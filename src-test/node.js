var assert = require('assert');

var vm = require('vm');
var fs = require('fs');

var window = { $R: require('../src/reactive') };
window.Reactive = window.$R;

var context = {
  TestCase: function() { return function() { } },
  window: window,
  $R: window.$R,
  assertTrue: function(x) { return assert.equal(x, true) },
  assertFalse: function(x) { return assert.equal(x, false) },
  assertEquals: function(a, b) { return assert.deepEqual(a, b) },
  assertUndefined: function(x) { return assert.equal(x, undefined) },
  assertNotNull: function(x) { return assert.notEqual(x, null) }
};

vm.runInNewContext(
  fs.readFileSync(__dirname + '/reactive_test.js').toString(),
  context
);

var tests = context.ReactiveTest.prototype;
Object.keys(tests)
  .filter(function(name) { return /^test/.test(name) })
  .forEach(function(name) {
    tests[name].call(tests);
  });
