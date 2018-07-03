var app6 = new Vue({
  el: '#app',
  data() {
    return {
      message: 'This is a good place to type things.',
      load: false
    }
  },
  methods: {
    beforeEnter(el) {
      TweenMax.set(el, {
        transformPerspective: 600,
        perspective: 300,
        transformStyle: "preserve-3d",
        autoAlpha: 1
      });
    },
    enter(el, done) {
      var loader = this.load;
      let split = new SplitText(el, { type: "words" }),
          wordCount = split.words.length,
          tl = new TimelineMax({
            onComplete: done
          });
      
      for (var i = 0; i < wordCount; i++) {
        TweenMax.set(split.words[i], {
          x: Math.floor(Math.random() * (1 + 300 - -300) + -300)
        });
      }
      
      tl.add("drop");
      for (var i = 0; i < wordCount; i++) {
        tl.from(split.words[i], 1.5, {
          z: Math.floor(Math.random() * (1 + 150 - -150) + -150),
          ease: Bounce.easeOut
        }, "drop+=0." + ([i] / 0.5));
        
        tl.fromTo(split.words[i], 1.5, {
          y: -800
        }, {
          y: 150,
          ease: Bounce.easeOut
        }, "drop+=0." + ([i] / 0.5));

        tl.to(split.words[i], 0.5, {
          rotation: 720,
          y: 0,
          x: 0,
          z: 0,
          ease: Sine.easeIn
        }, "drop+=1." + (5 + [i] / 0.5));
      }
      
    }
  }
})