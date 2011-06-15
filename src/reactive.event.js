//http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
//http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener


(function() {
  var Reactive = window.Reactive || {};
  
  // Reactive.Event = function(obj, event) {
  //   this.obj = obj
  //   this.event = event;
  //   this.obj.addEventListener(event, this._eventHandler, false);
  // }
  // Reactive.Event.prototype = new Reactive.Base;
  // Reactive.Event.prototype.get = function(){return this.memo;}
  // Reactive.Event.prototype._eventHandler = function(e) {
  //   this.memo = e;
  //   this.call();
  // }
  // Reactive.Event.prototype.call = function() {    
  //   for(var i=0,len=this.dependents;i<len;i++) {
  //     this.dependents[i].call();
  //   }
  //   return this.get();
  // }
})();