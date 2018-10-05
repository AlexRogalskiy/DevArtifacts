var pug = require("pug")

new Vue({
  el: "#app",
  data: function () {
    return {
      name: "John Doe",
      jadeTemplate: "mixin button(data)\n button.button-primary= data.label\n\nh1 Hello, #{name}.\np This is a rendered pug template.\n\n- var a = ['Apple', 'Banana', 'Orange']\neach item in a \n li= item\n\n+button({label: 'I’m a mixin button'})\n"
    }
  },
  computed: {
    renderedTemplate: function () {
       var compiled= pug.compile(this.jadeTemplate)
      return compiled({name: this.name })
    }
  }
})