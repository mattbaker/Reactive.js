(function() {
  function $reactify(fnc) {
      var rf = function() {
        var v = rf.run.apply(rf,arguments);
        rf.notifyDependents();
        return v;
      };
      rf.fnc = fnc;
      rf.dependents = [];
      rf.dependencies = {};
      return mixin(rf, reactiveExtensions);
  }
  function mixin(target,extra) {
    var k;
    for(k in extra) {
      if(extra.hasOwnProperty(k)) {
        target[k] = extra[k];
      }
    }
    return target;
  }
  var reactiveExtensions = {
    reactive: true,
    get: function() { if (this.memo===undefined) {return this.run()}; return this.memo;},
    run: function() {
      var args = Array.prototype.slice.call(arguments),
          v = this.fnc.apply(this, this.getArgArray(args));
      this.memo = v;
      return v;
    },
    notifyDependents: function() {
      var i=0, l=this.dependents.length;
      for (;i<l;i++) { this.dependents[i](); }
    },
    argInfo: function() {
      var i=0,
      args = this.fnc.toString()
        .match(/\((.*)\)/)[1]
        .replace(/\s/g, "")
        .split(","),
      arity = args.length,
      argInfo = {arity:arity, index:{}, name:args};

      for(;i<arity;i++) { argInfo.index[args[i]] = i; }
      this.argInfo = function() { return argInfo };
      return argInfo;
    },
    bindArguments: function(argObj) {
      var k;
      for(k in argObj) {
        this.dependencies[k] = argObj[k];
        argObj[k].dependents.push(this);
      }
      return this;
    },
    getArgArray: function(fncArguments) {
      var args = [], 
          currentReactive,
          argInfo = this.argInfo(),
          i = 0;
      if(fncArguments.length == argInfo.arity) { 
        return fncArguments; 
      }
      for(;i<argInfo.arity;i++) {
        currentReactive = this.dependencies[argInfo.name[i]];
        if(currentReactive !== undefined) {
          args[i] = currentReactive.get();
        } else {
          args[i] = fncArguments.shift();
        }
      }
      return args;
    }
  }
      
  window.$reactify = $reactify;
})();