(function() {
  window.Reactive = window.Reactive || {};
  
  Reactive.Element = function(elt) {
    this.value = elt;
  }
  Reactive.Element.prototype = new Reactive.Static();
  Reactive.Element.prototype.bindAttribute = function(attr, fnc) {
    this.dependencies = {attr:fnc};
    fnc.dependents.push(this);
  }
  Reactive.Element.prototype.call = function() {
    for(v in this.dependencies) {
      if(!this.dependencies.hasOwnProperty(v)) return;
      this.value.setAttribute(v, this.dependencies[v].get());
    }
  }
  Reactive.Element.prototype.getEvent = function(e) {
    return new Reactive.Event(this.value, e);
  }
})();

/*
(function() {
  window.Reactive = window.Reactive || {};
  
  Reactive.Elements = function(elts) {
    this.value = elts;
  }
  Reactive.Elements.prototype = new Reactive.Static();
  Reactive.Elements.prototype.bindAttribute = function(attr, fnc) {
    this.dependencies = {attr:fnc};
    fnc.dependents.push(this);
  }
  Reactive.Elements.prototype.call = function() {
    var dependencies = this.dependencies;
    Reactive.each(this.value, function() {
      for(v in dependencies) {
        if(!dependencies.hasOwnProperty(v)) return;
        this.setAttribute(v, dependencies[v].get());
      }
    });
  }
  Reactive.Elements.prototype.getEvent = function(e) {
    return (Reactive.map(this.value, function() {
      return new Reactive.Event(this, e);
    }));
  }
})();*/