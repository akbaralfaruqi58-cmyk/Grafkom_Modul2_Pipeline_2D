// pakai: node firstdiff.mjs A.ppm B.ppm [jumlah]
// cetak beberapa piksel yang berbeda (selisih terbesar dulu) beserta nilai RGB-nya
import { loadImage } from "./loadimg.mjs";

const [fa, fb2, n = "5"] = process.argv.slice(2);
const a = loadImage(fa), b = loadImage(fb2);
const hasil = [];
for (let y = 0; y < a.h; y++)
  for (let x = 0; x < a.w; x++) {
    const p = a.get(x, y), q = b.get(x, y);
    const d = Math.max(Math.abs(p[0] - q[0]), Math.abs(p[1] - q[1]), Math.abs(p[2] - q[2]));
    if (d > 0) hasil.push({ x, y, d, p, q });
  }
hasil.sort((m, k) => k.d - m.d || m.y - k.y || m.x - k.x);
console.log(`total piksel berbeda: ${hasil.length}`);
for (const h of hasil.slice(0, +n))
  console.log(`(${h.x},${h.y})  selisih=${h.d}  A=${h.p.join(",")}  B=${h.q.join(",")}`);