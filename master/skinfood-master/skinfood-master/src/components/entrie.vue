<template>
  <div class="entrie">
    <h1>Entrie {{ id }}</h1>
    <h2>Date: {{ www.date }}</h2>
  </div>
</template>

<script>
import store from '../store';

export default {
  name: 'entrie',
  props: ['id'],
  data() {
    return {
      www: {},
    };
  },
  mounted() {
    this.www = store.getters.getById(this.id);
  },
};
</script>
