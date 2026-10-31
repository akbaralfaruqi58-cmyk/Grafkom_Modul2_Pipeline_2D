import { Framebuffer, polyline } from "./raster.mjs";
import { loadPlan, CATEGORY_RGB } from "./plan.mjs";

const plan = loadPlan("myplan.json");
const W = 800, H = 600;
const s = plan.scale_px_per_m, [ox, oy] = plan.origin_m;

function render(w2s, out) {
  const fb = new Framebuffer(W, H, [18, 18, 22]);
  for (const pl of plan.polylines)
    polyline(fb, pl.points.map(w2s), CATEGORY_RGB[pl.category] || [255, 255, 255], !!pl.closed);
  fb.writePPM(out);
  console.log("ditulis", out);
}
// (a) skala + offset ada, tetapi y TIDAK dibalik
render(([x, y]) => [Math.round((x + ox) * s), Math.round((y + oy) * s)], "out/ablate_noflip.ppm");
// (b) tahap vertex dibuang total: meter dipakai langsung sebagai piksel
render(([x, y]) => [Math.round(x), Math.round(y)], "out/ablate_noxform.ppm");