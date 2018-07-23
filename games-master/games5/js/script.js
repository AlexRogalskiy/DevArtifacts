console.clear();

// =====================================
class App {
  constructor(opts) {
    this.opts = Object.assign({}, App.defaultOpts, opts);
    this.physixBodies = [];
    this.rotation = { x: 0, y: 0 };
    this.mobile = false;

    this.world = new World();
    this.physix = new Physix();
    this.ball = new Ball();
    this.bowl = new Bowl({ maps: opts.assets });
    if (this.opts.debug === true) this.physix.createDebugger(this.world.scene);

    this.init();
  }

  init() {
    this.threeEnvironment();
    this.physixEnvironment();
    this.createPairs();
    this.initEvents();
    window.requestAnimationFrame(this.animate.bind(this));
  }

  threeEnvironment() {
    initLights(this.world);
    this.world.sceneAdd(this.ball.mesh);
    this.world.sceneAdd(this.bowl.mesh);
  }

  physixEnvironment() {
    this.collider = collider();
    this.physix.addBody(this.collider);
    this.physix.addBody(this.ball.bounds);
    this.physix.addBody(this.bowl.bounds);
  }

  createPairs() {
    this.physixBodies.push({ destination: this.ball.mesh, source: this.ball.bounds });
    this.physixBodies.push({ destination: this.bowl.bounds, source: this.bowl.mesh });
  }

  initEvents() {
    const events = new EventHandler({
      callback: this.updateRotation.bind(this),
      collider: this.collider,
      body: this.ball.bounds,
      position: { x: 0, y: 30, z: 40 },
    });
  }

  updateRotation(eventData) {
    this.mobile = eventData.mobile;
    this.rotation.x = eventData.x;
    this.rotation.y = eventData.y;
  }

  animate() {
    const timeStep = 1.0 / 90.0;
    this.physix.updateStep(timeStep);

    if (this.mobile) {
      this.bowl.mesh.rotation.set(-this.rotation.y, 0, -this.rotation.x);
    } else {
      this.bowl.mesh.rotation.set(
        this.rotation.y * -0.2,
        -this.rotation.x * 0.3,
        -this.rotation.x * 0.2
      );
    }
    for (let i = 0; i < this.physixBodies.length; i++) {
      updatePhysix(this.physixBodies[i]);
    }
    this.world.renderer.render(this.world.scene, this.world.camera);
    if (this.opts.debug) this.physix.updateDebugger();

    window.requestAnimationFrame(this.animate.bind(this));
  }
}

App.defaultOpts = {
  debug: false,
};

// =====================================

class EventHandler {
  constructor(opts) {
    this.opts = opts;
    this.mobile = this.isMobile();
    this.mobile ? this.orientationHandler() : this.mouseHandler();
    this.collisionHandler();
  }

  collisionHandler() {
    let reset = false;
    this.opts.collider.addEventListener('collide', e => {
      resetBody(this.opts.body, this.opts.position);
    });
  }

  isMobile() {
    const useragent = navigator.userAgent;
    let mobile = false;

    if (
      useragent.match(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i
      )
    ) {
      mobile = true;
    }

    return mobile;
  }

  mouseHandler() {
    window.addEventListener('mousemove', this.getData.bind(this));
  }

  orientationHandler() {
    window.addEventListener('deviceorientation', this.getData.bind(this), true);
  }

  getData(e) {
    const data = {
      mobile: this.mobile,
      x: 0,
      y: 0,
    };

    if (this.mobile) {
      data.x = e.gamma * 0.01;
      data.y = 0.44 - e.beta * 0.01;
    } else {
      data.x = e.clientX / window.innerWidth * 2 - 1;
      data.y = e.clientY / window.innerHeight * -2 + 1;
    }
    this.sendData(data);
  }

  sendData(obj) {
    this.opts.callback(obj);
  }
}

