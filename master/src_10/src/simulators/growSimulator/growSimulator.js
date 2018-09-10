const settings = require('../../core/settings')
const browser = require('../../core/browser')
const fboHelper = require('../../../common/helpers/fboHelper')
const THREE = require('three')
const glslify = require('glslify')
const mixIn = require('mout/object/mixIn')

exports.init = init
exports.update = update

exports.defaultInfoTexture = null

exports.prevPositionRenderTarget = null
exports.currPositionRenderTarget = null
exports.prevVelocityRenderTarget = null
exports.currVelocityRenderTarget = null
exports.rotationRenderTarget = null

let BLOCK_COUNT = exports.BLOCK_COUNT = settings.blockAmount // settings.quality > 1 ? 8192 : 2048
let BLOCK_TEXTURE_COLUMN = exports.BLOCK_TEXTURE_COLUMN = 512
let BLOCK_TEXTURE_ROW = exports.BLOCK_TEXTURE_ROW = Math.ceil(BLOCK_COUNT / BLOCK_TEXTURE_COLUMN)
let TEXTURE_WIDTH = exports.TEXTURE_WIDTH = BLOCK_TEXTURE_COLUMN
let TEXTURE_HEIGHT = exports.TEXTURE_HEIGHT = BLOCK_TEXTURE_ROW

let COLLUSION_VOXEL_SIZE = exports.COLLUSION_VOXEL_SIZE = browser.isMobile ? 32 : 64
let COLLUSION_SLICE_SEGMENT_X = exports.COLLUSION_SLICE_SEGMENT_X = 8
let COLLUSION_SLICE_SEGMENT_Y = exports.COLLUSION_SLICE_SEGMENT_Y = browser.isMobile ? 4 : 8
let COLLUSION_TEXTURE_WIDTH = exports.COLLUSION_TEXTURE_WIDTH = COLLUSION_VOXEL_SIZE * COLLUSION_SLICE_SEGMENT_X
let COLLUSION_TEXTURE_HEIGHT = exports.COLLUSION_TEXTURE_HEIGHT = COLLUSION_VOXEL_SIZE * COLLUSION_SLICE_SEGMENT_Y
let COLLUSION_UNIFORMS = exports.COLLUSION_UNIFORMS = null

let velocityMaterial = exports.velocityMaterial = null
let positionMaterial = exports.positionMaterial = null
let rotationMaterial = exports.rotationMaterial = null

let _collusionPoints
let _collusionPointGeometry
let collusionWriteMaterial = exports.collusionWriteMaterial = null
let collusionVelocityMaterial = exports.collusionVelocityMaterial = null
let collusionPositionMaterial = exports.collusionPositionMaterial = null

let _tmpVelocityRenderTarget
let _tmpPositionRenderTarget

