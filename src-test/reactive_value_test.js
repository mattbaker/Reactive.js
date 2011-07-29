ReactiveValueTest = TestCase("ReactiveValueTest");

ReactiveValueTest.prototype.testInitialize = function() {
  assertNotUndefined(window.Reactive.Value);
}

ReactiveValueTest.prototype.testNewValue = function() {
  var v = Reactive.Value(function(){}, {});
  assertTrue(v instanceof Reactive._Value);
}

ReactiveValueTest.prototype.testGetValue = function() {
  var v = Reactive.Value(function(){return "foo";}, {});
  assertEquals("foo", v.get());
}

ReactiveValueTest.prototype.testMemoization = function() {
  var x;
  var v = Reactive.Value(function(){x = Math.random(); return x;}, {});
  var y = v.get();
  assertEquals(y,x);
  v.get();
  assertEquals(y,x);
}

ReactiveValueTest.prototype.testArgumentBinding = function() {
  var args = {a:Reactive.Value(10), b:Reactive.Value(4)};
  var v = Reactive.Value(function(b, a){return a * b}, args);
  assertEquals(40, v.get());
}

ReactiveValueTest.prototype.testNewDomValue = function() {
  /*:DOC += <input id="foo" type="text" value="foo">*/
  var foo = document.getElementById("foo");
  var v = Reactive.Value(foo, "value", "change");
  assertTrue(v instanceof Reactive._ObjectPropertyValue);
}

ReactiveValueTest.prototype.testRetrieveDomValue = function() {
  /*:DOC += <input id="foo" type="text" value="foo">*/
  var foo = document.getElementById("foo");
  var v = Reactive.Value(foo, "value", "change");
  assertEquals("foo", v.get());
}

ReactiveValueTest.prototype.testRetrieveEventedDomValue = function() {
  /*:DOC += <input id="foo" type="text" value="foo">*/
  var foo = document.getElementById("foo");
  var v = new Reactive.Value(foo, "value", "change");
  assertEquals("foo", v.get());
  foo.value = "bar";
  triggerDomEvent(foo, "change");
  assertEquals("bar", v.get());
}
ReactiveValueTest.prototype.testDependentBinding = function() {
  /*:DOC += <input id="foo" type="text" value="foo">*/
}

ReactiveValueTest.prototype.testLiteralValue = function() {
  var literal = new Reactive.Value(12);
  assertEquals(12, literal.get());
}