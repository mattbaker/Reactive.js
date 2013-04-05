(function() {
  var defaultContext = this;
  function $R(fnc, context) {
      var rf = function() {
        var dirtyNodes = topo(rf);
        var v = _.first(dirtyNodes).run.apply(rf, arguments);
        _.chain(dirtyNodes).rest().invoke("run");
        return v;
      };
      rf.id = _.uniqueId();
      rf.context = context || defaultContext;
      rf.fnc = fnc;
      rf.dependents = [];
      rf.dependencies = [];
      rf.memo = $R.empty;
      return _.extend(rf, reactiveExtensions, $R.pluginExtensions);
  }
  $R._ = {};
  $R.empty = {};
  $R.state = function (initial) {
    //TODO(matt): Don't traverse dependency graph for reads, only writes
    var rFnc = $R(function () {
      if (arguments.length) {
        this.val = arguments[0];
      }
      return this.val;
    })
    rFnc.context = rFnc;
    rFnc.val = initial;
    return rFnc;
  }
  $R.pluginExtensions = {}
  var reactiveExtensions = {
    _isReactive: true,
    toString: function () { return this.id + ":" + this.fnc.toString() },
    get: function() { return this.memo === $R.empty ? this.run() : this.memo },
    run: function() {
      var unboundArgs = Array.prototype.slice.call(arguments);
      return this.memo = this.fnc.apply(this.context, this.argumentList(unboundArgs));
    },
    bindTo: function() {
      var dependencies = Array.prototype.slice.call(arguments).map(wrap);

      _.chain(dependencies)
        .difference(this.dependencies)
        .filter(function (f) { return f !== $R._})
        .invoke("addDependent", this);

      _.chain(this.dependencies)
        .difference(dependencies)
        .filter(function (f) { return f !== $R._})
        .invoke("removeDependent", this);

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
        if (dependency === $R._) {
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
  //Private
  function topo(rootFnc) {
    var explored = {};
    function search(rFnc) {
      if (explored[rFnc]) { return [] }
      explored[rFnc] = true;
      return _.map(rFnc.dependents, search).concat(rFnc);
    }
    return _.chain(search(rootFnc)).flatten().reverse().value();
  }
  function wrap(v) {
    return v && (v._isReactive || v == $R._) ? v : $R(function () {return v});
  }

  window.$R = $R;
})();
