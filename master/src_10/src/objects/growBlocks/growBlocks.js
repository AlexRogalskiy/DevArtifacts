const fboHelper = require('../../../common/helpers/fboHelper')
const growSimulator = require('../../simulators/growSimulator/growSimulator')
const lights = require('../lights/lights')
const stage = require('../stage/stage')
const THREE = require('three')
const mixIn = require('mout/object/mixIn')
const glslify = require('glslify')

exports.init = init
exports.update = update

exports.mesh = null
exports.infoMesh = null
exports.averageColor = null

let _geometry
let _material
let _depthMaterial

function init () {
  exports.averageColor = new THREE.Color()
  _initGeometry()
  _initMaterial()

  exports.mesh = new THREE.Mesh(_geometry, _material)
  exports.mesh.customDepthMaterial = _depthMaterial
  exports.mesh.frustumCulled = false
  exports.mesh.receiveShadow = true
  exports.mesh.castShadow = true
}

function _initGeometry () {
  let BLOCK_COUNT = growSimulator.BLOCK_COUNT
  let BLOCK_TEXTURE_COLUMN = growSimulator.BLOCK_TEXTURE_COLUMN
  let BLOCK_TEXTURE_ROW = growSimulator.BLOCK_TEXTURE_ROW
  let TEXTURE_WIDTH = growSimulator.TEXTURE_WIDTH
  let TEXTURE_HEIGHT = growSimulator.TEXTURE_HEIGHT

  let ref = new THREE.BoxBufferGeometry(1.5, 0.5, 0.5)

  let positionUv = new Float32Array(BLOCK_COUNT * 2)

  let i2 = 0
  for (let i = 0; i < BLOCK_COUNT; i++) {
    let u = (i % BLOCK_TEXTURE_COLUMN + 0.5) / TEXTURE_WIDTH
    let v = (~~(i / BLOCK_TEXTURE_COLUMN) + 0.5) / TEXTURE_HEIGHT
    positionUv[i2 + 0] = u
    positionUv[i2 + 1] = v
    i2 += 2
  }

  _geometry = new THREE.InstancedBufferGeometry()
  _geometry.addAttribute('position', ref.attributes.position)
  _geometry.addAttribute('normal', ref.attributes.normal)
  _geometry.addAttribute('a_positionUv', new THREE.InstancedBufferAttribute(positionUv, 2, 1))
  if (ref.index) _geometry.setIndex(ref.index)
}

function _initMaterial () {
  _material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    roughness: 0,
    metalness: 0.1,
    envMap: stage.cubeMap
  })
  mixIn(_material, {
    type: 'ShaderMaterial',
    uniforms: mixIn(THREE.UniformsUtils.merge([THREE.ShaderLib.standard.uniforms]), {
      rectAreaShadowMap: lights.rectAreaShadowMap,
      rectAreaShadowMatrix: lights.rectAreaShadowMatrix,
      u_positionInfoTexture: { type: 't', value: null },
      u_rotationTexture: { type: 't', value: growSimulator.rotationRenderTarget.texture }
    }),
    blending: THREE.NoBlending,
    vertexShader: fboHelper.precisionPrefix + glslify('./growBlocks.vert'),
    fragmentShader: fboHelper.precisionPrefix + glslify('./growBlocks.frag'),
    depthTest: true,
    depthWrite: true,
    transparent: false
  })

  _depthMaterial = new THREE.ShaderMaterial({
    uniforms: {
      u_positionInfoTexture: _material.uniforms.u_positionInfoTexture,
      u_rotationTexture: _material.uniforms.u_rotationTexture
    },
    blending: THREE.NoBlending,
    // blending: THREE.AdditiveBlending,
    vertexShader: glslify('./growBlocksDepth.vert'),
    fragmentShader: glslify('./growBlocksDepth.frag'),
    // side: THREE.DoubleSide,
    depthTest: true,
    depthWrite: true,
    transparent: true,
    defines: {
      DEPTH_PACKING: 3201
    }
  })
}

function update (dt) {
  _material.uniforms.u_positionInfoTexture.value = growSimulator.currPositionRenderTarget.texture
}
