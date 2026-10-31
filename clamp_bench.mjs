// Lab 2 no.4: percepatan clamp bounding box pada segitiga kecil di framebuffer besar
import { Framebuffer, triangle } from "./myraster.mjs";

const fb = new Framebuffer(4000, 4000);
const T = [[100, 100], [140, 105], [115, 135]];            // segitiga kecil (±800 piksel)
for (const clamp of [false, true]) {
  const N = clamp ? 2000 : 5;                              // yang lambat cukup diulang sedikit
  let n = 0;
  const t0 = performance.now();
  for (let i = 0; i < N; i++) n = triangle(fb, ...T, [255, 0, 0], { clamp });
  const ms = (performance.now() - t0) / N;
  console.log(`clamp=${String(clamp).padEnd(5)}  piksel terisi=${n}  waktu per segitiga=${ms.toFixed(4)} ms`);
}