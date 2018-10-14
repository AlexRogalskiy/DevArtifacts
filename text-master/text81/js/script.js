// CDN: https://unpkg.com/actuatejs
// Repo: https://github.com/lukejacksonn/Actuate
// ---------------------------------------------
// Below are some example use cases including 
// animation sequencing and chaining of sequences
// if you would like to see more demos or features
// please go ahead and create an issue or pull request

// IMPORTANT!! This demo uses animations uses from:
// https://github.com/daneden/animate.css
// You will need to include a copy of this from:
// https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css

// --------------------------------------
// Actuate a single animation
// --------------------------------------
// Actuate('tada')(document.body)

// --------------------------------------
// Space delimited animation sequence
// --------------------------------------
Actuate('rollIn tada rollOut fadeIn bounce')(document.body)

// --------------------------------------
// Animation sequence from array
// --------------------------------------
// Actuate(['rollIn','tada','rollOut','fadeIn','bounce'])(document.body)

// --------------------------------------
// Animation end detection
// --------------------------------------
// Actuate('tada')(document.body)
// .then($ => console.log('Finished animating', $))

// --------------------------------------
// Chaining animations sequences
// --------------------------------------
// var intro = Actuate('rollIn')
// var showoff = Actuate('bounce tada bounce')
// var outro = Actuate('rollOut')

// Promise.resolve(document.body)
// .then(intro)
// .then(showoff)
// .then(outro)

// --------------------------------------
// Already animating catch
// --------------------------------------
addEventListener('click', () =>
  Actuate('tada')(document.body)
  .then($ => console.log('Finished'))
  .catch($ => console.log('Already Animating'))
)