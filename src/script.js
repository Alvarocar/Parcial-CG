import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const HEIGHT_TABLE = 20
const WITH_TABLE = 16

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// BoxGPU
const boxGPU = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 1),new THREE.MeshBasicMaterial({ color: 0x4CAF50 }))
boxGPU.position.z = -HEIGHT_TABLE/2
scene.add(boxGPU)


// BoxPlayer
const boxPlayer = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 1),new THREE.MeshBasicMaterial({ color: 0xFFEB3B }))
boxPlayer.position.z = HEIGHT_TABLE/2
scene.add(boxPlayer)


// Ball
const boxBall = new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial({ color: 0xE53935 }))
scene.add(boxBall)


// TABLE
const planeTable = new THREE.Mesh(new THREE.PlaneGeometry(24, 21), new THREE.MeshBasicMaterial({color: 0x90A4AE}) )
planeTable.rotation.x = 3*Math.PI/2
planeTable.position.y = -.5
scene.add(planeTable)
// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 15, 0)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Define la direccion de la barra
let rightBox = true


function boxGPUMove() {
    if (rightBox) {
        boxGPU.position.x += 0.05
    } else {
        boxGPU.position.x -= 0.05
    }

    if(boxGPU.position.x >= WITH_TABLE/2) {
        rightBox = false
    }
    if(boxGPU.position.x <= -WITH_TABLE/2) {
        rightBox = true
    }
}

let ballDirection = true

function ballMove() {
    if (ballDirection) {
        boxBall.position.z += 0.05
    } else {
        boxBall.position.z -= 0.05
    }

    if(boxBall.position.z >= HEIGHT_TABLE/2 - 1) {
        ballDirection = false
    }
    if(boxBall.position.z <= -HEIGHT_TABLE/2 + 1) {
        ballDirection = true
    }
}

document.addEventListener("keydown", (e) => {
    
    if (e.key == "ArrowRight") {
        if (boxPlayer.position.x >= WITH_TABLE/2) {
            return
        }
        boxPlayer.position.x += 0.2
        return
    }
    if (e.key == "ArrowLeft") {
        if (boxPlayer.position.x <= -WITH_TABLE/2) {
            return
        }
        boxPlayer.position.x -= 0.2
        return
    }
})

const tick = () =>
{

    boxGPUMove()

    ballMove()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()