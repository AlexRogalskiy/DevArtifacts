const Cube = Vue.component('cube', {
  template: '#cube-template',
  props: {
    x:  { default: 0   }, y:  { default: 0   }, z:  { default: 0   },
    w:  { default: 100 }, h:  { default: 100 }, d:  { default: 100 },
    rx: { default: 0   }, ry: { default: 0   }, rz: { default: 0   },
    sx: { default: 1   }, sy: { default: 1   }, sz: { default: 1   },

    color: { default: '#717C89' }
  },
  mounted () {
    const { $el } = this
    const qs = s => $el.querySelector(`.cube__side--${s}`)

    const darker = tinycolor(this.color).darken(8)
    const [bg, to, h, w] = ['background', 'transformOrigin', 'height', 'width']
    const [rx, ry, rz] = ['rotationX', 'rotationY', 'rotationZ']
    const [sx, sy, sz] = ['scaleX', 'scaleY', 'scaleZ']

    TweenMax.set($el.querySelectorAll('.cube__side'), { [bg]: darker.toString() })
    TweenMax.set(qs('back'),   { z: this.d * -1 })
    TweenMax.set(qs('top'),    { [to]: '50% 0', [bg]: this.color, [h]: this.d, [rx]: -90 })
    TweenMax.set(qs('right'),  { [to]: '0 50%', [bg]: this.color, [w]: this.d, [ry]: 90, x: this.w })
    TweenMax.set(qs('bottom'), { [to]: '50% 0', [h]: this.d, [rx]: -90, y: this.h })
    TweenMax.set(qs('left'),   { [to]: '0 50%', [w]: this.d, [ry]: 90 })

    const origin = `center center ${this.d / -2}px`
    TweenMax.set($el, {
      [to]: origin, [h]: this.h, [w]: this.w,
      [sx]: this.sx, [sy]: this.sy, [sz]: this.sz,
      [rx]: this.rx, [ry]: this.ry, [rz]: this.rz,
      x: this.x, y: this.y, z: this.z
    })
  }

})

const CodepenLogo = Vue.component('codepen-logo', {
  template: '#codepen-logo-template',
  components: { Cube },
  props: {
    size: { default: 8 },
    color: { default: '#717C89' },
    onAnimComplete: { type: Function }
  },
  data () {
    const cw = this.size, ch = this.size, cd = 10 * this.size
    const hd = cd / 2, hh = ch / 2
    const diff = 0.001, dis = ch * 5

    return { cw, ch, cd, hd, hh, diff, dis }
  },
  mounted () {
    const el = '.codepen-logo'
    const lines = document.querySelector('.intro-lines')
    const lpath = lines.querySelector('path').getTotalLength()
    const tl = new TimelineMax({
      onComplete: () => this.onAnimComplete && this.onAnimComplete()
    })

    tl
      .set(el, { transformOrigin: `${this.hh}px ${this.dis / 2}px ${this.hd * -1}px` })
      .set(el, { scale: 0, scaleZ: 0, rotationX: -90 })
      .set(lines, { strokeDasharray: lpath, strokeDashoffset: lpath, opacity: 1 })
      .to(el, 1, { scale: 1, scaleZ: 1, ease: Power4.easeOut }, 0.2)
      .to(el, 2, { rotationX: -45, ease: Power4.easeOut }, 0.6)
      .to(el, 0.8, { rotationY: 37, rotationZ: -32, ease: Power4.easeOut }, 0.6)
      .to(lines, 1, { strokeDashoffset: lpath * -1, opacity: 0 }, 0.7)
  }
})

const AnimType = Vue.component('anim-type', {
  template: '#anim-type',
  props: {
    text: { type: String, required: true }
  },
  computed: {
    letterArr () {
      return this.text.split('')
    }
  },
  mounted () {
    const letters = this.$el.querySelectorAll('span')
    TweenMax.staggerFromTo(letters, 1.4, {
      y: '100%',
      opacity: 0
    }, {
      y: '0%',
      opacity: 1,
      delay: 3,
      ease: Elastic.easeOut.config(1, 0.4),
      force3D: true
    }, 0.05)
  }
})

new Vue({
  el: '#app',
  components: { CodepenLogo, AnimType },
  template: `
    <div class="wrapper">
      <codepen-logo :onAnimComplete="listenMouseEvent" />
      <anim-type text="CodePen" class="codepen-title" />
    </div>
  `,
  data () { return { logo: null, px: 0, py: 0, lpx: 0, lpy: 0 } },
  methods: {
    listenMouseEvent () {
      const el = this.$el
      this.logo = document.querySelector('.codepen-logo__wrapper')

      const { top, left } = el.getBoundingClientRect()

      document.addEventListener('mousemove', event => {
        const { clientX: x, clientY: y } = event
        this.px = 2 * (x - left) / window.innerWidth
        this.py = 2 * (y - top) / window.innerHeight
      })

      TweenMax.set(this.logo, { transformOrigin: '50% 50% -40' })
      TweenMax.to(this.logo, 0.8, {
        scale: 0.7,
        x: -80,
        y: 20,
        ease: Expo.easeInOut
      })

      this.rotateLogo()
    },
    rotateLogo () {
      if (this.lpx !== this.px || this.lpy !== this.py) {
        TweenMax.to(this.logo, 1, {
          rotationX: this.py * 10,
          rotationY: this.px * -10
        })
        this.lpx = this.px
        this.lpy = this.py
      }
      requestAnimationFrame(this.rotateLogo)
    }
  }
})
