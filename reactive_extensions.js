(function() {
  console.assert(ReactiveFnc != null, "ReactiveJS has not been loaded.");
  ReactiveFnc.prototype.bindSelector = function(selectors, evnt) {
    for(s in selectors) {
      var $s = $(selectors[s]);
      this.dependencies[s] = new ReactiveFnc(function() {
        return $s.toArray();
      });
      if(evnt) {
        $s.bind(evnt, ((function(){this.call();}).bind(this)));
      }
    }
    return this;
  }
})();