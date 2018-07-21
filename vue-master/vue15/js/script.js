new Vue({
   el: '#app',
   data: {
      message: 'This is a reverse message.'
   },
   methods: {
      reverseMessage: function() {
         this.message = this.message.split('').reverse().join('')
      }
   }
});