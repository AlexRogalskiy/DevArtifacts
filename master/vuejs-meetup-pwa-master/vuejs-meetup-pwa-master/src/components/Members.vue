<template>
  <div>
    <button @click="subscribe" v-if="!isRegistered">I want to know the winner!</button>
    <h2>Participantes</h2>
    <ul v-if="members.length > 0">
      <li v-for="member in members">
        <div class="wrapper">
          <div class="photo" :style="`background-image: url(${member.photo.thumb_link})`"></div>
          <h3>{{ member.name }}</h3>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import { firebaseApp } from '../firebase';

export default {
  name: 'members',
  data() {
    return {
      isRegistered: false,
    };
  },
  computed: {
    members() {
      return this.$store.state.members;
    },
  },
  created() {
    this.registerServiceWorker();
  },
  mounted() {
    this.$store.dispatch('LOAD_MEMBERS_LIST');
    this.subscribe();
  },
  methods: {
    registerServiceWorker() {
      if ('serviceWorker' in navigator) {
        // eslint-disable-next-line
        const registration = runtime.register();

        navigator.serviceWorker.ready
          .then((serviceWorkerRegistration) => {
            firebaseApp.messaging().useServiceWorker(serviceWorkerRegistration);
            firebaseApp.messaging().onTokenRefresh(this.handleTokenRefresh);
          });
      }
    },
    subscribe() {
      firebaseApp.messaging()
        .requestPermission()
        .then(() => { this.handleTokenRefresh(); });
    },
    handleTokenRefresh() {
      return firebaseApp.messaging()
        .getToken()
        .then((token) => {
          this.isRegistered = true;
          firebaseApp.database().ref('/tokens').push({
            token,
          });
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
  display: table;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

li {
  display: block;
  margin: 0 0 10px;
  width: 50%;
  float: left;
  padding: 10px;
}

li .wrapper {
  border: 1px solid #ccc;
  display: table;
  width: 100%;
  text-align: left;
}

li .photo {
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  float: left;
  margin: 0 10px 0 0;
}

@media (max-width: 768px) {
  li {
    width: 100%;
  }
}

</style>
