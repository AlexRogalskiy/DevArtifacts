// The code is a little different in codepen, if you'd like to see the setup that's more true to real-life, it's in this repo: https://github.com/sdras/vue-weather-notifier
//I had to change a bunch of things around to use vuex in one script tag, most notably that this.$store became just store

const store = new Vuex.Store({
  state: {
    showWeather: false,
    template: 0
  },
  mutations: {
    toggle: state => state.showWeather = !state.showWeather,
    updateTemplate: (state) => {
      state.template = (state.template + 1) % 4;
      state.showWeather = !state.showWeather;
    }
  }
});

const Defs = {
  template: '#defs'
};

const Dialog = {
  template: '#dialog',
  computed: {
    template() {
      return store.state.template;
    }
  },
  methods: {
    toggle() {
      store.commit('toggle');
    }
  },
  mounted() {
    //enter weather
    const tl = new TimelineMax();

    tl.add("enter");

    tl.fromTo("#dialog", 2, {
      opacity: 0
    }, {
      opacity: 1
    }, "enter");

    tl.fromTo("#dialog", 2, {
      rotation: -4
    }, {
      rotation: 0,
      transformOrigin: "50% 100%",
      ease: Elastic.easeOut
    }, "enter");
  }
};

const Droparea = {
  template: '#droparea',
  mounted() {
    let audio = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/rain.mp3'),
      tl = new TimelineMax();

    audio.play();
    tl.add("drops");

    //drops in
    tl.staggerFromTo("#droplet-groups g path", 0.3, {
      drawSVG: "0% -10%"
    }, {
      drawSVG: "100% 110%",
      repeat: 3,
      repeatDelay: 1,
      ease: Sine.easeIn
    }, 0.5, "drops");

    tl.fromTo(".plat-piece", 0.5, {
      y: 88
    }, {
      y: 58,
      ease: Sine.easeOut
    }, "drops");

    tl.fromTo("#lt-shadow", 0.5, {
      scale: 0,
      opacity: 0
    }, {
      opacity: 1,
      scale: 1,
      ease: Sine.easeOut
    }, "drops");

    tl.staggerFromTo("#drop-area [id^='drop-a'] [id^='drop-in'] path", 0.3, {
      drawSVG: "100% 110%"
    }, {
      drawSVG: "0% -10%",
      repeat: 2,
      repeatDelay: 1,
      ease: Sine.easeIn
    }, 0.5, "drops+=1");

    tl.staggerFromTo("#drop-area [id^='drop-a'] [id^='big-drop'] path", 0.5, {
      opacity: 0
    }, {
      opacity: 1,
      ease: Sine.easeOut
    }, -0.04, "drops+=1");

    tl.fromTo("#drop-shadow", 3, {
      opacity: 0
    }, {
      opacity: 1,
      ease: Sine.easeOut
    }, "drops+=1.5");

    tl.staggerFromTo("#droplet-groups g ellipse", 0.3, {
      scaleX: 0,
      scaleY: 1,
      opacity: 1
    }, {
      transformOrigin: "20% 50%",
      scaleX: 4,
      scaleY: 2,
      opacity: 0,
      repeat: 3,
      repeatDelay: 1,
      ease: Sine.easeIn
    }, 0.5, "drops+=0.3");

    tl.staggerFromTo("#drop-area [id^='drop-a'] [id^='drop-in'] ellipse", 0.3, {
      scaleX: 0,
      scaleY: 1,
      opacity: 1
    }, {
      transformOrigin: "20% 50%",
      scaleX: 4,
      scaleY: 2,
      repeat: 2,
      repeatDelay: 1,
      opacity: 0,
      ease: Sine.easeIn
    }, 0.5, "drops+=0.3");

    tl.staggerFromTo("#ripple ellipse", 2, {
      scale: 0,
      opacity: 1,
      transformOrigin: "50% 50%",
    }, {
      transformOrigin: "50% 50%",
      scale: 1,
      opacity: 0,
      ease: Sine.easeOut
    }, "-0.2", "drops+=0.3");

  }
};

