var camera, scene, renderer;
			var geometry, material, mesh;

			function init() {

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10 );
				camera.position.z = 3;

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xffffff );

				geometry = new THREE.SphereGeometry( 1 );
				material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );

				mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );				
				
			}

			function animate( time ) {

				mesh.rotation.x = time * 0.0005;
				mesh.rotation.y = time * 0.001;

				renderer.render( scene, camera );
				requestAnimationFrame( animate );

			}

			init();
			requestAnimationFrame( animate );