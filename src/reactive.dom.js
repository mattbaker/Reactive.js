(function() {
  if (!$R) { return; }
  $R.dom = function(inputEl) {
    //You could detect whether this function is being
    //called as a ctor or function and do it all in here,
    //but it seems unnecessary.
    return new $R.Dom(inputEl);
  }
  $R.Dom = function (inputEl) {
    this.el = $(inputEl);
  }
  $R.Dom.prototype = {
    bindAttributeTo: function (attribute, rf, formatter) {
      formatter = formatter || _.identity
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

  _.extend($R.pluginExtensions, {
    bindToInput: function(input, sanitizer) {
      sanitizer = sanitizer || _.identity;
      var rf = this;
      $(input).on("change", function () {
        rf(sanitizer(this.value));
      })
    }
  });

})();
