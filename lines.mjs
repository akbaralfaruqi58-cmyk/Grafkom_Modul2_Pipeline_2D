import { lineDDA, lineBresenham } from "./raster.mjs";

const fmt = (p) => p.map(([x, y]) => `(${x},${y})`).join(" ");
console.log("DDA       :", fmt(lineDDA(2, 1, 9, 5)));
console.log("Bresenham :", fmt(lineBresenham(2, 1, 9, 5)));