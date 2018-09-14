<template>
  <div v-if="winner.user">
    <h2>Congratulations {{ winner.user }}!</h2>
    <img :src="winner.userProfileImg" :alt="`Pic of ${winner.user}`">
    <h3>You won 1 million coxinhas!</h3>
  </div>
</template>

<script>
import { firebaseApp } from '../firebase';

export default {
  name: 'winner',
  data() {
    return {
      winner: {},
    };
  },
  mounted() {
    this.getWinner();
  },
  methods: {
    getWinner() {
      firebaseApp.database().ref('/winner').orderByKey().limitToLast(1)
        .once('value')
        .then((data) => {
          if (!data.val()) return;

          const snapshot = data.val();
          const winner = snapshot[Object.keys(snapshot)[0]];

          this.winner = winner;
        });
    },
  },
};
</script>
