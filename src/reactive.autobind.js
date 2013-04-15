(function() {
  if (!$R) { return; }

  $R.extend($R.pluginExtensions, {
    autobind: function () {
      var args = this.fnc.toString()
        .match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
        .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
        .replace(/\s+/g, '').split(',');
      if (args) {
        var discovered = [];
        var positions = {};
        for (var i=0; i < args.length; i++) {
          positions[args[i]] = i;
        }
        for (var p in this.context) {
          if (positions[p] !== undefined) {
            discovered[positions[p]] = this.context[p];
          }
        }
        if (discovered.length === args.length) {
          this.bindTo.apply(this, discovered);
        }
      }
      return this;
    }
  });

})();
