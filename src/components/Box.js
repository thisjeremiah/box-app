/* eslint-disable */

import React, { Component } from 'react'
import * as OLD_THREE from 'three'
import OBJLoader from 'three-obj-loader'
import Promise from 'bluebird'
import R from 'ramda'

const coneUrl = process.env.PUBLIC_URL + '/cone.obj'
const publicUrl = process.env.PUBLIC_URL

const geometryDatas = [
  {
    name: 'cube',
    url: publicUrl + '/cube.json',
  },
  {
    name: 'sphere',
    url: publicUrl + '/sphere.json',
  },
]

const THREE = OLD_THREE
OBJLoader(THREE)
var OrbitControls = require('three-orbit-controls')(THREE)

const colors = ['blue', 'red', 'green', 'colorless']

class Box extends Component {
  constructor(props) {
    super(props)
    this.clock = new THREE.Clock()

    this.setupCamera()
    this.setupRenderer()
    this.setupControls()
    this.setupMaterials()
    this.setupLight()
    this.setupGroup()
    this.setupScene()

    const color = window.localStorage.getItem('boxApp/color') || 'blue'

    this.state = {
      metal: this.materials.gold,
      color,
      scale: 2,
    }
  }

  setupScene = () => {
    this.scene = new THREE.Scene()
    this.scene.add(this.light)
    this.scene.add(this.directionalLight)
    this.scene.add(this.group)
  }

  setupCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100000,
    )
    this.camera.position.z = 5
  }

  setupRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerWidth)
  }

  setupLight = () => {
    this.light = new THREE.AmbientLight(0x999999)
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
    this.directionalLight.position.set(0, 1, 1)
  }

  setupControls = () => {
    this.controls = new OrbitControls(this.camera)
    this.controls.enablePan = false
    this.controls.enableZoom = false
    this.controls.minPolarAngle = 0
    this.controls.maxPolarAngle = Math.PI / 2
  }

  setupMaterials = () => {
    this.materials = {}
    this.materials.blue = new THREE.MeshPhongMaterial({
      aoMapIntensity: 0x808080,
      color: 0x220cf9,
      specular: 0x111111,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    })
    this.materials.red = new THREE.MeshPhongMaterial({
      color: 0xb70000,
      specular: 0xffffff,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    })
    this.materials.green = new THREE.MeshPhongMaterial({
      color: 0x039100,
      specular: 0xffffff,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    })
    this.materials.colorless = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      specular: 0xffffff,
      shininess: 100,
      transparent: true,
      opacity: 0.9,
    })
    this.materials.gold = new THREE.MeshLambertMaterial({
      color: 0xf7d478,
      aoMapIntensity: 0xa87e40,
    })
    this.materials.platinum = new THREE.MeshLambertMaterial({
      color: 0xcccccc,
      aoMapIntensity: 0x808080,
    })
  }

  setupGroup = () => {
    this.group = new THREE.Object3D()
  }

  setGeometry = () => {
    const { color } = this.state
    const loader = new THREE.JSONLoader()
    return Promise.each(
      geometryDatas,
      geometryData =>
        new Promise(resolve => {
          loader.load(geometryData.url, geometry => {
            this[geometryData.name] = new THREE.Mesh(
              geometry,
              this.materials[color],
            )
            this[geometryData.name].scale.set(0.1, 0.1, 0.1)
            resolve()
          })
        }),
    )
  }

  switchGeometry = name => {
    this.group.add(this[name])

    const removeCurrentGeometry = R.compose(
      R.reject(R.equals(name)),
      R.map(R.prop('name')),
    )
    removeCurrentGeometry(geometryDatas).forEach(geometryName =>
      this.group.remove(this[geometryName]),
    )
  }

  renderTHREE = () => {
    const delta = this.clock.getDelta()
    this.group.rotation.y += delta * 0.16
    this.renderer.render(this.scene, this.camera)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  componentDidMount() {
    this.setGeometry().then(() => {
      this.anchor.appendChild(this.renderer.domElement)
      const animate = () => {
        this.renderTHREE()
        this.controls.update()
        requestAnimationFrame(animate)
      }
      animate()
    })
  }

  setGeometryColor = () => {
    this.cone.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.material = this.materials[this.state.color]
      }
    })
  }

  setColor = color =>
    this.setState({ color }, () => {
      this.setGeometryColor()
      this.saveColorToLocalStorage()
    })

  saveColorToLocalStorage = () => {
    window.localStorage.setItem('boxApp/color', this.state.color)
  }

  render() {
    return (
      <div>
        <div>
          {colors.map(color => (
            <button
              key={color}
              style={{ color: 'white', background: color }}
              onClick={() => this.setColor(color)}
            >
              {color}
            </button>
          ))}
        </div>
        <div>
          <button onClick={() => this.switchGeometry('sphere')}>Sphere</button>
          <button onClick={() => this.switchGeometry('cube')}>Cube</button>
        </div>
        <div ref={c => (this.anchor = c)} />
      </div>
    )
  }
}

export default Box
