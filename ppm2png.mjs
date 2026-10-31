// pakai: node ppm2png.mjs masuk.ppm keluar.png [skala]
//    atau node ppm2png.mjs masuk.ppm keluar.png x y lebar tinggi skala   (crop lalu perbesar)
import { writeFileSync } from "node:fs";
import { PNG } from "pngjs";
import { Framebuffer } from "./raster.mjs";

const [inp, out, ...rest] = process.argv.slice(2);
const n = rest.map(Number);
const fb = Framebuffer.readPPM(inp);
const [x0, y0, w, h, s] = n.length >= 5 ? n : [0, 0, fb.w, fb.h, n[0] || 1];

const png = new PNG({ width: w * s, height: h * s });
for (let y = 0; y < h * s; y++) {
  for (let x = 0; x < w * s; x++) {
    const [r, g, b] = fb.get(x0 + Math.floor(x / s), y0 + Math.floor(y / s));
    const i = (y * w * s + x) * 4;
    png.data[i] = r; png.data[i + 1] = g; png.data[i + 2] = b; png.data[i + 3] = 255;
  }
}
writeFileSync(out, PNG.sync.write(png));
console.log(`ditulis ${out} (${w * s}x${h * s})`);