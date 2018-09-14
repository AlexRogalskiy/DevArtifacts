<template>
  <button @click="findWinner">Click here to set the winner</button>
</template>

<script>
import { firebaseApp } from '../firebase';

export default {
  name: 'setWinner',
  data() {
    return {
      winner: {},
    };
  },
  computed: {
    members() {
      return this.$store.state.members;
    },
  },
  mounted() {
    this.$store.dispatch('LOAD_MEMBERS_LIST');
  },
  methods: {
    findWinner() {
      this.winner = this.members[Math.floor((Math.random() * this.members.length))];
      if (this.winner.name) {
        this.registerWinner();
      }
    },
    registerWinner() {
      firebaseApp.database().ref('/winner').push({
        user: this.winner.name,
        message: 'You won 1 million coxinhas!',
        userProfileImg: this.winner.photo.thumb_link,
      })
        .then(() => alert('Winner registered'))
        .catch(err => console.error(err));
    },
  },
};
</script>
