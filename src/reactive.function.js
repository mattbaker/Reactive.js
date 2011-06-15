(function() {
  window.Reactive = window.Reactive || {};
  
  Reactive.Fnc = function(fnc) {
    this.fnc = fnc;
    this.dependencies = {};
    this.dependents = [];
    this.argumentPositions = this._getArguments();
  }
  Reactive.Fnc.prototype = new Reactive.Base;
  Reactive.Fnc.prototype._getArguments = function() {
    var positions = {}
    var argNames = this.fnc
                    .toString()
                    .match(/\((.*)\)/)[1]
                    .replace(/\s/g, "")
                    .split(",");
    for(var i=0,l=argNames.length;i<l;i++) {
      positions[argNames[i]] = i;
    }
    return positions;
  }
  Reactive.Fnc.prototype._buildArgumentList = function() {
    var args = [];
    for(v in this.dependencies) {
      args[this.argumentPositions[v]] = this.dependencies[v].get();
    }
    return args;
  }
  Reactive.Fnc.prototype.memo = null;
  Reactive.Fnc.prototype.get = function() { return this.memo!==null ? this.memo : this.call();}
  Reactive.Fnc.prototype.call = function() {
    this.memo = this.fnc.apply(this.fnc, this._buildArgumentList());
    for(var i=0,len=this.dependents.length; i<len; i++) {
      this.dependents[i].call();
    }
    return this.memo;
  }
  Reactive.Fnc.prototype.bindArguments = function(bindings) {  
    for(v in bindings) {
      console.log(bindings[v], bindings[v].dependents);
      
      this.dependencies[v] = bindings[v];
      bindings[v].dependents.push(this);
    }
    return this;
  }
  Reactive.Fnc.prototype.bindValue = function(values) {  
    for(v in values) {
      this.dependencies[v] = new StaticValue(values[v]);
    }
    return this;
  }
})();