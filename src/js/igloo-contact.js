/* ==========================================================================
   IGLOO INC INSPIRED 3D INTERACTIVE CONTACT STAGE & PARTICLE MORPHING ENGINE
   ========================================================================== */

import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export class IglooContactEngine {
  constructor(audioEngine) {
    this.canvas = document.getElementById('igloo-contact-canvas');
    this.container = document.getElementById('igloo-stage-wrapper');
    if (!this.canvas || !this.container) return;

    this.audio = audioEngine;
    this.currentTab = 'github';
    this.soundEnabled = true;

    this.initThree();
    this.createStageGeometries();
    this.createParticleCloud();
    this.setupEvents();
    this.setupScrollTrigger();
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    
    const width = this.container.clientWidth || window.innerWidth || 1100;
    const height = this.container.clientHeight || 550;

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0, 2.5, 7.5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x1d5eff, 2.5);
    dirLight1.position.set(5, 10, 7);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff2a4b, 1.8);
    dirLight2.position.set(-5, -5, -5);
    this.scene.add(dirLight2);
  }

  createStageGeometries() {
    // 1. Outer 3D Metallic Ring (Igloo Torus Podium)
    const ringGeo = new THREE.TorusGeometry(3.0, 0.18, 32, 120);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x222030,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: false
    });
    this.stageRing = new THREE.Mesh(ringGeo, ringMat);
    this.stageRing.rotation.x = Math.PI / 2.2;
    this.stageRing.position.y = -1.2;
    this.scene.add(this.stageRing);

    // 2. Inner Glowing Halo Ring
    const innerRingGeo = new THREE.TorusGeometry(2.2, 0.04, 16, 80);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0xe8a589,
      wireframe: true
    });
    this.innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    this.innerRing.rotation.x = Math.PI / 2.2;
    this.innerRing.position.y = -1.1;
    this.scene.add(this.innerRing);

    // 3. Central Disc Platform Base
    const discGeo = new THREE.CylinderGeometry(2.8, 3.2, 0.2, 48);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x0f0e15,
      metalness: 0.9,
      roughness: 0.3
    });
    this.platformDisc = new THREE.Mesh(discGeo, discMat);
    this.platformDisc.position.y = -1.35;
    this.scene.add(this.platformDisc);
  }

  createParticleCloud() {
    this.particleCount = 3000;
    this.geometry = new THREE.BufferGeometry();

    // 4 Morphing Shape Generators
    this.shapePositions = {
      github: this.generateGitHubPoints(this.particleCount),
      linkedin: this.generateLinkedInPoints(this.particleCount),
      whatsapp: this.generateWhatsAppPoints(this.particleCount),
      email: this.generateEmailPoints(this.particleCount)
    };

    // Current positions buffer
    this.currentPositions = new Float32Array(this.shapePositions.github);
    this.targetPositions = new Float32Array(this.shapePositions.github);

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.currentPositions, 3));

    // Particle Color Array
    const colors = new Float32Array(this.particleCount * 3);
    for (let i = 0; i < this.particleCount; i++) {
      colors[i * 3] = 0.9;     // R
      colors[i * 3 + 1] = 0.65; // G
      colors[i * 3 + 2] = 0.54; // B
    }
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(this.geometry, material);
    this.particleSystem.position.y = 0.2;
    this.scene.add(this.particleSystem);
  }

  // --- Shape Generators ---
  generateGitHubPoints(count) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Octocat / 'G' Spiral Sphere Swarm
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.6 + (Math.sin(theta * 5) * 0.25);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) * 0.7;
    }
    return pos;
  }

  generateLinkedInPoints(count) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Square 'in' Box Cloud
      const u = (Math.random() - 0.5) * 2.8;
      const v = (Math.random() - 0.5) * 2.8;
      const w = (Math.random() - 0.5) * 0.8;

      pos[i * 3] = u;
      pos[i * 3 + 1] = v;
      pos[i * 3 + 2] = w;
    }
    return pos;
  }

  generateWhatsAppPoints(count) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Chat Bubble Double Torus Ring
      const angle = (i / count) * Math.PI * 2;
      const tubeR = 0.4 + (Math.random() * 0.2);
      const mainR = 1.5;

      const phi = Math.random() * Math.PI * 2;
      pos[i * 3] = (mainR + tubeR * Math.cos(phi)) * Math.cos(angle);
      pos[i * 3 + 1] = (mainR + tubeR * Math.cos(phi)) * Math.sin(angle);
      pos[i * 3 + 2] = tubeR * Math.sin(phi);
    }
    return pos;
  }

  generateEmailPoints(count) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Envelope Pyramidal Lattice
      const t = Math.random();
      const x = (Math.random() - 0.5) * 3.2;
      const y = (Math.random() - 0.5) * 2.0;
      const z = (Math.abs(x) * 0.4) - (Math.abs(y) * 0.2);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }

  switchTab(tabName) {
    if (!this.shapePositions[tabName] || this.currentTab === tabName) return;
    this.currentTab = tabName;

    const newTarget = this.shapePositions[tabName];
    const posAttr = this.geometry.attributes.position;
    const currentArray = posAttr.array;

    // Morph Particles via GSAP Tween Object
    const obj = { progress: 0 };
    const startArray = new Float32Array(currentArray);

    gsap.to(obj, {
      progress: 1,
      duration: 1.1,
      ease: 'power3.inOut',
      onUpdate: () => {
        const p = obj.progress;
        for (let i = 0; i < this.particleCount * 3; i++) {
          currentArray[i] = startArray[i] + (newTarget[i] - startArray[i]) * p;
        }
        posAttr.needsUpdate = true;
      }
    });

    // Rotate particle system on tab switch
    gsap.to(this.particleSystem.rotation, {
      y: this.particleSystem.rotation.y + Math.PI * 0.5,
      duration: 1.0,
      ease: 'power2.out'
    });

    if (this.audio && this.soundEnabled) {
      this.audio.playClick();
    }
  }

  setupEvents() {
    // Tab Clicks Listener
    const tabs = document.querySelectorAll('.igloo-tab');
    const statusText = document.getElementById('igloo-active-channel-text');

    const channelLabels = {
      github: 'ACTIVE CHANNEL: GITHUB (ianuj-yadav)',
      linkedin: 'ACTIVE CHANNEL: LINKEDIN (anuj-yadav)',
      whatsapp: 'ACTIVE CHANNEL: WHATSAPP (+91 7838042623)',
      email: 'ACTIVE CHANNEL: DIRECT EMAIL (ianujy@gmail.com)'
    };

    tabs.forEach(tab => {
      const handleTabActivate = () => {
        const tabName = tab.getAttribute('data-tab');
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.switchTab(tabName);
        if (statusText && channelLabels[tabName]) {
          statusText.textContent = channelLabels[tabName];
        }
      };

      tab.addEventListener('mouseenter', handleTabActivate);
      tab.addEventListener('click', handleTabActivate);
    });

    // Sound Button Listener
    const soundBtn = document.getElementById('igloo-sound-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        const icon = soundBtn.querySelector('.sound-icon');
        const text = soundBtn.querySelector('.sound-text');
        if (icon && text) {
          icon.textContent = this.soundEnabled ? '🔊' : '🔇';
          text.textContent = `Sound: ${this.soundEnabled ? 'ON' : 'OFF'}`;
        }
      });
    }

    // Pointer Parallax
    this.mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
      if (!this.container) return;
      const rect = this.container.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      }
    }, { passive: true });

    // Resize Handler
    const updateSize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth || window.innerWidth || 1100;
      const h = this.container.clientHeight || 550;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };

    window.addEventListener('resize', updateSize);
    window.addEventListener('load', updateSize);
    setTimeout(updateSize, 300);
    setTimeout(updateSize, 1000);

    if (window.ResizeObserver && this.container) {
      const ro = new ResizeObserver(updateSize);
      ro.observe(this.container);
    }
  }

  setupScrollTrigger() {
    if (!this.container) return;

    ScrollTrigger.create({
      trigger: this.container,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const p = self.progress;
        // Dynamic camera and ring motion on scroll
        this.stageRing.rotation.z = p * Math.PI * 1.5;
        this.innerRing.rotation.z = -p * Math.PI * 2;
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.001;

    // Smooth stage floating rotation
    this.stageRing.rotation.y = time * 0.35 + (this.mouse ? this.mouse.x * 0.4 : 0);
    this.innerRing.rotation.y = -time * 0.5;
    this.particleSystem.rotation.y += 0.004;

    // Gentle camera tilt towards pointer
    this.camera.position.x += (this.mouse.x * 0.8 - this.camera.position.x) * 0.05;
    this.camera.position.y += (2.5 + this.mouse.y * 0.5 - this.camera.position.y) * 0.05;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }
}
