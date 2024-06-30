import "./style.css";
import * as THREE from "three";
import { Pane } from "tweakpane";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as dat from 'dat.gui';




const pane = new Pane();

const canvas = document.querySelector("canvas.webgl");

/**Scene */
const scene = new THREE.Scene();

/** Texture Loader */
const textureLoader = new THREE.TextureLoader();

const albedoTexture =  textureLoader.load('/textures/space/albedo.png')
const aoTexture =  textureLoader.load('/textures/space/ao.png')
const heighTexture = textureLoader.load('/textures/space/height.png')
const normalTexture = textureLoader.load('/textures/space/normal.png')
const metalTexture = textureLoader.load('/textures/space/metallic.png');
const roughnesTexture = textureLoader.load('/textures/space/roughness.png')







/**
 * Lights
 */
// initialize the light
const light = new THREE.AmbientLight(0xffffff, 0);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(3, 3, 3);
scene.add(pointLight);




/** Sphere Geometry  */
const sphereGeometry = new THREE.SphereGeometry(1.4, 200, 200);
const uv2Geometry = new THREE.BufferAttribute(sphereGeometry.attributes.uv.array, 2)
sphereGeometry.setAttribute('uv2', uv2Geometry)


/**All Materials  */
/** Sphere Material */
const material = new THREE.MeshStandardMaterial();
material.map = albedoTexture
material.roughnessMap = roughnesTexture
material.metalnessMap = metalTexture
material.metalness = 0.5; 
material.roughness = 0.5;
material.normalMap = normalTexture
material.displacementMap = heighTexture
material.aoMap = aoTexture
material.displacementScale = 0.5;
material.aoMapIntensity = 0.5;



pointLight.intensity =  1;



/**
 * Controls
 */
const Group1 = pane.addFolder({
  title: ' Sphere',
  expanded: true
})




// Add event listeners to store the values when they change
Group1.addBinding(material, 'metalness', { min: 0, max: 1, step: 0.01 });
Group1.addBinding(material, 'roughness', { min: 0, max: 1, step: 0.01 });
Group1.addBinding(material, 'displacementScale', { min: 0, max: 1, step: 0.01 });
Group1.addBinding(material, 'aoMapIntensity', { min: 0, max: 1, step: 0.01 });
Group1.addBinding(pointLight, 'intensity', { min: 0, max: 10, step: 0.01 });


/**
 * Controls End
 */


const sphereMesh = new THREE.Mesh(sphereGeometry, material)
scene.add(sphereMesh)

/**
 * Environment Factors
 */



//Resize Event
window.addEventListener("resize", () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.z = 10;
camera.position.y = 0

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias : true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true,
renderer.outputColorSpace =   THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const clock = new THREE.Clock();
const renderLoop = () => {
  const elapsedTime = clock.getElapsedTime();
  sphereMesh.rotation.y = 0.1 * elapsedTime;

  // Update controls
  controls.update();

  // Update Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(renderLoop);
};

renderLoop();
