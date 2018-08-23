window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
  
class Canvas

	constructor: ->
    
    @days = {}
    
    @duration = 1
    
    # Init Renderer
    @renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
    @renderer.setSize window.innerWidth, window.innerHeight
    
    document.body.appendChild @renderer.domElement
    
    # Init Scene
    @scene = new THREE.Scene()
    
    # Add Camera
    @addCamera()
    
    # Add Light
    @addLight()
    
    # Create first label
    @createFirstLabel()
    
    # Create days
    for i in [25..1]
      label = if i < 10 then "0#{i}" else i
      @createDay label
      
  addCamera: ->

    @camera = new THREE.PerspectiveCamera 50, window.innerWidth / window.innerHeight, 1, 1000

    # Set Position
    @camera.position.set 0, 0, 500
    @scene.add @camera
    
    # Add controls for debug 
    controls = new THREE.OrbitControls @camera
    controls.addEventListener 'change', =>
      @renderer.render @scene, @camera
  
  addLight: ->
    
    ambientLight = new THREE.AmbientLight 0xCACACA
    pointLight = new THREE.PointLight 0xFFFFFF, 0.3
    
    # Set position
    ambientLight.position.set 0, 0, 500
    pointLight.position.set 0, 200, 500
    
    # Debug light
    #sphereSize = 5
    #pointLightHelper = new THREE.PointLightHelper ambientLight, sphereSize
    #@scene.add pointLightHelper
    #pointLightHelper = new THREE.PointLightHelper pointLight, sphereSize
    #@scene.add pointLightHelper
    # Debug light
    
    # Add light to the scene
    @scene.add ambientLight
    @scene.add pointLight

  createFirstLabel: ->
    
    # All face
    materials = [
      new THREE.MeshLambertMaterial({
        map: @makeCanvasTexture()
      }),
      new THREE.MeshLambertMaterial({
        map: @makeCanvasTexture()
      }),
      new THREE.MeshLambertMaterial({
        map: @makeCanvasTexture()
      }),
      new THREE.MeshLambertMaterial({
        map: @makeCanvasTexture()
      }),
      new THREE.MeshLambertMaterial({
        map: @makeCanvasTexture()
      }),
      new THREE.MeshLambertMaterial({
        map: @makeCanvasTexture 'December'
      })
    ]

    # Create day shape
    geometry = new THREE.CubeGeometry 200, 100, 1

    # Change transform origin
    geometry.applyMatrix new THREE.Matrix4().makeTranslation(0, -50, 0)
    
    # Set faces as material
    material = new THREE.MeshFaceMaterial materials 
    mesh = new THREE.Mesh geometry, material
    mesh.rotation.x = -Math.PI
    @scene.add mesh

    # Render Scene
    @renderer.render @scene, @camera
    
  createDay: (label) =>
    
    # All faces
    materials = [
      new THREE.MeshLambertMaterial({
        map: @makeCanvasTexture()
      }),
      new THREE.MeshLambertMaterial({
        map: @makeCanvasTexture()
      }),
      new THREE.MeshLambertMaterial({
        map: @makeCanvasTexture()
      }),
      new THREE.MeshLambertMaterial({
        map: @makeCanvasTexture()
      }),
      new THREE.MeshLambertMaterial({
        map: @makeCanvasTexture label
      }),
      new THREE.MeshLambertMaterial({
        map: @makeCanvasTexture  'December'
      })
    ]

    # Create day shape
    geometry = new THREE.CubeGeometry 200, 100, 1

    # Change transform origin
    geometry.applyMatrix new THREE.Matrix4().makeTranslation(0, -50, 0)
    
    # Set faces as material
    material = new THREE.MeshFaceMaterial materials 
    
    @days[label] = new THREE.Mesh geometry, material
    @scene.add @days[label]

    # Render Scene
    @renderer.render @scene, @camera
    
  goToTop: (key) =>
    
    TweenMax.to @days[key].rotation, @duration, { x: -Math.PI, ease: Quart.easeOut, onUpdate: =>
      @renderer.render @scene, @camera
    }
  
  goToBottom: (key) =>
    
    TweenMax.to @days[key].rotation, @duration, { x: 0, ease: Quart.easeOut, onUpdate: =>
      @renderer.render @scene, @camera
    }

  makeCanvasTexture: (text) ->

    canvas  = document.createElement 'canvas'
    context = canvas.getContext '2d'
    
    # Set size
    canvas.width = 400
    canvas.height = 200
    
    # Background
    context.fillStyle = "#FFF"
    context.fillRect 0, 0, 400, 200
    
    # Translate context to center of canvas
    context.translate canvas.width / 2, canvas.height / 2

    # Text
    if text  
      context.save()
        
      if text == 'December'
        context.fillStyle = "red"
        context.textAlign = 'center'
        context.font = "65px Helvetica"
        context.scale -1, -1
        context.fillText text, 0, 25
      else
        context.fillStyle = "red"
        context.textAlign = 'center'
        context.font = "140px Helvetica"
        context.fillText text, 0, 20
    
      context.restore()
    
    # Canvas contents will be used for a texture
    texture = new THREE.Texture canvas
    texture.minFilter = THREE.LinearFilter
    texture.needsUpdate = true

    return texture
    
canvas = new Canvas

top = document.getElementById 'top'
bottom = document.getElementById 'bottom'

i = 1
top.addEventListener 'click', ->
  i = if i > 24 then i = 24 else i 
  i = if i < 1 then i = 1 else i 
  label = if i < 10 then "0#{i}" else i
  canvas.goToTop label
  i++
  
bottom.addEventListener 'click', ->
  i = if i < 1 then i = 1 else i
  i = if i > 24 then i = 24 else i 
  label = if i < 10 then "0#{i}" else i
  canvas.goToBottom label
  i--