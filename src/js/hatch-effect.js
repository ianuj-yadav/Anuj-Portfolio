/* ==========================================================================
   HATCH EFFECT CANVAS GENERATOR
   - Translates image luminance into a pencil-style cross-hatch.
   - Applies shimmering wave animation for dynamic portfolio backgrounds.
   ========================================================================== */

export function initHatchEffect() {
  const canvas = document.getElementById('hero-hatch-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d', { alpha: true });
  
  // JSON Parameters derived from user request
  const params = {
    renderMode: "hatch",
    bgMode: "none",
    cellSize: 9,
    coverage: 100,
    invert: false,
    contrast: 158,
    density: 20,
    animated: true,
    animStyle: "shimmer",
    animSpeed: { enabled: true, intensity: 100 },
    animIntensity: { enabled: true, intensity: 60 }
  };

  let imgData = null;
  let animationId = null;
  let startTime = Date.now();
  let baseLumaMap = [];

  const sourceImage = new Image();
  sourceImage.crossOrigin = "Anonymous";
  sourceImage.src = "/assets/anuj-poly-cutout.png"; // User's portrait image
  
  sourceImage.onload = () => {
    // Wait for the next tick to ensure layout is ready
    setTimeout(() => {
      init();
    }, 100);
  };

  function applyContrast(data, contrast) {
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
      // Don't modify alpha channel (data[i+3])
      if (data[i+3] > 0) {
        data[i] = factor * (data[i] - 128) + 128;
        data[i+1] = factor * (data[i+1] - 128) + 128;
        data[i+2] = factor * (data[i+2] - 128) + 128;
      }
    }
  }

  function init() {
    // The portrait is usually around 640x800 logic inside canvas-stage.
    canvas.width = sourceImage.width;
    canvas.height = sourceImage.height;
    
    // Draw original and extract data to an offscreen canvas
    const offCtx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    offCtx.canvas.width = canvas.width;
    offCtx.canvas.height = canvas.height;
    offCtx.drawImage(sourceImage, 0, 0);
    
    imgData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Apply contrast
    applyContrast(imgData.data, params.contrast - 100);
    
    // Calculate base luminance map for performance
    const size = params.cellSize;
    const data = imgData.data;
    const w = canvas.width;
    const h = canvas.height;
    
    baseLumaMap = [];
    
    for (let y = 0; y < h; y += size) {
      let row = [];
      for (let x = 0; x < w; x += size) {
        let r = 0, g = 0, b = 0, a = 0, count = 0;
        const step = Math.max(1, Math.floor(size / 3)); 
        for (let cy = y; cy < y + size && cy < h; cy += step) {
          for (let cx = x; cx < x + size && cx < w; cx += step) {
            const idx = (cy * w + cx) * 4;
            a += data[idx + 3];
            if (data[idx + 3] > 0) {
                r += data[idx];
                g += data[idx + 1];
                b += data[idx + 2];
                count++;
            }
          }
        }
        
        let avgAlpha = count > 0 ? (a / (count * 255)) : 0;
        
        if (count > 0) { 
          r /= count; g /= count; b /= count; 
          row.push({
            luma: getLuminance(r, g, b),
            alpha: avgAlpha
          });
        } else {
          row.push(null); // transparent area
        }
      }
      baseLumaMap.push(row);
    }
    
    if (params.animated && params.animStyle === 'shimmer') {
      if (animationId) cancelAnimationFrame(animationId);
      startTime = Date.now();
      renderLoop();
    } else {
      renderFrame(0);
    }
  }

  function getLuminance(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

  function drawHatch(x, y, size, luma, time, alpha) {
    let nLuma = luma / 255;
    
    if (params.invert) nLuma = 1 - nLuma;
    
    if (params.animated && params.animStyle === 'shimmer') {
      const speed = params.animSpeed.intensity / 50;
      const intensity = params.animIntensity.intensity / 100;
      const wave = Math.sin(x * 0.05 + time * speed) * Math.cos(y * 0.05 + time * speed * 0.8);
      nLuma += wave * intensity * 0.2;
      nLuma = Math.max(0, Math.min(1, nLuma));
    }

    const darkness = 1 - nLuma;
    
    // Instead of drawing black/white, we'll draw with the brand colors to make it look native.
    // Or just white for dark background.
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`; 
    ctx.lineWidth = Math.max(0.5, size * 0.08); 
    ctx.lineCap = 'round';
    
    const d = Math.max(1, params.density / 10);
    const steps = Math.max(2, Math.floor(size / 2 * d));
    const stepSize = size / steps;

    ctx.beginPath();
    
    // Layer 1: Diagonal /
    if (darkness > 0.2) {
      for (let i = -steps; i <= steps * 2; i++) {
        ctx.moveTo(x + i * stepSize, y);
        ctx.lineTo(x + i * stepSize - size, y + size);
      }
    }
    
    // Layer 2: Diagonal \
    if (darkness > 0.4) {
      for (let i = -steps; i <= steps * 2; i++) {
        ctx.moveTo(x + i * stepSize, y);
        ctx.lineTo(x + i * stepSize + size, y + size);
      }
    }
    
    // Layer 3: Horizontal
    if (darkness > 0.6) {
      for (let i = 0; i <= steps; i++) {
        ctx.moveTo(x, y + i * stepSize);
        ctx.lineTo(x + size, y + i * stepSize);
      }
    }
    
    // Layer 4: Vertical
    if (darkness > 0.8) {
      for (let i = 0; i <= steps; i++) {
        ctx.moveTo(x + i * stepSize, y);
        ctx.lineTo(x + i * stepSize, y + size);
      }
    }
    
    ctx.stroke();
  }

  function renderFrame(time) {
    const w = canvas.width;
    const h = canvas.height;
    
    // Clear canvas entirely (transparent bg)
    ctx.clearRect(0, 0, w, h);
    
    const size = params.cellSize;
    
    let yi = 0;
    for (let y = 0; y < h; y += size) {
      let xi = 0;
      for (let x = 0; x < w; x += size) {
        if (params.coverage < 100 && (Math.random() * 100 > params.coverage)) continue;
        
        if (baseLumaMap[yi] && baseLumaMap[yi][xi] !== null && baseLumaMap[yi][xi] !== undefined) {
          const cell = baseLumaMap[yi][xi];
          drawHatch(x, y, size, cell.luma, time, cell.alpha);
        }
        xi++;
      }
      yi++;
    }
  }

  function renderLoop() {
    const time = (Date.now() - startTime) / 1000;
    renderFrame(time);
    animationId = requestAnimationFrame(renderLoop);
  }
}
