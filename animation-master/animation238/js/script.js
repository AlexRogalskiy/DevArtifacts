const draggable = document.querySelector('.draggable')
const proxy = document.querySelector('.proxy')
const cube = document.querySelector('.cube')

TweenLite.set(cube, {
  transformOrigin: '50% 100% 34px',
  rotationY: 45
})

function rotate (x, y) {
  TweenLite.set(cube, {
    rotationY: x / 2,
    rotationX: -y / 2,
  })
}

Draggable.create(proxy, {
  type: 'x,y',
  trigger: draggable,
  throwProps: true,
  onDrag: function () {
    rotate(this.x)
    //rotate(this.x, this.y)
  },
  onDragEnd: function () {
    TweenLite.to(this.target, 2, {
      throwProps: {
        x: 'auto',
        y: 'auto',
      },
      onUpdate: function () {
        rotate(this.target._gsTransform.x)
        //rotate(this.target._gsTransform.x, this.target._gsTransform.y)
      },
      ease: Power4.easeOut,
    })
  }
})

function mouseDown () {
  TweenLite.to(cube, .4, {
    y: 0,
    scaleX: 1.2,
    scaleY: .2,
    scaleZ: 1.2,
    ease: Power4.easeOut,
  })
}

function mouseUp () {
  // jump
  TweenLite.to(cube, .05, {
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    ease: Power0.easeNone,
  })
  
  TweenLite.to(cube, .5, {
    y: -64 * 4,
    ease: Back.easeOut,
    delay: .05,
  })
  
  TweenLite.to(cube, .4, {
    y: -64 * 2,
    scaleY: 3,
    ease: Power1.easeOut,
    delay: .41,
  })
  
  TweenLite.to(cube, .4, {
    y: 0,
    ease: Power4.easeOut,
    delay: .55,
  })
  
  TweenLite.to(cube, 2, {
    scaleY: 1,
    ease: Elastic.easeOut,
    delay: .65,
  })
}

document.addEventListener('touchstart', mouseDown)
document.addEventListener('touchend', mouseUp)

document.addEventListener('mousedown', mouseDown)
document.addEventListener('mouseup', mouseUp)

// jump once
mouseDown()
setTimeout(mouseUp, 400)
