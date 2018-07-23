class Ring {
    static defaultOpts = {
        innerRadius: 4,
        outerRadius: 6,
        amount: 4,
        fineness: 100,
        color: 0xff0000,
        emissive: 0x000000,
        roughness: 0.7,
        metalness: 0.0,
    };

    shape = null;
    mesh = null;

    constructor(opts) {
        this.opts = { ...Ring.defaultOpts, ...opts };
        this.init();
        return this.mesh;
    };

    init() {
        this.createShape();
        this.createRing();
    };

    createShape() {

        const baseShape = new THREE.Shape();
        baseShape.moveTo(0, 0);
        baseShape.absarc(0, 0, this.opts.outerRadius, 0, Math.PI * 2, false);

        const baseHole = new THREE.Path();
        baseHole.moveTo(0, 0);
        baseHole.absarc(0, 0, this.opts.innerRadius, 0, Math.PI * 2, true);
        baseHole.autoClose = true;
        baseShape.holes.push(baseHole);

        // increase fineness
        const points = baseShape.extractAllPoints(this.opts.fineness);

        // assemble final shape
        const shape = new THREE.Shape(points.shape);
        const hole = new THREE.Path(points.holes[0]);
        shape.holes.push(hole);

        this.shape = shape;
    };

    createRing() {

        var materials = [
            // front
            new THREE.MeshStandardMaterial({ 
                color: this.opts.color,
                roughness: this.opts.roughness,
                metalness: this.opts.metalness,
                emissive: this.opts.emissive,
                shading: THREE.FlatShading,
            }),
            // side
            new THREE.MeshStandardMaterial({
                color: this.opts.color,
                roughness: this.opts.roughness,
                metalness: this.opts.metalness,
                emissive: this.opts.emissive,
                shading: THREE.SmoothShading,
            }) 
        ];


        const props = {
            amount: this.opts.amount,  
            bevelEnabled: false,
        }

        const geometry = new THREE.ExtrudeGeometry( 
            this.shape,
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


        const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);

        this.mesh = new THREE.Mesh(geometry, materials);
    };
}




