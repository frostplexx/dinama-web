import { OrbitControls } from "./OrbitControls.js";
import * as THREE from "./three.module.min.js";

// Select the container for the scene
const container = document.getElementById("pan-container");

// Create the camera, and renderer
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Set up the camera and controls
camera.position.set(0, 0, 0.1);

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.01;
controls.minDistance = 0;
controls.maxDistance = 400;
controls.enableDamping = true;
controls.enableZoom = true;
controls.zoomSpeed = 10;
controls.enablePan = false;
controls.rotateSpeed = -0.25;

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

class PanScene {
    sphere;
    scene;

	constructor(imagePath) {
        this.scene = new THREE.Scene();
		this.loadTexture(imagePath);
        this.animate = this.animate.bind(this);
        this.animate();
	}

	loadTexture(imagePath) {
		// Load the panoramic image and create a texture
		const material = new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load(imagePath),
		});

		// Create a spherical geometry and map the texture to it
		const geometry = new THREE.SphereGeometry(500, 60, 40);

		// Flip the geometry inside out
		geometry.scale(-1, 1, 1);

		this.sphere = new THREE.Mesh(geometry, material);
		this.scene.add(this.sphere);
	}

	animate() {
		requestAnimationFrame(this.animate);

		controls.update();
		renderer.render(this.scene, camera);
	}
}


const panorama = new PanScene("/playground/panorama/pano2.png");

// slideshow controls
const prev = document.getElementById("prev");
const next = document.getElementById("next");
prev.addEventListener("click", () => {
    index--;
    if (index < 0) {
        index = worldPaths.length - 1;
    }
	panorama.loadTexture(worldPaths[index]);
});
next.addEventListener("click", () => {
    index++;
    if (index >= worldPaths.length) {
        index = 0;
    }
    panorama.loadTexture(worldPaths[index]);
});



//-----------------------------------------

document.addEventListener("mousedown", removeTitle);

function removeTitle(){
	document.getElementById("title").remove();
	document.removeEventListener("mousedown", removeTitle);
}

