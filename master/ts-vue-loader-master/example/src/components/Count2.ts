import { Vue, Component } from 'vue-property-decorator'

@Component({
  template: `<div>Another counter : {{ i }}</div>`
})
export default class Count2 extends Vue {
  i: number = 0
  timer?: number

  mounted () {
    this.timer = window.setInterval(() => {
      this.i++
    }, 2000)
  }

  destroyed () {
    if (this.timer) {
      window.clearInterval(this.timer)
    }
  }

}
