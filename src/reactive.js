(function() {
  function $R(fnc, context) {
      var rf = function() {
        var v = rf.run.apply(rf,arguments);
        rf.notifyDependents();
        return v;
      };
      rf.context = context || {};
      rf.fnc = fnc;
      rf.dependents = [];
      rf.dependencies = [];
      return _.extend(rf, reactiveExtensions);
  }
  $R._ = {};
  $R.accessor = function () {
    var rFnc = $R(function () {
      if (arguments.length) {
        this.accessorValue = arguments[0];
      }
      return this.accessorValue;
    })
    rFnc.context = rFnc;
    return rFnc;
  }
  function wrap(v) {
    return v && (v._isReactive || v == $R._) ? v : $R(function () {return v});
  }
  var reactiveExtensions = {
    toString: function () {
      return this.fnc.toString();
    },
    _isReactive: true,
    get: function() { return this.memo === undefined ? this.run() : this.memo;},
    run: function() {
      var unboundArgs = Array.prototype.slice.call(arguments);
      return this.memo = this.fnc.apply(this.context, this.argumentList(unboundArgs));
    },
    notifyDependents: function() {
      var i=0, l=this.dependents.length;
      for (;i<l;i++) { this.dependents[i](); }
    },
    bindTo: function() {//test
      var dependencies = Array.prototype.slice.call(arguments).map(wrap);
      var newDependencies = _.difference(dependencies, this.dependencies);
      var oldDependencies = _.difference(this.dependencies, dependencies);
      _.each(newDependencies, function(dep){if (dep != $R._) { dep.addDependent(this)} }, this);
      _.each(oldDependencies, function(dep){if (dep != $R._) { dep.removeDependent(this) } }, this);
      this.dependencies = dependencies;
      return this;
    },
    removeDependent: function(rFnc) {
      this.dependents = _.without(this.dependents, rFnc);
    },
    addDependent: function(rFnc) {
      this.dependents = _.union(this.dependents, rFnc);
    },
    argumentList: function(unboundArgs) {
      var args = _.map(this.dependencies, function(dependency) {
        if (dependency == $R._) {
          return unboundArgs.shift();
        } else if (dependency._isReactive) {
          return dependency.get();
        } else {
          return undefined;
        }
      });
      return args.concat(unboundArgs);
    }
  }
  window.$R = $R;
})();