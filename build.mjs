// Builds dist/: src/index.html with each {{illos:<name>}} replaced by public/illos/<name>.svg, inline, so every animated asset
// takes the page's --illos-* roles.
// Run: node build.mjs
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const missing = [];
const html = readFileSync("src/index.html", "utf8").replace(/\{\{illos:([a-z0-9-]+)(?:\s+"([^"]*)")?\}\}/g, (_, id, label) => {
  const file = `public/illos/${id}.svg`;
  if (!existsSync(file)) { missing.push(id); return `<!-- missing animated asset: ${id} -->`; }
  const svg = readFileSync(file, "utf8").replace(/^<\?xml[^>]*>\s*/, "");
  return `<div class="illo" data-illos>${svg}</div>`;
});
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
writeFileSync("dist/index.html", html);
for (const f of ["styles.css", "main.js"]) cpSync(`src/${f}`, `dist/${f}`);
cpSync("public/img", "dist/img", { recursive: true });
cpSync("public/favicon.svg", "dist/favicon.svg");
console.log(`dist/index.html ${Math.round(html.length / 1024)} KB${missing.length ? `, missing: ${missing.join(", ")}` : ""}`);
