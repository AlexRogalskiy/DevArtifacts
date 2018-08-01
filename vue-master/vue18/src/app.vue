<template>
    <div id="app">
        <img src="./assets/logo.png">
        <transition name="welcome">
            <HelloWorld msg="Welcome to your Vue.js application" v-if="displayHome"/>
        </transition>
        <transition name="about">
            <About msg="This is the About page" v-if="displayAbout"/>
        </transition>
        <transition name="extra">
            <div v-if="displayExtra">
                <Extra :msg="extra"/>
                <button @click="changeExtra">Update Extra</button>
            </div>
        </transition>
        <div>
            <ul>
                <li @click="showHome">Home</li>
                <li @click="showAbout">About</li>
                <li @click="showExtra">Extra</li>
            </ul>
        </div>
    </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import About from "./components/About.vue";
import Extra from "./components/Extra.vue";

export default {
  name: "app",
  components: {
    HelloWorld,
    About,
    Extra
  },
  data() {
    return {
      extra: null,
      displayHome: true,
      displayAbout: false,
      displayExtra: false
    };
  },
  methods: {
    changeExtra() {
      this.extra = "This is extra";
    },
    showHome() {
      this.displayHome = true;
      this.displayAbout = false;
      this.displayExtra = false;
    },
    showAbout() {
      this.displayHome = false;
      this.displayAbout = true;
      this.displayExtra = false;
    },
    showExtra() {
      this.displayHome = false;
      this.displayAbout = false;
      this.displayExtra = true;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
li:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>
<style scoped>
/* Welcome Styles */
.welcome-enter {
  transform: translateX(10px);
  opacity: 0;
}
.welcome-enter-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.welcome-leave-active,
.welcome-leave-to {
  opacity: 0;
}

/* About Styles */
.about-enter {
  width: 30%;
  opacity: 0;
}
.about-enter-active {
  transition: all 2s ease-in-out;
}
.about-leave-active,
.about-leave-to {
  opacity: 0;
}
.about-enter-to {
  width: 100%;
  opacity: 1;
  margin-left: auto;
}

/* Extra Styes */
.extra-enter {
  transform: translateX(-200px);
  opacity: 0;
}
.extra-enter-to {
  transform: translateX(0px);
}
.extra-enter-active {
  transition: all 1s cubic-bezier(1, 0.5, 0.8, 1);
}
.extra-leave-active,
.extra-leave-to {
  opacity: 0;
}
</style>
