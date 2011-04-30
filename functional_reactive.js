/*

*/

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
ReactiveFnc.prototype.get = function() { return this.memo || this.call();}
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
ReactiveFnc.prototype.bindInput = function(selectors) {  
  for(s in selectors) {
    var $s = $(selectors[s]);
    this.dependencies[s] = new ReactiveFnc(function() {
      return $s.val();
    });
    $s.change(function() {
      this.call();
    });
  }
}

var dynamicX = new ReactiveFnc(function() {
  return Math.round(Math.random()*100);
});

var constantY = new ReactiveFnc(function() {
  return 10000;
});

var testR = new ReactiveFnc(function() {
    return this.x + this.y;
}).bind({x:dynamicX}).bind({y:constantY});



console.log(testR.memo);
console.log(dynamicX.call());
console.log(testR.memo);

/* 
var allocations = new ReactiveFnc(function() {
  return this.inputs.map(function(){return this.value});
}).bindInputs({inputs:".inputs"});

var isDirty = new ReactiveFnc(function() {
  for(var i=0; i<this.inputs.length; i++) {
    if(this.inputs[i].original != this.input[i].current) {
      return true;
    }
  }
  return false;
}).bind({inputs:allocations});

var toggleButton = new ReactiveFnc(function() {
  this.isDirty ? $("#submit").addAttr("disabled") : $("#submit").removeAttr("disabled");
}).bind({isDirty:isDirty});
*/