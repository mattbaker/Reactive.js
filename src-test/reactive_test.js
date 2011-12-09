ReactiveTest = TestCase("ReactiveTest");

ReactiveTest.prototype.testInitialize = function() {
  assertNotNull(window.Reactive)
}

ReactiveTest.prototype.testDownwardPropagation = function() {
  var testFncRan = false,
      reactFncRan = false;
  function testA(a) {testFncRan = true};
  function testB() {reactFncRan = true};

  var reactiveA = $reactify(testA);
  var reactiveB = $reactify(testB);
  //A depends on B
  reactiveA.bindArguments({a:reactiveB});

  assertFalse(testFncRan);
  reactiveB();
  assertTrue(testFncRan);
  assertTrue(reactFncRan);  
}

ReactiveTest.prototype.testUpwardPropagation = function() {
  var testFncRan = false,
      reactFncRan = false;
  function testA(a) {testFncRan = true};
  function testB() {reactFncRan = true};

  var reactiveA = $reactify(testA),
      reactiveB = $reactify(testB);
  reactiveA.bindArguments({a:reactiveB});
  
  assertFalse(testFncRan);
  //Calling the dependent should call the dependency
  reactiveA();
  assertTrue(testFncRan);
  assertTrue(reactFncRan);  
}

ReactiveTest.prototype.testMemoization = function() {
  var parentFnc = $reactify(function() {
        return parseInt(Math.random() * 10000);
      }),
      childFnc = $reactify(function(x) {
        return x;
      }).bindArguments({x:parentFnc}),
      r = childFnc();
  assertEquals(r, childFnc());
  assertEquals(r, childFnc());
  assertEquals(r, childFnc());
}
ReactiveTest.prototype.testNoBinding = function() {
  function simpleFnc(a,b,c) { return "" + a + b + c; }
  var reactiveSimpleFnc = $reactify(simpleFnc);
  assertEquals(reactiveSimpleFnc(1,2,3),"123");
}
ReactiveTest.prototype.testBinding = function() {
  function simpleFnc(a,b,c) {
    return "" + a + b + c;
  }
  var reactiveSimpleFnc = $reactify(simpleFnc);
  reactiveSimpleFnc.bindArguments({a:$reactify(function(){return 0}),
                                   b:$reactify(function(){return 1}),
                                   c:$reactify(function(){return 2})});
  assertEquals(reactiveSimpleFnc(), "012");
}
ReactiveTest.prototype.testPartialBinding = function() {
    function simpleFnc(a,b,c) {
      return "" + a + b + c;
    }
    var reactiveSimpleFnc = $reactify(simpleFnc);
    reactiveSimpleFnc.bindArguments({b:$reactify(function(){return 7})});
    assertEquals(reactiveSimpleFnc(1,3), "173");
    assertEquals(reactiveSimpleFnc(1,2,3), "123");
    
    reactiveSimpleFnc.bindArguments({c:$reactify(function(){return 8})});
    assertEquals(reactiveSimpleFnc(1,2,3), "123");
    assertEquals(reactiveSimpleFnc(1,2), "178");
    assertEquals(reactiveSimpleFnc(2), "278");
}