// =====================================
// how to reset a body in cannon
// => https://github.com/schteppe/cannon.js/issues/215
function resetBody(body, pos) {
  const tl = new TimelineMax();

  tl
    .add(() => {
      body.mass = 0;
      body.updateMassProperties();
      body.velocity.setZero();
      body.angularVelocity.setZero();

      body.sleepState = 1;
      body.timeLastSleepy = 1;

      // orientation
      body.quaternion.set(0, 0, 0, 1);
      body.initQuaternion.set(0, 0, 0, 1);
      body.interpolatedQuaternion.set(0, 0, 0, 1);

      // Velocity
      body.initVelocity.setZero();
      body.initAngularVelocity.setZero();

      // Force
      body.force.setZero();
      body.torque.setZero();

      // Sleep state reset
      body.sleepState = 0;
      body.timeLastSleepy = 0;
      body._wakeUpAfterNarrowphase = false;
    })
    .to(body.position, 0.8, {
      bezier: {
        type: 'thru',
        curviness: 2,
        values: [
          { x: body.position.x * 0.5, y: 60, z: body.position.z * 0.5 },
          { x: pos.x, y: pos.y, z: pos.z },
        ],
      },
      ease: Power4.easeInOut,
    })
    .add(() => {
      body.mass = 5;
      body.updateMassProperties();
      body.sleepState = 1;
    });
}

// =====================================
function initLights(world) {
  const shadowLight = new THREE.PointLight(0xffffff);
  shadowLight.intensity = 1.0; 
  shadowLight.distance = 200;
  shadowLight.decay = 1.0;
  shadowLight.position.set(30, 100, 0);
  shadowLight.castShadow = true;
  shadowLight.shadow.mapSize.width = 1024;
  shadowLight.shadow.mapSize.height = 1024;
  shadowLight.shadow.camera.near = 50.0;
  shadowLight.shadow.camera.far = 200.0;
  shadowLight.shadow.radius = 6.0;
  world.sceneAdd(shadowLight);
  // world.sceneAdd(new THREE.CameraHelper(shadowLight.shadow.camera));

  const sunLight = new THREE.DirectionalLight(0xffffff, 0.2); // 0.4
  sunLight.position.set(30, 100, 20);
  world.sceneAdd(sunLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  world.sceneAdd(ambientLight);
}

function updatePhysix(obj) {
  obj.destination.quaternion.copy(obj.source.quaternion);
  obj.destination.position.copy(obj.source.position);
}

// =====================================
class Physix {
  constructor(opts) {
    this.opts = Object.assign({}, Physix.defaultOpts, opts);
    this.init();
  }

  init() {
    this.physix = new CANNON.World();
    this.physix.broadphase = new CANNON.NaiveBroadphase();
    this.physix.gravity.set(0, this.opts.gravityY, 0);
    this.physix.solver.iterations = this.opts.iterations;
    this.physix.solver.tolerance = this.opts.tolerance;
    this.physix.defaultContactMaterial.contactEquationStiffness = this.opts.stiffness;
    this.physix.defaultContactMaterial.contactEquationRelaxation = this.opts.relaxation;
  }

  addBody(body) {
    this.physix.add(body);
  }

  updateStep(step) {
    this.physix.step(step);
  }

  createDebugger(scene) {
    this.debugger = new THREE.CannonDebugRenderer(scene, this.physix);
  }

  updateDebugger() {
    this.debugger.update();
  }
}

Physix.defaultOpts = {
  gravityY: -1000,
  iterations: 20,
  tolerance: 0,
  stiffness: 1e9,
  relaxation: 1,
};

// =====================================

class World {
  constructor(opts) {
    this.opts = Object.assign({}, World.defaultOpts, opts);
    this.init();
  }

  init() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.addRenderer();
    window.addEventListener('resize', this.resizeHandler.bind(this));
  }

  initScene() {
    this.scene = new THREE.Scene();
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      this.opts.camFov,
      window.innerWidth / window.innerHeight,
      this.opts.camNear,
      this.opts.camFar
    );
    this.camera.position.set(
      this.opts.camPosition.x,
      this.opts.camPosition.y,
      this.opts.camPosition.z
    );
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  addRenderer() {
    this.opts.container.appendChild(this.renderer.domElement);
  }

  resizeHandler() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  sceneAdd(obj) {
    this.scene.add(obj);
  }
}

