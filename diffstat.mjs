// pakai: node diffstat.mjs A.ppm B.ppm  -> jumlah piksel berbeda per ember besar selisih (maks per kanal)
import { loadImage } from "./loadimg.mjs";
const [a, b] = process.argv.slice(2).map((p) => loadImage(p));
let sama = 0, kecil = 0, sedang = 0, besar = 0;
for (let i = 0; i < a.w * a.h; i++) {
  const d = Math.max(Math.abs(a.data[3 * i] - b.data[3 * i]), Math.abs(a.data[3 * i + 1] - b.data[3 * i + 1]), Math.abs(a.data[3 * i + 2] - b.data[3 * i + 2]));
  d === 0 ? sama++ : d <= 8 ? kecil++ : d <= 64 ? sedang++ : besar++;
}
const n = a.w * a.h, f = (v) => `${v} (${((100 * v) / n).toFixed(2)}%)`;
console.log("identik       :", f(sama));
console.log("beda 1..8     :", f(kecil));
console.log("beda 9..64    :", f(sedang));
console.log("beda > 64     :", f(besar));
console.log("TOTAL berbeda :", f(kecil + sedang + besar));