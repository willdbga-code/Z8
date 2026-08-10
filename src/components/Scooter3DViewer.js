import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Scooter3DViewer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = options;
    this.currentColor = 0x006847; // Emerald Green
    this.lightsOn = true;
    this.autoRotate = true;

    this.initScene();
    this.buildScooterMesh();
    this.initLights();
    this.initControls();
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f1217);

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      100
    );
    this.camera.position.set(2.8, 1.6, 3.2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Grid Floor
    const grid = new THREE.GridHelper(10, 20, 0x00f0ff, 0x1e2430);
    grid.position.y = -0.6;
    this.scene.add(grid);

    // Reflective Floor Mesh
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c10,
      roughness: 0.3,
      metalness: 0.8
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.601;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(5, 8, 5);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00f0ff, 0.6);
    dirLight2.position.set(-5, 4, -5);
    this.scene.add(dirLight2);

    // Headlight Spotlight
    this.spotLight = new THREE.SpotLight(0xffffff, 3);
    this.spotLight.position.set(0, 0.3, 0.8);
    this.spotLight.target.position.set(0, 0, 4);
    this.spotLight.angle = Math.PI / 6;
    this.spotLight.penumbra = 0.4;
    this.scene.add(this.spotLight);
    this.scene.add(this.spotLight.target);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't clip under floor
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 6.0;
    this.controls.target.set(0, 0.2, 0);
  }

  buildScooterMesh() {
    this.scooterGroup = new THREE.Group();

    // Shared Materials
    this.bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: this.currentColor,
      roughness: 0.15,
      metalness: 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    this.blackPlasticMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.75,
      metalness: 0.1
    });

    this.blackGlossMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.1,
      metalness: 0.6
    });

    this.tireMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.85
    });

    this.rimMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.3,
      metalness: 0.85
    });

    this.ledEmissiveMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

    this.cyanLcdMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff
    });

    // 1. FRONT NOSE SHIELD (Carenagem Frontal Esmeralda)
    const noseGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.75, 16, 1, false, 0, Math.PI);
    const noseMesh = new THREE.Mesh(noseGeo, this.bodyMaterial);
    noseMesh.rotation.y = -Math.PI / 2;
    noseMesh.position.set(0, 0.35, 0.55);
    noseMesh.scale.set(0.9, 1.0, 0.7);
    noseMesh.castShadow = true;
    this.scooterGroup.add(noseMesh);

    // Front Headlight Box & LED
    const headBoxGeo = new THREE.BoxGeometry(0.3, 0.16, 0.12);
    const headBox = new THREE.Mesh(headBoxGeo, this.blackPlasticMat);
    headBox.position.set(0, 0.08, 0.78);
    this.scooterGroup.add(headBox);

    const ledLensGeo = new THREE.BoxGeometry(0.26, 0.12, 0.02);
    this.ledMesh = new THREE.Mesh(ledLensGeo, this.ledEmissiveMat);
    this.ledMesh.position.set(0, 0.08, 0.84);
    this.scooterGroup.add(this.ledMesh);

    // Front Lower Panel with Stripes
    const lowerNoseGeo = new THREE.BoxGeometry(0.42, 0.35, 0.35);
    const lowerNose = new THREE.Mesh(lowerNoseGeo, this.blackGlossMat);
    lowerNose.position.set(0, -0.12, 0.62);
    lowerNose.castShadow = true;
    this.scooterGroup.add(lowerNose);

    // 2. HANDLEBAR COCKPIT & DASHBOARD
    const handleCowlGeo = new THREE.BoxGeometry(0.55, 0.15, 0.25);
    const handleCowl = new THREE.Mesh(handleCowlGeo, this.blackGlossMat);
    handleCowl.position.set(0, 0.78, 0.42);
    handleCowl.rotation.x = -0.2;
    this.scooterGroup.add(handleCowl);

    // Handlebar Grips
    const gripGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.75);
    const gripMesh = new THREE.Mesh(gripGeo, this.blackPlasticMat);
    gripMesh.rotation.z = Math.PI / 2;
    gripMesh.position.set(0, 0.78, 0.42);
    this.scooterGroup.add(gripMesh);

    // Mirrors
    const mirrorStemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.28);
    const mStemL = new THREE.Mesh(mirrorStemGeo, this.blackGlossMat);
    mStemL.position.set(-0.32, 0.92, 0.42);
    mStemL.rotation.z = -0.3;
    this.scooterGroup.add(mStemL);

    const mStemR = mStemL.clone();
    mStemR.position.x = 0.32;
    mStemR.rotation.z = 0.3;
    this.scooterGroup.add(mStemR);

    // LCD Screen
    const lcdScreenGeo = new THREE.PlaneGeometry(0.2, 0.12);
    const lcdScreen = new THREE.Mesh(lcdScreenGeo, this.cyanLcdMat);
    lcdScreen.position.set(0, 0.82, 0.45);
    lcdScreen.rotation.x = -0.6;
    this.scooterGroup.add(lcdScreen);

    // 3. FLOORBOARD DECK & BATTERY BODY
    const floorGeo = new THREE.BoxGeometry(0.44, 0.08, 0.75);
    const floorMesh = new THREE.Mesh(floorGeo, this.blackPlasticMat);
    floorMesh.position.set(0, -0.25, 0.1);
    floorMesh.receiveShadow = true;
    this.scooterGroup.add(floorMesh);

    // 4. REAR SEAT & SIDE PANELS
    const seatGeo = new THREE.BoxGeometry(0.42, 0.14, 0.65);
    const seatMesh = new THREE.Mesh(seatGeo, this.blackPlasticMat);
    seatMesh.position.set(0, 0.25, -0.3);
    seatMesh.castShadow = true;
    this.scooterGroup.add(seatMesh);

    // Passenger Pillion Seat
    const pillionGeo = new THREE.BoxGeometry(0.34, 0.08, 0.3);
    const pillionMesh = new THREE.Mesh(pillionGeo, this.blackPlasticMat);
    pillionMesh.position.set(0, 0.36, -0.68);
    this.scooterGroup.add(pillionMesh);

    // Side Emerald Body Panels with White S
    const sidePanelGeo = new THREE.BoxGeometry(0.46, 0.38, 0.55);
    const sidePanel = new THREE.Mesh(sidePanelGeo, this.bodyMaterial);
    sidePanel.position.set(0, 0.02, -0.32);
    sidePanel.castShadow = true;
    this.scooterGroup.add(sidePanel);

    // Rear Tubular Cargo Rack
    const rackGeo = new THREE.TorusGeometry(0.22, 0.015, 8, 16, Math.PI);
    const rackMesh = new THREE.Mesh(rackGeo, this.blackGlossMat);
    rackMesh.position.set(0, 0.35, -0.85);
    rackMesh.rotation.x = Math.PI / 2;
    this.scooterGroup.add(rackMesh);

    // Rear Tail Bar Light
    const tailLightGeo = new THREE.BoxGeometry(0.24, 0.05, 0.04);
    const tailLightMat = new THREE.MeshBasicMaterial({ color: 0xff0022 });
    const tailLight = new THREE.Mesh(tailLightGeo, tailLightMat);
    tailLight.position.set(0, 0.34, -0.92);
    this.scooterGroup.add(tailLight);

    // 5. WHEELS & SUSPENSION
    // Front Wheel
    const frontWheel = this.createWheel();
    frontWheel.position.set(0, -0.32, 0.72);
    this.scooterGroup.add(frontWheel);

    // Front Fork
    const forkGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.45);
    const forkL = new THREE.Mesh(forkGeo, this.rimMat);
    forkL.position.set(-0.16, -0.15, 0.72);
    this.scooterGroup.add(forkL);
    const forkR = forkL.clone();
    forkR.position.x = 0.16;
    this.scooterGroup.add(forkR);

    // Rear Wheel (Hub Motor)
    const rearWheel = this.createWheel(true);
    rearWheel.position.set(0, -0.32, -0.65);
    this.scooterGroup.add(rearWheel);

    // Rear Shocks
    const shockGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.35);
    const shockL = new THREE.Mesh(shockGeo, this.blackGlossMat);
    shockL.position.set(-0.19, -0.05, -0.65);
    this.scooterGroup.add(shockL);
    const shockR = shockL.clone();
    shockR.position.x = 0.19;
    this.scooterGroup.add(shockR);

    // Rear Hugger Fender
    const fenderGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.22, 16, 1, false, 0, Math.PI);
    const fenderMesh = new THREE.Mesh(fenderGeo, this.blackPlasticMat);
    fenderMesh.rotation.z = Math.PI / 2;
    fenderMesh.rotation.y = Math.PI;
    fenderMesh.position.set(0, -0.22, -0.65);
    this.scooterGroup.add(fenderMesh);

    this.scene.add(this.scooterGroup);
  }

  createWheel(isHubMotor = false) {
    const wheelGroup = new THREE.Group();

    // Tire
    const tireGeo = new THREE.TorusGeometry(0.24, 0.07, 12, 24);
    const tire = new THREE.Mesh(tireGeo, this.tireMat);
    tire.rotation.y = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Rim / Hub Motor Casing
    if (isHubMotor) {
      const hubGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 24);
      const hub = new THREE.Mesh(hubGeo, this.rimMat);
      hub.rotation.z = Math.PI / 2;
      wheelGroup.add(hub);
    } else {
      const rimGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.08, 16);
      const rim = new THREE.Mesh(rimGeo, this.rimMat);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      // Disc Brake Rotor
      const discGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.01, 16);
      const discMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.95, roughness: 0.1 });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.rotation.z = Math.PI / 2;
      disc.position.x = 0.05;
      wheelGroup.add(disc);
    }

    return wheelGroup;
  }

  setColor(hexColor) {
    this.currentColor = hexColor;
    if (this.bodyMaterial) {
      this.bodyMaterial.color.setHex(hexColor);
    }
  }

  toggleLights() {
    this.lightsOn = !this.lightsOn;
    if (this.spotLight) this.spotLight.intensity = this.lightsOn ? 3 : 0;
    if (this.ledMesh) {
      this.ledMesh.material.color.setHex(this.lightsOn ? 0xffffff : 0x333333);
    }
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (this.controls) this.controls.update();

    if (this.autoRotate && this.scooterGroup) {
      this.scooterGroup.rotation.y += 0.005;
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
