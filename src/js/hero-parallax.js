import { gsap } from 'gsap';

export function initHeroParallax() {
  const portrait = document.querySelector('.hero-image-portrait');
  const typographyContainer = document.querySelector('.hero-typography-container');
  const btnProjects = document.getElementById('btn-side-projects');
  const btnAbout = document.getElementById('btn-side-about');
  const glowLeft = document.getElementById('glow-left');
  const glowRight = document.getElementById('glow-right');

  if (!portrait) return;

  let activeSide = null; // null | 'left' | 'right'

  const activateLeftHover = () => {
    if (activeSide === 'left') return;
    activeSide = 'left';
    document.body.classList.add('hovering-left');
    document.body.classList.remove('hovering-right');

    gsap.to(portrait, {
      x: 260,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
    });

    if (btnAbout) {
      gsap.to(btnAbout, {
        x: 350,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.out',
      });
    }

    if (glowLeft) {
      gsap.to(glowLeft, {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
    if (glowRight) {
      gsap.to(glowRight, { opacity: 0, x: 40, duration: 0.3 });
    }
  };

  const activateRightHover = () => {
    if (activeSide === 'right') return;
    activeSide = 'right';
    document.body.classList.add('hovering-right');
    document.body.classList.remove('hovering-left');

    gsap.to(portrait, {
      x: -260,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
    });

    if (btnProjects) {
      gsap.to(btnProjects, {
        x: -350,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.out',
      });
    }

    if (glowRight) {
      gsap.to(glowRight, {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
    if (glowLeft) {
      gsap.to(glowLeft, { opacity: 0, x: -40, duration: 0.3 });
    }
  };

  const resetSideHover = () => {
    if (activeSide === null) return;
    activeSide = null;
    document.body.classList.remove('hovering-left', 'hovering-right');

    gsap.to(portrait, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
    });

    if (btnProjects) {
      gsap.to(btnProjects, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      });
    }

    if (btnAbout) {
      gsap.to(btnAbout, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      });
    }

    if (glowLeft) {
      gsap.to(glowLeft, {
        opacity: 0,
        x: -40,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    if (glowRight) {
      gsap.to(glowRight, {
        opacity: 0,
        x: 40,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const checkScrollVisibility = () => {
    const currentY = window.lenis ? window.lenis.scroll : window.scrollY;
    const inHeroSection = currentY < 150;

    if (!inHeroSection) {
      resetSideHover();
      if (btnProjects) {
        btnProjects.style.opacity = '0';
        btnProjects.style.pointerEvents = 'none';
        btnProjects.style.transform = 'translateY(-50%) scale(0.85)';
      }
      if (btnAbout) {
        btnAbout.style.opacity = '0';
        btnAbout.style.pointerEvents = 'none';
        btnAbout.style.transform = 'translateY(-50%) scale(0.85)';
      }
      if (glowLeft) {
        glowLeft.style.opacity = '0';
        glowLeft.style.pointerEvents = 'none';
      }
      if (glowRight) {
        glowRight.style.opacity = '0';
        glowRight.style.pointerEvents = 'none';
      }
    } else {
      if (activeSide === null) {
        if (btnProjects) {
          btnProjects.style.opacity = '1';
          btnProjects.style.pointerEvents = 'auto';
          btnProjects.style.transform = 'translateY(-50%) scale(1)';
        }
        if (btnAbout) {
          btnAbout.style.opacity = '1';
          btnAbout.style.pointerEvents = 'auto';
          btnAbout.style.transform = 'translateY(-50%) scale(1)';
        }
      }
    }
  };

  window.addEventListener('scroll', checkScrollVisibility, { passive: true });
  if (window.lenis) window.lenis.on('scroll', checkScrollVisibility);

  // Full-height 260px side strip hover detection (Hero Section Only)
  let mouseTicking = false;
  window.addEventListener('mousemove', (e) => {
    if (mouseTicking) return;
    mouseTicking = true;

    requestAnimationFrame(() => {
      mouseTicking = false;
      const currentY = window.lenis ? window.lenis.scroll : window.scrollY;
      if (currentY >= 150) return; // Ignore side hover when scrolled past Hero

      const sideZoneWidth = 260; // 260px wide side regions

      if (e.clientX < sideZoneWidth) {
        activateLeftHover();
      } else if (e.clientX > window.innerWidth - sideZoneWidth) {
        activateRightHover();
      } else {
        resetSideHover();

        // Micro mouse parallax in center region
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        gsap.to(portrait, {
          x: x * -3,
          y: y * -3,
          duration: 1.2,
          ease: 'power1.out',
          overwrite: 'auto'
        });

        if (typographyContainer) {
          gsap.to(typographyContainer, {
            x: x * 3,
            y: y * 3,
            duration: 1.4,
            ease: 'power1.out',
            overwrite: 'auto'
          });
        }
      }
    });
  }, { passive: true });

  if (btnProjects) {
    btnProjects.addEventListener('mouseenter', () => {
      const currentY = window.lenis ? window.lenis.scroll : window.scrollY;
      if (currentY < 150) activateLeftHover();
    });
  }

  if (btnAbout) {
    btnAbout.addEventListener('mouseenter', () => {
      const currentY = window.lenis ? window.lenis.scroll : window.scrollY;
      if (currentY < 150) activateRightHover();
    });
  }

  // Initial check
  checkScrollVisibility();
}

