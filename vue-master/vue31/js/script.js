const AnalogClock = {
  template: '#analog-clock',
  props: { minute: Number, tick: Number },
  data() {
    return {
      rotation: { hours: 0, minutes: 0, seconds: 0 }
    }
  },
  computed: {
    hours() {
      return { transform: `translate3d(-50%, 0, 0) rotate(${this.rotation.hours}deg)` }
    },
    minutes() {
      return { transform: `translate3d(-50%, 0, 0) rotate(${this.rotation.minutes}deg)` }
    },
    seconds() {
      return { transform: `translate3d(-50%, 0, 0) rotate(${this.rotation.seconds}deg)` }
    }
  },
  watch: {
    tick() {
      this.rotation.seconds += 6
      this.rotation.minutes += 0.1
    },
    minute(to, from) {
      if (from === to) return;
      this.rotation.hours += 0.5
    }
  },
  mounted() {
    let date = new Date()
    let [h, m, s] = [date.getHours(), date.getMinutes(), date.getSeconds()]
    this.rotation = {
      hours: (h * 30) + (m * 0.5),
      minutes: (m * 6) + (s * 0.1),
      seconds: s * 6
    }
  }
}

const TextClock = {
  template: '#text-clock',
  props: ['time'],
  data() {
    return {
      timeMap: {
        20: 'twenty',
        30: 'thirty',
        40: 'forty',
        50: 'fifty',
        0: [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
        10: [null, 'eleven', 'twelve', 'thirteen', 'fourteen', 'quarter', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
        hours: [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
      },
      parsers: [{
        test: n => !n,
        parse: () => ({ m: `o'clock` })
      }, {
        test: n => n <= 10,
        parse: n => ({ r: 1, m: `${this.timeMap[0][n]} ${!n % 5 ? 'after' : 'past'}` })
      }, {
        test: n => ~[15, 30, 45].indexOf(n),
        parse: n => ({ r: 1, m: `${n === 30 ? 'half' : 'quarter'} ${n <= 30 ? 'past' : 'to'}` })
      }, {
        test: n => ~[50, 55].indexOf(n),
        parse: n => ({ r: 1, m: `${this.timeMap[0][-(n % 10) + 10]} to` })
      }, {
        test: n => n < 20,
        parse: n => ({ m: this.timeMap[10][n % 10] })
      }, {
        test: n => n,
        parse: n => ({ m: `${this.timeMap[(n * 0.1 | 0) * 10]}${n % 10 ? `-${this.timeMap[0][n % 10]}` : ''}` })
      }]
    }
  },
  computed: {
    meridiem() {
      return (this.time.hours < 12) ? 'a' : 'p'
    },
    output() {
      const { hours: h, minutes: m } = this.time
      const { r: reverse, m: minutes } = this.parsers
        .find(({ test }) => test(m))
        .parse(m)

      const hours = [h]
        .map(h => h > 12 ? h - 12 : h || 12)
        .map(h => /\sto$/.test(minutes) ? h + 1 : h)
        .map(h => h > 12 ? 1 : h)
        .map(h => this.timeMap.hours[h])
        .reduce(h => h)

      return reverse ? [minutes, hours] : [hours, minutes]
    }
  }
}

new Vue({
  el: '#clock',
  components: { AnalogClock, TextClock },
  data() {
    return {
      tick: 0,
      time: { hours: 0, minutes: 0, seconds: 0 }
    }
  },
  methods: {
    updateTime(time) {
      this.tick++
      this.time = {
        hours: time.getHours(),
        minutes: time.getMinutes(),
        seconds: time.getSeconds()
      }

      setTimeout(() => this.updateTime(new Date()), 1000 - new Date().getMilliseconds())
    }
  },
  mounted() {
    this.updateTime(new Date())
  }
})
