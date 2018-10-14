const app = new Vue({
  el: "table",
  data: {
    items: [
      { description: "Website design", quantity: 1, price: 300 },
      { description: "Website design", quantity: 1, price: 75 },
      { description: "Website design", quantity: 1, price: 10 }
    ]
  },
  computed: {
    total() {
      return this.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    }
  },
  methods: {
    addRow() {
      this.items.push({ description: "", quantity: 1, price: 0 });
    }
  },
  filters: {
    currency(value) {
      return value.toFixed(2);
    }
  }
});
