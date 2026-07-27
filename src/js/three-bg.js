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
