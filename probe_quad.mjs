// Opsional (A3, bagian "keterbatasan"): quad W x H dibelah diagonal, bandingkan dua aturan uji.
//   node probe_quad.mjs 4 3
import { edge } from "./raster.mjs";

const [W, H] = process.argv.slice(2).map(Number);
const isTL = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1]; return (dy === 0 && dx < 0) || dy > 0; };
const Q = [[0, 0], [W, 0], [W, H], [0, H]];
const tris = [[Q[0], Q[1], Q[2]], [Q[0], Q[2], Q[3]]];

function hitung(nama, uji) {
  const cnt = new Int32Array(W * H);
  for (const [A, B, C] of tris)
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const px = x + 0.5, py = y + 0.5;
        if (uji(edge(...B, ...C, px, py), B, C) && uji(edge(...C, ...A, px, py), C, A) && uji(edge(...A, ...B, px, py), A, B)) cnt[y * W + x]++;
      }
  let sekali = 0, dua = 0, celah = 0;
  for (const v of cnt) v === 1 ? sekali++ : v > 1 ? dua++ : celah++;
  console.log(nama.padEnd(34), `sekali=${sekali} ganda=${dua} celah=${celah} dari ${W * H}`);
}
// aturan modul: E + bias >= 0, bias 0 untuk edge top/left dan -1 selain itu
hitung("modul  (E + bias >= 0)", (E, p, q) => E + (isTL(p, q) ? 0 : -1) >= 0);
// aturan perbaikan: E > 0, atau E == 0 dan edge top/left
hitung("perbaikan (E>0 || E==0 && TL)", (E, p, q) => E > 0 || (E === 0 && isTL(p, q)));