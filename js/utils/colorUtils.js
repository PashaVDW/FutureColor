// utils/colorUtils.js

export function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }
  
  export function averageColor(ingredients) {
    if (!ingredients.length) return '#e5e7eb';
    let r = 0, g = 0, b = 0;
    ingredients.forEach(({ color }) => {
      const [cr, cg, cb] = hexToRgb(color);
      r += cr;
      g += cg;
      b += cb;
    });
    r = Math.round(r / ingredients.length);
    g = Math.round(g / ingredients.length);
    b = Math.round(b / ingredients.length);
    return `rgb(${r}, ${g}, ${b})`;
  }
  