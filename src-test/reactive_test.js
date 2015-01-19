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
ReactiveTest.prototype.testRebinding = function() {
  var dependencyA = $R(function() {});
  var dependencyB = $R(function() {});
  var dependencyC = $R(function() {});

  var rf = $R(function(x,y) {});

  rf.bindTo(dependencyA, dependencyC);
  assertEquals([dependencyA, dependencyC], rf.dependencies)
  assertEquals([rf], dependencyA.dependents)
  assertEquals([], dependencyB.dependents)
  assertEquals([rf], dependencyC.dependents)

  rf.bindTo(dependencyB, dependencyC);
  assertEquals([dependencyB, dependencyC], rf.dependencies)
  assertEquals([], dependencyA.dependents)
  assertEquals([rf], dependencyB.dependents)
  assertEquals([rf], dependencyC.dependents)
}
ReactiveTest.prototype.testStateBinding = function() {
  var state = $R.state();
  var log = []
  var historian = $R(function(history, x){ return history.push(x) }).bindTo(log, state)

  state.set(100)
  assertEquals([100], log);

  state.modify(function(v){return v+1});
  assertEquals([100, 101], log);
}
ReactiveTest.prototype.testStateSet = function() {
  var state = $R.state(10);
  assertEquals(10, state());
  state.set(11)
  assertEquals(11, state());
}
ReactiveTest.prototype.testStateModify = function() {
  var state = $R.state(100);
  assertEquals(100, state());
  state.modify(function(v) { return v + 1 })
  assertEquals(101, state());
}
ReactiveTest.prototype.testTopologicalSort = function() {
  var aRan = 0;
  var bRan = 0;
  var cRan = 0;

  var a = $R(function(){aRan++});
  var b = $R(function(x){bRan++});
  var c = $R(function(x,y){cRan++});
  b.bindTo(a);
  c.bindTo(a,b);
  a();
  assertEquals(1, aRan);
  assertEquals(1, bRan);
  assertEquals(1, cRan);
}
ReactiveTest.prototype.testToString = function() {
  var a = $R(function (){ return "foo"; });
  assertEquals('function(){return"foo";}', a.toString().replace(/\s/g,''));
}
ReactiveTest.prototype.testReadmeStateExample = function() {
  var a = $R.state(1);
  var b = $R.state(2);
  var c = $R(function (v1, v2) { return v1 + v2 }); // C = A + B
  c.bindTo(a, b); // Tell C it depends on A and B

  assertEquals(3,c())
  a.set(5)   // Set A to 5
  b.set(10)  // Set B to 10
  assertEquals(15,c())
}
