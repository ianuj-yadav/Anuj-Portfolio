/* ==========================================================================
   HIGH-PERFORMANCE ASCII ART CANVAS PRE-RENDERER
   - Converts Image pixel RGBA matrix into Monospace ASCII Art
   - Pre-renders ASCII text matrix into Offscreen Canvas Buffers (120 FPS)
   - Supports Monochrome (Slate/B&W) and RGB Colored ASCII modes
   ========================================================================== */

export const ASCII_CHARSETS = {
  standard: " .,:;i1tfLCG08@",
  blocks: " ░▒▓█",
  dense: " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  matrix: " ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ",
  dots: " ·•●",
};

export class AsciiArtEngine {
  constructor(options = {}) {
    this.charset = options.charset || ASCII_CHARSETS.dense;
    this.resolution = options.resolution || 120; // Number of columns
  }

  /**
   * Converts an Image object into a 2D Grid of ASCII Pixels
   */
  generateAsciiData(img, cols = this.resolution) {
    if (!img || !img.complete || img.naturalWidth === 0) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const charAspect = 0.55; // Aspect ratio of monospace font (width/height)
    
    const rows = Math.floor(cols * (imgHeight / imgWidth) * charAspect);

    canvas.width = cols;
    canvas.height = rows;

    // Draw scaled image to sample pixels
    ctx.drawImage(img, 0, 0, cols, rows);

    let imageData;
    try {
      imageData = ctx.getImageData(0, 0, cols, rows);
    } catch (e) {
      console.error('ASCII Engine: Unable to fetch image data', e);
      return null;
    }

    const data = imageData.data;
    const grid = [];

    for (let y = 0; y < rows; y++) {
      const row = [];
      for (let x = 0; x < cols; x++) {
        const idx = (y * cols + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        if (a < 15) {
          row.push({ char: ' ', r: 0, g: 0, b: 0, a: 0 });
          continue;
        }

        // Perceived luminance formula
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const charIdx = Math.floor(brightness * (this.charset.length - 1));
        const char = this.charset[charIdx] || ' ';

        row.push({ char, r, g, b, a: a / 255 });
      }
      grid.push(row);
    }

    return { grid, cols, rows, aspect: imgWidth / imgHeight };
  }

  /**
   * Pre-renders ASCII Grid onto a Target Canvas Context with given bounds
   */
  renderAsciiToCanvas(targetCtx, asciiData, width, height, dpr = 1, options = {}) {
    if (!asciiData || !asciiData.grid) return;

    const { grid, cols, rows } = asciiData;
    const isColored = options.colored || false;
    const defaultColor = options.color || 'rgba(216, 222, 233, 0.9)';
    const xOffset = options.xOffset || 0;

    targetCtx.save();

    const charW = width / cols;
    const charH = height / rows;
    const fontSize = Math.max(7, Math.min(charW * 1.85, charH * 1.2));

    targetCtx.font = `700 ${fontSize}px "Fira Code", monospace`;
    targetCtx.textAlign = 'center';
    targetCtx.textBaseline = 'middle';

    const startX = (targetCtx.canvas.width / dpr - width) / 2 + xOffset;
    const startY = targetCtx.canvas.height / dpr - height;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = grid[y][x];
        if (cell.char === ' ' || cell.a === 0) continue;

        const cx = startX + x * charW + charW / 2;
        const cy = startY + y * charH + charH / 2;

        if (isColored) {
          targetCtx.fillStyle = `rgba(${cell.r}, ${cell.g}, ${cell.b}, ${cell.a})`;
        } else {
          targetCtx.fillStyle = defaultColor;
        }

        targetCtx.fillText(cell.char, cx, cy);
      }
    }

    targetCtx.restore();
  }
}
