#!/usr/bin/env node
/**
 * Ensures licensed city hero JPGs exist under public/assets/cities/.
 * Downloads from Wikimedia Commons FilePath when missing (CI / fresh clone).
 */
import { createWriteStream, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "assets", "cities");

const IMAGES = [
  {
    file: "boulder.jpg",
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Flatirons_Sunrise.jpg?width=1600",
  },
  {
    file: "louisville.jpg",
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Jacoe_Store.JPG?width=1600",
  },
  {
    file: "lafayette.jpg",
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Lafayette,_CO.jpg?width=1600",
  },
  {
    file: "longmont.jpg",
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Longmont_Colorado.JPG?width=1600",
  },
  {
    file: "superior.jpg",
    url: "https://commons.wikimedia.org/wiki/Special:FilePath/Superior,_Colorado,_Fall_2011.jpg?width=1600",
  },
];

const UA = "BoulderCountyDryerVentBot/1.0 (site build; rob@frostrivercapital.com)";

async function download(url, dest) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": UA, accept: "image/*,*/*" },
  });
  if (!res.ok || !res.body) {
    throw new Error(`Failed ${url} → ${res.status}`);
  }
  await pipeline(res.body, createWriteStream(dest));
}

mkdirSync(outDir, { recursive: true });

let fetched = 0;
for (const img of IMAGES) {
  const dest = join(outDir, img.file);
  if (existsSync(dest) && statSync(dest).size > 10_000) {
    console.log(`ok ${img.file} (${statSync(dest).size} bytes)`);
    continue;
  }
  console.log(`fetch ${img.file}`);
  await download(img.url, dest);
  console.log(`wrote ${img.file} (${statSync(dest).size} bytes)`);
  fetched += 1;
}

console.log(`City heroes ready (${fetched} downloaded, ${IMAGES.length - fetched} cached).`);
