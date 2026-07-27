import React, { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Geometry, Program, Mesh, Vec2 } from "ogl";

export interface GalaxyProps {
  starSpeed?: number;
  density?: number;
  hueShift?: number;
  speed?: number;
  glowIntensity?: number;
  saturation?: number;
  mouseRepulsion?: boolean;
  repulsionStrength?: number;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  transparent?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const vertexShader = /* glsl */ `
  attribute vec3 position;
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  attribute vec3 aOffset;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uStarSpeed;
  uniform float uSpeed;
  uniform float uRotationSpeed;
  uniform vec2 uMouse;
  uniform float uMouseRepulsion;
  uniform float uRepulsionStrength;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    vAlpha = aAlpha;

    vec3 pos = position + aOffset;

    // Spiral rotation effect
    float dist = length(pos.xy);
    float angle = uTime * uRotationSpeed * 0.12 + (1.0 / (dist + 0.4)) * 0.18;
    float cosA = cos(angle);
    float sinA = sin(angle);
    mat2 rot = mat2(cosA, -sinA, sinA, cosA);
    pos.xy = rot * pos.xy;

    // Subtle Z depth floating
    pos.z += sin(uTime * uStarSpeed * 0.6 + dist * 3.0) * 0.12;

    // Mouse Repulsion Effect
    if (uMouseRepulsion > 0.5) {
      vec2 mouseWorld = uMouse * 4.0;
      vec2 dir = pos.xy - mouseWorld;
      float d = length(dir);
      if (d < 2.5 && d > 0.001) {
        float force = (1.0 - d / 2.5) * uRepulsionStrength * 0.3;
        pos.xy += (dir / d) * force;
      }
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size attenuation
    gl_PointSize = aSize * (340.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec3 vColor;
  varying float vAlpha;

  uniform float uTime;
  uniform float uGlowIntensity;
  uniform float uTwinkleIntensity;
  uniform float uHueShift;
  uniform float uSaturation;

  vec3 rgb2hsl(vec3 c) {
    float maxC = max(max(c.r, c.g), c.b);
    float minC = min(min(c.r, c.g), c.b);
    float delta = maxC - minC;
    float h = 0.0;
    float s = 0.0;
    float l = (maxC + minC) * 0.5;

    if (delta > 0.00001) {
      s = l < 0.5 ? delta / (maxC + minC) : delta / (2.0 - maxC - minC);
      if (c.r == maxC) {
        h = (c.g - c.b) / delta + (c.g < c.b ? 6.0 : 0.0);
      } else if (c.g == maxC) {
        h = (c.b - c.r) / delta + 2.0;
      } else {
        h = (c.r - c.g) / delta + 4.0;
      }
      h /= 6.0;
    }
    return vec3(h, s, l);
  }

  float hue2rgb(float p, float q, float t) {
    if (t < 0.0) t += 1.0;
    if (t > 1.0) t -= 1.0;
    if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
    if (t < 1.0 / 2.0) return q;
    if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
    return p;
  }

  vec3 hsl2rgb(vec3 hsl) {
    vec3 rgb;
    if (hsl.y == 0.0) {
      rgb = vec3(hsl.z);
    } else {
      float q = hsl.z < 0.5 ? hsl.z * (1.0 + hsl.y) : hsl.z + hsl.y - hsl.z * hsl.y;
      float p = 2.0 * hsl.z - q;
      rgb.r = hue2rgb(p, q, hsl.x + 1.0 / 3.0);
      rgb.g = hue2rgb(p, q, hsl.x);
      rgb.b = hue2rgb(p, q, hsl.x - 1.0 / 3.0);
    }
    return rgb;
  }

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Smooth glow halo
    float core = 1.0 - smoothstep(0.0, 0.5, dist);
    float glow = exp(-dist * 5.5) * uGlowIntensity * 1.8;
    float alpha = (core + glow) * vAlpha;

    // Twinkle animation
    float twinkle = 1.0 + sin(uTime * 3.5 + gl_FragCoord.x * 0.08 + gl_FragCoord.y * 0.08) * uTwinkleIntensity * 0.6;
    alpha *= twinkle;

    // Hue shift and saturation control
    vec3 hsl = rgb2hsl(vColor);
    hsl.x = fract(hsl.x + uHueShift / 360.0);
    if (uSaturation >= 0.0) {
      hsl.y = clamp(uSaturation, 0.0, 1.0);
    }
    vec3 color = hsl2rgb(hsl);

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`;

export const Galaxy: React.FC<GalaxyProps> = ({
  starSpeed = 0.5,
  density = 1,
  hueShift = 140,
  speed = 1,
  glowIntensity = 0.3,
  saturation = 0,
  mouseRepulsion = true,
  repulsionStrength = 2,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  transparent = true,
  className = "",
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<Vec2>(new Vec2(0, 0));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new Renderer({
      alpha: transparent,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, transparent ? 0 : 1);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 45 });
    camera.position.set(0, 0, 5);

    const scene = new Transform();

    // Particle Generation
    const numParticles = Math.floor(4500 * density);
    const position = new Float32Array(numParticles * 3);
    const aOffset = new Float32Array(numParticles * 3);
    const aSize = new Float32Array(numParticles);
    const aAlpha = new Float32Array(numParticles);
    const aColor = new Float32Array(numParticles * 3);

    const numArms = 4;
    const basePalette = [
      [0.4, 0.8, 1.0], // Cyan
      [0.6, 0.4, 1.0], // Purple/Violet
      [0.2, 0.9, 0.8], // Emerald/Teal
      [1.0, 0.9, 0.9], // Bright star white
      [0.9, 0.6, 0.4], // Warm accent
    ];

    for (let i = 0; i < numParticles; i++) {
      // Logarithmic Spiral Arms + Core Cluster
      const isCore = Math.random() < 0.25;
      let radius: number;
      let angle: number;

      if (isCore) {
        radius = Math.pow(Math.random(), 2) * 1.2;
        angle = Math.random() * Math.PI * 2;
      } else {
        const armIndex = i % numArms;
        const armOffset = (armIndex / numArms) * Math.PI * 2;
        const distance = Math.pow(Math.random(), 1.5) * 3.5;
        angle = distance * 1.5 + armOffset + (Math.random() - 0.5) * 0.6;
        radius = distance;
      }

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 0.8 * (1.0 / (radius * 0.5 + 1.0));

      aOffset[i * 3 + 0] = x;
      aOffset[i * 3 + 1] = y;
      aOffset[i * 3 + 2] = z;

      aSize[i] = 3.0 + Math.random() * 9.0;
      aAlpha[i] = 0.25 + Math.random() * 0.75;

      const colorChoice = basePalette[Math.floor(Math.random() * basePalette.length)];
      aColor[i * 3 + 0] = colorChoice[0];
      aColor[i * 3 + 1] = colorChoice[1];
      aColor[i * 3 + 2] = colorChoice[2];
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: position },
      aOffset: { size: 3, data: aOffset },
      aSize: { size: 1, data: aSize },
      aAlpha: { size: 1, data: aAlpha },
      aColor: { size: 3, data: aColor },
    });

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uStarSpeed: { value: starSpeed },
        uSpeed: { value: speed },
        uRotationSpeed: { value: rotationSpeed },
        uMouse: { value: mouseRef.current },
        uMouseRepulsion: { value: mouseRepulsion ? 1.0 : 0.0 },
        uRepulsionStrength: { value: repulsionStrength },
        uGlowIntensity: { value: glowIntensity },
        uTwinkleIntensity: { value: twinkleIntensity },
        uHueShift: { value: hueShift },
        uSaturation: { value: saturation },
      },
      transparent: true,
      depthTest: false,
    });

    const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
    mesh.setParent(scene);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.perspective({ aspect: w / h });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.set(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;
    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001 * speed;
      program.uniforms.uTime.value = elapsed;
      program.uniforms.uMouse.value = mouseRef.current;

      renderer.render({ scene, camera });
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    starSpeed,
    density,
    hueShift,
    speed,
    glowIntensity,
    saturation,
    mouseRepulsion,
    repulsionStrength,
    twinkleIntensity,
    rotationSpeed,
    transparent,
  ]);

  return (
    <div
      ref={containerRef}
      className={`galaxy-container ${className}`}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    />
  );
};

export default Galaxy;
