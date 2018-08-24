const template = `
<div>
  hash is {{ hash }} <button @click="changeHash">change hash</button>
</div>
`;

new Vue({
  el: '#app',
  template,
  data: {
    hash: 'test',
  },
  watch: {
    hash() {
      location.hash = this.hash;
    },
  },
  methods: {
    changeHash() {
      this.hash += ' changed!';
    },
  },
});