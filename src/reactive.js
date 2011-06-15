(function() {
  if(typeof Function.bind === 'undefined') {
    Function.prototype.bind = function(object){ 
      var fn = this; 
      return function(){ 
        return fn.apply(object, arguments); 
      }; 
    };
  }

  var Reactive = {};
  Reactive.Base = function() {
  }
  Reactive.Base.prototype.tap = function(f) {
    f.apply(this,[]);
    return this;
  };
  
  /*
  Reactive.each = function(arr, f) {
    for(var i=0,l=arr.length;i<l;f.call(arr[i]),i++);
  }
  Reactive.map = function(arr, f) {
    var mapped = [];
    for(var i=0,l=arr.length;i<l;mapped[i] = f.call(arr[i]),i++);
    return mapped;
  }
  
  Reactive.Base = function() {
    this.dependencies = {};
    this.dependents = [];
  }
  Reactive.Base.merge = function(from, into) {
    for(v in from) {
      into[v] = from[v];
    }
  }
  Reactive.Base.prototype = {
    get: function(){ throw new Error("Not implemented")},
    update: function(){ throw new Error("Not implemented")},
    updateDependents: function() {
      var dependents = this.dependents;
      for(var i=0,l=dependents.length;i<l;i++) {
        dependents.update();
      }
    }
  }*/
  

  
  window.Reactive = Reactive;
})();