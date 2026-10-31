import { loadPlan, makeWorldToScreen } from "./plan.mjs";

const W = 800, H = 600;
const plan = loadPlan("myplan.json");
const w2s = makeWorldToScreen(plan, H);

for (const zoom of [1, 10]) {
  const segs = [];
  for (const pl of plan.polylines) {
    const pts = pl.points.map(([x, y]) => {
      const [sx, sy] = w2s([x, y]);
      return [(sx - W / 2) * zoom + W / 2, (sy - H / 2) * zoom + H / 2];
    });
    for (let i = 0; i + 1 < pts.length; i++) segs.push([pts[i], pts[i + 1]]);
    if (pl.closed && pts.length > 2) segs.push([pts[pts.length - 1], pts[0]]);
  }
  // forward: jumlah langkah Bresenham (satu piksel per langkah)
  let fwd = 0;
  for (const [a, b] of segs)
    fwd += Math.max(Math.abs((b[0] | 0) - (a[0] | 0)), Math.abs((b[1] | 0) - (a[1] | 0))) + 1;
  // backward: jumlah uji jarak (sama persis dengan bench.mjs, termasuk break)
  let tests = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const px = x + 0.5, py = y + 0.5;
      for (const [a, b] of segs) {
        tests++;
        const vx = b[0] - a[0], vy = b[1] - a[1], wx = px - a[0], wy = py - a[1];
        const L2 = vx * vx + vy * vy || 1e-9;
        let t = (wx * vx + wy * vy) / L2;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const dx = wx - t * vx, dy = wy - t * vy;
        if (dx * dx + dy * dy <= 0.5625) break;
      }
    }
  console.log(`zoom ${zoom}x  segmen=${segs.length}  forward=${fwd} langkah  backward=${tests} uji  rasio=${(tests / fwd).toFixed(0)}x`);
}