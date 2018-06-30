// Scrubber component
// Lets the user change an input field value by dragging the mouse left/right.
// Manual text input is still possible.

Vue.component('scrubber', {
  data: function() {
    return {
      isMouseDown: false,
      initialMouse: null
    }
  },
  computed: {

    // returns the number of decimals based on the step value
    // e.g. "0.25" returns "2"
    decimals: function() {
      return this.steps.toString().substr((this.steps).toString().indexOf(".")).length - 1;
    },

    // every time the value changes, we need to make sure it stays inside the min/max
    constrainedValue: function() {
      return this.constrain(this.value, this.min, this.max, this.decimals);
    },

    style: function() {
      var stop = translate(this.value, this.min, this.max, 0, 100);
      return {
        background: this.color,
        width: this.width + "px",
        backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.04) " + (stop - 1) + "%, rgba(0, 0, 0, 0) " + stop + "%, rgba(0, 0, 0, 0) 100%)"
      }
    }
  },

  // props that the scrubber can receive
  // value: initial value
  // min: minimum value
  // max: maximum value
  // steps: increments for each pixel the mouse is moved
  props: ["value", "min", "max", "steps", {
    "name": "change",
    "default": function() {}
  }, {
    "name": "width",
    "default": 200
  }, {
    "name": "color",
    "default": "rgba(0, 0, 0, 0.05)"
  }],

  // the template
  template: "<input class='vue-scrubber' v-model='constrainedValue' v-on:mousedown='handleMouseDown' v-on:input='handleInput' v-on:keydown.up='handleKeyCodeUp' v-on:keydown.down='handleKeyCodeDown' v-on:change='handleChange' v-bind:style='style' />",

  methods: {

    // constrains a number to not exceed the min/max
    // decimals: rounding precision
    constrain: function(value, min, max, decimals) {
      decimals = typeof decimals !== 'undefined' ? decimals : 0;

      if (min != undefined && max != undefined) {
        return this.round(Math.min(Math.max(parseFloat(value), min), max), decimals);
      } else {
        return value;
      }
    },

    // method to round a number to given decimals
    round: function(value, decimals) {
      return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    },
    handleInput: function(event) {
      console.log(event.keyCode)
        // only allow numeric keys
      if (event.keyCode != 46 && event.keyCode < 48 || event.keyCode > 57) {
        event.preventDefault();
      } else {
        //this.value = parseFloat(event.target.value)
        if (event.keyCode != 8) {
          var value = isNaN(parseFloat(event.target.value)) ? 0 : parseFloat(event.target.value);
          this.value = Math.min(Math.max(value, this.min), this.max);
        } else {

        }

      }
    },

    handleChange: function(event) {

      this.value = isNaN(parseFloat(event.target.value)) ? 0 : parseFloat(event.target.value);

    },

    handleKeyCodeUp: function(event) {
      event.preventDefault();
      this.value += parseFloat(this.steps);
    },

    handleKeyCodeDown: function(event) {
      event.preventDefault();
      this.value -= parseFloat(this.steps);
    },

    // mouse handler
    handleMouseDown: function(event) {

      // enable scrubbing
      this.mouseDown = true;

      // remember the initial mouse position when the scubbing started
      this.initialMouse = {
        x: event.clientX,
        y: event.clientY
      }

      // remember the initial value
      this.initialValue = this.value;

      // register global event handlers because now we are not bound to the component anymore
      document.addEventListener("mousemove", this.handleMouseMove)

      // global mouse up listener
      document.addEventListener("mouseup", this.handleMouseUp)

    },
    handleMouseUp: function($event) {

      // disable scrubbing
      this.mouseDown = false;

      document.removeEventListener("mousemove", this.handleMouseMove)
      document.removeEventListener("mouseup", this.handleMouseUp)

    },

    // the actual translation of mouse movement to value change…
    handleMouseMove: function(event) {

      // scrub if the mouse is being pressed
      if (this.mouseDown) {
        var damping = (this.max - this.min) / this.width;
        var newValue = this.initialValue + ((event.clientX - this.initialMouse.x) * damping)

        // constrain the value to the min/max
        this.value = this.constrain(newValue, this.min, this.max, this.decimals);

        // call change handler
        if (typeof this.change == "function") this.change(event)
      }
    }
  }
})

function translate(value, low1, high1, low2, high2) {
  var value = parseFloat(value)
  var low1 = parseFloat(low1)
  var high1 = parseFloat(high1)
  var low2 = parseFloat(low2)
  var hight2 = parseFloat(high2)
  return low2 + (high2 - low2) * ((value - low1) / (high1 - low1));
}

