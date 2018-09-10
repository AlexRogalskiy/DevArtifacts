const settings = require('../../core/settings')
const THREE = require('three')
const quickLoader = require('quick-loader')
const OBJLoader = require('../../loaders/OBJLoader')
const BasicMaterial = require('../../materials/basic/BasicMaterial')
const InfoMaterial = require('../../materials/info/InfoMaterial')

exports.preload = preload
exports.init = init
exports.postUpdate = postUpdate

exports.container = null
exports.infoContainer = null
exports.cubeCamera = null
exports.cubeMap = null

function preload () {
  exports.container = new THREE.Object3D()
  exports.infoContainer

  let self = this
  quickLoader.add(settings.assetPath + 'models/stage/stage.obj', {
    type: 'any',
    loadFunc: function (url, cb) {
      let loader = new OBJLoader()
      loader.load(url, function (group) {
        exports.container = group
        cb(group)
      })
    }
  })
}

function init () {
  let planes = exports.container.children
  for (let i = 0, len = planes.length; i < len; i++) {
    let name = planes[i].name = planes[i].name.split('_')[0]
    let matOpts = {
      roughness: 0.746,
      metalness: 0.469
      // envMap: exports.cubeMap,
      // roughness: 1,
      // metalness: 0,
    }
    switch (name) {
      case 'left':
        matOpts.color = 0xf3ef81
        // matOpts.emissive = 0xf3ef81
        // matOpts.emissiveIntensity = 0.4
        // matOpts.roughness = 0.746
        // matOpts.metalness = 0.469
        break
      case 'right':
        matOpts.color = 0xf3d100
        // matOpts.emissive = 0xf3d100
        // matOpts.emissiveIntensity = 0.4
        // matOpts.roughness = 0.549
        // matOpts.metalness = 0.469
        break
      case 'floor':
        matOpts.color = 0x00b1f3
        // matOpts.emissive = 0x00b1f3
        // matOpts.emissiveIntensity = 0.4
        break
    }
    // planes[i].material = new THREE.MeshPhysicalMaterial(matOpts)
    planes[i].material = new BasicMaterial(matOpts)
    if (name === 'floor') {
      planes[i].receiveShadow = true
    }
  }

  exports.infoContainer = exports.container.clone()
  planes = exports.infoContainer.children
  for (let i = 0, len = planes.length; i < len; i++) {
    planes[i].material = new InfoMaterial(1)
  }

  let cubeCamera = exports.cubeCamera = new THREE.CubeCamera(0.1, 100, 256)
  cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter
  cubeCamera.renderTarget.texture.generateMipmaps = true
  exports.cubeMap = cubeCamera.renderTarget.texture
  exports.container.add(cubeCamera)

}

function postUpdate () {
  exports.cubeCamera.parent.remove(exports.cubeCamera)
  // let planes = exports.container.children
  // for (let i = 0, len = planes.length; i < len; i++) {
  //   planes[i].material.envMap = exports.cubeMap
  //   planes[i].material.needsUpdate = true
  // }
}
