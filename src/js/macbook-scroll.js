/* ==========================================================================
   ACETERNITY 3D MACBOOK SCROLL ENGINE (120 FPS HIGH PERFORMANCE)
   - Scroll-driven 3D Lid unfold rotation (-32deg -> 0deg)
   - Realistic Metallic Aluminum Chassis, Backlit Keyboard & Trackpad
   - Integrated Developer Profile Screen inside Macbook Display
   ========================================================================== */

export class MacbookScrollEngine {
  constructor(sectionId = 'about') {
    this.section = document.getElementById(sectionId);
    if (!this.section) return;

    this.lid = this.section.querySelector('.macbook-lid-interactive');
    this.screenTitle = this.section.querySelector('.macbook-scroll-title');
    if (!this.lid) return;

    this.initScrollListener();
  }

  initScrollListener() {
    let ticking = false;

    const update3DTransform = () => {
      if (!this.section || !this.lid) return;

      const rect = this.section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress from 0 (entry) to 1 (passed)
      const totalDistance = rect.height + viewportHeight;
      const currentScroll = viewportHeight - rect.top;
      let progress = Math.max(0, Math.min(1, currentScroll / totalDistance));

      // Interpolate lid open angle: starts at -32deg, unfolds to 0deg
      // Lid opens between progress 0.15 and 0.5
      let openProgress = Math.max(0, Math.min(1, (progress - 0.12) / 0.35));
      
      // Easing function for smooth mechanical lid open
      const easedOpen = 1 - Math.pow(1 - openProgress, 3);
      const rotateX = -32 + (easedOpen * 32); // -32deg -> 0deg
      const opacity = Math.min(1, openProgress * 1.5);
      const scale = 0.82 + (easedOpen * 0.18); // 0.82 -> 1.0

      // Apply GPU-accelerated 3D transform
      this.lid.style.transform = `perspective(1200px) rotateX(${rotateX}deg) scale(${scale})`;
      this.lid.style.opacity = opacity;

      // Optional text float fade
      if (this.screenTitle) {
        const titleTranslateY = (1 - easedOpen) * -30;
        this.screenTitle.style.transform = `translateY(${titleTranslateY}px)`;
        this.screenTitle.style.opacity = Math.min(1, progress * 2.5);
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update3DTransform);
        ticking = true;
      }
    }, { passive: true });

    // Initial trigger
    update3DTransform();
  }
}
