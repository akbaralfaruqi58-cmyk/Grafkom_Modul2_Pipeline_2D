// simulasi filter CVD (matriks sama dengan index.html, dihitung di linearRGB seperti SVG)
const M = {
  deuteranopia: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]],
  protanopia: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
};
const CAT = {
  wall: [0x44, 0x01, 0x54], cella: [0x3b, 0x52, 0x8b], stair: [0x21, 0x91, 0x8c],
  shrine: [0x5e, 0xc9, 0x62], axis: [0xfd, 0xe7, 0x25],
};
const BG = [0x12, 0x12, 0x16]; // warna latar kanvas (setClearColor 0x121216)

const toLin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const toSrgb = (l) => { l = Math.min(1, Math.max(0, l)); return Math.round(255 * (l <= 0.0031308 ? 12.92 * l : 1.055 * l ** (1 / 2.4) - 0.055)); };
const lum = (c) => 0.2126 * toLin(c[0]) + 0.7152 * toLin(c[1]) + 0.0722 * toLin(c[2]);
const contrast = (a, b) => { const x = lum(a) + 0.05, y = lum(b) + 0.05; return Math.max(x, y) / Math.min(x, y); };
function lab(c) {
  const r = toLin(c[0]), g = toLin(c[1]), b = toLin(c[2]);
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047);
  const fy = f(0.2126 * r + 0.7152 * g + 0.0722 * b);
  const fz = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
const dE = (a, b) => Math.hypot(...lab(a).map((v, i) => v - lab(b)[i]));
const simulate = (c, m) => m.map((row) => toSrgb(row[0] * toLin(c[0]) + row[1] * toLin(c[1]) + row[2] * toLin(c[2])));

const names = Object.keys(CAT);
for (const [mode, m] of [["normal", null], ...Object.entries(M)]) {
  const cols = names.map((n) => (m ? simulate(CAT[n], m) : CAT[n]));
  let min = 1e9, pair = "", minL = 1e9;
  const Ls = cols.map((c) => lab(c)[0]).sort((a, b) => a - b);
  for (let i = 1; i < Ls.length; i++) minL = Math.min(minL, Ls[i] - Ls[i - 1]);
  for (let i = 0; i < cols.length; i++)
    for (let j = i + 1; j < cols.length; j++) {
      const d = dE(cols[i], cols[j]);
      if (d < min) { min = d; pair = `${names[i]}-${names[j]}`; }
    }
  console.log(`\n== ${mode}`);
  names.forEach((n, i) =>
    console.log(`${n.padEnd(7)} rgb(${cols[i].join(",")})  L*=${lab(cols[i])[0].toFixed(0)}  kontras vs latar=${contrast(cols[i], BG).toFixed(2)}:1`));
  console.log(`dE76 minimum = ${min.toFixed(1)} (${pair});  selisih L* minimum = ${minL.toFixed(1)}`);
}