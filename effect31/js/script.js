class Pointer {
  constructor(domElement, { scaleMin = 0.01, scaleMax = 10.0, pressureMax = 1.0, pressureDuration = 1000 } = {}) {
    if (Pointer.instance) {
      return Pointer.instance;
    }

    this.dom = domElement;
    this.opt = { scaleMin, scaleMax, pressureMax, pressureDuration };

    this.position = new THREE.Vector2();
    this.zoomSpeed = 1.0;
    this.scale = 1.0;
    this.dollyStart = new THREE.Vector2();
    this.dollyEnd = new THREE.Vector2();
    this.dollyDelta = new THREE.Vector2();

    this.addMoveListener(this.onMove.bind(this));
    this.addDownListener(this.onDown.bind(this));
    this.addUpListener(this.onUp.bind(this));

    this.dom.addEventListener('touchstart', this._onTouchZoomStart, false);
    this.addZoomListener(this.onZoom.bind(this));
    this.isPressing = false;
    this.pressure = 0.0;

    Pointer.instance = this;
  }

  get zoomScale() {
    return Math.pow(0.95, this.zoomSpeed);
  }
  setScale(val) {
    this.scale = THREE.Math.clamp(val, this.opt.scaleMin, this.opt.scaleMax);
  }

  updatePosition(clientX, clientY) {
    let size = Math.min(this.dom.clientWidth, this.dom.clientHeight);
    this.position.x = (clientX*2 - this.dom.clientWidth) / size;
    this.position.y = ((this.dom.clientHeight-clientY)*2 - this.dom.clientHeight) / size;
  }

  onMove(e) {
    let x, y;
    if (e.touches) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    this.updatePosition(x, y);
    // e.preventDefault();
  }
  addMoveListener(cb) {
    ['mousemove', 'touchmove'].forEach(evtName => {
      this.dom.addEventListener(evtName, cb, false);
    });
  }

  setPressure(val) {
    let valid = val <= this.opt.pressureMax && val >= 0.0;
    this.pressure = THREE.Math.clamp(val, 0.0, this.opt.pressureMax);
    //   console.log(this.pressure);    
    return valid;
  }
  onDown(e) {
    if(e instanceof MouseEvent && e.button !== Pointer.BUTTON.MOUSE_LEFT) {
      return;
    }

    this.isPressing = true;
    if (e.touches) {
      let x = e.touches[0].clientX;
      let y = e.touches[0].clientY;
      this.updatePosition(x, y);
    }


    let interval = 50;
    let intervalID = setInterval(() => {
      let deltaPressure = this.opt.pressureMax / this.opt.pressureDuration * interval;
      if (!this.isPressing || !this.setPressure(this.pressure + deltaPressure)) {
        clearInterval(intervalID);
      }
    }, interval);
  }
  addDownListener(cb) {
    ['mousedown', 'touchstart'].forEach(evtName => {
      this.dom.addEventListener(evtName, cb, false);
    });
  }

  onUp(e) {
    if(e instanceof MouseEvent && e.button !== Pointer.BUTTON.MOUSE_LEFT) {
      return;
    }

    this.isPressing = false;
    let interval = 50;

    let intervalID = setInterval(() => {
      let deltaPressure = this.opt.pressureMax / this.opt.pressureDuration * interval;
      if (this.isPressing || !this.setPressure(this.pressure - deltaPressure)) {
        clearInterval(intervalID);
      }
    }, interval);
  }
  addUpListener(cb) {
    ['mouseup', 'touchend'].forEach(evtName => {
      this.dom.addEventListener(evtName, cb, false);
    });
  }

  _onTouchZoomStart(e) {
    if (e.touches.length !== 2) return;
    let dx = e.touches[0].pageX - e.touches[1].pageX;
    let dy = e.touches[0].pageY - e.touches[1].pageY;
    this.dollyStart.set(0, Math.sqrt(dx * dx + dy * dy));
  }
  _onTouchZoom(e) {
    var dx = e.touches[0].pageX - e.touches[1].pageX;
    var dy = e.touches[0].pageY - e.touches[1].pageY;
    this.dollyEnd.set(0, Math.sqrt(dx * dx + dy * dy));

    this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart);
    if (dollyDelta.y > 0) {
      this.zoomOut();
    } else if (dollyDelta.y < 0) {
      this.zoomIn();
    }

    this.dollyStart.copy(this.dollyEnd);
  }
  _onWheelZoom(e) {
    if (e.deltaY > 0) {
      this.zoomOut();
    } else if (e.deltaY < 0) {
      this.zoomIn();
    }
    e.preventDefault();
  }
  onZoom(e) {
    if (e.touches) {
      this._onTouchZoom(e);
    } else {
      this._onWheelZoom(e);
    }
  }
  addZoomListener(cb) {
    ['wheel', 'touchmove'].forEach(evtName => {
      if (evtName === 'touchmove') {
        cb = (e) => {
          return e.touches.length === 2 ? cb(e) : undefined;
        }
      }
      this.dom.addEventListener(evtName, cb, false);
    });
  }

  zoomIn(scaleFactor = this.zoomScale) {
    this.setScale(this.scale * scaleFactor);
  }
  zoomOut(scaleFactor = this.zoomScale) {
    this.setScale(this.scale / scaleFactor);
  }
}
Pointer.instance = null;
Pointer.BUTTON = {
  MOUSE_LEFT: 0,
  MOUSE_MIDDLE: 1,
  MOUSE_RIGHT: 2
}

