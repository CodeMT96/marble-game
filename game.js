import "./style.css";
import * as THREE from "three";

//Init three.js basics
//Defining the Game via Class
class Game {
  //Adding the GameConstructer
  constructor() {
    const gameContainer = document.createElement("div");
    //appending the div to the body
    document.body.appendChild(gameContainer);
    //This initializes the scene
    this.scene = new THREE.Scene();
    //Adding a new Perspective Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    //Positioning the camera
    this.camera.position.set(2, 2, 4);
    //Setting the look direction (quarternion) of the camera
    this.camera.lookAt(0, 0, 0);
    //Setting up the renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    //Renderer PixelRatio = DevicePixelRatio keine festen werte
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //Renderer Window size = windowsize same as camera
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //appending the renderer to the container
    gameContainer.appendChild(this.renderer.domElement);
    //Eventlistener for resize 
    window.addEventListener('resize', this.resize.bind(this))
    //Loop to see changes and keep rendering
    this.renderer.setAnimationLoop(this.render.bind(this))
    //Lights
    this.globalLight = new THREE.HemisphereLight(0xfffff,5)
    //Positioning the light
    this.globalLight.position.set(0.2, 1, 1)
    //adding the light to the scene
    this.scene.add(this.globalLight)
    //A direct Light
    const directLight = new THREE.DirectionalLight(0xfffff,10)
    //Direct light Postion
    directLight.position.set(0.2, 1 ,1)
    //Direct light Rotation
    //Nothing here yet
    //Adding the direct light into the scene
    this.scene.add(directLight)
    //TestCube Geometry
    const blockGeometry = new THREE.BoxGeometry()
    //TestCube Material
    const blockMaterial = new THREE.MeshStandardMaterial({color:0x1242})
    //Combining material and geometry into a full mesh
    this.block = new THREE.Mesh(blockGeometry, blockMaterial)
    //Positioning the Block
    console.log(this.block);
    this.block.position.set(0,0,0)
    //Adding the block
    this.scene.add(this.block)
  }
  //Method to Resize the window
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  //Render Method
  render() {
    this.renderer.render(this.scene, this.camera,);
  }
}

export {Game}