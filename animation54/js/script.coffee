class Stage
	constructor: ->
		window.requestAnimationFrame = 
			window.requestAnimationFrame or
			window.webkitRequestAnimationFrame or
			window.mozRequestAnimationFrame

		@init_scene()
		@make_meshes()

	init_scene: ->
		@scene = new THREE.Scene

		# Renderer
		width = window.innerWidth * 0.9;
		height = window.innerHeight * 0.9;
		@renderer = new THREE.WebGLRenderer({
			canvas: document.querySelector('.threed')
		})
		@renderer.setSize(width, height)

		# Camera
		@camera = new THREE.PerspectiveCamera(
			45,					      # fov
			width / height,		# aspect
			1,					      # near
			1000				      # far
		)
		@scene.add(@camera)

	make_meshes: ->
		size = 8
		num = 3

		geo = new THREE.CubeGeometry(size, size, size)
		material = new THREE.MeshNormalMaterial()

		for i in [-num ... num]
			for j in [-num ... num]
				for k in [-num ... num]	
					mesh = new THREE.Mesh(geo, material)
					mesh.position.set(
						i * size * 3,
						j * size * 3,
						k * size * 3
					)
					
					@scene.add(mesh)

	draw: =>
		angle = Date.now() * 0.0005
		radius = 300

		@camera.position.set(
			radius * Math.cos(angle),
			radius * Math.sin(angle),
			radius * Math.sin(angle)
		)
		@camera.lookAt(new THREE.Vector3())

		@renderer.render(@scene, @camera)
		requestAnimationFrame(@draw)

stage = new Stage
stage.draw()

document.querySelector('.warn').style.display = 'none'
