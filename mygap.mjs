// Lab 2 no.2 dengan triangle() BUATAN SENDIRI: persegi 6x6 dibelah di y = x
import { Framebuffer, triangle } from "./myraster.mjs";

const T1 = [[2, 2], [8, 2], [8, 8]], T2 = [[2, 2], [8, 8], [2, 8]];
const W = 12, H = 12;

function hitung(nama, file, opt) {
  const cnt = new Int32Array(W * H);
  for (const T of [T1, T2]) triangle({ w: W, h: H, set() {} }, ...T, null, { ...opt, autoFlip: false, onFragment: (x, y) => cnt[y * W + x]++ });
  const fb = new Framebuffer(W, H);
  let sekali = 0, ganda = 0, celah = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const k = cnt[y * W + x];
    const diDalam = x >= 2 && x < 8 && y >= 2 && y < 8;      // 36 piksel persegi 6x6
    if (k === 1) { sekali++; fb.set(x, y, [120, 120, 120]); }
    else if (k >= 2) { ganda++; fb.set(x, y, [220, 30, 30]); }
    else if (diDalam) { celah++; fb.set(x, y, [40, 110, 230]); }
  }
  console.log(nama.padEnd(26), `sekali=${sekali} ganda=${ganda} celah=${celah}`);
  fb.writePPM(file);
}
hitung("E >= 0, tanpa aturan", "out/my_gap_ganda.ppm", { topLeft: false });
hitung("aturan top-left", "out/my_gap_beres.ppm", { topLeft: true });