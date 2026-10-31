// pembaca gambar bersama: .ppm atau .png -> Framebuffer
import { readFileSync } from "node:fs";
import { PNG } from "pngjs";
import { Framebuffer } from "./raster.mjs";

export function loadImage(path) {
  if (path.toLowerCase().endsWith(".png")) {
    const png = PNG.sync.read(readFileSync(path));
    const fb = new Framebuffer(png.width, png.height);
    for (let p = 0; p < png.width * png.height; p++)
      for (let k = 0; k < 3; k++) fb.data[p * 3 + k] = png.data[p * 4 + k];
    return fb;
  }
  return Framebuffer.readPPM(path);
}