function init (sdfModel) {
  _initDefaultInfo(sdfModel)
  _initCollusionUniforms(sdfModel)
  // head x, y, z, pscale,
  // collusion

  exports.prevPositionRenderTarget = fboHelper.createRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, THREE.RGBAFormat, fboHelper.renderTargetFloatType, THREE.NearestFilter, THREE.NearestFilter)
  exports.currPositionRenderTarget = fboHelper.createRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, THREE.RGBAFormat, fboHelper.renderTargetFloatType, THREE.NearestFilter, THREE.NearestFilter)

  exports.prevVelocityRenderTarget = fboHelper.createRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, THREE.RGBAFormat, fboHelper.renderTargetFloatType, THREE.NearestFilter, THREE.NearestFilter)
  exports.currVelocityRenderTarget = fboHelper.createRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, THREE.RGBAFormat, fboHelper.renderTargetFloatType, THREE.NearestFilter, THREE.NearestFilter)

  _tmpVelocityRenderTarget = fboHelper.createRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, THREE.RGBAFormat, fboHelper.renderTargetFloatType, THREE.NearestFilter, THREE.NearestFilter)
  _tmpPositionRenderTarget = fboHelper.createRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, THREE.RGBAFormat, fboHelper.renderTargetFloatType, THREE.NearestFilter, THREE.NearestFilter)

  exports.collusionRenderTarget = fboHelper.createRenderTarget(COLLUSION_TEXTURE_WIDTH, COLLUSION_TEXTURE_HEIGHT, THREE.RGBAFormat, fboHelper.renderTargetFloatType, THREE.NearestFilter, THREE.NearestFilter)
  exports.collusionRenderTarget.depthBuffer = true
  exports.collusionRenderTarget.stencilBuffer = true

  // tangent and normal
  exports.rotationRenderTarget = fboHelper.createRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, THREE.RGBAFormat, fboHelper.renderTargetFloatType, THREE.NearestFilter, THREE.NearestFilter)

  let state = fboHelper.getColorState()
  let copyMaterial = fboHelper.copyMaterial
  let copyMaterialTransparency = copyMaterial.transparent
  copyMaterial.transparent = true
  fboHelper.renderer.autoClearColor = false
  fboHelper.copy(exports.defaultInfoTexture, exports.prevPositionRenderTarget)
  fboHelper.copy(exports.defaultInfoTexture, exports.currPositionRenderTarget)
  copyMaterial.transparent = copyMaterialTransparency
  fboHelper.setColorState(state)

  velocityMaterial = exports.velocityMaterial = new THREE.RawShaderMaterial({
    uniforms: mixIn({
      u_positionTexture: {value: null},
      u_velocityTexture: {value: null},
      u_noiseFrequence: {value: 2},
      u_noiseTime: {value: 0},
      u_noiseAmplitude: {value: 0.001},
      u_sdfOutBoundForce: {value: 0.1},
      u_sdfInBoundForce: {value: 0.01},
      u_sdfThreshold: {value: 0.05}
      // u_dtRatio: {value: 1},
    }, sdfModel.uniforms),
    vertexShader: fboHelper.vertexShader,
    fragmentShader: fboHelper.precisionPrefix + glslify('./growVelocity.frag'),
    blending: THREE.NoBlending,
    depthTest: false,
    depthWrite: false,
    transparent: true
  })

  positionMaterial = exports.positionMaterial = new THREE.RawShaderMaterial({
    uniforms: {
      u_positionTexture: {value: null},
      u_velocityTexture: {value: null}
      // u_dtRatio: {value: 1},
    },
    vertexShader: fboHelper.vertexShader,
    fragmentShader: fboHelper.precisionPrefix + glslify('./growPosition.frag'),
    blending: THREE.NoBlending,
    depthTest: false,
    depthWrite: false,
    transparent: true
  })

  _initCollusionPointGeometry()
  collusionWriteMaterial = exports.collusionWriteMaterial = new THREE.RawShaderMaterial({
    uniforms: mixIn({
      u_positionTexture: {value: null},
      u_blockCount: {value: BLOCK_COUNT}
    }, COLLUSION_UNIFORMS),
    vertexShader: fboHelper.precisionPrefix + glslify('./growCollusionWrite.vert'),
    fragmentShader: fboHelper.precisionPrefix + glslify('./growCollusionWrite.frag'),
    blending: THREE.NoBlending,
    depthTest: true,
    depthWrite: true,
    transparent: true,
    depthFunc: THREE.LessDepth
  })
  _collusionPoints = new THREE.Points(_collusionPointGeometry, collusionWriteMaterial)

  collusionVelocityMaterial = exports.collusionVelocityMaterial = new THREE.RawShaderMaterial({
    uniforms: mixIn({
      u_positionTexture: {value: null},
      u_velocityTexture: {value: null},
      u_collusionTexture: {value: exports.collusionRenderTarget.texture},
      u_collusionForce: {value: 2},
      u_textureResolution: {value: new THREE.Vector2(TEXTURE_WIDTH, TEXTURE_HEIGHT)}
    }, COLLUSION_UNIFORMS),
    vertexShader: fboHelper.vertexShader,
    fragmentShader: fboHelper.precisionPrefix + glslify('./growCollusionVelocity.frag'),
    blending: THREE.NoBlending,
    depthTest: false,
    depthWrite: false,
    transparent: true
  })

  collusionPositionMaterial = exports.collusionPositionMaterial = new THREE.RawShaderMaterial({
    uniforms: mixIn({
      u_positionTexture: {value: null},
      u_velocityTexture: {value: null},
      u_collusionTexture: {value: exports.collusionRenderTarget.texture},
      u_collusionForce: {value: 0.15},
      u_textureResolution: {value: new THREE.Vector2(TEXTURE_WIDTH, TEXTURE_HEIGHT)}
    }, COLLUSION_UNIFORMS),
    vertexShader: fboHelper.vertexShader,
    fragmentShader: fboHelper.precisionPrefix + glslify('./growCollusionPosition.frag'),
    blending: THREE.NoBlending,
    depthTest: false,
    depthWrite: false,
    transparent: true
  })

  rotationMaterial = exports.rotationMaterial = new THREE.RawShaderMaterial({
    uniforms: mixIn({
      u_positionTexture: {value: null},
      u_velocityTexture: {value: null},
      u_prevPositionTexture: {value: null}
    }, sdfModel.uniforms),
    vertexShader: fboHelper.vertexShader,
    fragmentShader: fboHelper.precisionPrefix + glslify('./growRotation.frag'),
    blending: THREE.NoBlending,
    depthTest: false,
    depthWrite: false,
    transparent: true
  })
}