World.defaultOpts = {
  container: document.body,
  camPosition: new THREE.Vector3(0, 200, 400),
  camFov: 20,
  camNear: 0.1,
  camFar: 800,
};

// =====================================
function collider() {
  const body = new CANNON.Body({
    mass: 0,
  });
  body.type = 2;

  const shape = new CANNON.Cylinder(1000, 1000, 10, 16);
  const position = new CANNON.Vec3(0, -100, 0);
  const rotation = new CANNON.Quaternion();
  rotation.setFromEuler(Math.PI * 0.5, 0, 0, 'XYZ');
  body.addShape(shape, position, rotation);

  return body;
}

// =====================================
class Ball {
  constructor(opts) {
    this.opts = Object.assign({}, Ball.defaultOpts, opts);
    this.mesh = this.ballMesh();
    this.bounds = this.ballBounds();
  }

  ballMesh() {
    const geometry = new THREE.SphereGeometry(
      this.opts.radius,
      this.opts.segments,
      this.opts.segments
    );

    geometry.faces.forEach(face => {
      if (face.normal.y > 0) {
        face.color.setHex(this.opts.color1);
      } else {
        face.color.setHex(this.opts.color2);
      }
    });

    const material = new THREE.MeshStandardMaterial({
      vertexColors: THREE.FaceColors,
      roughness: this.opts.roughness,
      metalness: this.opts.metalness,
      emissive: this.opts.emissive,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(this.opts.scale);
    mesh.receiveShadow = this.opts.receiveShadow;
    mesh.castShadow = this.opts.castShadow;

    return mesh;
  }

  ballBounds() {
    const material = new CANNON.Material({
      friction: 0.01,
      restitution: 1.0,
    });
    const body = new CANNON.Body({
      mass: 5,
      material: material,
      linearDamping: 0.0,
      angularDamping: 0.0,
    });
    const sphere = new CANNON.Sphere(this.opts.radius);
    body.addShape(sphere);
    body.position.copy(this.opts.position);

    return body;
  }
}

Ball.defaultOpts = {
  position: { x: 0, y: 30, z: 41 },
  radius: 7,
  segments: 32,
  scale: 1,
  color1: 0xffffff,
  color2: 0x9edc9c,
  roughness: 1.0,
  metalness: 0.0,
  emissive: 0x454545,
  receiveShadow: false,
  castShadow: true,
};

// =====================================

const getPath = obj => {
  const radius = 30;
  const c = radius * 0.55191502449;
  const path = new THREE.CurvePath();

  path.curves = [
    new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, radius, 0),
      new THREE.Vector3(c, radius, 0),
      new THREE.Vector3(radius, c, 0),
      new THREE.Vector3(radius, 0, 0)
    ),
  ];
  return path;
};

function getShape() {
  const radius = 10;
  const v = 2.0;

  const outerShape = new THREE.Shape();
  outerShape.moveTo(radius, radius);
  outerShape.absarc(
    0, // x
    radius, // y
    radius, // radius
    Math.PI * 1.5, // startAngle
    Math.PI * 2.5, // endAngle
    false // clockwise
  );

  const innerShape = new THREE.Shape();
  innerShape.moveTo(radius - v, radius);
  innerShape.absarc(
    0, // x
    radius, // y
    -radius - v, // radius
    Math.PI * 1.5, // startAngle
    Math.PI * 2.5, // endAngle
    true // clockwise
  );

  const pointsOuter = outerShape.extractPoints(100);
  const pointsInner = innerShape.extractPoints(100);
  const p = [...pointsOuter.shape, ...pointsInner.shape];
  const shape = new THREE.Shape(p);

  return shape;
}

