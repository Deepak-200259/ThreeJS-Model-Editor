import * as THREE from "three";
import {
	AmbientLight,
	AxesHelper,
	DirectionalLight,
	Mesh,
	MeshBasicMaterial,
	PlaneGeometry,
	TextureLoader,
	Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const loaders = {};
const setUpLoaders = () => {
	loaders.textureLoader = new TextureLoader();
	loaders.gltfLoader = new GLTFLoader();
	loaders.fbxLoader = new FBXLoader();
	loaders.objLoader = new OBJLoader();
	loaders.colladaLoader = new ColladaLoader();
	loaders.ddsLoader = new DDSLoader();
	loaders.mtlLoader = new MTLLoader();
	loaders.stlLoader = new STLLoader();
};
setUpLoaders();

const fileFormats = {
	texture: { jpg: "jpg", png: "png", gif: "gif" },
	fbx: "fbx",
	gltf: "gltf",
	glb: "glb",
	obj: "obj",
	collada: "dae",
	dds: "dds",
	mtl: "mtl",
	stl: "stl",
};

const helper = new AxesHelper(5000);

const scene = new THREE.Scene();
scene.add(helper);
const canvas = document.getElementById("webgl");
canvas.style.width = window.innerWidth - 500;
canvas.style.height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(
	50,
	window.innerWidth / window.innerHeight,
	0.1,
	10000,
);
camera.position.set(10, 5, 6);
camera.lookAt(new Vector3(0, 0, 0));
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const plane = new Mesh(
	new PlaneGeometry(100, 100, 10, 10),
	new MeshBasicMaterial({ color: 0xffffff, wireframe: true }),
);
plane.rotation.x = (Math.PI / 180) * 90;
scene.add(plane);

const ambientLight = new AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

// Handle file drops
canvas.addEventListener("dragover", (event) => {
	event.preventDefault();
});

canvas.addEventListener("drop", (event) => {
	event.preventDefault();
	const file = event.dataTransfer.files[0];
	addModel(file);
});

const addModel = (file) => {
	const fileExtension = getFileExtension(file.name);
	// Load file based on extension
	switch (fileExtension) {
		case fileFormats.texture.jpg:
		case fileFormats.texture.png:
		case fileFormats.texture.gif:
			loadTexture(file, loaders.textureLoader);
			break;
		case fileFormats.collada:
			loadCollada(file, loaders.colladaLoader);
			break;
		case fileFormats.dds:
			loadDDS(file, loaders.ddsLoader);
			break;
		case fileFormats.fbx:
			loadFBX(file, loaders.fbxLoader);
			break;
		case fileFormats.glb:
		case fileFormats.gltf:
			loadGLTF(file, loaders.gltfLoader);
			break;
		case fileFormats.mtl:
			loadMTL(file, loaders.mtlLoader);
			break;
		case fileFormats.obj:
			loadOBJ(file, loaders.objLoader);
			break;
		case fileFormats.stl:
			loadSTL(file, loaders.stlLoader);
			break;
		default:
			console.error("Unsupported file type");
			break;
	}
};
// Function to get file extension
const getFileExtension = (fileName) => {
	return fileName.split(".").pop().toLowerCase();
};

const loadTexture = (file, loader) => {
	loader.load(URL.createObjectURL(file), (texture) => {
		scene.traverse(
			(child) => {
				if (
					child.name !== scene.children[0].name &&
					child instanceof THREE.Mesh
				) {
					child.material.map = texture;
					child.material.needsUpdate = true;
				}
			},
			(xhr) => {
				console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
			},
			(error) => {
				console.error("Error loading Texture file", error);
			},
		);
	});
};

// Function to load GLB or GLTF file
const loadGLTF = (file, loader) => {
	loader.load(
		URL.createObjectURL(file),
		(gltf) => {
			scene.add(gltf.scene);
			const animations = gltf.animations;
			console.log(animations);
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		(error) => {
			console.error("Error loading GLTF file", error);
		},
	);
};

// Function to load FBX file
const loadFBX = (file, loader) => {
	loader.load(
		URL.createObjectURL(file),
		(fbx) => {
			scene.add(fbx);
			console.log(fbx);
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		(error) => {
			console.error("Error loading FBX file", error);
		},
	);
};

// Function to load MTL file
const loadMTL = (file, loader) => {
	loader.load(
		URL.createObjectURL(file),
		(mtl) => {
			scene.add(mtl);
			console.log(mtl);
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		(error) => {
			console.error("Error loading MTL file", error);
		},
	);
};

// Function to load STL file
const loadSTL = (file, loader) => {
	loader.load(
		URL.createObjectURL(file),
		(stl) => {
			scene.add(stl);
			console.log(stl);
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		(error) => {
			console.error("Error loading STL file", error);
		},
	);
};

// Function to load DDS file
const loadDDS = (file, loader) => {
	loader.load(
		URL.createObjectURL(file),
		(dds) => {
			scene.add(dds);
			console.log(dds);
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		(error) => {
			console.error("Error loading DDS file", error);
		},
	);
};

// Function to load Collada(DAE) file
const loadCollada = (file, loader) => {
	loader.load(
		URL.createObjectURL(file),
		(dae) => {
			scene.add(dae);
			console.log(dae);
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		(error) => {
			console.error("Error loading Collada file", error);
		},
	);
};

// Function to load OBJ file
const loadOBJ = (file, loader) => {
	loader.load(
		URL.createObjectURL(file),
		(obj) => {
			scene.add(obj);
			console.log(obj);
		},
		(xhr) => {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		(error) => {
			console.error("Error loading OBJ file", error);
		},
	);
};

const update = () => {
	//Updating controls
	controls.update();

	//Rendering scene on each frame
	renderer.render(scene, camera);

	window.requestAnimationFrame(update);
};

function openFileDialog() {
	// Trigger the click event of the hidden file input element
	document.getElementById("fileInput").click();
}

// Handle the file selection
document.getElementById("fileInput").addEventListener("change", function () {
	if (this.files.length > 0) {
		// Files are selected
		const selectedFile = this.files[0];
		// You can perform further actions with the selected file, e.g., display its name
		console.log("Selected file: " + selectedFile.name);
		addModel(selectedFile);
	} else {
		// No files selected, user clicked "Cancel"
		console.warn("No file selected.");
	}
});

const browseButton = document.getElementById("browse");
browseButton.addEventListener("click", openFileDialog);

window.addEventListener("resize", () => {
	// Update camera
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

renderer.render(scene, camera);

update();
