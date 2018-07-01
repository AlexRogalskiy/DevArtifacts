import { Vue, Component } from 'vue-property-decorator'

@Component({
  template: `<div>First Counter : {{ i }}</div>`
})
export default class Count1 extends Vue {
  i: number = 0
  timer?: number

  mounted () {
    this.timer = window.setInterval(() => {
      this.i++
    }, 1000)
  }

  destroyed () {
    if (this.timer) {
      window.clearInterval(this.timer)
    }
  }

}
