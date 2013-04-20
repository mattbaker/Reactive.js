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
ReactiveTest.prototype.testState = function() {
  var foo = $R.state();
  var i = 0;
  var rf = $R(function(x){ i++; });
  rf.bindTo(foo);
  assertEquals(undefined, foo());

  foo(10101);
  assertEquals(10101, foo());

  rf();

  assertEquals(4, i);
}
ReactiveTest.prototype.testStateInitialValue = function() {
  var foo = $R.state(10);
  var bar = $R.state();
  assertEquals(10, foo());
  assertUndefined(bar());
}
ReactiveTest.prototype.testObjectProperties = function() {
  var obj = $R.state({ a: 10 });
  assertEquals({ a: 10 }, obj());
  assertEquals(10, obj.property('a')());
}
ReactiveTest.prototype.testArrayProperties = function() {
  var obj = $R.state([ 10 ]);
  assertEquals([ 10 ], obj());
  assertEquals(10, obj.property(0)());
  assertEquals(1, obj.property('length')());
}
ReactiveTest.prototype.testInvalidProperties = function() {
  var obj = $R.state({ a: 10 });
  assertEquals({ a: 10 }, obj());
  assertEquals(10, obj.property('a')());
  assertUndefined(obj.property('b')());
  assertUndefined(obj.property('a').property('b')());
}
ReactiveTest.prototype.testObjectUpdates = function() {
  var obj = $R.state({ a: 10 });
  var ref = obj();

  assertEquals({ a: 10 }, ref);
  assertEquals({ a: 10 }, obj());
  assertEquals(10, obj.property('a')());
  assertUndefined(obj.property('a').property('b')());
  assertUndefined(obj.property('c')());

  obj({ a: { b: 12 }, c: 2 });

  assertEquals({ a: 10 }, ref);
  assertEquals({ a: { b: 12 }, c: 2 }, obj());
  assertEquals({ b: 12 }, obj.property('a')());
  assertEquals(12, obj.property('a').property('b')());
  assertEquals(2, obj.property('c')());
}
ReactiveTest.prototype.testObjectPropertyUpdates = function() {
  var obj = $R.state({ a: 10 });
  var a = obj.property('a');
  var double = $R(function(x) { return x * 2 }).bindTo(a);
  var ref = obj();

  assertEquals({ a: 10 }, ref);
  assertEquals({ a: 10 }, obj());
  assertEquals(10, a());
  assertEquals(20, double());

  a(12);

  assertEquals({ a: 10 }, ref);
  assertEquals({ a: 12 }, obj());
  assertEquals(12, a());
  assertEquals(24, double());
}
ReactiveTest.prototype.testDeepObjectUpdates = function() {
  var obj = $R.state({ a: { b: { c: { d: 10 } } } });
  var a = obj.property('a');
  var b = a.property('b');
  var c = b.property('c');
  var d = c.property('d');
  var double = $R(function(x) { return x * 2 }).bindTo(d);
  var ref = obj();

  assertEquals({ a: { b: { c: { d: 10 } } } }, ref);
  assertEquals({ a: { b: { c: { d: 10 } } } }, obj());
  assertEquals({ b: { c: { d: 10 } } }, a());
  assertEquals({ c: { d: 10 } }, b());
  assertEquals({ d: 10 }, c());
  assertEquals(10, d());
  assertEquals(20, double());

  obj({ a: { b: { c: { d: 12 } } } });

  assertEquals({ a: { b: { c: { d: 10 } } } }, ref);
  assertEquals({ a: { b: { c: { d: 12 } } } }, obj());
  assertEquals({ b: { c: { d: 12 } } }, a());
  assertEquals({ c: { d: 12 } }, b());
  assertEquals({ d: 12 }, c());
  assertEquals(12, d());
  assertEquals(24, double());
}
ReactiveTest.prototype.testDeepObjectPropertyUpdates = function() {
  var obj = $R.state({ a: { b: { c: { d: 10 } } } });
  var a = obj.property('a');
  var b = a.property('b');
  var c = b.property('c');
  var d = c.property('d');
  var double = $R(function(x) { return x * 2 }).bindTo(d);
  var ref = obj();

  assertEquals({ a: { b: { c: { d: 10 } } } }, ref);
  assertEquals({ a: { b: { c: { d: 10 } } } }, obj());
  assertEquals({ b: { c: { d: 10 } } }, a());
  assertEquals({ c: { d: 10 } }, b());
  assertEquals({ d: 10 }, c());
  assertEquals(10, d());
  assertEquals(20, double());

  d(12);

  assertEquals({ a: { b: { c: { d: 10 } } } }, ref);
  assertEquals({ a: { b: { c: { d: 12 } } } }, obj());
  assertEquals({ b: { c: { d: 12 } } }, a());
  assertEquals({ c: { d: 12 } }, b());
  assertEquals({ d: 12 }, c());
  assertEquals(12, d());
  assertEquals(24, double());
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
