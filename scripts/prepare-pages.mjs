import { copyFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = join(process.cwd(), "out");

writeFileSync(join(out, ".nojekyll"), "");

const nested404 = join(out, "404", "index.html");
if (existsSync(nested404)) {
  copyFileSync(nested404, join(out, "404.html"));
}

console.log("Prepared GitHub Pages artifact in out/");
