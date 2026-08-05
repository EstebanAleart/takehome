// Convierte los PNG originales (Downloads) a WebP optimizado en public/.
// Uso: npm i -D sharp && node scripts/optimize-images.mjs
// Idempotente: si el PNG fuente no está, saltea ese ítem.
import sharp from "sharp";
import { mkdir, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = "C:/Users/esteb/Downloads";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public");

// pizzas: cuadradas, ~700px. hero: ancho, ~1600px.
const jobs = [
  ["margarita.png", "pizzas/margherita.webp", 700, 700],
  ["pepperoni.png", "pizzas/pepperoni.webp", 700, 700],
  ["napolitana.png", "pizzas/napolitana.webp", 700, 700],
  ["4 quesos.png", "pizzas/cuatro-quesos.webp", 700, 700],
  ["fugazeta.png", "pizzas/fugazzeta.webp", 700, 700],
  ["vegetariana.png", "pizzas/vegetariana.webp", 700, 700],
  ["hero.png", "hero.webp", 1600, null],
];

const exists = async p => access(p).then(() => true, () => false);

await mkdir(join(OUT, "pizzas"), { recursive: true });
for (const [src, dst, w, h] of jobs) {
  const srcPath = join(SRC, src);
  if (!(await exists(srcPath))) { console.warn("skip (falta):", src); continue; }
  await sharp(srcPath)
    .resize(w, h, { fit: "cover" })
    .webp({ quality: 78 })
    .toFile(join(OUT, dst));
  console.log("ok:", dst);
}
