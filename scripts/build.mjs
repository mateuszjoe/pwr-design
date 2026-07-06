import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(rootDir, "dist");

const publicFiles = [
  "index.html",
  "polityka-prywatnosci.html",
  "regulamin.html",
  "styles.css",
  "script.js",
  "robots.txt",
  "sitemap.xml",
  "assets"
];

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const file of publicFiles) {
  cpSync(resolve(rootDir, file), resolve(outDir, file), { recursive: true });
}
