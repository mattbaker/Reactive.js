//Constant = DOM.Element • DOM.Attribute -> Constant
//Constant = Object -> Constant
//Reactive.Value = Constant • DOM.Event -> Constant
//Reactive.Value = Constant • Event -> Constant
//Reactive.Value = Constant -> Constant

//"Merge, composes (combines) events", this is what Reactive.Collection is doing, new Collection(arr, merge(arr.map(&:event)))

/* Given a behavior, issuing
an event whenever its value changes yields a corresponding
event stream*/

/*In Flapjax, nodes in the dataﬂow
graphs are event streams while behaviors are derived objects*/
//I think "Values" are EventStreams

/* Rx.net .Throttle() 

eventstream.onComplete

merge(), project(), filter() values (value streams)

Filter(Value) -> Value

Value.Select(function() { modify value}) -> Value //map... behavior?
*/

//Error handling?

//http://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
  
(function() {
  Reactive.Value = function() {
    var args = Array.prototype.slice.apply(arguments);
    switch(arguments.length) {
      case 3:
      return Reactive._ObjectPropertyValue.apply(this, args).tap(function() {
        this.bindEvent();
      });
      return v;
      break;
      case 2:
      return Reactive._ObjectValue.apply(this, args).tap(function() {
        this.bindEvent();
      });
      break;
      case 1:
      return Reactive._LiteralValue.call(this, args);
      break;
    }
  }

  Reactive.Value.prototype = new Reactive.Base;
  Reactive.Value.prototype.get = function() {
    this.memo = this.memo === undefined ? this.update() : this.memo;
    return this.memo;
  }
  Reactive.Value.prototype.update = function() {
    //this.updateDependents();//?????????????????????????????
    return this.memo;
  }
  
  Reactive.Value._listener = function(e) {
    console.log("Calling event listener");
    this.update();
  }
  
  Reactive._LiteralValue = function(value) {
    if (!(this instanceof Reactive._LiteralValue)) {
      //TODO: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
      return new Reactive._LiteralValue(value);
    }
    this.value = value;
  }
  Reactive._LiteralValue.prototype = new Reactive.Value;
  Reactive._LiteralValue.prototype.get = function(){return this.value;}
  Reactive._LiteralValue.prototype.update = function(){return this.value;}
  
  Reactive._ObjectValue = function(obj, evnt) {
    if (!(this instanceof Reactive._ObjectValue)) {
      return new Reactive._ObjectValue(obj, evnt);
    }
    this.value = obj;
    this.evnt = evnt;
  }
  Reactive._ObjectValue.prototype = new Reactive.Value;//TODO this must be wrong
  Reactive._ObjectValue.prototype.bindEvent = function() {
    this.addEventListener(this.evnt, Reactive.Value._listener.bind(this));
  }
  Reactive._ObjectValue.prototype.update = function() {
    this.memo = this.value;
    return this.memo;
  }
  Reactive._ObjectValue.prototype.addEventListener = function(eventName, fnc) {
    if (this.value.addEventListener !== undefined) {
      this.value.addEventListener(this.evnt, Reactive.Value._listener.bind(this), false);  
    } else {
      this.events = this.events || {};
      this.events[eventName] = this.events[eventName] || []; 
      this.events[eventName].push(fnc);
    }
  }
  //Doesn't handle the DOM yet
  Reactive._ObjectValue.prototype.triggerEvent = function(eventName, data) {
    if(this.events) {
      for(var i=0,l=this.events.length;i<l;i++) {
        this.events[i](data);
      }
    }
  }
  ///
  // how do we handle toggle???
  // function that returns on click of link... true or false, that value?
  //
  Reactive._ObjectPropertyValue = function(obj, property, evnt) {
    if (!(this instanceof Reactive._ObjectPropertyValue)) {
      //TODO: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
      return new Reactive._ObjectPropertyValue(obj, property, evnt);
    }
    this.value = obj;
    this.property = property;
    this.evnt = evnt;
  }
  Reactive._ObjectPropertyValue.prototype = new Reactive._ObjectValue;//this must be wrong
  Reactive._ObjectPropertyValue.prototype.update = function() {
    this.memo = this.value[this.property];
    return this.memo;
  }  
})();