const Windarea = {
  template: '#windarea',
  mounted() {
    let audio = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/wind.mp3'),
      tl = new TimelineMax(),
      easeConfig = CustomEase.create("custom", "M0,0 C0,0 0.012,-0.064 0.015,-0.076 0.03,0.05 0.057,-0.052 0.075,-0.042 0.06,0.344 0.123,0.258 0.125,0.266 0.125,0.258 0.114,-0.039 0.14,-0.039 0.184,-0.039 0.165,0.205 0.175,0.29 0.211,0.303 0.26,0.108 0.315,0.341 0.316,0.329 0.324,0.275 0.325,0.272 0.325,0.277 0.338,0.385 0.34,0.395 0.354,0.512 0.413,0.263 0.42,0.251 0.478,0.108 0.445,0.432 0.46,0.532 0.474,0.559 0.516,0.392 0.5,0.608 0.472,0.802 0.633,0.486 0.65,0.471 0.651,0.491 0.657,0.602 0.66,0.65 0.678,0.659 0.67,0.8 0.73,0.685 0.764,0.789 0.778,1.144 0.845,1.029 0.846,1.026 0.858,0.989 0.86,0.984 0.87,1.002 0.926,0.822 0.96,1.151 0.964,1.136 1,1 1,1");

    audio.play();
    audio.volume = 0.2;
    TweenMax.set("#hat", {
      x: -120
    });

    tl.add("wind");

    //wind timeline
    tl.fromTo(".windbox", 1.5, {
      rotation: -10,
      x: -6,
      y: 3
    }, {
      x: -6,
      y: 3,
      rotation: 10,
      repeat: 2,
      yoyo: true,
      transformOrigin: "0% 80%",
      ease: easeConfig
    }, "wind");

    tl.to(".leaf1", 1.5, {
      attr: {
        d: "M321.6,240.6c-18.9-5.4-28.7-.7-27.6,11.7.1.9.3,2.6-.4,3.2v-.8C292,240.6,299.9,239.1,321.6,240.6Z"
      },
      repeat: 2,
      yoyo: true,
      ease: easeConfig
    }, "wind");

    tl.to(".leaf2", 1.5, {
      rotation: 8,
      transformOrigin: "0 100%",
      repeat: 2,
      yoyo: true,
      ease: easeConfig
    }, "wind");

    tl.to(".leaf3", 1.5, {
      rotation: 4,
      transformOrigin: "0 100%",
      repeat: 2,
      yoyo: true,
      ease: easeConfig
    }, "wind");

    tl.to(".leaf4", 1.5, {
      attr: {
        d: "M259.8,205.8c-10.9-.8-15.1,2.6-20.4,10.7-1.9,2.9-1.7,10.9-1.5,14.5C241.5,214.4,248.3,213.3,259.8,205.8Z"
      },
      repeat: 2,
      yoyo: true,
      ease: easeConfig
    }, "wind");

    tl.to(".leaf5", 1.5, {
      attr: {
        d: "M257.7,211.1c-7.7,1.2-16.4,1.7-18.2,11.6-.7,3.6-1.5,4.6-1.6,8.2C243.3,214.3,249.8,218,257.7,211.1Z"
      },
      repeat: 2,
      yoyo: true,
      ease: easeConfig
    }, "wind");

    tl.to("#hat", 5, {
      bezier: {
        type: "soft",
        values: [{
          x: -100,
          y: -50
        }, {
          x: 100,
          y: -100
        }, {
          x: 200,
          y: -50
        }, {
          x: 300,
          y: -80
        }, {
          x: 400,
          y: -200
        }, {
          x: 500,
          y: -100
        }, {
          x: 600,
          y: -100
        }, {
          x: 700,
          y: -50
        }, {
          x: 900,
          y: -130
        }],
        autoRotate: false
      },
      rotation: -1000,
      ease: Circ.easeInOut
    }, "wind");

    tl.to(".petal1", 3, {
      bezier: {
        type: "soft",
        values: [{
          x: 20,
          y: -70
        }, {
          x: 250,
          y: 80
        }, {
          x: 300,
          y: 80
        }, {
          x: 500,
          y: 90
        }, {
          x: 600,
          y: 100
        }, {
          x: 700,
          y: 80
        }, {
          x: 900,
          y: 130
        }],
        autoRotate: true
      },
      ease: Circ.easeInOut
    }, "wind");

    tl.to(".petal2", 4, {
      bezier: {
        type: "soft",
        values: [{
          x: 20,
          y: -70
        }, {
          x: 60,
          y: -100
        }, {
          x: 150,
          y: -50
        }, {
          x: 250,
          y: 120
        }, {
          x: 300,
          y: 80
        }, {
          x: 500,
          y: 90
        }, {
          x: 600,
          y: 100
        }, {
          x: 700,
          y: 80
        }, {
          x: 900,
          y: 130
        }],
        autoRotate: true
      },
      ease: Circ.easeOut
    }, "wind");

    tl.to(".petal3", 4, {
      bezier: {
        type: "soft",
        values: [{
          x: 40,
          y: -20
        }, {
          x: 60,
          y: -40
        }, {
          x: 150,
          y: -50
        }, {
          x: 250,
          y: -40
        }, {
          x: 300,
          y: -80
        }, {
          x: 500,
          y: -90
        }, {
          x: 600,
          y: -100
        }, {
          x: 700,
          y: -80
        }, {
          x: 900,
          y: 60
        }],
        autoRotate: false
      },
      rotation: 1000,
      ease: Circ.easeOut
    }, "wind+=3");

  }
};

