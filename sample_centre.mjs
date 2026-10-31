// Lab 2 no.3: persegi 2x2 di (1,1) -> aturan pusat (2x2) vs aturan sudut (3x3)
import { Framebuffer, triangle } from "./myraster.mjs";

const Q = [[1, 1], [3, 1], [3, 3], [1, 3]];                 // persegi dari (1,1) sampai (3,3), lebar 2
const tris = [[Q[0], Q[1], Q[2]], [Q[0], Q[2], Q[3]]];

function gambar(judul, opt) {
  const fb = new Framebuffer(6, 6);
  let n = 0;
  const hit = new Set();
  for (const T of tris) triangle(fb, ...T, null, { ...opt, onFragment: (x, y) => hit.add(x + "," + y) });
  console.log(judul);
  for (let y = 0; y < 6; y++) console.log("  " + [...Array(6).keys()].map((x) => (hit.has(x + "," + y) ? "#" : ".")).join(" "));
  console.log(`  jumlah piksel = ${hit.size}\n`);
}
gambar("Aturan PUSAT (sampel di x+0.5, y+0.5), top-left:", { off: 0.5, topLeft: true });
gambar("Aturan SUDUT (sampel di x, y), uji E >= 0 polos:", { off: 0, topLeft: false });