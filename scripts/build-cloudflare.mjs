import { copyFile, cp, mkdir, rm } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const publicDir = new URL("../public/", import.meta.url);
const appFiles = ["index.html", "style.css", "data.js", "script.js"];
const cloudflareFiles = ["_headers"];

for (const outputDir of [dist, publicDir]) {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  for (const file of appFiles) {
    await copyFile(new URL(file, root), new URL(file, outputDir));
  }

  for (const file of cloudflareFiles) {
    await copyFile(new URL(`cloudflare/${file}`, root), new URL(file, outputDir));
  }

  await cp(new URL("assets/", root), new URL("assets/", outputDir), {
    recursive: true,
    force: true
  });
}

console.log("Cloudflare assets written to dist/ and public/");