let createOrbitViewer = threeOrbitViewer(THREE);

const app = createOrbitViewer({
  clearColor: 0xffffff,
  clearAlpha: 0.0,
  fov: 30,
  position: new THREE.Vector3(0, 0, 100)
});
console.log("app", app);
// app.controls.noZoom = true;
app.controls.noRotate = true;
app.controls.noPan = true;
// const canvas = app.renderer.domElement;

// let viewSize = Math.min(app.engine.deviceWidth, app.engine.deviceHeight);
const shaderMat = new THREE.ShaderMaterial({
  vertexShader: document.getElementById('vert').textContent,
  fragmentShader: document.getElementById('frag').textContent,
  uniforms: {
    uResolution: new THREE.Uniform(new THREE.Vector2(app.engine.deviceWidth, app.engine.deviceHeight)),
    uTime: { type: "f", value: 0 },
    uMouse: new THREE.Uniform(new THREE.Vector2(0, 0)),
    uScale: { type: "f", value: 1.0 },
    uTextureOffset: new THREE.Uniform(new THREE.Vector2(0, 0)),
    uMorphAmount: { type: "f", value: 0.0 },
    uRandomSeed: { type: "f", value: new Date().getTime() % 1000000 }
  },
  extensions: {
    // derivatives: true // don't need this now
  },
  transparent: true,
  // wireframe: true,
  side: THREE.DoubleSide
});

//make a box, hidden until the texture has loaded
const geo = new THREE.PlaneGeometry(100, 100);

const skyWindow = new THREE.Mesh(geo, shaderMat);
app.scene.add(skyWindow);
app.camera.lookAt(skyWindow.position);

const mouse = new Pointer(app.renderer.domElement, {
  scaleMin: 0.4,
  scaleMax: 3.0,
  pressureDuration: 1100
});

mouse.addMoveListener(e => {
  shaderMat.uniforms.uMouse = new THREE.Uniform(mouse.position);
  // console.log(shaderMat.uniforms.uMouse.value);
  // shaderMat.needsUpdate = true;
});

mouse.addDownListener(e => {
  // if play long time, unlock rotate controls
  if(morphAmount > 5) {
    app.controls.noRotate = false;
  }
});
mouse.addUpListener(e => { });
mouse.addZoomListener(e => {
  shaderMat.uniforms.uScale.value = mouse.scale;
});

let time = 0;
let textureOffset = new THREE.Vector2(0, 0);
let morphAmount = 0;
const cloudRunSpeed = 0.005;
app.on("tick", dt => {
  let dtSec = dt / 1000;
  time += dtSec;
  shaderMat.uniforms.uTime.value = time;

  textureOffset.add(mouse.position.clone().multiplyScalar(dtSec * mouse.pressure * cloudRunSpeed));
  morphAmount += dtSec * mouse.pressure;
  shaderMat.uniforms.uTextureOffset = new THREE.Uniform(textureOffset.clone());
  shaderMat.uniforms.uMorphAmount.value = morphAmount;
});

// animation at start
(function fovAnimation() {
  app.camera.fov += 0.6;
  app.camera.updateProjectionMatrix();
  if(app.camera.fov <= 90) {
    setTimeout(fovAnimation, 20);
  }
})();

console.log('The weight of clouds is the weight of the sea.');
console.log('The shape of the sea is the shape of blue.');