/* ==========================================================================
   FRAMER 3D CONFIDENTIAL FOLDER CARD CONTROLLER
   - Interactive 3D Perspective Parallax Tilt & Specular Light Reflection
   - Staggered 3D Folder Flip & Document Slide-Out Micro-Interaction
   - Clean Boundary Clipping Prevention
   ========================================================================== */

import { gsap } from 'gsap';

export function initFramerDocumentCards() {
  const cards = document.querySelectorAll('.framer-doc-card');
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  cards.forEach(card => {
    const shine = card.querySelector('.card-shine');
    const folderCover = card.querySelector('.folder-cover-3d');
    const docSheet = card.querySelector('.confidential-doc-sheet');

    const title = card.querySelector('.card-title, .folder-project-title')?.textContent.trim() || 'project case study';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Open ${title} case study`);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    });

    if (!supportsHover) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate safe 3D parallax tilt angles (max 6deg)
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      // Apply subtle 3D card tilt
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        scale: 1.015,
        duration: 0.3,
        ease: 'power2.out'
      });

      // Move specular shine light reflection flare
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.18) 0%, transparent 65%)`;
      }
    });

    card.addEventListener('mouseenter', () => {
      // Clean, controlled folder cover flip open inside sleeve
      if (folderCover) {
        gsap.to(folderCover, {
          rotateY: -22,
          rotateX: 6,
          x: -8,
          duration: 0.4,
          ease: 'power2.out'
        });
      }

      // Internal confidential document sheet slide-out inside sleeve
      if (docSheet) {
        gsap.to(docSheet, {
          y: -24,
          rotate: 3,
          scale: 1.02,
          duration: 0.4,
          delay: 0.04,
          ease: 'power2.out'
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      // Reset 3D tilt & scale cleanly
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power3.out'
      });

      if (folderCover) {
        gsap.to(folderCover, {
          rotateY: 0,
          rotateX: 0,
          x: 0,
          duration: 0.35,
          ease: 'power2.inOut'
        });
      }

      if (docSheet) {
        gsap.to(docSheet, {
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 0.35,
          ease: 'power2.inOut'
        });
      }

      if (shine) {
        shine.style.background = 'none';
      }
    });
  });
}
