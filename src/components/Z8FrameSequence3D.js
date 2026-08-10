import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class Z8FrameSequence3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.modelMesh = null;
    this.headlightSpot = null;
    this.studioTopSpot = null;
    this.studioSideSpot = null;
    this.studioRimSpot = null;

    this.initScene();
    this.initLights();
    this.loadModel();
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x606266); // Neutral Studio Grey background

    this.camera = new THREE.PerspectiveCamera(
      36,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    // Frame 1 Position: Close Front Zoom on Handlebar & Headlight
    this.camera.position.set(0, 0.45, 1.8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Studio Floor with shadow receiver
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x484a4e,
      roughness: 0.35,
      metalness: 0.25
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.85;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainLight.position.set(5, 10, 6);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.bias = -0.0001;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xaaccff, 1.0);
    fillLight.position.set(-6, 5, -4);
    this.scene.add(fillLight);

    const backRimLight = new THREE.DirectionalLight(0xffe6aa, 1.4);
    backRimLight.position.set(0, 6, -8);
    this.scene.add(backRimLight);

    // Headlight Spotlight
    this.headlightSpot = new THREE.SpotLight(0xffffff, 6);
    this.headlightSpot.position.set(0, 0.35, 0.85);
    this.headlightSpot.target.position.set(0, -0.2, 5);
    this.headlightSpot.angle = Math.PI / 5;
    this.scene.add(this.headlightSpot);
    this.scene.add(this.headlightSpot.target);

    // Dynamic Studio Highlights for Final Stage
    this.studioTopSpot = new THREE.SpotLight(0xffffff, 0);
    this.studioTopSpot.position.set(0, 7, 0);
    this.studioTopSpot.angle = Math.PI / 3.5;
    this.studioTopSpot.penumbra = 0.8;
    this.studioTopSpot.decay = 1.2;
    this.scene.add(this.studioTopSpot);

    this.studioSideSpot = new THREE.SpotLight(0x00f0ff, 0);
    this.studioSideSpot.position.set(4, 4, 3);
    this.studioSideSpot.angle = Math.PI / 3;
    this.studioSideSpot.penumbra = 0.7;
    this.scene.add(this.studioSideSpot);

    this.studioRimSpot = new THREE.SpotLight(0xffe600, 0);
    this.studioRimSpot.position.set(-4, 4, -2);
    this.studioRimSpot.angle = Math.PI / 3;
    this.studioRimSpot.penumbra = 0.7;
    this.scene.add(this.studioRimSpot);
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
        console.warn('GLB error, loading OBJ fallback...', error);
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
        console.error('OBJ error:', err);
        updateProgress(100);
      }
    );
  }

  setupLoadedMesh() {
    if (!this.modelMesh) return;

    // Center & Scale
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

    // Enhance materials across all sub-meshes
    this.modelMesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.needsUpdate = true;
          const matName = (child.name || '').toLowerCase();
          if (matName.includes('body') || matName.includes('green') || matName.includes('panel')) {
            child.material.roughness = 0.24;
            child.material.metalness = 0.55;
          } else if (matName.includes('tire') || matName.includes('wheel') || matName.includes('seat')) {
            child.material.roughness = 0.75;
            child.material.metalness = 0.12;
          } else if (matName.includes('metal') || matName.includes('chrome') || matName.includes('mirror')) {
            child.material.roughness = 0.15;
            child.material.metalness = 0.85;
          }
        }
      }
    });

    // FRAME 1 INITIAL POSITION: Straight Front View (0 deg)
    this.modelMesh.rotation.y = 0;

    this.scene.add(this.modelMesh);

    // Setup GSAP ScrollTrigger Sequence
    this.setupScrollAnimation();
  }

  setupScrollAnimation() {
    if (!this.modelMesh) return;

    const heroText = document.getElementById('hero-text-block');
    const minimalTitle = document.getElementById('minimal-model-name');

    // Create GSAP ScrollTrigger Timeline across the hero sequence container
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero-sequence-trigger',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2
      }
    });

    // ----------------------------------------------------
    // STAGE 1 -> STAGE 2: Front Close-up -> 3/4 Front View
    // - Motorcycle shifts to left
    // - Hero main text moves in reverse to the RIGHT and EXITS the screen completely
    // ----------------------------------------------------
    tl.to(this.camera.position, {
      x: 1.5,
      y: 0.3,
      z: 2.7,
      duration: 1,
      ease: 'power2.inOut'
    }, 0);

    tl.to(this.modelMesh.rotation, {
      y: Math.PI * 0.22, // 40 deg angle
      duration: 1,
      ease: 'power2.inOut'
    }, 0);

    // Text moves to the right and exits the screen desocupando a tela
    if (heroText) {
      tl.to(heroText, {
        x: '100vw',
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut'
      }, 0);
    }

    // ----------------------------------------------------
    // STAGE 2 -> STAGE 3: Full Flat Side Profile (Vista Lateral)
    // - Full bike fully visible including wheels (camera z: 4.5, y: 0.15)
    // - ONLY the model name of the bike appears on screen
    // - Studio spotlight highlights ignite illuminating the bike
    // ----------------------------------------------------
    tl.to(this.camera.position, {
      x: 0,
      y: 0.15,
      z: 4.5, // Pull back so entire bike & wheels fit with vertical margin
      duration: 1,
      ease: 'power2.inOut'
    }, 1);

    tl.to(this.modelMesh.position, {
      y: -0.15, // Center bike vertically
      duration: 1,
      ease: 'power2.inOut'
    }, 1);

    tl.to(this.modelMesh.rotation, {
      y: Math.PI * 0.5, // 90 deg full side profile
      duration: 1,
      ease: 'power2.inOut'
    }, 1);

    // Reveal ONLY the minimal model name of the motorcycle in side view
    if (minimalTitle) {
      tl.to(minimalTitle, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, 1);
    }

    // Ignite Studio Highlights in Side View Stage
    if (this.studioTopSpot) {
      tl.to(this.studioTopSpot, {
        intensity: 20,
        duration: 1,
        ease: 'power2.out'
      }, 1);
    }
    if (this.studioSideSpot) {
      tl.to(this.studioSideSpot, {
        intensity: 12,
        duration: 1,
        ease: 'power2.out'
      }, 1);
    }
    if (this.studioRimSpot) {
      tl.to(this.studioRimSpot, {
        intensity: 14,
        duration: 1,
        ease: 'power2.out'
      }, 1);
    }

    tl.to(this.scene.background, {
      r: 0.12,
      g: 0.14,
      b: 0.16,
      duration: 1,
      ease: 'power1.inOut'
    }, 1);

    // ----------------------------------------------------
    // STAGE 3 -> STAGE 4: Handoff to content scroll down
    // ----------------------------------------------------
    if (minimalTitle) {
      tl.to(minimalTitle, {
        opacity: 0,
        y: -30,
        duration: 0.6,
        ease: 'power1.in'
      }, 2);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

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

