const PARAGRAPH = `NIH (Not Invented Here) isn’t a 4-letter word. We’re all presumably programmers because we like programming. We shouldn’t have to resign ourselves to the plumbing together of existing, poorly understood software, spending our days to write glue code we hate to produce a Frankenstein, monster system that sucks. We can do noble work and have it address problems from first principles. And that, in turn, makes us better more able engineers in the doing. NIH is a derogatory term for what I think is actually an incredibly important and virtuous impulse that is to invent and to create, to learn by doing. Of course, we have to strike a balance between self-actualizing and getting the job done, but I don’t think we should take inventing something from first principles out of our tool belt kind of reflexively. Sometimes it can be the right thing to do and it can help us grow as professionals and as human beings.`;

new Vue({
  el: '#app',
  data: {
    title: 'Vue Typer',
    originalText: PARAGRAPH,
    typedText: '',
    typoIndex: -1,
    timer: 60
  },
  methods: {
    startTypingSpeed: function() {

    },
    startTimer: function() {
      setInterval(function() {
        if (this.timer === 0) {
          this.endTypingSpeed()
          return;
        }
        this.timer--
      }, 1000)
    },
    endTypingSpeed: function() {
      
    }
  },
  computed: {
    outputHTML: function() {
      let newHTML = '<span class="correct">'
      if (this.typoIndex === -1) {
        // we do not have a typo index
        newHTML += this.originalText.substr(0, this.typedText.length)
        newHTML += '</span>'
        newHTML += this.originalText.substr(this.typedText.length)

        return newHTML
      }

      // else we have a typo index
      newHTML += this.originalText.substr(0, this.typoIndex)
      newHTML += '</span>'
      newHTML += '<span class="typo">'
      newHTML += this.originalText.substring(this.typoIndex, this.typedText.length)
      newHTML += '</span>'
      newHTML += this.originalText.substr(this.typedText.length)

      return newHTML
    }
  },
  watch: {
    typedText: function(value) {
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== this.originalText[i]) {
          this.typoIndex = i;
          break;
        }
        this.typoIndex = -1;
      }
    }
  }
});
