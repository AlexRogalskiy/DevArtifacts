<template>
  <div class="list-entries">
    <ul>
      <li v-for="entrie in entries"><a :href="'/entrie/'+entrie.id">{{ entrie.date }}</a></li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'listEntries',
  computed: mapState([
    'entries',
  ]),
};
</script>
