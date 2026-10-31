// Lab 2 no.5: asterisk 24 jari-jari (tiap 15 derajat); panjang tiap jari-jari harus sama +-1 piksel
import { Framebuffer, lineBresenham } from "./myraster.mjs";

const W = 201, H = 201, cx = 100, cy = 100, R = 90, N = 24;
const fb = new Framebuffer(W, H, [18, 18, 22]);
let ok = true, minL = 1e9, maxL = 0, maxDev = 0;

for (let k = 0; k < N; k++) {
  const t = (k * 2 * Math.PI) / N;
  const ex = Math.round(cx + R * Math.cos(t)), ey = Math.round(cy - R * Math.sin(t));
  const pts = lineBresenham(cx, cy, ex, ey);
  for (const [x, y] of pts) fb.set(x, y, [253, 231, 37]);
  const [lx, ly] = pts[pts.length - 1];
  const panjang = Math.hypot(lx - cx, ly - cy);                 // panjang Euclid ujung jari-jari
  // simpangan tiap piksel terhadap garis ideal (jarak titik ke segmen pusat-ujung)
  for (const [x, y] of pts) {
    const dx = ex - cx, dy = ey - cy;
    const dev = Math.abs(dy * (x - cx) - dx * (y - cy)) / Math.hypot(dx, dy);
    if (dev > maxDev) maxDev = dev;
  }
  minL = Math.min(minL, panjang); maxL = Math.max(maxL, panjang);
  if (Math.abs(panjang - R) > 1) { ok = false; console.log(`jari-jari ${k} (${k * 15} derajat) panjang ${panjang.toFixed(2)} MELESET`); }
  if (lx !== ex || ly !== ey) { ok = false; console.log(`jari-jari ${k} (${k * 15} derajat) berakhir di (${lx},${ly}), seharusnya (${ex},${ey})`); }
}
if (maxDev > 1) { ok = false; console.log(`simpangan ${maxDev.toFixed(2)} piksel dari garis ideal (batas 1): ada oktan yang salah`); }
console.log(`panjang min=${minL.toFixed(2)} maks=${maxL.toFixed(2)} (target ${R} +-1)  simpangan maks dari garis ideal=${maxDev.toFixed(2)} piksel`);
console.log(ok ? "LULUS: semua jari-jari sama panjang +-1 piksel" : "GAGAL: ada oktan yang salah");
fb.writePPM("out/asterisk.ppm");
process.exit(ok ? 0 : 1);