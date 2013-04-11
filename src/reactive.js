(function(exports) {
  var _uniqueId = 0;
  function _(coll) {
    this._ = coll;
  }
  _.extend = function(obj) {
    var args = [].slice.call(arguments, 1);
    args.forEach(function(arg) {
      for (var prop in arg) {
        obj[prop] = arg[prop];
      }
    });
    return obj;
  };
  // static
  _.extend(_, {
    difference: function(a, b) {
      return a.filter(function(e) {
        return b.indexOf(e) === -1;
      });
    },
    first: function(a) {
      return a[0];
    },
    flatten: function(arr) {
      var result = [];
      arr.forEach(function(e) {
        if (Array.isArray(e)) {
          result.push.apply(result, _.flatten(e));
        } else {
          result.push(e);
        }
      });
      return result;
    },
    invoke: function(a, method) {
      var args = [].slice.call(arguments, 2);
      a.forEach(function(e) {
        e[method].apply(e, args);
      });
    },
    rest: function(a) {
      return a.slice(1);
    },
    uniqueId: function() {
      return String(++_uniqueId);
    }
  });
  // methods that are chainable
  ['difference', 'flatten', 'invoke', 'rest'].forEach(function(m) {
    var method = _[m];
    _.prototype[m] = function() {
      var args = [].slice.call(arguments, 0);
      this._ = method.apply(method, [this._].concat(args));
      return this;
    }
  });
  // Array.prototype methods
  ['concat', 'filter', 'map', 'reverse'].forEach(function(m) {
    _.prototype[m] = function() {
      this._ = Array.prototype[m].apply(this._, arguments);
      return this;
    }
  });
  _.prototype.value = function() { return this._; };

  var defaultContext = this;
  function $R(fnc, context) {
      var rf = function() {
        var dirtyNodes = topo(rf);
        var v = _.first(dirtyNodes).run.apply(rf, arguments);
        new _(dirtyNodes).rest().invoke("run");
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
    toString: function () { return this.fnc.toString() },
    get: function() { return this.memo === $R.empty ? this.run() : this.memo },
    run: function() {
      var unboundArgs = Array.prototype.slice.call(arguments);
      return this.memo = this.fnc.apply(this.context, this.argumentList(unboundArgs));
    },
    bindTo: function() {
      var dependencies = Array.prototype.slice.call(arguments).map(wrap);

      new _(dependencies)
        .difference(this.dependencies)
        .filter(function (f) { return f !== $R._})
        .invoke("addDependent", this);

      new _(this.dependencies)
        .difference(dependencies)
        .filter(function (f) { return f !== $R._})
        .invoke("removeDependent", this);

      this.dependencies = dependencies;
      return this;
    },
    removeDependent: function(rFnc) {
      this.dependents = this.dependents.filter(function(prop) {
        return prop !== rFnc;
      });
    },
    addDependent: function(rFnc) {
      this.dependents = [rFnc].concat(this.dependents);
    },
    argumentList: function(unboundArgs) {
      return this.dependencies.map(function(dependency) {
        if (dependency === $R._) {
          return unboundArgs.shift();
        } else if (dependency._isReactive) {
          return dependency.get();
        } else {
          return undefined;
        }
      }).concat(unboundArgs);
    }
  }
  //Private
  function topo(rootFnc) {
    var explored = {};
    function search(rFnc) {
      if (explored[rFnc.id]) { return [] }
      explored[rFnc.id] = true;
      return rFnc.dependents.map(search).concat(rFnc);
    }

    return new _(search(rootFnc)).flatten().reverse().value();
  }
  function wrap(v) {
    return v && (v._isReactive || v == $R._) ? v : $R(function () {return v});
  }

  if (typeof module !== 'undefined') {
    module.exports = $R;
  } else {
    exports.$R = $R;
  }
}(this));
