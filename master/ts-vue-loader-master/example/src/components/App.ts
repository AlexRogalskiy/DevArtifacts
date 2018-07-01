import { Vue, Component } from 'vue-property-decorator'
import Count1 from './Count1'
import Count2 from './Count2'
import CountVue from './CountVue.vue'

@Component({
  components: { Count1, Count2, CountVue },
  template: `<div>
    <p>This demo is stupid, but it shows how components are reloaded</p>
    <Count1></Count1>
    <Count2></Count2>
    <CountVue></CountVue>
  </div>`
})
export default class App extends Vue {
}
