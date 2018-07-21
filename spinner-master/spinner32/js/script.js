debug = 1;

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
            { pointLight: true, color: 0xd2e4ee, intensity: 20, position: { x: 0, y: 0, z: 0 } },
            { pointLight: false, color: 0x278aef, intensity: 4, position: { x: -1, y: 1, z: 0 } },
            { pointLight: false, color: 0xa3bbff, intensity: 5, position: { x: -1, y: -0.7, z: 0 } },
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
        self.renderer.setSize(window.innerWidth * self.options.accuracy, window.innerHeight * self.options.accuracy);
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


(function ($) {

    $.fn.fitText = function (kompressor, options) {

        // Setup options
        var compressor = kompressor || 1,
            settings = $.extend({
                'minFontSize': Number.NEGATIVE_INFINITY,
                'maxFontSize': Number.POSITIVE_INFINITY,
            }, options);

        return this.each(function () {

            // Store the object
            var $this = $(this);

            // Resizer() resizes items based on the object width divided by the compressor * 10
            var resizer = function () {
                $this.css('font-size', Math.max(Math.min($this.width() / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
            };

            // Call once to set.
            resizer();

            // Call on resize. Opera debounces their resize by default.
            $(window).on('resize.fittext orientationchange.fittext', resizer);

        });

    };

})(jQuery);

(function ($) {

    $.yslider = function (el, list, options) {
        var self = this,
            $el = $(el);

        self.options = $.extend({}, $.yslider.defaults, options);

        self.list = list;
        self.ul;
        self.items = [];
        self.int = 0;

        // Slide
        function slide() {
            self.ul.css({
                transition: '',
                top: '-100%'
            });

            setTimeout(function () {

                self.ul.css({
                    transition: 'none',
                    top: ''
                });

                var first = self.ul.children().first();
                first.remove();
                self.ul.append(first);

            }, self.options.speed + 10);
        }

        // Init
        function init() {
            $el.addClass('y-slider');
            $el.empty();

            var div = $('<div>'),
                maxLen = 0;

            self.ul = $('<ul>');

            for (var i = 0; i < list.length; i++) {
                var word = list[i],
                    item = $('<li>').html(word);

                self.items.push(item);
                self.ul.append(item);

                maxLen = Math.max(maxLen, word.length);
            }

            $el.text(Array(maxLen + 1).join('M'))
               .append(div.append(self.ul));

            setTimeout(function () {
                self.int = setInterval(slide, self.options.speed + self.options.pause + 10);
            }, self.options.delay);
        };
        init();
    };

    $.yslider.defaults = {
        speed: 100,
        pause: 300,
        delay: 0,
    };

    $.fn.yslider = function (list, options) {
        return this.each(function () {
            new $.yslider(this, list, options);
        });
    };

})(jQuery);

(function () {
    $('#main').fitText(8);
   
    Modernizr.addTest('preserve3d', function () {

        var prop = Modernizr.prefixed('transformStyle');
        var val = 'preserve-3d';
        var computedStyle;
        if (!prop) return false;

        prop = prop.replace(/([A-Z])/g, function (str, m1) { return '-' + m1.toLowerCase(); }).replace(/^ms-/, '-ms-');

        Modernizr.testStyles('#modernizr{' + prop + ':' + val + ';}', function (el, rule) {
            computedStyle = window.getComputedStyle ? getComputedStyle(el, null).getPropertyValue(prop) : '';
        });

        return (computedStyle === val);
    });

    // Oper test
    browsers = {
        opera: [false, "opera"],
        ie: [false, "msie"],
        chrome: [false, "chrome"],
    };

    for (var b in browsers) {

        if (browsers[b][0] = navigator.userAgent.toLowerCase().indexOf(browsers[b][1]) >= 0)
            $('html').addClass(browsers[b][1]);
    }
    
    var resize_seq = false;
    $(window).resize(function (e) {
        if (!resize_seq) {
            resize_seq = true;
            setTimeout(function () { $(window).resize(); resize_seq = false; }, 2000);
        }
    });
})();

//-----------------------------------------

(function () {

  // Cross origin texture error trick
var image = document.getElementById('img'),
    texture = new THREE.Texture( undefined, {} );
texture.image = image;
texture.needsUpdate = true;

var sky = new MagicBG($('#cvs1').get(0), texture, { accuracy: 0.3 }).toggle(true);
  
    var booting = true;
  
    function InitIntro() {
        var $main = $('#main');
        var $world = $main.find('.world');

        $main.find('.viewport').mousemove(function (e) {
            var Vertical = 4,
                Horizontal = 2,
                Yangle = -Vertical + (e.clientY / window.innerHeight) * 2 * Vertical,
                Xangle = -Horizontal + (e.clientX / window.innerWidth) * 2 * Horizontal;

            $world.css('transform', 'rotateX( ' + -Yangle + 'deg) rotateY( ' + Xangle + 'deg)');
        });

        $main.find('.loader').toggleClass('hide');

        setTimeout(function () {
            if (!debug) $('html, body').scrollTop(0);
            $main.toggleClass('play');
            $main.find('#skills-slider').yslider(['.NET', 'C', 'C#', 'C++', 'JS', 'PHP', 'WPF'], { speed: 150, pause: 500, delay: 2600 });
            $main.find('#like-slider').yslider(['Programming', 'UI Design', 'Skiing', 'Football', 'NLP', 'Squash'], { speed: 150, pause: 500, delay: 2600 });

            booting = false;

            $(window).resize();
          $("#main" ).unbind( "click", InitIntro );
        }, 300);
    }

  $('#main').click(InitIntro);
})();
