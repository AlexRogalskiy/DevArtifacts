new Vue ({
  el: '.container',
  data: () => ({
    users: [],
    errors: [],
    show: true
  }),

  mounted () {
    this.getUsers()
  },

  methods: {
    getUsers () {
      axios.get('https://randomuser.me/api/?results=3')
        .then(response => {
          console.log(JSON.stringify(response.data.results))
          this.users = response.data.results
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  },

  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
});