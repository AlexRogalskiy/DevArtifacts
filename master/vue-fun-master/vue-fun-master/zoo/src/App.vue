<template>
  <div id="app">
    <img src="./assets/logo.png">
    <zoo :animals="animalsForZoo" :animalCodes="animalCodes":name="name"></zoo>
    <router-view/>
  </div>
</template>

<script>
import Zoo from './components/Zoo'
 var animalsForZoo = []
var animalCodes = {
  dog     : '&#x1f436;',
  cat     : '&#x1f638;',
  monkey  : '&#x1f435;',
  unicorn : '&#x1f984;',
  tiger   : '&#x1f42f;',
  mouse   : '&#x1f42d;',
  rabbit  : '&#x1f430;',
  cow     : '&#x1f42e;',
  whale   : '&#x1f433;',
  horse   : '&#x1f434;',
  pig     : '&#x1f437;',
  frog    : '&#x1f438;',
  koala   : '&#x1f43c;'
}
 var animals = Object.keys(animalCodes)
var data = {name:'Olga', animalCodes, animals, sadSrc: 'images/sad.png',
  gladSrc: 'images/glad.png', animalsForZoo};

export default {
  name: 'app',
  data () {
      return data
    },
    components: {
      Zoo
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
