import gsap from 'gsap';

export function initMagneticButtons() {
  const magnets = document.querySelectorAll('.magnetic');
  
  magnets.forEach(magnet => {
    let position = null;

    magnet.addEventListener('mouseenter', () => {
      position = magnet.getBoundingClientRect();
    });

    magnet.addEventListener('mousemove', (e) => {
      if (!position) position = magnet.getBoundingClientRect();
      const x = e.clientX - position.left - position.width / 2;
      const y = e.clientY - position.top - position.height / 2;
      
      gsap.to(magnet, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto'
      });
      
      const text = magnet.querySelector('.magnetic-text');
      if (text) {
        gsap.to(text, {
          x: x * 0.1,
          y: y * 0.1,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    });

    magnet.addEventListener('mouseleave', () => {
      position = null;
      gsap.to(magnet, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.3)',
        overwrite: 'auto'
      });
      
      const text = magnet.querySelector('.magnetic-text');
      if (text) {
        gsap.to(text, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)',
          overwrite: 'auto'
        });
      }
    });
  });
}
