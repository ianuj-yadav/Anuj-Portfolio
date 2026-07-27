/* ==========================================================================
   ULTRA-OPTIMIZED ASCII ART DUAL-BUFFER CANVAS ENGINE (120 FPS)
   - Solid Deep Matte Dark Background (#0b0a10)
   - Base State: High-Resolution Monochrome ASCII Art Portrait
   - Spotlight Hover State: Vibrant RGB Color ASCII Art Reveal
   ========================================================================== */

import { AsciiArtEngine, ASCII_CHARSETS } from './ascii-art-engine.js';

export class ColorRevealEngine {
  constructor(canvasId, cursorId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d', { alpha: false, desynchronized: true });
    this.cursor = document.getElementById(cursorId);
    
    // Mouse tracking
    this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    this.time = 0;
    
    // Galekto Side Interactions
    this.portraitXOffset = 0;
    this.targetPortraitXOffset = 0;
    
    this.glowLeft = document.getElementById('glow-left');
    this.glowRight = document.getElementById('glow-right');
    
    // Liquid Flow Trail & Metaball Nodes
    this.flowNodes = [];
    this.ripples = [];
    this.particles = [];
    
    // Image & ASCII Assets
    this.images = {
      bwPortrait: new Image(),
      realColorPortrait: new Image()
    };

    this.asciiEngine = new AsciiArtEngine({
      charset: ASCII_CHARSETS.dense,
      resolution: 110 // High-detail ASCII character grid
    });

    this.asciiBwData = null;
    this.asciiColorData = null;
    
    this.isLoaded = false;
    this.init();
  }

