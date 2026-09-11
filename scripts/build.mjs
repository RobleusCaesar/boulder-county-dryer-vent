#!/usr/bin/env node
// Static site build — zero dependencies. Reads src/, writes dist/.
//   node scripts/build.mjs
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { site, routes, towns } from "../src/data/site.mjs";
import { esc, redirectPage } from "../src/lib/html.mjs";
import { homePage } from "../src/pages/home.mjs";
import { servicePage } from "../src/pages/service.mjs";
import { pricingPage } from "../src/pages/pricing.mjs";
import { areasPage, townPage, townRedirect } from "../src/pages/areas.mjs";
import { blogIndex, blogPost } from "../src/pages/blog.mjs";
import { bookPage } from "../src/pages/book.mjs";
import { aboutPage, reviewsPage, contactPage, termsPage, privacyPage, creditsPage, notFoundPage } from "../src/pages/misc.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const DIST = join(ROOT, "dist");

/* ── Blog: markdown + frontmatter → post objects ─────────────────────── */
function parseFrontmatter(raw) {
  raw = raw.replace(/\r\n/g, "\n");
  if (!raw.startsWith("---")) return { meta: {}, body: raw.trim() };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: raw.trim() };
  const meta = {};
  for (const line of raw.slice(3, end).trim().split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    let value = line.slice(i + 1).trim();
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1);
    meta[line.slice(0, i).trim()] = value;
  }
  return { meta, body: raw.slice(end + 4).trim() };
}

// Minimal markdown: ##/# headings, paragraphs, - lists, > quotes, **bold**.
function renderMarkdown(md) {
  const inline = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const out = [];
  let list = null;
  const flush = () => { if (list) { out.push(`<ul>${list.join("")}</ul>`); list = null; } };
  for (const line of md.split("\n")) {
    if (line.startsWith("## ")) {
      flush();
      const m = line.slice(3).match(/^(\d+)\.\s+(.*)$/);
      out.push(m ? `<h2><span class="n">${m[1]}. </span>${inline(m[2])}</h2>` : `<h2>${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) { flush(); out.push(`<h2>${inline(line.slice(2))}</h2>`); }
    else if (line.startsWith("> ")) { flush(); out.push(`<blockquote><p>${inline(line.slice(2))}</p></blockquote>`); }
    else if (line.startsWith("- ")) { (list ||= []).push(`<li>${inline(line.slice(2))}</li>`); }
    else if (line.trim() === "") { flush(); }
    else { flush(); out.push(`<p>${inline(line)}</p>`); }
  }
  flush();
  return out.join("\n");
}

function loadPosts() {
  const dir = join(SRC, "content", "blog");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { meta, body } = parseFrontmatter(readFileSync(join(dir, f), "utf8"));
      const slug = meta.slug || f.replace(/\.md$/, "");
      return {
        slug,
        title: meta.title || slug,
        date: meta.date || "1970-01-01",
        category: meta.category || "Notes",
        readTime: meta.readTime || "3 min read",
        image: meta.image || "hero-exterior",
        imageAlt: meta.imageAlt || "",
        imageCaption: meta.imageCaption || "",
        description: meta.description || "",
        html: renderMarkdown(body),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
}

/* ── Emit ────────────────────────────────────────────────────────────── */
const pages = new Map(); // path → html
const put = (path, html) => pages.set(path, html);

function write(path, html) {
  const file = path.endsWith(".html") ? join(DIST, path) : join(DIST, path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(SRC, "static"), DIST, { recursive: true });

const posts = loadPosts();

put(routes.home, homePage(posts));
put(routes.service, servicePage());
put(routes.pricing, pricingPage());
put(routes.book, bookPage());
put(routes.areas, areasPage());
for (const t of towns) put(routes.area(t.slug), townPage(t));
put(routes.blog, blogIndex(posts));
for (const p of posts) put(routes.post(p.slug), blogPost(p, posts));
put(routes.reviews, reviewsPage());
put(routes.about, aboutPage());
put(routes.contact, contactPage());
put(routes.terms, termsPage());
put(routes.privacy, privacyPage());
put(routes.credits, creditsPage());

for (const [path, html] of pages) write(path, html);

// Legacy alias URLs → canonical town pages.
for (const t of towns) write(routes.seoArea(t.seoSlug), townRedirect(t));

// Bare /terms/ and /privacy/ → existing legal pages (nothing important links here).
write("/terms/", redirectPage("Terms of service", `${site.url}${routes.terms}`));
write("/privacy/", redirectPage("Privacy policy", `${site.url}${routes.privacy}`));

// 404, sitemap, robots, .nojekyll
write("/404.html", notFoundPage());

const today = new Date().toISOString().slice(0, 10);
const urls = [...pages.keys()]
  .filter((p) => p !== routes.book)
  .map((p) => `  <url><loc>${site.url}${p}</loc><lastmod>${today}</lastmod><priority>${p === "/" ? "1.0" : p.startsWith("/blog/") ? "0.6" : "0.7"}</priority></url>`)
  .join("\n");
writeFileSync(join(DIST, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync(join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
writeFileSync(join(DIST, ".nojekyll"), "");

console.log(`Built ${pages.size} pages + ${towns.length} redirects, ${posts.length} posts → dist/`);
