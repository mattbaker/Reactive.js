(function() {
  function $R(fnc) {
      var rf = function() {
        var v = rf.run.apply(rf,arguments);
        rf.notifyDependents();
        return v;
      };
      rf.fnc = fnc;
      rf.dependents = [];
      rf.dependencies = [];
      return augment(rf, reactiveExtensions);
  }
  function augment(target, augmentation) {
    var k;
    for(k in augmentation) {
      if(augmentation.hasOwnProperty(k)) {
        target[k] = augmentation[k];
      }
    }
    return target;
  }
  function identity(v) {
    return $R(function(){return v;});
  }
  function wrap(v) {
    return v && v._isReactive ? v : identity(v);
  }
  var reactiveExtensions = {
    _isReactive: true,
    get: function() { return this.memo === undefined ? this.run() : this.memo;},
    run: function() {
      var args = Array.prototype.slice.call(arguments);
      return this.memo = this.fnc.apply(this, this.argumentList(args));
    },
    notifyDependents: function() {
      var i=0, l=this.dependents.length;
      for (;i<l;i++) { this.dependents[i](); }
    },
    signature: function() {
      var i=0,
          names = this.fnc.toString()
            .match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
            .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
            .replace(/\s+/g, '').split(',');
          arity = names.length,
          signature = {arity:arity, index:{}, name:names};

      for(;i<arity;i++) { signature.index[names[i]] = i; }
      this.signature = function() { return signature };
      return signature;
    },
    register: function(keyOrObject, value) {
      return arguments.length == 2 ? this._registerSingle(keyOrObject,value) : this._registerMany(keyOrObject);
    },
    _registerSingle: function(key,value) {
      var reactiveValue = wrap(value),
          signature = this.signature();
      this.dependencies[signature.index[key]] = reactiveValue;
      reactiveValue.dependents.push(this);
      return this;
    },
    _registerMany: function(argObj) {
      var k;
      for(k in argObj) {
        if (argObj.hasOwnProperty(k)) { this._registerSingle(k, argObj[k]); }
      }
      return this;
    },
    argumentList: function(fncArguments) {
      var args = [],
          signature = this.signature(),
          i = 0, j = 0;
      for(;i<signature.arity;i++) {
        args.push(this.dependencies[i] !== undefined ? this.dependencies[i].get() : fncArguments[j++]);
      }
      return args;
    }
  }
  window.$R = $R;
})();