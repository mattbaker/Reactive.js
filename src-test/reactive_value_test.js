ReactiveValueTest = TestCase("ReactiveValueTest");

ReactiveValueTest.prototype.testInitialize = function() {
  assertNotUndefined(window.Reactive.Value);
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

ReactiveValueTest.prototype.testObjectValue = function() {
  var v = Reactive.Value({x:"xyz"}, null);
  assertTrue(v instanceof Reactive._ObjectValue);
  assertEquals("xyz", v.get().x);
}

ReactiveValueTest.prototype.testObjectValueEventify = function() {
  var o = {x:"xyz"};
  var v = Reactive.Value(o, "myEvent");
  assertNotUndefined(v.addEventListener);
  assertNotUndefined(v.triggerEvent);
  assertNotUndefined(v.events["myEvent"]);
}

ReactiveValueTest.prototype.testEventedObjectValue = function() {
  return; //I don't know how this is relevant... yet
  var o = {x:"xyz"};
  var v = Reactive.Value(o, "myEvent");
  assertEquals("xyz", v.get().x);
  o = {x:"abc"}; //do we need a setter for ObjectValue?...
  assertEquals("xyz", v.get().x);
  v.triggerEvent("myEvent");
  assertEquals("abc", v.get().x);
}

ReactiveValueTest.prototype.testDependentBinding = function() {
  /*:DOC += <input id="foo" type="text" value="foo">*/
}

ReactiveValueTest.prototype.testLiteralValue = function() {
  var literal = new Reactive.Value(12);
  assertEquals(12, literal.get());
}