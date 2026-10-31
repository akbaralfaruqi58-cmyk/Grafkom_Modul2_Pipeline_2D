// Menguji myraster.mjs terhadap contoh modul dan terhadap raster.mjs (sebagai oracle).
import * as me from "./myraster.mjs";
import * as ref from "./raster.mjs";

let ok = 0, gagal = 0;
const cek = (nama, cond, info = "") => { cond ? ok++ : gagal++; console.log(cond ? "OK  " : "GAGAL", nama, info); };
const sama = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// E2/E3: garis (2,1)->(9,5)
const E = [[2,1],[3,2],[4,2],[5,3],[6,3],[7,4],[8,4],[9,5]];
cek("E2 DDA (2,1)->(9,5)", sama(me.lineDDA(2, 1, 9, 5), E));
cek("E3 Bresenham (2,1)->(9,5)", sama(me.lineBresenham(2, 1, 9, 5), E));

// delapan oktan: satu segmen (0,0)->(7,3) direfleksikan 8 kali, harus cocok dengan oracle dan simetris
const refl = [[1,1],[1,-1],[-1,1],[-1,-1]];
let oktanOk = true;
for (const [sx, sy] of refl) for (const swap of [false, true]) {
  let [x1, y1] = [7 * sx, 3 * sy]; if (swap) [x1, y1] = [y1, x1];
  const a = me.lineBresenham(0, 0, x1, y1), b = ref.lineBresenham(0, 0, x1, y1);
  if (!sama(a, b) || a.length !== 8) { oktanOk = false; console.log("  beda di", x1, y1); }
}
cek("8 oktan Bresenham (refleksi) = oracle", oktanOk);

// acak: 5000 garis, Bresenham dan DDA vs oracle
let beda = 0, bedaD = 0;
for (let i = 0; i < 5000; i++) {
  const r = () => Math.floor(Math.random() * 61) - 30;
  const [a, b, c, d] = [r(), r(), r(), r()];
  if (!sama(me.lineBresenham(a, b, c, d), ref.lineBresenham(a, b, c, d))) beda++;
  if (!sama(me.lineDDA(a, b, c, d), ref.lineDDA(a, b, c, d))) bedaD++;
}
cek("5000 garis acak Bresenham = oracle", beda === 0, `(beda ${beda})`);
cek("5000 garis acak DDA = oracle", bedaD === 0, `(beda ${bedaD})`);

// E5: barycentric 10/20/40 di (.5,.25,.25) -> 20
const A = [0, 0], B = [8, 0], C = [0, 8], P = [2, 2];      // lam = (.5,.25,.25)
const [la, lb, lc] = me.barycentric(A, B, C, P);
cek("barycentric jumlah = 1", Math.abs(la + lb + lc - 1) < 1e-12, `(${la},${lb},${lc})`);
cek("E5 interpolasi 10/20/40 = 20", Math.abs(10 * la + 20 * lb + 40 * lc - 20) < 1e-9);

// segitiga: himpunan piksel sama dengan oracle pada 300 segitiga acak
const himp = (fn) => { const s = []; fn((x, y) => s.push(x + "," + y)); return s.sort().join(";"); };
let tb = 0;
for (let i = 0; i < 300; i++) {
  const r = () => Math.floor(Math.random() * 24);
  let T = [[r(), r()], [r(), r()], [r(), r()]];
  const tot = me.edge(...T[0], ...T[1], ...T[2]);
  if (tot === 0) continue;
  if (tot < 0) T = [T[0], T[2], T[1]];
  const a = himp((f) => me.triangle({ w: 30, h: 30 }, ...T, null, { onFragment: f }));
  const b = himp((f) => ref.triangle({ w: 30, h: 30 }, ...T, null, { onFragment: f }));
  if (a !== b) tb++;
}
cek("300 segitiga acak = oracle", tb === 0, `(beda ${tb})`);

// auto-flip winding: segitiga terbalik tetap terisi sama
const fbA = new me.Framebuffer(12, 12), fbB = new me.Framebuffer(12, 12);
const n1 = me.triangle(fbA, [1, 1], [9, 2], [4, 9], [255, 0, 0]);
const n2 = me.triangle(fbB, [1, 1], [4, 9], [9, 2], [255, 0, 0]);
cek("auto-flip: dua urutan simpul, jumlah piksel sama", n1 === n2 && n1 > 0, `(${n1} vs ${n2})`);

console.log(`\n${gagal === 0 ? "SEMUA LULUS" : "ADA YANG GAGAL"} (${ok} ok, ${gagal} gagal)`);
process.exit(gagal ? 1 : 0);