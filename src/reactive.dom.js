(function() {
  var identity = function (v) { return v };

  if (!$R) { return; }
  $R.dom = function(inputEl) {
    return new $R.Dom(inputEl);
  }
  $R.Dom = function (inputEl) {
    this.el = $(inputEl);
  }
  $R.Dom.prototype = {
    bindAttributeTo: function (attribute, rf) {
      $R(function(v) {
        if (this.el[0]) { this.el[0][attribute] = v };
      }, this).bindTo(rf);
      return this;
    },
    bindInputTo: function (rf) {
      this.bindAttributeTo("value", rf);
      return this;
    }
  }

  $R.extend($R.pluginExtensions, {
    bindToInput: function(input) {
      var rf = this;
      $(input).on("change", function () {
        rf(this.value);
      })
      return this;
    }
  });

})();
