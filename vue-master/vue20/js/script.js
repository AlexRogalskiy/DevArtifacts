const app = new Vue({
  el: '#app',
  data: {
    colour: 'red',
    onOff: true
  },
  methods: {
    toggleOnOff() {
      this.onOff = !this.onOff;
    }
  }
});