/* ==========================================================================
   CLEAN & ELEGANT OPENING REVEAL ANIMATION SEQUENCE
   ========================================================================== */

import { gsap } from 'gsap';

export function prepareOpeningSequence() {
  const introScreen = document.getElementById('intro-screen');
  const brandLogo = document.getElementById('brand-logo');
  const navBtns = document.querySelectorAll('.nav-btn');
  const topNav = document.querySelector('.top-nav');
  const heroPortrait = document.querySelector('.hero-static-portrait');
  const sideLeft = document.querySelector('.side-left');
  const sideRight = document.querySelector('.side-right');
  const typographyContainer = document.querySelector('.hero-typography-container');
  const bottomBar = document.querySelector('.bottom-hero-bar');
  
  const typoItems = typographyContainer ? Array.from(typographyContainer.children).filter(el => !el.classList.contains('title-ambient-glow')) : [];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (introScreen) introScreen.style.display = 'none';
    return;
  }

  // Ensure containers are visible but children are hidden initially
  if (topNav) gsap.set(topNav, { opacity: 1 });
  if (typographyContainer) gsap.set(typographyContainer, { opacity: 1 });

  // Set initial states for smooth entrance BEFORE fade finishes
  if (heroPortrait) gsap.set(heroPortrait, { y: 250, opacity: 0, scale: 0.92 });
  if (brandLogo) gsap.set(brandLogo, { y: -40, opacity: 0 });
  if (navBtns.length) gsap.set(navBtns, { y: -40, opacity: 0 });
  if (sideLeft) gsap.set(sideLeft, { x: -200, opacity: 0 });
  if (sideRight) gsap.set(sideRight, { x: 200, opacity: 0 });
  if (typoItems.length) gsap.set(typoItems, { y: 60, opacity: 0 });
  if (bottomBar) gsap.set(bottomBar, { y: 50, opacity: 0 });
}

export function playOpeningSequence() {
  const brandLogo = document.getElementById('brand-logo');
  const navBtns = document.querySelectorAll('.nav-btn');
  const heroPortrait = document.querySelector('.hero-static-portrait');
  const sideLeft = document.querySelector('.side-left');
  const sideRight = document.querySelector('.side-right');
  const typographyContainer = document.querySelector('.hero-typography-container');
  const bottomBar = document.querySelector('.bottom-hero-bar');
  
  const typoItems = typographyContainer ? Array.from(typographyContainer.children).filter(el => !el.classList.contains('title-ambient-glow')) : [];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.addLabel('start', 0)
    .to(heroPortrait, { y: 0, opacity: 1, scale: 1, duration: 2.5, ease: 'expo.out' }, 'start')
    .to(brandLogo, { y: 0, opacity: 1, duration: 1.5, ease: 'expo.out' }, 'start+=0.2')
    .to(navBtns, { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power3.out' }, 'start+=0.3')
    .to(sideLeft, { x: 0, opacity: 1, duration: 1.6, ease: 'expo.out' }, 'start+=0.5')
    .to(sideRight, { x: 0, opacity: 1, duration: 1.6, ease: 'expo.out' }, 'start+=0.5')
    .to(typoItems, { y: 0, opacity: 1, duration: 1.5, stagger: 0.15, ease: 'expo.out' }, 'start+=0.4')
    .to(bottomBar, { y: 0, opacity: 1, duration: 1.5, ease: 'expo.out' }, 'start+=0.8');
}