class Bowl {
  constructor(opts) {
    this.opts = Object.assign({}, Bowl.defaultOpts, opts);
    this.mesh = this.bowlMesh();
    this.bounds = this.bowlBounds();
  }

  bowlMesh() {
    const props = {
      steps: this.opts.steps,
      extrudePath: this.opts.path,
      bevelEnabled: false,
      curveSegments: this.opts.curveSegments,
    };

    const geometry = new THREE.ExtrudeGeometry(this.opts.shape, props);
    assignUVs(geometry);

    const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);

    const mesh = new THREE.Group();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI * 0.5);

    const materials = [
      { color: 0xffffff, map: this.opts.maps.wood, bumpScale: 1.0 },
      { color: 0xffffff, map: null, bumpScale: 0 },
      { color: 0xffffff, map: this.opts.maps.wall, bumpScale: 0.7 },
      { color: 0xfbaaab, map: null, bumpScale: 0.9 },
    ];

    const material = new THREE.MeshStandardMaterial({
      emissive: 0x454545,
      metalness: 0.0,
      roughness: 1.0,
    });
    material.flatShading = false;

    for (let i = 0; i < materials.length; i++) {
      const segment = new THREE.Mesh(bufferGeometry.clone(), material.clone());
      const euler = new THREE.Euler(-Math.PI * 0.5, 0, Math.PI * 0.5 * i, 'XYZ');
      segment.matrix.makeRotationFromEuler(euler);
      segment.matrixAutoUpdate = false;
      segment.material.color.setHex(materials[i].color);
      segment.material.map = materials[i].map;
      segment.material.bumpMap = materials[i].map;
      segment.material.bumpScale = materials[i].bumpScale;
      segment.material.needsUpdate = true;
      segment.receiveShadow = this.opts.receiveShadow;
      segment.castShadow = this.opts.castShadow;

      mesh.add(segment);
    }

    return mesh;
  }

  bowlBounds() {
    const material = new CANNON.Material({
      friction: 1.0,
      restitution: 0.0,
    });
    const body = new CANNON.Body({
      mass: 0,
      material: material,
      type: 2,
    });

    const props = [
      { radius: 47, angle: -Math.PI * 0.15, y: -10 },
      { radius: 33, angle: Math.PI * 0.15, y: -10 },
      { radius: 40, angle: Math.PI * 0.5, y: -11 },
    ];

    const sides = 64;
    const theta = Math.PI * 2 / sides;

    for (let i = 0; i < props.length; i++) {
      const dim = new CANNON.Vec3(1, 10, theta * props[i].radius * 0.5);

      for (let j = 0; j < sides; j++) {
        const side = new CANNON.Box(dim);
        const radius = props[i].radius;
        let angle = theta * j;
        const p = {
          x: radius * Math.cos(angle),
          y: props[i].y,
          z: radius * Math.sin(angle),
        };
        const q = new CANNON.Quaternion();
        q.setFromEuler(0, -angle, props[i].angle, 'XYZ');
        body.addShape(side, p, q);
      }
    }

    return body;
  }
}

Bowl.defaultOpts = {
  path: getPath(),
  shape: getShape(),
  steps: 40,
  curveSegments: 16,
  receiveShadow: true,
  castShadow: false,
};

// =====================================
function loadAssets() {
  const src = {
    wood: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/46992/wood.jpg',
    wall: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/46992/concrete.jpg',
  };

  const assets = {
    wood: null,
    wall: null,
  };

  const loadManager = new THREE.LoadingManager();
  const texLoader = new THREE.TextureLoader(loadManager);
  texLoader.setCrossOrigin('anonymous');
  texLoader.load(src.wood, function(texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 1);
    assets.wood = texture;
  });
  texLoader.load(src.wall, function(texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 1);
    assets.wall = texture;
  });

  loadManager.onLoad = function() {
    const app = new App({ assets });
  };
}

loadAssets();
