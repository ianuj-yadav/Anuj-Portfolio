/* ==========================================================================
   REACT BITS - FLOWING MENU COMPONENT ENGINE (WEBSAFE CERTIFICATE PREVIEW)
   ========================================================================== */

import { gsap } from 'gsap';

export class FlowingMenuEngine {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.items = options.items || [];
    this.speed = options.speed || 14;
    this.textColor = options.textColor || '#ffffff';
    this.bgColor = options.bgColor || '#120F17';
    this.marqueeBgColor = options.marqueeBgColor || '#E8A589';
    this.marqueeTextColor = options.marqueeTextColor || '#120F17';
    this.borderColor = options.borderColor || 'rgba(255, 255, 255, 0.08)';
    
    this.animationDefaults = { duration: 0.5, ease: 'expo' };
    this.setupViewerModal();
    this.render();
  }

  findClosestEdge(mouseX, mouseY, width, height) {
    const topEdgeDist = this.distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = this.distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  }

  distMetric(x, y, x2, y2) {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  }

  setupViewerModal() {
    const viewerModal = document.getElementById('modal-cert-viewer');
    const closeBtn = document.getElementById('paper-close-btn');

    if (viewerModal && closeBtn && !viewerModal.dataset.viewerControlsBound) {
      viewerModal.dataset.viewerControlsBound = 'true';
      closeBtn.addEventListener('click', () => {
        gsap.to('#paper-certificate-card', {
          rotateX: 45,
          scale: 0.8,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => {
            if (window.portfolioModalManager) {
              window.portfolioModalManager.close(viewerModal);
            } else {
              viewerModal.classList.remove('active');
            }
          }
        });
      });

      viewerModal.addEventListener('click', (e) => {
        if (e.target === viewerModal) {
          gsap.to('#paper-certificate-card', {
            rotateX: 45,
            scale: 0.8,
            opacity: 0,
            duration: 0.35,
            ease: 'power2.in',
            onComplete: () => {
              if (window.portfolioModalManager) {
                window.portfolioModalManager.close(viewerModal);
              } else {
                viewerModal.classList.remove('active');
              }
            }
          });
        }
      });
    }
  }

  openPaperCertificateModal(title, imageSrc) {
    openPaperCertificateModal(title, imageSrc);
  }

  render() {
    this.container.innerHTML = '';

    const menuWrap = document.createElement('div');
    menuWrap.className = 'menu-wrap';

    const menuNav = document.createElement('nav');
    menuNav.className = 'menu';

    this.items.forEach((item, index) => {
      const menuItem = document.createElement('div');
      menuItem.className = 'menu__item';

      const itemLink = document.createElement('a');
      itemLink.className = 'menu__item-link';
      itemLink.textContent = item.text;

      // Click to open 3D Paper Modal
      itemLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openPaperCertificateModal(item.text, item.image);
      });

      // Marquee overlay container
      const marquee = document.createElement('div');
      marquee.className = 'marquee';

      const marqueeInnerWrap = document.createElement('div');
      marqueeInnerWrap.className = 'marquee__inner-wrap';

      const marqueeInner = document.createElement('div');
      marqueeInner.className = 'marquee__inner';
      marqueeInner.setAttribute('aria-hidden', 'true');

      for (let i = 0; i < 4; i++) {
        const marqueePart = document.createElement('div');
        marqueePart.className = 'marquee__part';

        const span = document.createElement('span');
        span.textContent = item.text;

        const imgDiv = document.createElement('div');
        imgDiv.className = 'marquee__img';
        imgDiv.style.backgroundImage = `url(${item.image})`;

        marqueePart.appendChild(span);
        marqueePart.appendChild(imgDiv);
        marqueeInner.appendChild(marqueePart);
      }

      marqueeInnerWrap.appendChild(marqueeInner);
      marquee.appendChild(marqueeInnerWrap);

      menuItem.appendChild(itemLink);
      menuItem.appendChild(marquee);
      menuNav.appendChild(menuItem);

      // GSAP Marquee Animation
      this.initItemAnimation(menuItem, marquee, marqueeInner);
    });

    menuWrap.appendChild(menuNav);
    this.container.appendChild(menuWrap);
  }

  initItemAnimation(menuItem, marquee, marqueeInner) {
    let edge = 'top';

    const marqueeTween = gsap.to(marqueeInner, {
      xPercent: -50,
      repeat: -1,
      duration: this.speed,
      ease: 'none'
    }).totalProgress(Math.random());

    menuItem.addEventListener('mouseenter', (ev) => {
      const rect = menuItem.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      edge = this.findClosestEdge(x, y, rect.width, rect.height);

      gsap.timeline({ defaults: this.animationDefaults })
        .set(marquee, { yPercent: edge === 'top' ? -101 : 101 })
        .set(marqueeInner, { yPercent: edge === 'top' ? 101 : -101 })
        .to([marquee, marqueeInner], { yPercent: 0 });
    });

    menuItem.addEventListener('mouseleave', (ev) => {
      const rect = menuItem.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      edge = this.findClosestEdge(x, y, rect.width, rect.height);

      gsap.timeline({ defaults: this.animationDefaults })
        .to(marquee, { yPercent: edge === 'top' ? -101 : 101 })
        .to(marqueeInner, { yPercent: edge === 'top' ? 101 : -101 });
    });
  }
}

export function openPaperCertificateModal(title, imageSrc) {
  const viewerModal = document.getElementById('modal-cert-viewer');
  const cardEl = document.getElementById('paper-certificate-card');
  const titleEl = document.getElementById('paper-cert-title');
  const imgEl = document.getElementById('paper-cert-img');
  const downloadEl = document.getElementById('paper-cert-download');

  if (!viewerModal || !imgEl) return;

  titleEl.textContent = title;
  imgEl.src = imageSrc;
  downloadEl.href = imageSrc;

  // Ensure modal close listener is bound
  const closeBtn = document.getElementById('paper-close-btn');
  if (closeBtn && !viewerModal.dataset.viewerControlsBound) {
    viewerModal.dataset.viewerControlsBound = 'true';
    const closeHandler = () => {
      gsap.to('#paper-certificate-card', {
        rotateX: 45,
        scale: 0.8,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          if (window.portfolioModalManager) {
            window.portfolioModalManager.close(viewerModal);
          } else {
            viewerModal.classList.remove('active');
          }
        }
      });
    };
    closeBtn.addEventListener('click', closeHandler);
    viewerModal.addEventListener('click', (e) => {
      if (e.target === viewerModal) closeHandler();
    });
  }

  if (window.portfolioModalManager) {
    window.portfolioModalManager.open(viewerModal, document.activeElement);
  } else {
    viewerModal.classList.add('active');
  }

  // Smooth Paper Unfolding 3D Animation
  gsap.fromTo(cardEl, 
    { rotateX: -60, scale: 0.7, opacity: 0, y: -40 },
    { rotateX: 0, scale: 1, opacity: 1, y: 0, duration: 0.65, ease: 'back.out(1.2)' }
  );
}