function _initDefaultInfo (sdfModel) {
  // head x, y, z, pscale, tail x, y, z, collusion
  let refPositions = sdfModel.geometry.attributes.position.array
  // let refNormals = sdfModel.geometry.attributes.normal.array
  let vertexCount = refPositions.length / 3
  let data = new Float32Array(TEXTURE_WIDTH * TEXTURE_HEIGHT * 4)
  for (let i = 0, i4 = 0; i < BLOCK_COUNT; i++) {
    let index = ~~(Math.random() * vertexCount)
    let index3 = index * 3
    data[i4 + 0] = refPositions[index3 + 0] + (Math.random() - 0.5) * 0.001
    data[i4 + 1] = refPositions[index3 + 1] + (Math.random() - 0.5) * 0.001
    data[i4 + 2] = refPositions[index3 + 2] + (Math.random() - 0.5) * 0.001
    data[i4 + 3] = Math.pow(Math.random(), 10) * 0.02 + 0.01
    i4 += 4
  }
  exports.defaultInfoTexture = new THREE.DataTexture(data, TEXTURE_WIDTH, TEXTURE_HEIGHT, THREE.RGBAFormat, THREE.FloatType)
  exports.defaultInfoTexture.magFilter = THREE.NearestFilter
  exports.defaultInfoTexture.minFilter = THREE.NearestFilter
  exports.defaultInfoTexture.needsUpdate = true
}

function _initCollusionPointGeometry () {
  let positions = new Float32Array(BLOCK_COUNT * 3)
  let i3 = 0
  for (let i = 0; i < BLOCK_COUNT; i++) {
    let u = (i % BLOCK_TEXTURE_COLUMN + 0.5) / TEXTURE_WIDTH
    let v = (~~(i / BLOCK_TEXTURE_COLUMN) + 0.5) / TEXTURE_HEIGHT
    positions[i3 + 0] = u
    positions[i3 + 1] = v
    positions[i3 + 2] = i
    i3 += 3
  }
  _collusionPointGeometry = new THREE.BufferGeometry()
  _collusionPointGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
}

function _initCollusionUniforms (sdfModel) {
  COLLUSION_UNIFORMS = exports.COLLUSION_UNIFORMS = {
    u_sdfScale: sdfModel.uniforms.u_sdfScale,
    u_sdfOffset: sdfModel.uniforms.u_sdfOffset,
    u_collusionTextureResolution: {value: new THREE.Vector2(COLLUSION_TEXTURE_WIDTH, COLLUSION_TEXTURE_HEIGHT)},
    u_collusionVoxelSize: {value: COLLUSION_VOXEL_SIZE},
    u_collusionSliceInfo: {value: new THREE.Vector4(
      COLLUSION_SLICE_SEGMENT_X * COLLUSION_SLICE_SEGMENT_Y,
      COLLUSION_SLICE_SEGMENT_X,
      1.0 / COLLUSION_SLICE_SEGMENT_X,
      1.0 / Math.floor((COLLUSION_SLICE_SEGMENT_X * COLLUSION_SLICE_SEGMENT_Y + COLLUSION_SLICE_SEGMENT_X - 1.0) / COLLUSION_SLICE_SEGMENT_X)
    )}
  }
}

