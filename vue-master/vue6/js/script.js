const Child = {
  template: '#childarea',
  props: ['isShowing'],
  methods: {
    toggleShow() {
      this.isShowing = !this.isShowing;
    }
  }
};

new Vue({
  el: '#app',
  data() {
    return {
      isShowing: false
    }
  },
  components: {
    appChild: Child
  }
});