///
// how do we handle toggle???
// function that returns on click of link... true or false, that value?
//
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
      console.log(Reactive);
        return Reactive._ObjectPropertyValue.apply(this, args).tap(function() {
          this.bindEvent();
        });
      break;
      case 2:
        return Reactive._Value.apply(this, args);
      break;
      case 1:
        return Reactive._IdentityValue.call(this, args);
      break;
    }
  }
    
  Reactive._Value = function(fnc, args) {
    if (!(this instanceof Reactive._Value)) {
      return new Reactive._Value(fnc, args);
    }
    this.fnc = fnc;
    this.args = args;
  }
  Reactive._Value.prototype = new Reactive.Base;
  Reactive._Value.prototype.dependents = [];
  Reactive._Value.prototype.get = function() {
    this.memo = this.memo === undefined ? this.update() : this.memo;
    return this.memo;
  }
  Reactive._Value.prototype.update = function() {
    this.memo = this.retrieveValue();
    this.notifyDependents();
    return this.memo;
  }
  Reactive._Value.prototype.retrieveValue = function() {
    return this.fnc.apply(this, this._argumentList());
  }
  Reactive._Value.prototype.notifyDependents = function() {
    for(var i=0,l=this.dependents.length; i<l; i++) {
      this.dependents[i].call();
    }
  }
  Reactive._Value.prototype._argPositions = function() {
    var positions = {};
    var argNames = this.fnc
                    .toString()
                    .match(/\((.*)\)/)[1]
                    .replace(/\s/g, "")
                    .split(",");
    for(var i=0,l=argNames.length;i<l;i++) {
      positions[argNames[i]] = i;
    }
    this.argPositions = function() { return positions };//thunk
    return positions;
  }
  Reactive._Value.prototype._argumentList = function() {
    var args = [];
    for(v in this.args) {
      args[this._argPositions()[v]] = this.dependencies[v].get();
    }
    return args;
  }
  
  /* A evented object property value */
  Reactive._ObjectPropertyValue = function(obj, property, evnt) {
    if (!(this instanceof Reactive._ObjectPropertyValue)) {
      //TODO: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
      return new Reactive._ObjectPropertyValue(obj, property, evnt);
    }
    this.value = obj;
    this.property = property;
    this.evnt = evnt;
  }
  Reactive._ObjectPropertyValue.prototype = new Reactive._Value;
  Reactive._ObjectPropertyValue.prototype.retrieveValue = function() {
    return this.value[this.property];
  }
  Reactive._ObjectPropertyValue._listener = function(e) {
    console.log("Calling event listener");
    this.update();
  }
  Reactive._ObjectPropertyValue.prototype.bindEvent = function() {
    this.value.addEventListener(this.evnt, Reactive._ObjectPropertyValue._listener.bind(this), false);  
  }  

  /* A literal, static value */
  Reactive._IdentityValue = function(value) {
    if (!(this instanceof Reactive._IdentityValue)) {
      //TODO: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
      return new Reactive._IdentityValue(value);
    }
    this.value = value;
  }
  Reactive._IdentityValue.prototype = new Reactive._Value;
  Reactive._IdentityValue.prototype.retrieveValue = function(){return this.value;}
})();