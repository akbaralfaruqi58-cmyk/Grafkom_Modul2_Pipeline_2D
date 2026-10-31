// Rasteriser buatan sendiri (Lab 2). Konvensi: y ke bawah, piksel (x,y) = titik sampel (x+0.5, y+0.5).
import { Framebuffer } from "./raster.mjs";   // hanya kelas framebuffer-nya yang dipakai ulang
export { Framebuffer };

// ---------- garis ----------
export function lineDDA(x0, y0, x1, y1) {
  const dx = x1 - x0, dy = y1 - y0;
  const langkah = Math.max(Math.abs(dx), Math.abs(dy));
  const pts = [];
  if (langkah === 0) return [[x0, y0]];
  const ix = dx / langkah, iy = dy / langkah;
  let x = x0, y = y0;
  for (let k = 0; k <= langkah; k++) {
    pts.push([Math.round(x), Math.round(y)]);
    x += ix; y += iy;
  }
  return pts;
}

// Bresenham bilangan bulat, SEMUA oktan: sumbu cepat = sumbu dengan selisih lebih besar.
// Saat D == 0 (titik tepat di tengah) dipilih naik (>= 0); ini sama dengan raster.mjs (bentuk Zingl).
export function lineBresenham(x0, y0, x1, y1) {
  const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  const pts = [];
  let x = x0, y = y0;
  if (dx >= dy) {                       // landai: x melangkah tiap iterasi
    let D = 2 * dy - dx;
    for (let i = 0; i <= dx; i++) {
      pts.push([x, y]);
      if (D >= 0) { y += sy; D += 2 * (dy - dx); } else D += 2 * dy;
      x += sx;
    }
  } else {                              // curam: y melangkah tiap iterasi
    let D = 2 * dx - dy;
    for (let i = 0; i <= dy; i++) {
      pts.push([x, y]);
      if (D >= 0) { x += sx; D += 2 * (dx - dy); } else D += 2 * dx;
      y += sy;
    }
  }
  return pts;
}

// ---------- segitiga ----------
export const edge = (ax, ay, bx, by, px, py) => (bx - ax) * (py - ay) - (by - ay) * (px - ax);

// bias top-left: 0 bila edge A->B adalah top/left (dy > 0, atau dy == 0 dan dx < 0), selain itu -1
const bias = (ax, ay, bx, by) => {
  const dx = bx - ax, dy = by - ay;
  return dy > 0 || (dy === 0 && dx < 0) ? 0 : -1;
};

export function barycentric(A, B, C, P) {
  const total = edge(A[0], A[1], B[0], B[1], C[0], C[1]);
  const la = edge(B[0], B[1], C[0], C[1], P[0], P[1]) / total;
  const lb = edge(C[0], C[1], A[0], A[1], P[0], P[1]) / total;
  return [la, lb, 1 - la - lb];
}

// opsi: clamp (batasi bounding box), autoFlip (tukar B,C bila winding terbalik),
//       off (offset sampel: 0.5 = pusat piksel), topLeft (false = uji E >= 0 polos)
export function triangle(fb, A, B, C, rgb, opt = {}) {
  const { clamp = true, autoFlip = true, off = 0.5, topLeft = true, onFragment = null } = opt;
  let total = edge(A[0], A[1], B[0], B[1], C[0], C[1]);
  if (total < 0 && autoFlip) { [B, C] = [C, B]; total = -total; }
  if (total <= 0) return 0;
  let x0 = 0, y0 = 0, x1 = fb.w - 1, y1 = fb.h - 1;
  if (clamp) {
    x0 = Math.max(0, Math.floor(Math.min(A[0], B[0], C[0])));
    y0 = Math.max(0, Math.floor(Math.min(A[1], B[1], C[1])));
    x1 = Math.min(fb.w - 1, Math.ceil(Math.max(A[0], B[0], C[0])));
    y1 = Math.min(fb.h - 1, Math.ceil(Math.max(A[1], B[1], C[1])));
  }
  const bBC = topLeft ? bias(B[0], B[1], C[0], C[1]) : 0;
  const bCA = topLeft ? bias(C[0], C[1], A[0], A[1]) : 0;
  const bAB = topLeft ? bias(A[0], A[1], B[0], B[1]) : 0;
  let n = 0;
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      const px = x + off, py = y + off;
      if (edge(B[0], B[1], C[0], C[1], px, py) + bBC >= 0 &&
          edge(C[0], C[1], A[0], A[1], px, py) + bCA >= 0 &&
          edge(A[0], A[1], B[0], B[1], px, py) + bAB >= 0) {
        if (rgb) fb.set(x, y, rgb);
        if (onFragment) onFragment(x, y);
        n++;
      }
    }
  return n;
}

// polyline dari Bresenham ke framebuffer
export function polyline(fb, pts, rgb, closed = false) {
  for (let i = 0; i + 1 < pts.length; i++)
    for (const [x, y] of lineBresenham(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1])) fb.set(x, y, rgb);
  if (closed && pts.length > 2) {
    const a = pts[pts.length - 1], b = pts[0];
    for (const [x, y] of lineBresenham(a[0], a[1], b[0], b[1])) fb.set(x, y, rgb);
  }
}