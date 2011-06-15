(function() {
  window.Reactive = window.Reactive || {};
  
  Reactive.Static = function(value) {
    this.value = value;
  }
  Reactive.Static.prototype = new Reactive.Base;
  Reactive.Static.prototype.get = function(){return this.value};
  Reactive.Static.prototype.call = Reactive.Static.prototype.get;
})();