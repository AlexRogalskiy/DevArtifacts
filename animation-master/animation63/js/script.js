
function MagicBG(cvs, textureUrl, options) {

    var self = this,
        paused = true,
        rafid;

    self.isOK = false;
    self.camera = null;
    self.scene = null;
    self.renderer = null;
    self.texture = null;
    self.lights = [];

    self.defaults = {
        accuracy: 0.4,
        speed: 0.0015,

        camera: {
            perspective: 30,
            position: { x: 0, y: 0.5, z: 10 },
            lookAt: { x: 0, y: 0, z: 0 }
        },
        fog: {
            enabled: true,
            color: 0xFFFFFF,
            density: .18,
        },
        tube: {
            radius1: 1,
            radius2: 2.5,
            height: 25,
            segments: 40,
        },
        lights: [
            { pointLight: true, color: 0xd2e4ee, intensity: 13, position: { x: 0, y: 0, z: 0 } },
            { pointLight: false, color: 0xff0000, intensity: 5, position: { x: -1, y: 1, z: 0 } },
            { pointLight: false, color: 0x7614DE, intensity: 6, position: { x: -1, y: 1, z: 0 } },
            { pointLight: false, color: 0x1DB4DE, intensity: 6, position: { x: .7, y: .2, z: 0 } },
            { pointLight: false, color: 0x76C213, intensity: 5, position: { x: -.5, y: -.5, z: 0 } }
        ],
        renderCallback: function (sky) {
            sky.camera.rotation.z = Math.PI - Math.sin(Date.now() / 1000) / 5;
        }
    };

    self.isPaused = function () {
        return paused;
    };

    function extend(destination, source) {
        for (var property in source) {
            if (typeof source[property] === 'object')
                destination[property] = extend(destination[property], source[property]);
            else
                destination[property] = source[property];
        }
        return destination;
    }

    function addEvent(elem, type, eventHandle) {
        if (elem == null || elem == undefined) return;
        if (elem.addEventListener) {
            elem.addEventListener(type, eventHandle, false);
        } else if (elem.attachEvent) {
            elem.attachEvent("on" + type, eventHandle);
        } else {
            elem["on" + type] = eventHandle;
        }
    };

    function OnResizeCVS() {
        self.camera.aspect = window.innerWidth / window.innerHeight;
        self.camera.updateProjectionMatrix();
        //self.renderer.setSize(window.innerWidth * self.options.accuracy, window.innerHeight * self.options.accuracy);
    }

    function init() {
        self.options = extend(self.defaults, options);

        if (!!!window.WebGLRenderingContext) return false;

        try {
            self.renderer = new THREE.WebGLRenderer({ canvas: cvs });

            // SCENE
            self.scene = new THREE.Scene();
            if (self.options.fog.enabled)
                self.scene.fog = new THREE.FogExp2(self.options.fog.color, self.options.fog.density);

            // CAMERA
            self.camera = new THREE.PerspectiveCamera(self.options.camera.perspective, window.innerWidth / window.innerHeight, .1, 1000);
            self.camera.position.set(self.options.camera.position.x, self.options.camera.position.y, self.options.camera.position.z);
            self.camera.lookAt(new THREE.Vector3(self.options.camera.lookAt.x, self.options.camera.lookAt.y, self.options.camera.lookAt.z));
            self.scene.add(self.camera);

            // ON WINDOW RESIZE
            addEvent(window, 'resize', OnResizeCVS);
            OnResizeCVS();

            // LIGHTS
            for (var i = 0; i < self.options.lights.length; i++) {
                var light = self.options.lights[i];
                var l = light.pointLight == true ? new THREE.PointLight(light.color, light.intensity) : new THREE.DirectionalLight(light.color, light.intensity);
                l.position.set(light.position.x, light.position.y, light.position.z);
                self.scene.add(l);
                self.lights.push(l);
            }

            // TUBE
            if(typeof textureUrl == 'string')
              self.texture = THREE.ImageUtils.loadTexture();
            else
              self.texture = textureUrl;
          
            self.texture.wrapT = THREE.RepeatWrapping;
            var material = new THREE.MeshLambertMaterial({
                map: self.texture,
                side: THREE.DoubleSide
            }),
            geometry = new THREE.CylinderGeometry(
                self.options.tube.radius2,
                self.options.tube.radius1,
                self.options.tube.height,
                self.options.tube.segments, 1, true),

            mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = Math.PI / 2;
            self.scene.add(mesh);
        } catch (e) {
            return false;
        }
        return true;
    }
    self.isOK = init();

    function animate() {
        rafid = requestAnimationFrame(animate);
        self.texture.offset.y -= self.options.speed;

        self.options.renderCallback(self);
        self.renderer.render(self.scene, self.camera);
    }

    self.toggle = function (run) {
        if (!self.isOK) return false;

        if (run === undefined)
            self.toggle(!paused);

        else if (!!run && paused) {
            paused = false;
            animate();
        }
        else if (!!!run) {
            paused = true;
            cancelAnimationFrame(rafid);
        }
        return true;
    }
}

// Cross origin texture error trick
var image = document.getElementById('img'),
    cvs = document.getElementById('cvs'),
    texture = new THREE.Texture( undefined, {} );
texture.image = image;
texture.needsUpdate = true;

new MagicBG(cvs, texture, { accuracy: 0.3 }).toggle(true);
