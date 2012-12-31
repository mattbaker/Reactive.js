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

  reactiveA.bindTo(reactiveB);

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
  reactiveA.bindTo(reactiveB);

  assertFalse(testFncRan);
  //Calling the dependent should call the dependency
  reactiveA();
  assertTrue(testFncRan);
  assertTrue(reactFncRan);
}
ReactiveTest.prototype.testContextPreservation = function() {
  function Klass(){}

  var thisWithinReactiveFunction = null;
  var context = new Klass;
  function foo() {
    thisWithinReactiveFunction = this;
  }
  $R(foo, context)();

  assertEquals(context, thisWithinReactiveFunction);
}
ReactiveTest.prototype.testMemoization = function() {
  var parentFnc = $R(function() {
        return parseInt(Math.random() * 10000);
      }),
      childFnc = $R(function(x) {
        return x;
      }).bindTo(parentFnc),
      r = childFnc();
  assertEquals(r, childFnc());
  assertEquals(r, childFnc());
  assertEquals(r, childFnc());
}
ReactiveTest.prototype.testNoBinding = function() {
  function simpleFnc(a,b,c) { return "" + a + b + c; }
  var reactiveSimpleFnc = $R(simpleFnc);
  assertEquals("123", reactiveSimpleFnc(1,2,3));
}
ReactiveTest.prototype.testBinding = function() {
  function simpleFnc(a,b,c) {
    return "" + a + b + c;
  }
  var reactiveSimpleFnc = $R(simpleFnc);
  reactiveSimpleFnc.bindTo($R(function(){return 0}),
                          $R(function(){return 1}),
                          $R(function(){return 2}));
  assertEquals("012", reactiveSimpleFnc());
}
ReactiveTest.prototype.testPartialBinding = function() {
  function simpleFnc(a,b,c) {
    return "" + a + b + c;
  }
  var reactiveSimpleFnc = $R(simpleFnc);
  reactiveSimpleFnc.bindTo($R._, $R(function(){return 7}), $R._);
  assertEquals("173", reactiveSimpleFnc(1, 3));
}
ReactiveTest.prototype.testUnBinding = function() {
  var aRan = 0;
  var bRan = 0;
  var cRan = 0;
  var dependencyA = $R(function() {
    aRan++;
  })
  var dependencyB = $R(function() {
    bRan++;
  })
  var dependencyC = $R(function() {
    cRan++;
  })
  var rf = $R(function(x,y) {});
  rf.bindTo(dependencyA, dependencyC);
  rf();
  rf.bindTo(dependencyB, dependencyC);
  rf();
  assertEquals(1, aRan);
  assertEquals(1, bRan);
  assertEquals(2, cRan);
}
ReactiveTest.prototype.testAccessor = function() {
  var foo = $R.accessor();
  var i = 0;
  var rf = $R(function(x){ i++; });
  rf.bindTo(foo);
  assertEquals(undefined, foo());

  foo(10101);
  assertEquals(10101, foo());

  rf();

  assertEquals(4, i);
}
