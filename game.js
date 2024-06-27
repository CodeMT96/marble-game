import "./style.css";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { CannonCombiner } from "./libary/CannonCombiner";
import {OrbitControls} from "./node_modules/three/examples/jsm/controls/OrbitControls"

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
    this.camera.position.set(0, 5, 10);
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
    window.addEventListener("resize", this.resize.bind(this));
    //Loop to see changes and keep rendering
    this.renderer.setAnimationLoop(this.render.bind(this));
    //Lights
    this.globalLight = new THREE.HemisphereLight(0xfffff, 5);
    //Positioning the light
    this.globalLight.position.set(0.2, 1, 1);
    //adding the light to the scene
    this.scene.add(this.globalLight);
    //A direct Light
    const directLight = new THREE.DirectionalLight(0xfffff, 10);
    //Direct light Postion
    directLight.position.set(0.2, 1, 1);
    //Direct light Rotation
    //Nothing here yet
    //Adding the direct light into the scene
    this.scene.add(directLight);
    //Orbit Controls
    const controls = new OrbitControls( this.camera, this.renderer.domElement )
    //TestCube Geometry
    const blockGeometry = new THREE.BoxGeometry();
    //TestCube Material
    const blockMaterial = new THREE.MeshStandardMaterial({ color: 0x1242 });
    //Combining material and geometry into a full mesh
    this.block = new THREE.Mesh(blockGeometry, blockMaterial);
    //Positioning the Block
    console.log(this.block);
    this.block.position.set(0, 4, 0);

    //Adding the block
    this.scene.add(this.block);
    this.planeMaker();
    this.initWorld();
    this.initBasePlane();
    this.initBlock();
    this.animate();
  }
  initWorld() {
    const world = new CANNON.World();
    world.gravity.set(0, -10, 0);

    this.world = world;
  }

  //Adding a Plane
  planeMaker() {
    const planeGeo = new THREE.PlaneGeometry();
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x44456,
    });
    this.planeObj = new THREE.Mesh(planeGeo, planeMat);
    this.planeObj.rotation.x = -Math.PI / 2;
    this.planeObj.scale.set(5, 5, 5);
    this.scene.add(this.planeObj);
    console.log(this.planeObj);
  }
  initBlock() {
    const blockShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));//WARUM DIE HÄLFTE!!!!
    //CHATGPT fragen später

    const blockBody = new CANNON.Body({
      mass: 2,
      position: new CANNON.Vec3(
        this.block.position.x,
        this.block.position.y,
        this.block.position.z
      ),
      shape: blockShape,
    });
    this.blockBody = blockBody;
    this.world.addBody(blockBody);
  }

  initBasePlane() {
    const planeShape = new CANNON.Plane(new CANNON.Vec3(1, 1, 1));
    const basePlaneBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(
        this.planeObj.position.x,
        this.planeObj.position.y,
        this.planeObj.position.z
      ),
      shape: new CANNON.Plane(),
    });
    basePlaneBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    this.basePlaneBody = basePlaneBody
    this.world.addBody(basePlaneBody);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.world.fixedStep();

    this.block.position.copy(this.blockBody.position);
    this.block.quaternion.copy(this.blockBody.quaternion);

    this.basePlaneBody.position.copy(this.planeObj.position);
    this.basePlaneBody.quaternion.copy(this.planeObj.quaternion);

    this.renderer.render(this.scene, this.camera, this.world);
  };

  //Method to Resize the window
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  //Render Method
  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

export { Game };
