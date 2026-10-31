// Contoh E4: tanda edge function untuk A(1,1) B(6,2) C(3,7) pada titik (3,3), (5,5), (1,4)
import { edge } from "./myraster.mjs";
const A = [1, 1], B = [6, 2], C = [3, 7];
console.log("total edge(A,B,C) =", edge(...A, ...B, ...C));
for (const P of [[3, 3], [5, 5], [1, 4]]) {
  const e = [edge(...B, ...C, ...P), edge(...C, ...A, ...P), edge(...A, ...B, ...P)];
  console.log(`P=(${P})  E_BC=${e[0]}  E_CA=${e[1]}  E_AB=${e[2]}  ->`, e.every((v) => v >= 0) ? "di dalam" : "di luar");
}