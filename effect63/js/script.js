var cssVarUpdates = {
  init: function() {
    this.cacheDOM();
    this.events();
    this.update();
  },
  cacheDOM: function() {
    this.prim = document.getElementById('prim-picker');
    this.sec = document.getElementById('sec-picker');
  },
  events: function() {
    this.prim.addEventListener('input', this.update.bind(this));
    this.sec.addEventListener('input', this.update.bind(this));
  },
  update: function() {
    this.primcolor = this.prim.value;
    this.seccolor = this.sec.value;
    // update css variables
    document.documentElement.style.setProperty("--primary-col", this.primcolor, null);
    document.documentElement.style.setProperty("--secondary-col", this.seccolor, null);
  }
};

cssVarUpdates.init();