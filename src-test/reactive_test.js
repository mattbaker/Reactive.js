ReactiveTest = TestCase("ReactiveTest");

ReactiveTest.prototype.testInitialize = function() {
  assertNotNull(window.Reactive)
}

ReactiveTest.prototype.testDownwardPropagation = function() {
  var testFncRan = false,
      reactFncRan = false;
  function testA(a) {testFncRan = true};
  function testB() {reactFncRan = true};

  var reactiveA = $R(testA);
  var reactiveB = $R(testB);
  //A depends on B
  reactiveA.register({a:reactiveB});

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

  var reactiveA = $R(testA),
      reactiveB = $R(testB);
  reactiveA.register({a:reactiveB});

  assertFalse(testFncRan);
  //Calling the dependent should call the dependency
  reactiveA();
  assertTrue(testFncRan);
  assertTrue(reactFncRan);
}

ReactiveTest.prototype.testMemoization = function() {
  var parentFnc = $R(function() {
        return parseInt(Math.random() * 10000);
      }),
      childFnc = $R(function(x) {
        return x;
      }).register({x:parentFnc}),
      r = childFnc();
  assertEquals(r, childFnc());
  assertEquals(r, childFnc());
  assertEquals(r, childFnc());
}
ReactiveTest.prototype.testNoBinding = function() {
  function simpleFnc(a,b,c) { return "" + a + b + c; }
  var reactiveSimpleFnc = $R(simpleFnc);
  assertEquals(reactiveSimpleFnc(1,2,3),"123");
}
ReactiveTest.prototype.testBinding = function() {
  function simpleFnc(a,b,c) {
    return "" + a + b + c;
  }
  var reactiveSimpleFnc = $R(simpleFnc);
  reactiveSimpleFnc.register({a:$R(function(){return 0}),
                                   b:$R(function(){return 1}),
                                   c:$R(function(){return 2})});
  assertEquals(reactiveSimpleFnc(), "012");
}
ReactiveTest.prototype.testPartialBinding = function() {
    function simpleFnc(a,b,c) {
      return "" + a + b + c;
    }
    var reactiveSimpleFnc = $R(simpleFnc);
    reactiveSimpleFnc.register({b:$R(function(){return 7})});
    assertEquals(reactiveSimpleFnc(1, undefined, 3), "173");
    assertEquals(reactiveSimpleFnc(1,2,3), "123");

    reactiveSimpleFnc.register({c:$R(function(){return 8})});
    assertEquals(reactiveSimpleFnc(1,2,3), "123");
    assertEquals(reactiveSimpleFnc(1,2), "128");
    assertEquals(reactiveSimpleFnc(2), "278");
}
