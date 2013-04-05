ReactiveDomTest = TestCase("ReactiveDomTest");

ReactiveDomTest.prototype.testBindAttributeTo = function() {
  /*:DOC += <div id="foo"></div> */
  var rFnc = $R(function () {
    return "hello!"
  });

  $R.dom("#foo").bindAttributeTo("innerHTML", rFnc);
  assertEquals("", $("#foo").html());
  rFnc();
  assertEquals("hello!", $("#foo").html());
}

ReactiveDomTest.prototype.testBindToInput = function() {
  /*:DOC += <input id="myInput" value=""> */
  var x = null;
  $R(function (v) {
    x = v;
  }).bindToInput("#myInput");
  $("#myInput").val("foo").change();
  assertEquals("foo", x);
}

ReactiveDomTest.prototype.testBindToInputWithSanitizer = function() {
  /*:DOC += <input id="myInput" value=""> */
  var x = null;
  $R(function (v) {
    x = v;
  }).bindToInput("#myInput", function (v) {return v.toUpperCase()});
  $("#myInput").val("foo").change();
  assertEquals("FOO", x);
}

ReactiveDomTest.prototype.testBindInputTo = function() {
  /*:DOC += <input id="myInput" value=""> */
  var barFnc = $R(function() {
    return "bar";
  });
  $R.dom("#myInput").bindInputTo(barFnc);

  assertEquals("", $("#myInput").val());
  barFnc();
  assertEquals("bar", $("#myInput").val());
}

ReactiveDomTest.prototype.testLinkInput = function() {
  /*:DOC += <input id="myInput" value=""> */
  var foo = $R.state("bar");
  $R.dom("#myInput").linkInput(foo, function (v){return v+"!"}, function(v){return "$"+v});

  assertEquals("", $("#myInput").val());
  foo("hello");
  assertEquals("hello!", $("#myInput").val())
  $("#myInput").val("world").change();
  assertEquals("$world", foo());

}