  async init() {
    this.resize();
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize();
      }, 100);
    });
    
    const getRect = () => {
      if (!this.rect) this.rect = this.canvas.getBoundingClientRect();
      return this.rect;
    };

    const handleMove = (clientX, clientY) => {
      const rect = getRect();
      const newX = clientX - rect.left;
      const newY = clientY - rect.top;
      
      const dx = newX - this.mouse.targetX;
      const dy = newY - this.mouse.targetY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      this.mouse.targetX = newX;
      this.mouse.targetY = newY;

      // Add liquid flow node on movement
      if (speed > 1.5) {
        this.addFlowNode(newX, newY, Math.min(160, 90 + speed * 1.5));
      }
      
      // Spawn subtle gold & slate particles on move
      if (Math.random() < 0.4 && speed > 3) {
        this.spawnParticle(newX, newY);
      }

      // Fast CSS cursor movement
      if (this.cursor) {
        this.cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }
    };

    // Pointer tracking
    window.addEventListener('pointermove', (e) => handleMove(e.clientX, e.clientY), { passive: true });
    
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    const handleDown = (clientX, clientY) => {
      if (this.cursor) this.cursor.classList.add('active');
      const rect = getRect();
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;
      
      this.addFlowNode(clickX, clickY, 240);
      
      this.ripples.push({
        x: clickX,
        y: clickY,
        radius: 20,
        maxRadius: 260,
        alpha: 0.85
      });
    };

    window.addEventListener('pointerdown', (e) => handleDown(e.clientX, e.clientY), { passive: true });
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        handleDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('pointerup', () => {
      if (this.cursor) this.cursor.classList.remove('active');
    }, { passive: true });
    window.addEventListener('touchend', () => {
      if (this.cursor) this.cursor.classList.remove('active');
    }, { passive: true });

    // Spatial Side Strip Hover Triggers (260px full height side regions)
    window.addEventListener('mousemove', (e) => {
      const sideZoneWidth = 260;

      if (e.clientX < sideZoneWidth) {
        this.forceLeftHover = true;
        this.forceRightHover = false;
      } else if (e.clientX > window.innerWidth - sideZoneWidth) {
        this.forceLeftHover = false;
        this.forceRightHover = true;
      } else {
        this.forceLeftHover = false;
        this.forceRightHover = false;
      }
    }, { passive: true });

    // Load assets and build ASCII Data Grids
    const loadImg = (img, src) => new Promise((resolve) => {
      img.onload = () => resolve();
      img.src = src;
    });

    await Promise.all([
      loadImg(this.images.bwPortrait, '/assets/anuj-cutout-bw.png'),
      loadImg(this.images.realColorPortrait, '/assets/anuj-cutout-color.png')
    ]);

    // Process ASCII matrix from loaded images
    this.asciiBwData = this.asciiEngine.generateAsciiData(this.images.bwPortrait, 110);
    this.asciiColorData = this.asciiEngine.generateAsciiData(this.images.realColorPortrait, 110);

    this.isLoaded = true;
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    if (this.mouse.targetX === -1000) {
      this.mouse.x = this.width / 2;
      this.mouse.y = this.height / 2;
      this.mouse.targetX = this.width / 2;
      this.mouse.targetY = this.height / 2;
    }
  }

  addFlowNode(x, y, radius) {
    this.flowNodes.push({
      x,
      y,
      radius,
      maxRadius: radius,
      alpha: 1.0,
      life: 1.0,
      decay: 0.016 + Math.random() * 0.008,
      wobbleOffset: Math.random() * Math.PI * 2
    });

    if (this.flowNodes.length > 25) {
      this.flowNodes.shift();
    }
  }

  spawnParticle(x, y) {
    this.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 2.2,
      vy: (Math.random() - 0.5) * 2.2 - 0.8,
      radius: Math.random() * 2.2 + 1.0,
      alpha: 0.85,
      color: Math.random() > 0.4 ? 'rgba(232, 165, 137, ' : 'rgba(216, 222, 233, '
    });

    if (this.particles.length > 30) {
      this.particles.shift();
    }
  }

  update() {
    this.time += 0.025;

    // Fast cursor interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.18;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.18;

    // Galekto Side Hover Logic
    let isLeftHover = this.forceLeftHover || false;
    let isRightHover = this.forceRightHover || false;

    if (this.width > 768 && window.scrollY < this.height * 0.8) {
      if (isLeftHover) {
        this.targetPortraitXOffset = 260;
      } else if (isRightHover) {
        this.targetPortraitXOffset = -260;
      } else {
        this.targetPortraitXOffset = 0;
      }
    } else {
      this.targetPortraitXOffset = 0;
    }

    this.portraitXOffset += (this.targetPortraitXOffset - this.portraitXOffset) * 0.08;

    if (this.glowLeft) {
      this.glowLeft.classList.toggle('glow-visible-left', isLeftHover);
    }
    if (this.glowRight) {
      this.glowRight.classList.toggle('glow-visible-right', isRightHover);
    }
    document.body.classList.toggle('hovering-left', isLeftHover);
    document.body.classList.toggle('hovering-right', isRightHover);

    // Update liquid flow nodes
    for (let i = this.flowNodes.length - 1; i >= 0; i--) {
      const node = this.flowNodes[i];
      node.life -= node.decay;
      node.radius = node.maxRadius * Math.pow(node.life, 0.7);
      
      if (node.life <= 0) {
        this.flowNodes.splice(i, 1);
      }
    }

    // Update ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += 6.5;
      r.alpha -= 0.025;
      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.025;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    if (!this.isLoaded) return;

    // Clear main canvas scaled by dpr
    this.ctx.save();
    this.ctx.scale(this.dpr, this.dpr);

    // ==========================================
    // SOLID CLEAN DARK BACKGROUND (#0b0a10)
    // ==========================================
    this.ctx.fillStyle = '#0b0a10';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Subtle ambient background grid accent lines
    this.drawSubtleSolidGrid();

    // Determine portrait render size
    const targetH = this.height * 0.94;
    const imgRatio = (this.asciiBwData?.aspect) || 0.8;
    const renderW = targetH * imgRatio;

    // ==========================================
    // PASS 1: MONOCHROME ASCII ART PORTRAIT (SLATE/SILVER ASCII)
    // ==========================================
    if (this.asciiBwData) {
      this.asciiEngine.renderAsciiToCanvas(
        this.ctx,
        this.asciiBwData,
        renderW,
        targetH,
        this.dpr,
        {
          colored: false,
          color: 'rgba(180, 185, 200, 0.85)',
          xOffset: this.portraitXOffset
        }
      );
    }

    // ==========================================
    // PASS 2: LIQUID CLIP MASK & COLORED RGB ASCII ART SPOTLIGHT
    // ==========================================
    this.ctx.save();
    this.ctx.beginPath();

    // Liquid spotlight head
    const headRadius = 140 + Math.sin(this.time * 3) * 10;
    this.drawWobblyCircle(this.mouse.x, this.mouse.y, headRadius, 0.2, 8);

    // Flow nodes
    this.flowNodes.forEach(node => {
      this.drawWobblyCircle(node.x, node.y, node.radius, 0.22, 6, node.wobbleOffset);
    });

    // Ripples
    this.ripples.forEach(r => {
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    });

    this.ctx.clip();

    // Solid dark spotlight background tone
    this.ctx.fillStyle = '#0f0e18';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Render full RGB Colored ASCII Art inside Spotlight
    if (this.asciiColorData) {
      this.asciiEngine.renderAsciiToCanvas(
        this.ctx,
        this.asciiColorData,
        renderW,
        targetH,
        this.dpr,
        {
          colored: true,
          xOffset: this.portraitXOffset
        }
      );
    }

    this.ctx.restore();

    // ==========================================
    // PASS 3: PARTICLES
    // ==========================================
    this.particles.forEach(p => {
      this.ctx.beginPath();
      this.ctx.fillStyle = `${p.color}${p.alpha})`;
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.restore();
  }

  drawSubtleSolidGrid() {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    this.ctx.lineWidth = 1;

    const step = 80;
    for (let x = 0; x < this.width; x += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  drawWobblyCircle(centerX, centerY, baseRadius, wobbleAmount, numPoints = 8, phaseShift = 0) {
    const angleStep = (Math.PI * 2) / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
      const angle = i * angleStep;
      const distortion = Math.sin(angle * 3 + this.time * 2 + phaseShift) * wobbleAmount * baseRadius;
      const r = baseRadius + distortion;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        const prevAngle = (i - 1) * angleStep;
        const prevDist = Math.sin(prevAngle * 3 + this.time * 2 + phaseShift) * wobbleAmount * baseRadius;
        const prevR = baseRadius + prevDist;
        const cpX = centerX + Math.cos((angle + prevAngle) / 2) * ((r + prevR) / 2 + 15);
        const cpY = centerY + Math.sin((angle + prevAngle) / 2) * ((r + prevR) / 2 + 15);
        this.ctx.quadraticCurveTo(cpX, cpY, x, y);
      }
    }
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}
