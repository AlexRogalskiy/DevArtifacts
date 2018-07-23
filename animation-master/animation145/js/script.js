console.clear();

// =====================================
class App {
    constructor(opts) {
        this.opts = Object.assign({}, App.defaultOpts, opts);
        this.world = new World();
        this.init();
    }

    init() {
        this.threeEnvironment();
        window.requestAnimationFrame(this.animate.bind(this));
    }

    threeEnvironment() {
        const light = new Light();
        this.world.sceneAdd(light.ambient);
        this.world.sceneAdd(light.sun);
        const lights = lightBalls(this.world, light.lights);
        
        const composition = new Composition({
            sideLength: 10,
            amount: 15, 
            radius: 6, 
            thickness: 2,
            offset: 0.3,
        });
        this.world.sceneAdd(composition.tubes);
    }

    animate() {
        this.world.renderer.render(this.world.scene, this.world.camera);
        window.requestAnimationFrame(this.animate.bind(this));
    }
}

App.defaultOpts = {
    debug: false,
};

function lightBalls(world, meshes) {
    const radius = 12.4;
    const mainTl = new TimelineMax();
    
    meshes.forEach(function (group) {
        world.sceneAdd(group);
        createAnimation(group);
    });
    
    function createAnimation(group) {
        const tl = new TimelineMax({
            yoyo: true,
        });
        
        tl.set(group.position, {
            x: THREE.Math.randInt(-2, 2) * radius + (radius * 0.5),
            z: THREE.Math.randInt(-2, 2) * radius + (radius * 0.5),
        })
        .to(group.position, 2, {
            y: 18,
            ease: Linear.easeNone,
        })
        .to(group.children[0], 1.2, {
            intensity: 4.0,
            distance: 18,
            ease: Linear.easeNone,
        }, '-=1.2');
        
        tl.paused(true);
        
        mainTl.to(tl, 1.2, {
            progress: 1,
            ease: SlowMo.ease.config(0.0, 0.1, true),
            onComplete: createAnimation,
            onCompleteParams: [group],
            delay: THREE.Math.randFloat(0, 0.8),
        }, mainTl.time());
    }
}


// =====================================
class Light {
    
    constructor() {
        this.lights = [];
        this.ambient = null;
        this.sun = null;
        this.createLights();
        this.createAmbient();
        this.createSun();
    }
    
    createLights() {
        for(let i = 0; i < 3; i++) {
            const group = new THREE.Group();

            const light = new THREE.PointLight(0xff0000);
            light.intensity = 4.0; 
            light.distance = 6;
            light.decay = 1.0;
            group.add(light);

            const geometry = new THREE.SphereBufferGeometry(2, 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
            })
            const mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);
            group.position.set(0, -5, 0);

            this.lights.push(group);
        }    
    }
    
    createAmbient() {
        this.ambient = new THREE.AmbientLight(0xffffff, 0.03);
    }
    
    createSun() {
        this.sun = new THREE.SpotLight(0xffffff); // 0.1
        this.sun.intensity = 0.4; 
        this.sun.distance = 100;
        this.sun.angle = Math.PI;
        this.sun.penumbra = 2.0;
        this.sun.decay = 1.0;
        this.sun.position.set(0, 50, 0);
    }
}



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
    camPosition: new THREE.Vector3(150, 200, 400),
    camFov: 6,
    camNear: 0.1,
    camFar: 800,
};


class Composition {
    constructor(opts) {
        this.opts = Object.assign({}, Composition.defaultOpts, opts);
        this.tube = Tube({ 
            amount: this.opts.amount, 
            radius: this.opts.radius, 
            thickness: this.opts.thickness 
        });
        this.tubes = this.createTubes();
    }
    
    createRow() {
        const radius = this.opts.radius + this.opts.offset;
        const geometry = new THREE.Geometry();
        
        for(let i = 0; i < this.opts.sideLength; i++) {
            const t = this.tube.clone();
            t.translate(i*radius*2, 0, 0);
            geometry.merge(t);
        }
        
        return geometry;
    }
    
