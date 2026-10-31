// pakai: node px.mjs x y fileA [fileB ...]  (ppm atau png)  -> cetak RGB di piksel (x,y) tiap file
import { loadImage } from "./loadimg.mjs";
const [x, y, ...files] = process.argv.slice(2);
for (const f of files) console.log(f.padEnd(28), `(${x},${y}) =`, loadImage(f).get(+x, +y).join(","));