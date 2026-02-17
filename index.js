import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ===============================
// ESCENA
// ===============================
const scene = new THREE.Scene();
let skyHue = 0;
const skyColor = new THREE.Color();
scene.background = new THREE.Color(0xFF5F22);

// ===============================
// CÁMARA
// ===============================
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 10, 6);

const DEFAULT_FOV = 75;
const ZOOM_FOV = 35;
const WORLD_CENTER = new THREE.Vector3(0, 0, 0);

// ===============================
// RENDER
// ===============================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===============================
// LUZ
// ===============================
const toggleLight = new THREE.PointLight(0xffffff, 40, 70);
toggleLight.position.set(0, 5, 0);
scene.add(toggleLight);

// ===============================
// CONTROLES
// ===============================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 8;
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2;

// ===============================
// VARIABLES
// ===============================
let ring;
let selectedObject = null;
let targetFov = DEFAULT_FOV;
let focusMode = false;
let infoTimeout = null;

const randomRotationSpeed = 0.01;
const zoomSpeed = 0.08;

// ===============================
// RAYCASTER
// ===============================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ===============================
// FUNCIONES AUXILIARES
// ===============================
function highlightObject(object) {
    object.traverse(child => {
        if (child.isMesh) {
            child.userData.originalMaterial = child.material;
            child.material = child.material.clone();
            child.material.emissive = new THREE.Color(0xffff00);
            child.material.emissiveIntensity = 0.6;
        }
    });
}

function resetHighlight(object) {
    object.traverse(child => {
        if (child.isMesh && child.userData.originalMaterial) {
            child.material = child.userData.originalMaterial;
            delete child.userData.originalMaterial;
        }
    });
}

function isSelectable(object) {
    let current = object;
    while (current) {
        if (current.userData.selectable === false) return false;
        current = current.parent;
    }
    return true;
}

// ===============================
// INFOBOX ESTÁTICO
// ===============================
function showStaticInfoBox(id) {
    document.querySelectorAll('.infoBox').forEach(box => {
        box.style.display = 'none';
    });

    const box = document.getElementById(`infoBox-${id}`);
    if (box) box.style.display = 'block';
}

// ===============================
// CARGA DE MODELOS
// ===============================
const loader = new GLTFLoader();

loader.load('resources/main.glb', gltf => {
    gltf.scene.userData.selectable = false;
    scene.add(gltf.scene);
});

loader.load('resources/numeros.glb', gltf => {
    gltf.scene.userData.selectable = false;
    scene.add(gltf.scene);
});

loader.load('resources/ring.glb', gltf => {
    ring = gltf.scene;
    ring.name = 'ring';
    ring.userData.selectable = true;
    scene.add(ring);
});

loader.load('resources/floor.glb', gltf => {
    gltf.scene.userData.selectable = false;
    gltf.scene.position.set(0, -0.1, 0);
    scene.add(gltf.scene);
});

for (let i = 1; i <= 20; i++) {
    loader.load(`resources/${i}.glb`, gltf => {
        gltf.scene.name = `${i}`;
        gltf.scene.userData.selectable = true;
        scene.add(gltf.scene);
    });
}

loader.load('resources/isv.glb', gltf => {
    gltf.scene.userData.selectable = false;
    scene.add(gltf.scene);
});

loader.load('resources/h.glb', gltf => {
    gltf.scene.userData.selectable = false;
    scene.add(gltf.scene);
});
loader.load('resources/can.glb', gltf => {
    gltf.scene.userData.selectable = false;
    scene.add(gltf.scene);
});

loader.load('resources/conejo.glb', gltf => {
    gltf.scene.userData.selectable = false;
    scene.add(gltf.scene);
});

loader.load('resources/cuchillas.glb', gltf => {
    gltf.scene.userData.selectable = false;
    scene.add(gltf.scene);
});

loader.load('resources/cuentas.glb', gltf => {
    gltf.scene.userData.selectable = false;
    scene.add(gltf.scene);
});

loader.load('resources/espadaLaser.glb', gltf => {
    gltf.scene.userData.selectable = false;
    scene.add(gltf.scene);
});

loader.load('resources/flor.glb', gltf => {
    gltf.scene.userData.selectable = false;
    scene.add(gltf.scene);
});

loader.load('resources/gnome.glb', gltf => {
    gltf.scene.userData.selectable = false;
    scene.add(gltf.scene);
});

loader.load('resources/inframundo.glb', gltf => {
    gltf.scene.userData.selectable = false;
    scene.add(gltf.scene);
});

loader.load('resources/jet.glb', gltf => {
    gltf.scene.userData.selectable = false;
    scene.add(gltf.scene);
});

loader.load('resources/khopesh.glb', gltf => {
    gltf.scene.userData.selectable = false;
    scene.add(gltf.scene);
});


// ===============================
// ANIMACIÓN
// ===============================
function animate() {
    requestAnimationFrame(animate);

    skyHue += 0.0005;
    if (skyHue > 1) skyHue = 0;
    skyColor.setHSL(skyHue, 0.6, 0.5);
    scene.background = skyColor;

    if (ring) {
        ring.rotation.x += 0.5 * randomRotationSpeed;
        ring.rotation.z += 0.7 * randomRotationSpeed;
    }

    camera.fov += (targetFov - camera.fov) * zoomSpeed;
    camera.updateProjectionMatrix();

    controls.update();
    renderer.render(scene, camera);
}

// ===============================
// CLICK
// ===============================
window.addEventListener('click', event => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (!intersects.length) return;

    let obj = intersects[0].object;
    if (!isSelectable(obj)) return;
    while (obj.parent && obj.parent !== scene) obj = obj.parent;

    if (focusMode) return;

    if (selectedObject) resetHighlight(selectedObject);

    if (obj.name === 'ring') {
        toggleLight.visible = !toggleLight.visible;
        return;
    }

    if (!isNaN(parseInt(obj.name))) {
        highlightObject(obj);
        selectedObject = obj;

        const box = new THREE.Box3().setFromObject(obj);
        const center = new THREE.Vector3();
        box.getCenter(center);
        controls.target.copy(center);

        targetFov = ZOOM_FOV;
        focusMode = true;
        controls.enableRotate = false;
        controls.enablePan = false;

        if (infoTimeout) clearTimeout(infoTimeout);
        infoTimeout = setTimeout(() => {
            showStaticInfoBox(obj.name);
        }, 3000);
    }
});

// ===============================
// WHEEL → RESET
// ===============================
window.addEventListener('wheel', () => {
    if (infoTimeout) {
        clearTimeout(infoTimeout);
        infoTimeout = null;
    }

    targetFov = DEFAULT_FOV;
    controls.target.copy(WORLD_CENTER);
    focusMode = false;
    controls.enableRotate = true;
    controls.enablePan = true;

    if (selectedObject) {
        resetHighlight(selectedObject);
        selectedObject = null;
    }

    document.querySelectorAll('.infoBox').forEach(box => {
        box.style.display = 'none';
    });
});

// ===============================
// RESIZE
// ===============================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===============================
animate();
