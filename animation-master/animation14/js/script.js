const instances = []

const anchor = document.querySelector('.anchor')

// Create an animation for each border and letter
document.querySelectorAll('.letter, .border').forEach((elem) => {

  // Get the end values from the data attributes
  const tx = elem.getAttribute('data-tx') + 'px'
  const ty = elem.getAttribute('data-ty') + 'px'
  const r = elem.getAttribute('data-r') + 'deg'

  // Crate an instance for the current element and store the instance in an array.
  // We start the animation later using the instances from the array.
  instances.push(basicScroll.create({
    elem: anchor,
    from: 'top-bottom',
    to: 'top-top',
    direct: elem,
    props: {
      '--tx': {
        from: '0',
        to: tx
      },
			'--ty': {
        from: '0',
        to: ty
      },
			'--r': {
        from: '0',
        to: r
      }
    }
  }))

})

instances.forEach((instance) => instance.start())