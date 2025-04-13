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

export function getTriadicColors(hex) {
    const hsl = hexToHsl(hex);

    const triadic1 = { h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l };
    const triadic2 = { h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l };

    return [
        { hex: hslToHex(triadic1), hsl: triadic1 },
        { hex: hslToHex(triadic2), hsl: triadic2 },
    ];
}

export function hexToHsl(hex) {
    const [r, g, b] = hexToRgb(hex).map(v => v / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) h = s = 0;
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
            case g: h = ((b - r) / d + 2); break;
            case b: h = ((r - g) / d + 4); break;
        }
        h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex({ h, s, l }) {
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));

    return `#${[f(0), f(8), f(4)].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}
export function rgbToHex(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

