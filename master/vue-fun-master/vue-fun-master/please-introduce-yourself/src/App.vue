//App.vue

<template>
  <div id="app" class="jumbotron">
  <div class="container">
      <h1>Hello! Nice to meet you!</h1>
    <hr />
    <form @submit="addMessage">
        <div class="form-group">
          <input  class="form-control" v-model="newMessage.title" maxlength="40" autofocus placeholder="Please introduce yourself :)" />
        </div>
        <div class="form-group">
          <textarea v-model="newMessage.text" class="form-control" placeholder="Leave your message!"  rows="3">
          </textarea>
        </div>
        <button class="btn btn-primary" type="submit">Send</button>
      </form>
    <div class="card-group">
      <card class="card-outline-success":title="'Hello!'":text="'This is our fixed card!'":footer="'Added on ' + dateToString(Date.now())"></card>
  </div>
    <card v-for="message in messages":title="message.title":text="message.text":footer="'Added on ' + dateToString(message.timestamp)"></card>
  </div>
  </div>
  </div>
</template>

<script>
  import { dateToString } from './utils/utils'
  import Firebase from 'firebase'
  import Card from './components/Card'

  let config = {
    apiKey: 'AIzaSyD9sbzFLMowLXsLDzgwGcebQyZMhLBrNB0',
    authDomain: 'vuejstestproject-ee411.firebaseapp.com',
    databaseURL: 'https://vuejstestproject-ee411.firebaseio.com',
    projectId: 'vuejstestproject-ee411',
    storageBucket: 'vuejstestproject-ee411.appspot.com',
    messagingSenderId: '135223515034'
  }

  let app = Firebase.initializeApp(config)
  let db = app.database()
  let messagesRef = db.ref('messages')
  export default {
    components: {
      Card
    },
    data () {
      return {
        newMessage: {
          title: '',
          text: '',
          timestamp: null
        }
      }
    },
    name: 'app',
    firebase: {
      messages: messagesRef
    },
    methods: {
      dateToString,
      addMessage (e) {
        e.preventDefault()
        if (this.newMessage.title === '') {
          return
        }
        this.newMessage.timestamp = Date.now()
        messagesRef.push(this.newMessage)
        this.newMessage.text = ''
        this.newMessage.title = ''
        this.newMessage.timestamp = null
      }
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
