import * as THREE from 'three';

export function initThreeBackground() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.zIndex = '0'; // Behind everything but above base background
  container.style.pointerEvents = 'none';
  document.body.prepend(container);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  // Visibility Pause Optimizer
  let isTabActive = true;
  document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
  });

  // Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 800;
  
  const posArray = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10; // Spread between -5 and 5
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.015,
    color: '#e8a589', // Peach accent color
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  camera.position.z = 3;

  // Mouse interactivity
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
  }, { passive: true });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isTabActive) return;

    const elapsedTime = clock.getElapsedTime();

    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;

    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.001;

    particlesMesh.position.x += (targetX - particlesMesh.position.x) * 0.05;
    particlesMesh.position.y += (-targetY - particlesMesh.position.y) * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
