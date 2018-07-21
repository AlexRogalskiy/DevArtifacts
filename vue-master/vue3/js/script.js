// First idea comes from: https://jsfiddle.net/x53494ef/
new Vue({
	el:'#vue',
  data () {
  	return {
      sourceIntervalDelay: 230,
    	interval: false,
      intervalDelay: 0,
      minimumInternalDelay: 45,
      count: 0
    }
  },
  mounted () {
    this.intervalDelay = this.sourceIntervalDelay
  },
  methods: {
  	start () {
      this.count++
      this.interval = window.setTimeout(this.start, this.intervalDelay)
      this.intervalDelay -= Math.log(this.intervalDelay)
      this.intervalDelay = this.intervalDelay <= this.minimumInternalDelay ? this.minimumInternalDelay : this.intervalDelay
    },
    stop () {
      clearTimeout(this.interval)
      this.interval = false
      this.intervalDelay = this.sourceIntervalDelay
    }
  }
})