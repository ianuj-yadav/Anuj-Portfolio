/* ==========================================================================
   REACT BITS - SMOOTH SILK WEBGL BACKGROUND ENGINE
   - Smooth, fluid silk fabric wave shader (No noise moire/static artifacts)
   - Color palette: #7B7481 (Slate Silk) with soft luminous highlights
   ========================================================================== */

import * as THREE from 'three';

export class SilkBackgroundEngine {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.speed = options.speed !== undefined ? options.speed : 5;
    this.scale = options.scale !== undefined ? options.scale : 1;
    this.hexColor = options.color || '#7B7481';
    this.noiseIntensity = options.noiseIntensity !== undefined ? options.noiseIntensity : 1.5;
    this.rotation = options.rotation !== undefined ? options.rotation : 0;

    this.color = new THREE.Color(this.hexColor);

    this.initThree();
    this.setupEvents();
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.uniforms = {
      uTime: { value: 0 },
      uColor: { value: this.color },
      uSpeed: { value: this.speed },
      uScale: { value: this.scale },
      uNoiseIntensity: { value: this.noiseIntensity },
      uRotation: { value: this.rotation },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }
    };

    const geometry = new THREE.PlaneGeometry(2, 2);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Smooth flowing silk GLSL shader without moire/static noise
    const fragmentShader = `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uSpeed;
      uniform float uScale;
      uniform float uNoiseIntensity;
      uniform float uRotation;
      uniform vec2 uResolution;
      uniform vec2 uMouse;

      varying vec2 vUv;

      // Smooth Simplex noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * frac(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
        
        float t = uTime * uSpeed * 0.08;
        
        // Smooth rotation
        float rad = uRotation;
        mat2 rot = mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
        st = rot * st;

        // Scale coords for smooth large silk waves
        st *= uScale * 1.1;

        // Interactive mouse offset
        vec2 mOffset = (uMouse - 0.5) * 0.2;
        st += mOffset;

        // Domain warping for smooth organic silk folds
        float n1 = snoise(st * (uNoiseIntensity * 0.8) + vec2(t * 0.4, t * 0.3));
        float n2 = snoise(st * (uNoiseIntensity * 1.2) - vec2(t * 0.3, n1 * 0.5));

        // Smooth wave function
        float fold1 = sin(st.x * 2.2 + n1 * 2.5 + t * 0.8);
        float fold2 = cos(st.y * 2.2 + n2 * 2.5 + t * 0.6);
        float silkWave = 0.5 + 0.5 * sin((fold1 + fold2) * 2.0 + t);

        // Color ramp: Dark Charcoal Slate -> Primary #7B7481 -> Soft Silk Highlight #B8B0C0
        vec3 darkSlate = vec3(0.12, 0.11, 0.14);
        vec3 silkBase = uColor;
        vec3 silkHighlight = vec3(0.74, 0.70, 0.78);

        vec3 color = mix(darkSlate, silkBase, smoothstep(0.1, 0.75, silkWave));
        color = mix(color, silkHighlight, pow(silkWave, 3.0) * 0.45);

        // Subtle ambient sheen
        float sheen = smoothstep(0.65, 0.95, silkWave) * 0.3;
        color += vec3(sheen);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    });

    const handlePointerMove = (x, y) => {
      this.uniforms.uMouse.value.set(x / window.innerWidth, 1.0 - (y / window.innerHeight));
      
      const cursor = document.getElementById('custom-cursor');
      if (cursor) {
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
      }
    };

    window.addEventListener('pointermove', (e) => handlePointerMove(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.uniforms.uTime.value += 0.016;
    this.renderer.render(this.scene, this.camera);
  }
}