var content = [{
    text: "Adaptive Modular Scale",
    size: 3,
    class: "title"
  },

  {
    text: "A sane approach to responsive typography",
    size: 2,
    class: "subtitle"
  },

  {
    text: "Parameters, not values",
    size: 1,
    class: "heading"
  },

  {
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam illo vero vitae placeat cupiditate, blanditiis. Possimus, quidem, ea. Beatae perspiciatis officia obcaecati ipsum incidunt, adipisci illo inventore ab architecto eum. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam illo vero vitae placeat cupiditate, blanditiis. Possimus, quidem, ea. Beatae perspiciatis officia obcaecati ipsum incidunt, adipisci illo inventore ab architecto eum.",
    size: 0,
    class: "paragraph"
  },

  {
    text: "Math to the rescue",
    size: 0,
    class: "heading"
  },

  {
    text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam illo vero vitae placeat cupiditate, blanditiis. Possimus, quidem, ea. Beatae perspiciatis officia obcaecati ipsum incidunt, adipisci illo inventore ab architecto eum.",
    size: 0,
    class: "paragraph"
  }

]

new Vue({
  el: "#app",
  data: function() {
    return {
      factor: 1.38,
      amount: 10,
      content: content,
      lock: true,
      ratio: 0,
      minWidth: 320,
      maxWidth: 960,
      width: 960,
      timeout: null,
      mouse: {
        x: 0,
        y: 0
      },
      willChange: "none",
      initialWidth: 0,
      showMax: false,
      splitView: true,
      settings: {
        minBase: 16,
        maxBase: 18,
        minWidth: 320,
        maxWidth: 960,
        minContrast: 1.2,
        maxContrast: 1.6,
        transitionDuration: "0s"
      },
      mousedown: false,
      initialMouse: {
        x: 0,
        y: 0
      }
    }
  },
  methods: {
    onLock: function() {
      this.ratio = this.factor / this.base;
    },
    onMinWidthChange: function() {
      this.minWidth = this.settings.minWidth;
    },
    onMaxWidthChange: function() {
      this.maxWidth = this.settings.maxWidth;
    },
    onWidthUp: function() {
      if (this.lock) this.width = this.settings.maxWidth;
    },
    handleMinMousedown: function(event) {

      this.willChange = "min";
      this.mousedown = true;

      this.initialWidth = this.minWidth;

      this.initialMouse = {
        x: event.clientX,
        y: event.clientY
      }
    },
    handleMousedown: function(event) {

      this.willChange = "max";
      this.mousedown = true;

      this.initialWidth = this.maxWidth;

      this.initialMouse = {
        x: event.clientX,
        y: event.clientY
      }
    },
    handleMouseup: function(event) {
      this.mousedown = false;

      switch (this.willChange) {
        case "min":
          this.minWidth = this.settings.minWidth;
          break;
        case "max":
          this.maxWidth = this.settings.maxWidth;
          break;
      }

      var that = this;
      this.settings.transitionDuration = "0.25s";
      this.timeout = setTimeout(function() {
        that.settings.transitionDuration = "0s";
      }, 250)
    },

    handleMousemove: function(event) {

      if (this.mousedown) {
        if (this.willChange == "min") {

          this.minWidth = Math.min(Math.max(this.initialWidth - (this.initialMouse.x - event.clientX), this.settings.minWidth), this.settings.maxWidth)
          this.mouse = {
            x: event.clientX,
            y: event.clientY
          }
        }

        if (this.willChange == "max") {

          this.maxWidth = Math.min(Math.max(this.initialWidth - (this.initialMouse.x - event.clientX), this.settings.minWidth), this.settings.maxWidth)
          this.mouse = {
            x: event.clientX,
            y: event.clientY
          }
        }
        this.settings.transitionDuration = "0s";
      }

    }
  },
  computed: {
    base: function() {
      return translate(this.maxWidth, this.settings.minWidth, this.settings.maxWidth, this.settings.minBase, this.settings.maxBase).toFixed(2)
    },

    baseMin: function() {
      return translate(this.minWidth, this.settings.minWidth, this.settings.maxWidth, this.settings.minBase, this.settings.maxBase).toFixed(2)
    },
    css: function() {
      var diffBase = this.base - this.baseMin;
      var diffWidth = this.maxWidth - this.minWidth;

      return "font-size: calc(" + this.baseMin + "px + (" + diffBase + " * (100vw - " + this.minWidth + "px) /  " + diffWidth + "))"

    },

    scale: function() {
      var result = [];
      var start = 0;

      for (var i = start; i < this.amount; i++) {
        result.push(this.base * Math.pow(this.contrast, i))
      }
      return result;
    },
    scaleMin: function() {
      var result = [];
      var start = 0;

      for (var i = start; i < this.amount; i++) {
        result.push(this.baseMin * Math.pow(this.contrastMin, i))
      }
      return result;
    },

    contrast: function() {
      return translate(this.maxWidth, this.settings.minWidth, this.settings.maxWidth, this.settings.minContrast, this.settings.maxContrast).toFixed(2)
    },
    contrastMin: function() {
      return translate(this.minWidth, this.settings.minWidth, this.settings.maxWidth, this.settings.minContrast, this.settings.maxContrast).toFixed(2)
    }
  },
  ready: function() {
    document.addEventListener("mouseup", this.handleMouseup)
  }
})