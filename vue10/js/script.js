new Vue({
  el: "#app",
  data() {
    return {
      checked: 'choose',
      tlProg: 0,
      lastM: '',
      dates: [
        { city: 'Honolulu', region: 'Pacific/Honolulu'},
        { city: 'Anchorage', region: 'America/Anchorage'},
        { city: 'Los Angeles', region: 'America/Los_Angeles'},
        { city: 'San Francisco', region: 'America/Los_Angeles'},
        { city: 'Vancouver', region: 'America/Vancouver'},
        { city: 'Phoenix', region: 'America/Phoenix'},
        { city: 'Denver', region: 'America/Denver'},
        { city: 'Costa Rica', region: 'America/Costa_Rica'},
        { city: 'Chicago', region: 'America/Chicago'},
        { city: 'Cancun', region: 'America/Cancun'},
        { city: 'Jamaica', region: 'America/Jamaica'},
        { city: 'Toronto', region: 'America/Toronto'},
        { city: 'Puerto Rico', region: 'America/Puerto_Rico'},
        { city: 'Dublin', region: 'Europe/Dublin'},
        { city: 'London', region: 'Europe/London'},
        { city: 'Rome', region: 'Europe/Rome'},
        { city: 'Vatican', region: 'Europe/Vatican'},
        { city: 'Berlin', region: 'Europe/Berlin'},
        { city: 'Prague', region: 'Europe/Prague'},
        { city: 'Madrid', region: 'Europe/Madrid'},
        { city: 'Paris', region: 'Europe/Paris'},
        { city: 'Warsaw', region: 'Europe/Warsaw'},
        { city: 'Algiers', region: 'Africa/Algiers'},
        { city: 'Athens', region: 'Europe/Athens'},
        { city: 'Cairo', region: 'Africa/Cairo'},
        { city: 'Johannesburg', region: 'Africa/Johannesburg'},
        { city: 'Istanbul', region: 'Europe/Istanbul'},
        { city: 'Jerusalem', region: 'Asia/Jerusalem'},
        { city: 'Baghdad', region: 'Asia/Baghdad'},
        { city: 'Kuwait', region: 'Asia/Kuwait'},
        { city: 'Addis Ababa', region: 'Africa/Addis_Ababa'},
        { city: 'Tehran', region: 'Asia/Tehran'},
        { city: 'Moscow', region: 'Europe/Moscow'},
        { city: 'Katmandu', region: 'Asia/Katmandu'},
        { city: 'Hong Kong', region: 'Asia/Hong_Kong'},
        { city: 'Kuala Lumpur', region: 'Asia/Kuala_Lumpur'},
        { city: 'Singapore', region: 'Asia/Singapore'},
        { city: 'Perth', region: 'Australia/Perth'},
        { city: 'Tokyo', region: 'Asia/Tokyo'},
        { city: 'Melbourne', region: 'Australia/Melbourne'}
      ]
    };
  },
  methods: {
    //this formats the hour info without a library
    getCurrentHour(zone) {
      let newhr = new Date().toLocaleTimeString('en', {
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true, 
        timeZone: zone
      })
      return newhr
    },
    spin(rot) {
      TweenMax.to('#dialspin', 1, {
        rotation: rot,
        transformOrigin: '50% 50%',
        ease: Sine.easeInOut
      })
    },
    daynight() {
      const tl = new TimelineMax(),
            //edge why you do dis to me
            isIE = '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style && !window.navigator.msPointerEnabled,
            dur = 3;
      
      tl.add('day')
      tl.fromTo('#radcircs', dur, {
        fill: '#2be2de',
      }, {
        fill: '#ff3989',
        ease: Sine.easeOut
      }, 'day')
      tl.fromTo('#radcircs circle', dur, {
        opacity: 0.02,
      }, {
        opacity: 0.04,
        ease: Sine.easeOut
      }, 'day')
      tl.staggerFromTo('#cloudsm', dur, {
        x: 0,
        y: 0
      }, {
        x: 50,
        y: 5,
        ease: Sine.easeOut
      }, 0.5, 'day')
      tl.staggerFromTo('#cloudlg', dur, {
        x: 0,
        y: 0
      }, {
        x: 70,
        y: -10,
        ease: Sine.easeOut
      }, 0.5, 'day')
      tl.fromTo('#sun', dur, {
        opacity: 1,
        x: 0,
        y: 0
      }, {
        x: 100,
        y: 50,
        opacity: 0,
        ease: Sine.easeIn
      }, 'day')
      tl.fromTo('#moonstars', dur, {
        opacity: 0,
        x: -100,
        y: 50
      }, {
        x: 0,
        y: 0,
        opacity: 1,
        ease: Sine.easeOut
      }, 'day')
      tl.fromTo('#yellowlayer-3', dur, {
        opacity: 0.2
      }, {
        opacity: 0,
        ease: Sine.easeOut
      }, 'day')
      tl.fromTo('#sky-3', dur, {
        opacity: 1
      }, {
        opacity: 0.4,
        ease: Sine.easeOut
      }, 'day')
      tl.fromTo('#stopcolor', dur, {
        attr: {
          'stop-color': '#76b4e8'
        }
      }, {
        attr: {
          'stop-color': 'blue',
        },
        ease: Sine.easeOut
      }, 'day')
      if (!isIE) { tl.pause() } 
      return tl;
    },
    animTime(time, period) {
      this.daynight().timeScale(1).pause();
      if (period == this.lastM) {
        TweenMax.fromTo(this.daynight(), 0.75, {
          progress: this.tlProg
        }, {
          progress: time,
          ease: Sine.easeInOut
        })
      } else {    
        TweenMax.to(this.daynight(), 1.3, {
          progress: time,
          ease: Sine.easeInOut
        })
      }
      this.tlProg = time;
      this.lastM = period;
    },
  },
  computed: {
    timeVal() {
      return this.getCurrentHour(this.checked.region);
    }
  },
  watch: {
    checked() { 
      let period = this.timeVal.slice(-2),
          hr = this.timeVal.slice(0, this.timeVal.indexOf(":"));
      
      const dayhr = 12,
            rpos  = 115,
            rneg  = -118;
      
      if ((period === 'AM' && hr != 12) || (period === 'PM' && hr == 12)) {
        this.spin(`${rneg - (rneg/dayhr) * hr}`)
        this.animTime(1-hr/dayhr, period)
      } else {
        this.spin(`${(rpos/dayhr) * hr}`)
        this.animTime(hr/dayhr, period)
      }
      
    }
  },
});
