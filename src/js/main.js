/* ==========================================================================
   ANUJ PORTFOLIO - MAIN ENTRY POINT & CYBER ENGINE SUITE
   ========================================================================== */

import { prepareOpeningSequence, playOpeningSequence } from './opening-sequence.js';
import { initFramerDocumentCards } from './document-cards.js';
import { FlowingMenuEngine, openPaperCertificateModal } from './flowing-menu.js';
import { ProjectCarouselController } from './project-carousel.js';
import { AudioFXEngine } from './audio-fx.js';
import { CommandPaletteEngine } from './command-palette.js';
import { initHatchEffect } from './hatch-effect.js';
import { mountMatrixLoader } from './mount-loader.jsx';
import { mountGalaxyBackground } from './mount-galaxy-bg.jsx';
import { mountHeroMatrixText } from './mount-matrix-text.jsx';
import { setupModals } from './modals.js';
import { MacbookScrollEngine } from './macbook-scroll.js';
import { initMagneticButtons } from './magnetic-effect.js';
import { initHeroParallax } from './hero-parallax.js';
import { initThreeBackground } from './three-bg.js';
import { initTerminalTyping } from './terminal-typing.js';
import { initScrollAnimations } from './scroll-animations.js';
import { IglooContactEngine } from './igloo-contact.js';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Lock GSAP Ticker Engine to 120 FPS High Refresh Rate
gsap.ticker.fps(120);
gsap.ticker.lagSmoothing(0);

