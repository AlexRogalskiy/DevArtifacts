// Record video using puppeteer
// https://gist.github.com/mallendeo/8f589d9e828ebfec287a77be71b6c4d3


// Note: there is a bug with the inner lines when replaying the animation
new Vue({
  el: '#app', 
  data: {
    colors: [
      '#F25F5C',
      '#FFE066',
      '#247BA0',
      '#34CDCC'
    ],
    offset2: 380,
    offsetD: 450,
    svgH: 456,
    svgW: 580,
    tl: null,
    opts: {
      rotate: 0
    }
  },

  computed: {
    height () {
      return this.svgH / this.colors.length
    }
  },
  
  mounted () {
    this.tl = new TimelineMax()

    this.tl
      .set('.letter', { opacity: 0 })
      .set('button, .links', { opacity: 0, scale: .9 })
      .set('#logo-bg', { x: -this.svgW })
      .set('.stroke-line', { strokeDashoffset: -1530 }) 
      .set('.line', { x: -this.svgW })
      .set('#shape-left', { opacity: 0 })
    
    this.animLines()
    this.anim2d()
    this.animShape()
    this.outro()
    
    this.opts.rotate && this.tl
      .fromTo('.stroke-line', 1, {
        rotationZ: this.opts.rotate,
        transformOrigin: 'center center'
      }, {
        rotationZ: 0,
        ease: Circ.easeOut
      }, 0)

    this.tl
      .fromTo('#app svg', 4, { scale: .8 }, { scale: 1, ease: Quad.easeOut }, 0)
      .fromTo('#app', 4, { '--p': 0 }, { '--p': 1, ease: Quad.easeOut }, 0)
    
    window.timeline = this.tl
    //this.tl.progress(.5)
  },
  
  methods: {
    anim2d () {
      const delay = 1.55 + .08 * this.colors.length
      return this.tl
        .staggerTo('.letter', .05, { opacity: 1 }, .08, delay)
        .staggerTo('.letter', 1, {
          strokeDashoffset: 0,
          ease: Expo.easeOut
        }, .08, delay)
    },
    
    animShape () {
      const dist = 170
      const ease = Circ.easeInOut
      const delay = '-=.7'
      return this.tl
        .to('#shape-left', 0, { opacity: 1 }, delay)
        .to('#shape-left', .5, { x: -dist, ease }, delay)
        .to('#logo-wrapper', .5, { x: dist, ease }, delay)
    },
    
    animLines () {
      return this.tl
        .staggerTo('.stroke-line', .75, { strokeDashoffset: 0, ease: Quad.easeInOut }, .1, '+=.4')
        .staggerTo('.line', .5, { x: 0, ease: Quad.easeIn }, .075, '-=.5')
        .staggerTo('.line', .5, { x: this.svgW, ease: Quad.easeOut }, .075, '-=.3')
        .to('#logo-bg', .5, { x: 0, ease: Circ.easeInOut }, '-=.5')
    },
    
    outro () {
      const letters = '.letter.last, #shape-left path'
      const hex = '#shape-left, #logo-wrapper'
      const ease = Circ.easeInOut
      const scale = 8
      return this.tl
        .staggerTo(letters, .2, { opacity: 0 }, .1, '+=.4')
        .to(hex, .5, { x: 0, ease }, '-=.5')
        .to('#logo-wrapper', .5, { scale, transformOrigin: '31.95% 39.4%', ease })
        .fromTo('#outro-shape', .5, { opacity: 1, scale: 0, transformOrigin: '50% 50%' }, { scale, ease }, '-=.25')
        .to('#logo-wrapper', .1, { opacity: 0 })
        .to('button, .links', .5, { opacity: 1, scale: 1, ease: Quad.easeOut })
    }
  }
})
