import { loadPlan, makeWorldToScreen } from "./plan.mjs";
import { lineBresenham } from "./raster.mjs";

const plan = loadPlan("myplan.json");
const f = makeWorldToScreen(plan, 600);
const A = [0, 0], B = [8.6, 0];          // dinding depan struktur_A (meter)
const a = f(A), b = f(B);
const px = lineBresenham(a[0], a[1], b[0], b[1]);
console.log("dunia  :", A, B);
console.log("layar  :", a, b);
console.log("piksel :", px.length, "dari", px[0], "sampai", px[px.length - 1]);