document.addEventListener('DOMContentLoaded', async () => {
  // Mount Galaxy Background behind hero photo & Matrix Text Title
  mountGalaxyBackground();
  mountHeroMatrixText();
  // Initialize Lenis 120 FPS High Refresh Smooth Scroll & Sync with GSAP ScrollTrigger
  const lenis = new Lenis({
    duration: 0.9,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });
  window.lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Global Lenis Smooth Scroll Helper
  window.scrollToSection = (targetId) => {
    if (targetId === 0 || targetId === 'top' || targetId === 'hero') {
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.0 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    const el = typeof targetId === 'string' ? document.getElementById(targetId) : targetId;
    if (el) {
      if (window.lenis) {
        window.lenis.scrollTo(el, { duration: 1.0 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Set initial hidden states BEFORE intro fades
  prepareOpeningSequence();

  // Initialize Magnetic Hover Effects
  initMagneticButtons();
  initHeroParallax();
  initThreeBackground();
  initTerminalTyping();
  initScrollAnimations();

  // Initialize Hatch Canvas Effect
  initHatchEffect();

  // Bento Glow Tracking (Ultra-Optimized)
  document.querySelectorAll('.bento-glow-effect').forEach(card => {
    let rect = null;
    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    });
    card.addEventListener('mousemove', e => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
    card.addEventListener('mouseleave', () => {
      rect = null;
    });
  });

  // Mount React Matrix Encrypted Text Loader Animation
  mountMatrixLoader();

  // Listen for the custom event from IntroSequence to play animation
  document.addEventListener('intro:finished', () => {
    playOpeningSequence();
  });

  // Setup modals, PDF preview & contact copy
  setupModals();

  // Initialize Web Audio Synth Engine
  const audio = new AudioFXEngine();

  // Initialize Command Palette (Ctrl+K / Cmd+K)
  const cmdPalette = new CommandPaletteEngine(audio);

  // Initialize 3D Igloo-Style Interactive Contact Stage & Particle Engine
  const iglooContact = new IglooContactEngine(audio);

  // Recalculate Lenis scroll dimensions whenever DOM content or images load/resize
  const updateScrollDimensions = () => {
    if (window.lenis) window.lenis.resize();
    ScrollTrigger.refresh();
  };

  setTimeout(updateScrollDimensions, 300);
  setTimeout(updateScrollDimensions, 1200);

  window.addEventListener('load', updateScrollDimensions);

  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => {
      updateScrollDimensions();
    });
    const mainWrapper = document.getElementById('main-content-area');
    if (mainWrapper) resizeObserver.observe(mainWrapper);
    const scrollWrapper = document.querySelector('.scroll-content-wrapper');
    if (scrollWrapper) resizeObserver.observe(scrollWrapper);
  }



  // Compact mobile menu, separate from the desktop navigation so no controls are clipped.
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const closeMobileNav = () => {
    if (!mobileMenuToggle || !mobileNav) return;
    mobileNav.hidden = true;
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
  };

  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', () => {
      const willOpen = mobileNav.hidden;
      mobileNav.hidden = !willOpen;
      mobileMenuToggle.setAttribute('aria-expanded', String(willOpen));
    });

    mobileNav.querySelectorAll('[data-mobile-nav-link]').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    window.matchMedia('(min-width: 769px)').addEventListener('change', closeMobileNav);
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !mobileNav.hidden) closeMobileNav();
    });
  }

  // Initialize Framer 3D Document Folder cards perspective tilt
  initFramerDocumentCards();

  // Initialize 3-Slide Presentation Showcase Carousel for all 7 projects
  new ProjectCarouselController();

  // Setup HUD Header Buttons
  const btnCmd = document.getElementById('btn-cmd-palette');
  if (btnCmd) {
    btnCmd.addEventListener('click', () => {
      audio.playClick();
      cmdPalette.open();
    });
  }

  const btnCrt = document.getElementById('btn-crt-toggle');
  if (btnCrt) {
    btnCrt.addEventListener('click', () => {
      audio.playClick();
      document.body.classList.toggle('crt-active');
      const isCRT = document.body.classList.contains('crt-active');
      btnCrt.style.borderColor = isCRT ? 'var(--color-peach)' : 'rgba(255,255,255,0.2)';
    });
  }

  const btnAudio = document.getElementById('btn-audio-toggle');
  const audioIconLabel = document.getElementById('audio-icon-label');
  if (btnAudio && audioIconLabel) {
    btnAudio.addEventListener('click', () => {
      const isMuted = audio.toggleMute();
      audioIconLabel.textContent = isMuted ? '🔇' : '🔊';
    });
  }

  // Setup Sound Effects for Interactive Nav Buttons
  document.querySelectorAll('.nav-btn, .side-label, .metric-card, .filter-chip-btn').forEach(el => {
    el.addEventListener('mouseenter', () => audio.playHover());
    el.addEventListener('click', () => audio.playClick());
  });

  // Dynamic Typewriter / Role Cycler
  const roleTextEl = document.getElementById('role-cycler-text');
  if (roleTextEl) {
    const roles = [
      'AI & SOFTWARE DEVELOPER',
      'LLM CHATBOT ARCHITECT',
      'FULL-STACK ENGINEER',
      'DSA & ALGORITHM ENTHUSIAST',
      'DATA & PIPELINE AUTOMATOR'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const typeRole = () => {
      const currentRole = roles[roleIdx];
      
      if (isDeleting) {
        roleTextEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        roleTextEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === currentRole.length) {
        speed = 2200; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        speed = 400;
      }

      setTimeout(typeRole, speed);
    };

    setTimeout(typeRole, 1000);
  }

  // Metric Cards Modal Triggers
  document.querySelectorAll('.hero-metrics-grid .metric-card').forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.getAttribute('data-modal');
      const targetBtn = document.querySelector(`[data-modal="${modalId}"]`);
      if (targetBtn) targetBtn.click();
    });
  });

  // Load certificate media only after the visitor opens its drawer.
  let certificateItems = null;
  let certificateLoadPromise = null;
  let activeCertFilter = 'all';
  let activeCertSearch = '';

  const certFilterBtns = document.querySelectorAll('#certs-filter-bar .filter-chip-btn');
  const certSearchInput = document.getElementById('certs-search-input');

  const getCertificateItems = async () => {
    if (certificateItems) return certificateItems;
    if (!certificateLoadPromise) {
      certificateLoadPromise = fetch('/assets/certificates/certificates.json')
        .then(res => {
          if (!res.ok) throw new Error(`Certificate index returned ${res.status}`);
          return res.json();
        })
        .then(certData => certData.map(c => {
          let category = 'cs';
          const titleUpper = c.title.toUpperCase();
          if (titleUpper.includes('AWS')) category = 'aws';
          else if (titleUpper.includes('AZURE')) category = 'azure';
          else if (titleUpper.includes('ANTHROPIC') || titleUpper.includes('CLAUDE')) category = 'anthropic';

          return {
            title: c.title,
            image: c.image,
            filename: c.filename,
            category: category
          };
        }));
    }
    certificateItems = await certificateLoadPromise;
    return certificateItems;
  };

  const renderCertificates = async () => {
    const container = document.getElementById('certifications-grid-container');
    if (!container) return;

    try {
      const items = await getCertificateItems();
      let filtered = items;

      // Filter by category
      if (activeCertFilter === 'aws') filtered = items.filter(item => item.category === 'aws');
      if (activeCertFilter === 'azure') filtered = items.filter(item => item.category === 'azure');
      if (activeCertFilter === 'anthropic') filtered = items.filter(item => item.category === 'anthropic');
      if (activeCertFilter === 'cs') filtered = items.filter(item => item.category === 'cs');

      // Filter by search query
      if (activeCertSearch) {
        const query = activeCertSearch.toLowerCase();
        filtered = filtered.filter(item => item.title.toLowerCase().includes(query));
      }

      if (filtered.length === 0) {
        container.innerHTML = `<div class="certs-empty-state"><p>No certificates found matching "${activeCertSearch}".</p></div>`;
        return;
      }

      container.innerHTML = filtered.map((cert, idx) => `
        <div class="cert-grid-card" data-cert-idx="${idx}">
          <div class="cert-card-media">
            <img src="${cert.image}" alt="${cert.title}" loading="lazy" />
            <div class="cert-card-overlay">
              <span class="cert-view-badge">VIEW DIPLOMA ↗</span>
            </div>
          </div>
          <div class="cert-card-info">
            <span class="cert-category-tag">${cert.category.toUpperCase()}</span>
            <h4 class="cert-card-title">${cert.title}</h4>
          </div>
        </div>
      `).join('');

      // Add click listener to open 3D Paper Modal on card click
      container.querySelectorAll('.cert-grid-card').forEach((card, idx) => {
        card.addEventListener('click', () => {
          const item = filtered[idx];
          if (item) {
            openPaperCertificateModal(item.title, item.image);
          }
        });
      });

    } catch (err) {
      container.innerHTML = '<p class="cert-loading-state">Unable to load certifications. Please try again.</p>';
      console.error('Failed to load certificates index:', err);
    }
  };

  document.addEventListener('portfolio:modalopen', event => {
    if (event.detail.id === 'modal-artworks' && !certificateItems) renderCertificates();
  });

  certFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeCertFilter = btn.getAttribute('data-cert-filter');
      certFilterBtns.forEach(chip => chip.classList.remove('active'));
      btn.classList.add('active');
      renderCertificates();
    });
  });

  if (certSearchInput) {
    certSearchInput.addEventListener('input', (e) => {
      activeCertSearch = e.target.value.trim();
      renderCertificates();
    });
  }
});
