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
  var upperCased = $R(function (v) {return v.toUpperCase()});
  upperCased.bindToInput("#myInput");
  $R(assertEquals).bindTo("FOO", upperCased);
  $("#myInput").val("foo").change();
}

ReactiveDomTest.prototype.testBindInputTo = function() {
  /*:DOC += <input id="myInput" value=""> */
  var setter = $R(function(x) { return x });
  $R.dom("#myInput").bindInputTo(setter);

  assertEquals("", $("#myInput").val());
  setter("str");
  assertEquals("str", $("#myInput").val());
}