const Rainbowarea = {
  template: '#rainbowarea',
  mounted () {
			let audio = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/rainbow.mp3'),
					tl = new TimelineMax();

      audio.play();
      audio.volume = 0.2;
			tl.add("rainbow", "+=0.5");

			//rainbow
			tl.fromTo("#beams", 2.5, {
				scale: 0,
				opacity: 0,
				x: 36, 
				y: 34,
				rotation: 0
			}, {
				scale: 1,
				x: 36, 
				y: 34,
				opacity: 0.2,
				rotation: "-720",
				transformOrigin: "50% 50%",
				ease: Linear.easeNone
			}, "rainbow");

			tl.to("#beams", 4, {
				rotation: 360,
				repeat: 4,
				transformOrigin: "50% 50%",
				ease: Linear.easeNone
			}, "rainbow+=2.5");

			tl.fromTo(".bow, #sun", 1, {
				opacity: 0,
			}, {
				opacity: 1,
				ease: Sine.easeOut
			}, "rainbow");

			tl.fromTo("#light", 3, {
				opacity: 0,
			}, {
				opacity: 0.8,
				ease: Sine.easeOut
			}, "rainbow");

			tl.fromTo("#blue", 2, {
				opacity: 0,
				x: 36, 
				y: 21,
				scale: 0.5
			}, {
				opacity: 1,
				scale: 1,
				x: 36, 
				y: 21,
				transformOrigin: "50% 50%",
				ease: Sine.easeOut
			}, "rainbow");

			tl.staggerFromTo("#rainbowpaths ellipse", 1.5, {
				drawSVG: false
			}, {
				drawSVG: true,
				ease: Sine.easeIn
			}, 0.1, "rainbow");

			tl.fromTo(".r-piece1", 0.5, {
				y: 88
			}, {
				y: 58,
				ease: Sine.easeOut
			}, "rainbow");

		}
};

const Tornadoarea = {
  template: '#tornadoarea',
  mounted () {
			let audio = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/tornado.mp3'),
					tl = new TimelineMax();

      audio.play();
			tl.add("tornado");

			//drops in
			tl.staggerFromTo(".tornado-group ellipse", 1, {
				opacity: 0
			}, {
				opacity: 1,
				ease: Sine.easeOut
			}, 0.15, "tornado");

			tl.staggerFromTo(".tornado-group ellipse", 1, {
				rotation: 0
			}, {
				rotation: 20,
				transformOrigin: "50% 50%",
				repeat: 10,
				yoyo: true,
				ease: Sine.easeInOut
			}, 0.15, "tornado-=1");

			tl.fromTo("#fog", 1, {
				opacity: 0,
				scale: 0,
				x: 75,
				y: 75
			}, {
				opacity: 1,
				scale: 1,
				x: 75,
				y: 75,
				transformOrigin: "50% 50%",
				ease: Sine.easeOut
			}, "tornado");

			tl.fromTo("#lightning", 1.2, {
				drawSVG: "0% -10%"
			}, {
				drawSVG: "100% 110%",
				repeat: 3,
				repeatDelay: 1.5,
				ease: Sine.easeInOut
			}, "tornado");

		}
};

//main app
const app = new Vue({
  el: '#app',
  computed: {
    showWeather() {
      return store.state.showWeather;
    },
    template() {
      return store.state.template;
    }
  },
  methods: {
    updateTemplate() {
      store.commit('updateTemplate');
    },
    beforeEnter(el) {
      el.style.opacity = 0;
    },
    enter(el, done) {
      const tl = new TimelineMax({
        onComplete: done
      });

      tl.set(el, {
        opacity: 0,
        scale: 0.9,
        visibility: 'visible',
        transformOrigin: '50% 50%'
      });

      tl.to(el, 0.75, {
        opacity: 1,
        scale: 1,
        ease: Circ.easeOut
      }, 1);

      tl.to(el, 0.75, {
        opacity: 0.8,
        scale: 0.97,
        repeat: 5,
        yoyo: true,
        ease: Sine.easeOut
      });

      tl.to(el, 1, {
        opacity: 0,
        scale: 0.9,
        ease: Sine.easeIn
      }, "+=0.5");

    },
    beforeEnterStroke(el) {
      el.style.strokeWidth = 0;
      el.style.stroke = 'orange';
    },
    enterStroke(el, done) {
      const tl = new TimelineMax({
        onComplete: done
      });

      tl.to(el, 0.75, {
        strokeWidth: 1,
        ease: Circ.easeOut
      }, 1);

      tl.to(el, 4, {
        strokeWidth: 0,
        opacity: 0,
        ease: Sine.easeOut
      });

    },
    leaveDroparea(el, done) {
      const tl = new TimelineMax({
        onComplete: done
      });

      tl.to(el, 1, {
        opacity: 0,
        ease: Sine.easeIn
      });

    },
    leaveDialog(el, done) {
      const tl = new TimelineMax({
        onComplete: done
      });

      tl.add("leave");

      tl.to(el, 0.3, {
        rotation: -2,
        repeat: 2,
        yoyo: true,
        transformOrigin: "50% 100%",
        ease: Sine.easeInOut
      }, "leave");

      tl.fromTo(el, 1, {
        opacity: 1
      }, {
        opacity: 0,
        ease: Sine.easeIn
      }, "leave");

    }
  },
  components: {
    appDefs: Defs,
    appDialog: Dialog,
    appDroparea: Droparea,
    appWindarea: Windarea,
    appRainbowarea: Rainbowarea,
    appTornadoarea: Tornadoarea
  }
});