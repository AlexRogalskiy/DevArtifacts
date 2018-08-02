class Post {
  constructor(title, link, author, img) {
    this.title = title;
    this.link = link;
    this.author = author;
    this.img = img;
  }
}

const app = new Vue({
  el: '#app',
  data: {
    keyword: '',
    postList: [
      new Post(
        'Vue.js', 
        'https://vuejs.org/', 
        'Chris', 
        'https://vuejs.org//images/logo.png'
      ),
      new Post(
        'React.js', 
        'https://facebook.github.io/react/', 
        'Tim',
        'https://daynin.github.io/clojurescript-presentation/img/react-logo.png'
      ),
      new Post(
        'Angular.js', 
        'https://angularjs.org/', 
        'Sam', 
        'https://angularjs.org/img/ng-logo.png'
      ),
      new Post(
        'Ember.js', 
        'http://emberjs.com/', 
        'Rachel',
        'http://www.gravatar.com/avatar/0cf15665a9146ba852bf042b0652780a?s=200'
      ),
      new Post(
        'Meteor.js', 
        'https://www.meteor.com/', 
        'Chris', 
        'http://hacktivist.in/introduction-to-nodejs-mongodb-meteor/img/meteor.png'
      ),
      new Post(
        'Aurelia', 
        'http://aurelia.io/', 
        'Tim',
        'https://cdn.auth0.com/blog/aurelia-logo.png'
      ),
      new Post(
        'Node.js', 
        'https://nodejs.org/en/', 
        'A. A. Ron',
        'https://code-maven.com/img/node.png'
      ),
      new Post(
        'Pusher', 
        'https://pusher.com/', 
        'Alex', 
        'https://avatars1.githubusercontent.com/u/739550?v=3&s=400'
      ),
      new Post(
        'Feathers.js', 
        'http://feathersjs.com/', 
        'Chuck',
        'https://cdn.worldvectorlogo.com/logos/feathersjs.svg'
      ),
    ]
  },
  methods: {
    toggleOnOff() {
      this.onOff = !this.onOff;
    }
  },
  computed: {
    filteredList() {
      return this.postList.filter((post) => {
        return post.title.toLowerCase().includes(this.keyword.toLowerCase());
      });
    }
  }
});