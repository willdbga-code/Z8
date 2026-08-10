import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export class Radian3DEngine {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = options;
    this.modelMesh = null;
    this.headlightSpot = null;
    this.headlightLens = null;
    this.lightsOn = true;
    this.scrollProgress = 0;
    this.currentBodyColor = 0x006847; // Default Emerald Green
    this.materialsMap = [];

    this.initScene();
    this.initLights();
    this.initControls();
    this.loadModel();
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('scroll', () => this.onScroll());
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090a0d);
    this.scene.fog = new THREE.FogExp2(0x090a0d, 0.06);

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.1, 4.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Reflective Grid Floor
    const grid = new THREE.GridHelper(24, 48, 0x00f0ff, 0x171922);
    grid.position.y = -0.85;
    this.scene.add(grid);

    const floorGeo = new THREE.PlaneGeometry(40, 40);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x07080b,
      roughness: 0.2,
      metalness: 0.9
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.851;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  initLights() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    this.scene.add(keyLight);

    // Rim Cyan Light
    const rimLight = new THREE.DirectionalLight(0x00f0ff, 1.2);
    rimLight.position.set(-6, 4, -5);
    this.scene.add(rimLight);

    // Fill Warm Light
    const fillLight = new THREE.DirectionalLight(0xffaa00, 0.5);
    fillLight.position.set(0, -3, 5);
    this.scene.add(fillLight);

    // Headlight Spotlight (Targeted forward)
    this.headlightSpot = new THREE.SpotLight(0xffffff, 8);
    this.headlightSpot.position.set(0, 0.15, 0.65);
    this.headlightSpot.target.position.set(0, -0.2, 6);
    this.headlightSpot.angle = Math.PI / 5;
    this.headlightSpot.penumbra = 0.3;
    this.headlightSpot.distance = 18;
    this.headlightSpot.castShadow = true;
    this.scene.add(this.headlightSpot);
    this.scene.add(this.headlightSpot.target);

    // Headlight Lens Emissive Mesh (Placed sleekly inside front housing)
    const lensGeo = new THREE.BoxGeometry(0.22, 0.1, 0.02);
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.0,
      roughness: 0.1
    });
    this.headlightLens = new THREE.Mesh(lensGeo, lensMat);
    this.headlightLens.position.set(0, 0.12, 0.66);
    this.scene.add(this.headlightLens);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.01;
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 8.0;
    this.controls.target.set(0, 0.1, 0);
  }

  loadModel() {
    const loadingElem = document.getElementById('radian-loading-screen');
    const loadingBar = document.getElementById('radian-loading-bar');
    const loadingPct = document.getElementById('radian-loading-pct');

    const updateProgress = (pct) => {
      const p = Math.min(100, Math.max(0, Math.round(pct)));
      if (loadingBar) loadingBar.style.width = `${p}%`;
      if (loadingPct) loadingPct.innerText = `${p}%`;
      if (p >= 100 && loadingElem) {
        setTimeout(() => loadingElem.classList.add('fade-out'), 300);
      }
    };

    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      '/assets/3d/Hi3D_Untitled_allparts_20260806_000341.glb',
      (gltf) => {
        this.modelMesh = gltf.scene;
        this.setupLoadedMesh();
        updateProgress(100);
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          updateProgress((xhr.loaded / xhr.total) * 100);
        } else {
          updateProgress(85);
        }
      },
      (error) => {
        console.warn('GLB load error, attempting OBJ fallback...', error);
        this.loadObjFallback(updateProgress);
      }
    );
  }

  loadObjFallback(updateProgress) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/assets/3d/diffuse_0.png');

    const objLoader = new OBJLoader();
    objLoader.load(
      '/assets/3d/model.obj',
      (obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              map: texture,
              roughness: 0.35,
              metalness: 0.4
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        this.modelMesh = obj;
        this.setupLoadedMesh();
        updateProgress(100);
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          updateProgress((xhr.loaded / xhr.total) * 100);
        }
      },
      (err) => {
        console.error('OBJ fallback error:', err);
        updateProgress(100);
      }
    );
  }

  setupLoadedMesh() {
    if (!this.modelMesh) return;

    // Center & Scale Bounding Box
    const box = new THREE.Box3().setFromObject(this.modelMesh);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    this.modelMesh.position.x += (this.modelMesh.position.x - center.x);
    this.modelMesh.position.y += (this.modelMesh.position.y - center.y);
    this.modelMesh.position.z += (this.modelMesh.position.z - center.z);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.4 / maxDim;
    this.modelMesh.scale.set(scale, scale, scale);

    this.modelMesh.position.y = -0.1;
    this.modelMesh.rotation.y = Math.PI / 4;

    // Store references to materials for color customizer
    this.modelMesh.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;
        this.materialsMap.push(child.material);
      }
    });

    this.scene.add(this.modelMesh);
  }

  toggleHeadlight(forceState = null) {
    this.lightsOn = forceState !== null ? forceState : !this.lightsOn;

    if (this.headlightSpot) {
      this.headlightSpot.intensity = this.lightsOn ? 8 : 0;
    }

    if (this.headlightLens && this.headlightLens.material) {
      this.headlightLens.material.emissiveIntensity = this.lightsOn ? 2.5 : 0;
      this.headlightLens.material.color.setHex(this.lightsOn ? 0xffffff : 0x222222);
    }
  }

  setBodyColor(hexColor) {
    this.currentBodyColor = hexColor;

    if (this.modelMesh) {
      this.modelMesh.traverse((child) => {
        if (child.isMesh && child.material) {
          // Clone material if shared to avoid changing tires/black parts
          const matName = (child.name || '').toLowerCase();
          if (matName.includes('body') || matName.includes('shield') || matName.includes('panel') || matName.includes('green') || !child.material.map) {
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.color.setHex(hexColor));
            } else {
              child.material.color.setHex(hexColor);
            }
          }
        }
      });
    }
  }

  onScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    this.scrollProgress = window.scrollY / maxScroll;

    // Smoothly rotate 3D model on scroll
    if (this.modelMesh) {
      this.modelMesh.rotation.y = Math.PI / 4 + this.scrollProgress * Math.PI * 2.2;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.controls) this.controls.update();

    // Subtle idle rotation when idle near top
    if (this.modelMesh && window.scrollY < 80 && !this.controls.state > -1) {
      this.modelMesh.rotation.y += 0.002;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  onWindowResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
}
