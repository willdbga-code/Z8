import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export class RadianSequenceEngine {
  constructor(containerId, options = {}) {
    let elem = document.getElementById(containerId);
    if (!elem) return;

    // Check if passed element is canvas or div wrapper
    if (elem.tagName.toLowerCase() === 'canvas') {
      this.canvas = elem;
    } else {
      this.canvas = document.createElement('canvas');
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.display = 'block';
      elem.appendChild(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');
    this.options = options;
    this.totalFrames = options.totalFrames || 76;
    this.frames = [];
    this.currentFrame = 0;
    this.isReady = false;

    this.resizeCanvas();
    this.preRender3DSequence();

    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('scroll', () => this.onScroll());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (this.isReady && this.frames[this.currentFrame]) {
      this.drawFrame(this.currentFrame);
    }
  }

  async preRender3DSequence() {
    const loadingElem = document.getElementById('radian-loading-screen');
    const loadingBar = document.getElementById('radian-loading-bar');
    const loadingPct = document.getElementById('radian-loading-pct');

    const updateLoading = (pct) => {
      const p = Math.min(100, Math.max(0, Math.round(pct)));
      if (loadingBar) loadingBar.style.width = `${p}%`;
      if (loadingPct) loadingPct.innerText = `${p}%`;
      if (p >= 100 && loadingElem) {
        setTimeout(() => loadingElem.classList.add('fade-out'), 300);
      }
    };

    // 1. Setup Offscreen Three.js WebGL Scene
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 1280;
    offCanvas.height = 720;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090a0d);

    const camera = new THREE.PerspectiveCamera(45, 1280 / 720, 0.1, 100);
    camera.position.set(0, 1.1, 4.0);

    const renderer = new THREE.WebGLRenderer({ canvas: offCanvas, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(1280, 720);
    renderer.setPixelRatio(1);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 1.2);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    // Headlight Spot
    const headlightSpot = new THREE.SpotLight(0xffffff, 0);
    headlightSpot.position.set(0, 0.35, 0.85);
    headlightSpot.target.position.set(0, -0.2, 5);
    headlightSpot.angle = Math.PI / 5;
    scene.add(headlightSpot);
    scene.add(headlightSpot.target);

    // Headlight Lens Mesh
    const lensGeo = new THREE.BoxGeometry(0.35, 0.18, 0.05);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const headlightLens = new THREE.Mesh(lensGeo, lensMat);
    headlightLens.position.set(0, 0.35, 0.85);
    scene.add(headlightLens);

    // Grid Floor
    const grid = new THREE.GridHelper(16, 32, 0x00f0ff, 0x171922);
    grid.position.y = -0.85;
    scene.add(grid);

    // 2. Load Mesh (GLB or Procedural Model Fallback)
    updateLoading(20);
    const modelGroup = new THREE.Group();

    const gltfLoader = new GLTFLoader();
    let loadedMesh = null;

    try {
      await new Promise((resolve) => {
        gltfLoader.load(
          '/assets/3d/Hi3D_Untitled_allparts_20260806_000341.glb',
          (gltf) => {
            loadedMesh = gltf.scene;
            resolve();
          },
          (xhr) => {
            if (xhr.lengthComputable && xhr.total > 0) {
              updateLoading(20 + (xhr.loaded / xhr.total) * 35);
            }
          },
          () => resolve()
        );
      });
    } catch (e) {
      console.warn('GLB load fallback triggered', e);
    }

    if (loadedMesh) {
      // Auto Center & Scale
      const box = new THREE.Box3().setFromObject(loadedMesh);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      loadedMesh.position.x += (loadedMesh.position.x - center.x);
      loadedMesh.position.y += (loadedMesh.position.y - center.y);
      loadedMesh.position.z += (loadedMesh.position.z - center.z);

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.4 / maxDim;
      loadedMesh.scale.set(scale, scale, scale);
      loadedMesh.position.y = -0.1;

      modelGroup.add(loadedMesh);
    } else {
      // High Precision Procedural Model Mesh Fallback
      const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x006847, roughness: 0.15, metalness: 0.3, clearcoat: 1.0 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7 });
      
      const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.75, 16), bodyMat);
      nose.position.set(0, 0.3, 0.5);
      modelGroup.add(nose);

      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.15, 0.7), darkMat);
      seat.position.set(0, 0.2, -0.3);
      modelGroup.add(seat);

      const wheelF = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.08, 12, 24), darkMat);
      wheelF.position.set(0, -0.35, 0.7);
      wheelF.rotation.y = Math.PI / 2;
      modelGroup.add(wheelF);

      const wheelR = wheelF.clone();
      wheelR.position.z = -0.65;
      modelGroup.add(wheelR);
    }

    scene.add(modelGroup);

    // 3. Pre-render 76 Frames into Offscreen Canvas Blobs
    updateLoading(60);

    for (let i = 0; i < this.totalFrames; i++) {
      const progress = i / (this.totalFrames - 1);

      // Rotate Model 360 deg
      modelGroup.rotation.y = Math.PI / 4 + progress * Math.PI * 2;

      // Headlight Ignition Sequence (Frames 18 to 35)
      if (i >= 18 && i <= 35) {
        const lightIntensity = ((i - 18) / 17) * 7.0;
        headlightSpot.intensity = lightIntensity;
        lensMat.color.setHex(0x00f0ff);
      } else if (i > 35) {
        headlightSpot.intensity = 7.0;
        lensMat.color.setHex(0x00f0ff);
      } else {
        headlightSpot.intensity = 0;
        lensMat.color.setHex(0x111111);
      }

      renderer.render(scene, camera);

      // Store Canvas Data URI
      const dataUrl = offCanvas.toDataURL('image/webp', 0.85);
      const img = new Image();
      img.src = dataUrl;
      this.frames.push(img);

      if (i % 10 === 0) {
        updateLoading(60 + (i / this.totalFrames) * 40);
        await new Promise(r => setTimeout(r, 10));
      }
    }

    // Clean up WebGL Context
    renderer.dispose();
    this.isReady = true;
    updateLoading(100);
    this.drawFrame(0);
  }

  onScroll() {
    if (!this.isReady || this.frames.length === 0) return;

    const heroSection = document.getElementById('hero-3d');
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();
    const heroHeight = heroSection.offsetHeight;
    
    let scrollRatio = (-rect.top) / (heroHeight - window.innerHeight);
    scrollRatio = Math.max(0, Math.min(1, scrollRatio));

    const targetFrame = Math.floor(scrollRatio * (this.totalFrames - 1));
    if (targetFrame !== this.currentFrame) {
      this.currentFrame = targetFrame;
      this.drawFrame(this.currentFrame);
    }
  }

  drawFrame(index) {
    if (!this.ctx || !this.frames[index]) return;

    const img = this.frames[index];
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const imgRatio = 1280 / 720;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawW = canvasWidth;
      drawH = canvasWidth / imgRatio;
      drawX = 0;
      drawY = (canvasHeight - drawH) / 2;
    } else {
      drawH = canvasHeight;
      drawW = canvasHeight * imgRatio;
      drawX = (canvasWidth - drawW) / 2;
      drawY = 0;
    }

    this.ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }
}
