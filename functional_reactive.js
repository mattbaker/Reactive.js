(function() {
  if(typeof Function.bind === 'undefined') {
    Function.prototype.bind = function(object){ 
      var fn = this; 
      return function(){ 
        return fn.apply(object, arguments); 
      }; 
    };
  }
  function ReactiveFnc(fnc) {
    this.fnc = fnc;
    this.dependencies = {};
    this.dependents = [];
  }
  ReactiveFnc.merge = function(from, into) {
    for(v in from) {
      into[v] = from[v];
    }
  }
  ReactiveFnc.prototype.memo=null;
  ReactiveFnc.prototype.get = function() { return this.memo!==null ? this.memo : this.call();}
  ReactiveFnc.prototype.call = function() {
    for(v in this.dependencies) {
      this[v] = this.dependencies[v].get();
    }
    this.memo = this.fnc();
    for(var i=0,len=this.dependents.length; i<len; i++) {
      this.dependents[i].call();
    }
    return this.memo;
  }
  ReactiveFnc.prototype.bind = function(bindings) {  
    for(v in bindings) {
      this.dependencies[v] = bindings[v];
      bindings[v].dependents.push(this);
    }
    return this;
  }
  window.ReactiveFnc = ReactiveFnc;
})();