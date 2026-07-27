import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // Animate About Section Cards safely
  const aboutGrid = document.querySelector('.about-grid');
  if (aboutGrid) {
    gsap.fromTo('.about-card', 
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: {
          trigger: '.about-grid',
          start: 'top 95%',
          toggleActions: 'play none none none',
          onEnter: () => {
            gsap.to('.about-card', { opacity: 1, y: 0, duration: 0.5 });
          }
        }
      }
    );
    // Safety check: Ensure cards are visible after 500ms regardless of ScrollTrigger state
    setTimeout(() => {
      gsap.to('.about-card', { opacity: 1, y: 0, duration: 0.4 });
    }, 600);
  }

  // Animate Tech Stack Marquee
  gsap.fromTo('.tech-stack-section .section-header', 
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.tech-stack-section',
        start: 'top 90%'
      }
    }
  );

  gsap.fromTo('.marquee-container', 
    { opacity: 0, scale: 0.95 },
    {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.tech-stack-section',
        start: 'top 80%'
      }
    }
  );
}
