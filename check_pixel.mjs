// pakai: node check_pixel.mjs px py ax ay bx by cx cy
// px,py = indeks piksel (bulat); titik sampel = (px+0.5, py+0.5)
import { edge, triangle } from "./raster.mjs";

const [px, py, ax, ay, bx, by, cx, cy] = process.argv.slice(2).map(Number);
const sx = px + 0.5, sy = py + 0.5;

// bias top-left (sama dengan raster.mjs): 0 jika edge top/left, -1 jika bukan
const bias = (x0, y0, x1, y1) => {
  const dx = x1 - x0, dy = y1 - y0;
  return (dy === 0 && dx < 0) || dy > 0 ? 0 : -1;
};
const E = {
  BC: edge(bx, by, cx, cy, sx, sy),
  CA: edge(cx, cy, ax, ay, sx, sy),
  AB: edge(ax, ay, bx, by, sx, sy),
};
const B = { BC: bias(bx, by, cx, cy), CA: bias(cx, cy, ax, ay), AB: bias(ax, ay, bx, by) };
console.log("total edge(A,B,C) =", edge(ax, ay, bx, by, cx, cy));
console.log(`sampel (${sx}, ${sy})`);
for (const k of ["BC", "CA", "AB"])
  console.log(`E_${k} = ${E[k]}   bias = ${B[k]}   E+bias = ${E[k] + B[k]}`);
const manual = ["BC", "CA", "AB"].every((k) => E[k] + B[k] >= 0);

let drawn = false;
triangle({ w: 4096, h: 4096 }, [ax, ay], [bx, by], [cx, cy], null, {
  onFragment: (x, y) => { if (x === px && y === py) drawn = true; },
});
console.log("keputusan manual :", manual ? "DIISI" : "TIDAK diisi");
console.log("keputusan kode   :", drawn ? "DIISI" : "TIDAK diisi");