    createTubes() {
        const row = this.createRow();
        const radius = this.opts.radius + this.opts.offset;
        const geometry = new THREE.Geometry();
        
        for(let i = 0; i < this.opts.sideLength; i++) {
            const r = row.clone();
            r.translate(0, 0, i*radius*2);
            geometry.merge(r);
        }
        
        geometry.center();

        const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
        
        const materials = [
        // front
            new THREE.MeshStandardMaterial({ 
                color: 0x333333,
                roughness: 1.0,
                metalness: 0.0,
                emissive: 0x000000,
                flatShading: true, // true
                side: THREE.DoubleSide,
            }),
            // side
            new THREE.MeshStandardMaterial({
                color: 0x333333,
                roughness: 0.6,
                metalness: 0.0,
                emissive: 0x000000,
                flatShading: true, // false
                side: THREE.DoubleSide,
            }) 
        ];

        const mesh = new THREE.Mesh(bufferGeometry, materials)
        // mesh.rotation.set(0, -Math.PI*0.15, 0);
        
        return mesh;
    }
}

Composition.defaultOpts = {
    sideLength: 10,
    amount: 15, 
    radius: 6, 
    thickness: 2,
    offset: 0.3,
};

// ===========================
function createShape({ innerRadius = 4, outerRadius = 6, fineness = 30 }) {
    
    const outer = getPath(outerRadius, fineness, false);
    const baseShape = new THREE.Shape(outer);
    
    const inner = getPath(innerRadius, fineness, true);
    const baseHole = new THREE.Path(inner);
    
    baseShape.holes.push(baseHole);

    return baseShape;
};

const getPath = (radius, fineness, reverse) => {
    const c = radius * 0.55191502449;
    const path = new THREE.CurvePath();

    path.curves = [
        new THREE.CubicBezierCurve(
            new THREE.Vector2(0, radius),
            new THREE.Vector2(c, radius),
            new THREE.Vector2(radius, c),
            new THREE.Vector2(radius, 0)
        ),
        new THREE.CubicBezierCurve(
            new THREE.Vector2(radius, 0),
            new THREE.Vector2(radius, -c),
            new THREE.Vector2(c, -radius),
            new THREE.Vector2(0, -radius)
        ),
        new THREE.CubicBezierCurve(
            new THREE.Vector2(0, -radius),
            new THREE.Vector2(-c, -radius),
            new THREE.Vector2(-radius, -c),
            new THREE.Vector2(-radius, 0)
        ),
        new THREE.CubicBezierCurve(
            new THREE.Vector2(-radius, 0),
            new THREE.Vector2(-radius, c),
            new THREE.Vector2(-c, radius),
            new THREE.Vector2(0, radius)
        ),
    ];

    const points = path.getPoints(fineness);
    if(reverse) points.reverse();
    return points;
};

function Tube({ amount = 4, radius = 6, thickness = 2 }) {
    
    const shape = createShape({ innerRadius: radius - thickness, outerRadius: radius, fineness: 14 });
    const props = {
        amount: amount,
        bevelEnabled: true,
        bevelThickness: 0.3,
        bevelSize: 0.2,
        bevelSegments: 1
    }

    const geometry = new THREE.ExtrudeGeometry( 
        shape,
        props
    );

    geometry.center();
    geometry.computeVertexNormals();

    for ( var i = 0; i < geometry.faces.length; i ++ ) {
        var face = geometry.faces[ i ];
        if (face.materialIndex == 1 ) {
            for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
                face.vertexNormals[ j ].z = 0;
                face.vertexNormals[ j ].normalize();
            }
        }
    }
    geometry.rotateX(Math.PI * 0.5);
    geometry.rotateZ(Math.PI);

    return geometry;
};


// ===========================
const app = new App();