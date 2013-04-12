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
    bindAttributeTo: function (attribute, rf, formatter) {
      formatter = formatter || identity
      $R(function(v) {
        if (this.el[0]) { this.el[0][attribute] = formatter(v) };
      }, this).bindTo(rf);
      return this;
    },
    bindInputTo: function (rf, formatter) {
      this.bindAttributeTo("value", rf, formatter);
      return this;
    },
    linkInput: function(rf, formatter, sanitizer) {
      this.bindInputTo(rf, formatter);
      rf.bindToInput(this.el, sanitizer);
      return this;
    }
  }

  $R.extend($R.pluginExtensions, {
    bindToInput: function(input, sanitizer) {
      sanitizer = sanitizer || identity;
      var rf = this;
      $(input).on("change", function () {
        rf(sanitizer(this.value));
      })
      return this;
    }
  });

})();
