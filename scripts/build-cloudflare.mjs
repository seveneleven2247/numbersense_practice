import { copyFile, mkdir, rm } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const appFiles = ["index.html", "styles.css", "app.js"];
const cloudflareFiles = ["_headers", "_redirects"];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of appFiles) {
  await copyFile(new URL(file, root), new URL(file, dist));
}

for (const file of cloudflareFiles) {
  await copyFile(new URL(`cloudflare/${file}`, root), new URL(file, dist));
}

console.log("Cloudflare Pages build output written to dist/");
