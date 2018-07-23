class World {
    static defaultOpts = {
        container: document.body,
        camPosition: new THREE.Vector3( 0, 0, 0 ),
        camFov: 10,
        camNear: 0.1,
        camFar: 800,
    };

    scene = null;
    camera = null;
    renderer = null;

    constructor(opts) {
        this.opts = { ...World.defaultOpts, ...opts };
        this.init();
    }

    init() {
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.addRenderer();
        window.addEventListener("resize", this.resizeHandler.bind(this));
    }

    initScene() {
        this.scene = new THREE.Scene();
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            this.opts.camFov,
            window.innerWidth / window.innerHeight,
            this.opts.camNear,
            this.opts.camFar,
        );
        this.camera.position.set(this.opts.camPosition.x, this.opts.camPosition.y, this.opts.camPosition.z);
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
    }

    addRenderer() {
        this.opts.container.appendChild(this.renderer.domElement);
    }

    resizeHandler() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}