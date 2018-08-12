new Vue({
    el: "#app",
    data: {
        items: [],
        baseUrl: 'https://api.themoviedb.org/3',
        apiKey: '1b62ccff88d2cd537027e1d82920197b',
        imageUrl: 'https://image.tmdb.org/t/p/w342',
        loaded: true
    },
    created: function() {
        // Create the method you made below
        this.fetchData();
    },
    methods: {
        // Fetch data from the API
        fetchData: function() {
            this.$http.get(this.baseUrl + '/discover/movie?api_key=' + this.apiKey + '&sort_by=popularity.desc').then(response => {
                this.items = response.body;
                this.loaded = false;
            });
        }
    }
});
