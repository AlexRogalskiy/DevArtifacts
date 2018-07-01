import Vue from 'vue'
import App from './components/App'

/* tslint:disable:no-unused-expression */
new Vue({
  el: document.querySelector('#app') as Element,
  components: { App },
  render: h => h('App')
})