function _swapRenderTargets () {
  // swap
  let tmp = exports.prevVelocityRenderTarget
  exports.prevVelocityRenderTarget = exports.currVelocityRenderTarget
  exports.currVelocityRenderTarget = tmp

  tmp = exports.prevPositionRenderTarget
  exports.prevPositionRenderTarget = exports.currPositionRenderTarget
  exports.currPositionRenderTarget = tmp

  velocityMaterial.uniforms.u_velocityTexture.value = exports.prevVelocityRenderTarget.texture
  velocityMaterial.uniforms.u_positionTexture.value = exports.prevPositionRenderTarget.texture

  positionMaterial.uniforms.u_velocityTexture.value = exports.currVelocityRenderTarget.texture
  positionMaterial.uniforms.u_positionTexture.value = exports.prevPositionRenderTarget.texture
}

function update (dt) {
  let state = fboHelper.getColorState()
  fboHelper.renderer.autoClearColor = false

  _swapRenderTargets()

  velocityMaterial.uniforms.u_noiseTime.value += dt * 0.2

  fboHelper.render(velocityMaterial, _tmpVelocityRenderTarget)

  fboHelper.render(positionMaterial, _tmpPositionRenderTarget)

  // write Collusion
  fboHelper.renderer.setClearColor(0, 0)
  fboHelper.renderer.clearTarget(exports.collusionRenderTarget, true, true, true)
  collusionWriteMaterial.uniforms.u_positionTexture.value = _tmpPositionRenderTarget.texture

  let context = fboHelper.renderer.context
  let rendererState = fboHelper.renderer.state
  fboHelper.renderer.autoClearColor = false
  fboHelper.renderer.autoClearStencil = false
  fboHelper.renderer.autoClearDepth = false

  rendererState.buffers.stencil.setTest(true)

  context.colorMask(true, false, false, false)
  collusionWriteMaterial.depthFunc = THREE.LessDepth
  fboHelper.renderObject(_collusionPoints, exports.collusionRenderTarget)

  context.colorMask(false, true, false, false)
  collusionWriteMaterial.depthFunc = THREE.GreaterDepth
  rendererState.buffers.stencil.setFunc(context.GREATER, 1, 1)
  rendererState.buffers.stencil.setOp(context.KEEP, context.KEEP, context.INCR)
  context.clear(context.STENCIL_BUFFER_BIT)
  fboHelper.renderObject(_collusionPoints, exports.collusionRenderTarget)

  context.colorMask(false, false, true, false)
  context.clear(context.STENCIL_BUFFER_BIT)
  fboHelper.renderObject(_collusionPoints, exports.collusionRenderTarget)

  context.colorMask(false, false, false, true)
  context.clear(context.STENCIL_BUFFER_BIT)
  fboHelper.renderObject(_collusionPoints, exports.collusionRenderTarget)

  context.colorMask(true, true, true, true)
  context.disable(context.STENCIL_TEST)

  rendererState.buffers.stencil.setTest(false)

  collusionVelocityMaterial.uniforms.u_velocityTexture.value = _tmpVelocityRenderTarget.texture
  collusionVelocityMaterial.uniforms.u_positionTexture.value = _tmpPositionRenderTarget.texture
  fboHelper.render(collusionVelocityMaterial, exports.currVelocityRenderTarget)

  collusionPositionMaterial.uniforms.u_velocityTexture.value = _tmpVelocityRenderTarget.texture
  collusionPositionMaterial.uniforms.u_positionTexture.value = _tmpPositionRenderTarget.texture
  fboHelper.render(collusionPositionMaterial, exports.currPositionRenderTarget)

  rotationMaterial.uniforms.u_positionTexture.value = exports.currPositionRenderTarget.texture
  rotationMaterial.uniforms.u_prevPositionTexture.value = exports.prevPositionRenderTarget.texture
  rotationMaterial.uniforms.u_velocityTexture.value = exports.currVelocityRenderTarget.texture
  fboHelper.render(rotationMaterial, exports.rotationRenderTarget)

  fboHelper.setColorState(state)
}
