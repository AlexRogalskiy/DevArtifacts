// using class World from
// https://codepen.io/Hornebom/pen/b82ff2cdc295137d93a7b76fe3e7d5ed

// using class Ring from
// https://codepen.io/Hornebom/pen/91474a0d7273767bd39d596d8c0ea935

console.clear();

const global = {
    ticker: 0,
    tlActive: false,
    tl: null,
    group: null,
    rings: [],
}

const init = () => {
    initTl();
    initLights();
    createComposition(animate);
    render();
}

const world = new World({
    container: document.querySelector(`[data-stage]`),
    camPosition: new THREE.Vector3( 0, 0, 1000 ),
    camFov: 10,
    camNear: 800,
    camFar: 1200,
});

const update = () => {
    global.ticker++;
    world.renderer.render(world.scene, world.camera);
};

const render = () => {
    requestAnimationFrame(render);
    if(global.tlActive) return;
    update();
};

const initTl = () => {
    global.tl = new TimelineMax({
        onStart: () => {
            global.tlActive = true;
        },
        onUpdate: () => {
            update();
        },
        onComplete: () => {
            global.tlActive = false;
        }
    });
}

const initLights = () => {
    const globalLight = new THREE.AmbientLight(0xffffff, 0.2);
    world.scene.add(globalLight);
    
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.2 );
    directionalLight.position.set(0, 100, 100);
    world.scene.add( directionalLight );
}

const createRing = (offset, thickness) => {
    const ring = new Ring({
            innerRadius: 4 + offset,
            outerRadius: 6 + offset,
            amount: thickness,
            fineness: 100,
            color: 0xffffff,
            roughness: 0.9,
            metalness: 0.6,
            emissive: 0x000000,
        });
    
    return ring;
}

const createComposition = (callback) => {
    
    global.group = new THREE.Group();
    
    const thickness = 2;
    const rings = 7;
    const offset = 6;
    let count = 0;
    let scale = 50;
    const scaleV = scale/rings;
    
    for( let i = 0; i < rings; i++ ) {
        count+=3;
        scale-=scaleV; 
        
        const ring = createRing(offset * i, thickness);
        ring.scale.set(1, 1, scale + thickness);
        global.rings.push(ring);
        global.group.add(ring);
    } 
    
    global.group.rotation.set(-Math.PI*0.35, Math.PI*0.25, 0);
    world.scene.add(global.group);
    
    animate();
}

const animate = () => {
    const time = 0.6;
    const stagger = 0.01;
    
    const tl = new TimelineMax({ repeat: -1, });
    
    tl.to(global.group.rotation, time*2, {
        y: -Math.PI*0.25,
        ease: Elastic.easeInOut.config(1, 0.7),
    })
    .to(global.group.rotation, time*2, {
        y: Math.PI*0.25,
        ease: Elastic.easeInOut.config(1, 0.7),
    })
    global.tl.add(tl, 0);
    
    for( let i = 0; i < global.rings.length; i++) {
        global.tl.add(
            TweenMax.to(global.rings[i].rotation, time, {
                y: Math.PI*0.05,
                yoyo: true,
                repeat: -1,
                ease: Back.easeIn.config(1.5*i)
            }), 0 + i*stagger
        )
        .add(
            TweenMax.to(global.rings[i].rotation, time, {
                y: -Math.PI*0.05,
                yoyo: true,
                repeat: -1,
                ease: Back.easeOut.config(1.5*i)
            }), time + i*stagger
        )
        .add(
            TweenMax.to(global.rings[i].scale, time, {
                z: global.rings[i].scale.z * 0.5,
                yoyo: true,
                repeat: -1,
                ease: Back.easeIn.config(4),
            }), 0 + i*stagger
        )
    }
}


init();