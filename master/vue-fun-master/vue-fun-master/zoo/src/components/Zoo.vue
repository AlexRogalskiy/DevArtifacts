//Zoo.vue
<template>
  <div v-if="animals.length > 0">
    <h2><span v-if="name">{{name}}! </span>Here's your Zoo</h2>
    <ol>
      <li v-for="animal in animals"><span class="animal"v-html="animalCodes[animal]"></span></li>
    </ol>
  </div>
</template>
<script>
  export default {
    props: ['animals', 'animalCodes', 'name']
  }
</script>