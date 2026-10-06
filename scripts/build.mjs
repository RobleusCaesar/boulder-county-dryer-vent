#!/usr/bin/env node
// Static site build — zero dependencies. Reads src/, writes dist/.
//   node scripts/build.mjs
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { site, routes, towns, mcp, prices } from "../src/data/site.mjs";
import { esc, redirectPage } from "../src/lib/html.mjs";
import { homePage } from "../src/pages/home.mjs";
import { servicePage } from "../src/pages/service.mjs";
import { pricingPage } from "../src/pages/pricing.mjs";
import { areasPage, townPage, townRedirect } from "../src/pages/areas.mjs";
import { blogIndex, blogPost } from "../src/pages/blog.mjs";
import { bookPage } from "../src/pages/book.mjs";
import { aboutPage, reviewsPage, contactPage, termsPage, privacyPage, creditsPage, agentsPage, notFoundPage } from "../src/pages/misc.mjs";

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

// Minimal markdown: ##/# headings, paragraphs, - lists, > quotes, **bold**, [links](url).
function renderMarkdown(md) {
  const inline = (t) =>
    esc(t)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => `<a href="${href}">${text}</a>`)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
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
put(routes.agents, agentsPage());

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
writeDiscovery(DIST);
writeFileSync(join(DIST, ".nojekyll"), "");

console.log(`Built ${pages.size} pages + ${towns.length} redirects, ${posts.length} posts → dist/`);

/* ── Machine discovery (llms.txt, MCP well-known) ────────────────────── */
// Written at build time so prices, phone, and the MCP URL stay in sync with
// src/data/site.mjs. Files land in dist/.well-known/, which this host already
// serves (see .github/workflows/pages.yml — the Pages artifact must keep dotfiles).
function writeDiscovery(dist) {
  const mcpUrl = mcp.url;
  const bookUrl = `${site.url}${routes.book}`;
  const agentsUrl = `${site.url}${routes.agents}`;
  const cardUrl = `${site.url}/.well-known/mcp/server-card.json`;
  const catalogUrl = `${site.url}/.well-known/ai-catalog.json`;
  const townList = towns.map((t) => t.name).join(", ");
  const cardDescription = "Book a dryer vent cleaning in Boulder County. Pay after the visit.";

  const manifest = {
    name: "bcdv-agent-booking",
    title: site.name,
    version: "1.0.0",
    description: `${site.name} booking. Fixed price $${prices.standard.amount} standard or $${prices.difficult.amount} difficult. No token. No payment to hold a time.`,
    transport: {
      type: "streamable-http",
      url: mcpUrl,
      endpoint: mcpUrl,
    },
    url: mcpUrl,
    authentication: { required: false },
    documentation: agentsUrl,
    website: site.url,
    serverCard: cardUrl,
    catalog: catalogUrl,
    tools: [
      {
        name: "list_services",
        description: `Fixed prices (standard $${prices.standard.amount}, difficult $${prices.difficult.amount}), service-area towns, phone, and the public book URL.`,
      },
      {
        name: "check_availability",
        description: "Request a preferred 2-hour window. A person confirms within one business day.",
      },
      {
        name: "create_booking",
        description: "Create a booking lead. No token. Rate-limited. No payment. A person confirms the 2-hour window within one business day. Pay after the service.",
        inputSchema: {
          type: "object",
          required: ["name", "phone", "street", "town"],
          properties: {
            name: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
            street: { type: "string" },
            town: { type: "string", description: `Town in the service area: ${townList}` },
            service: {
              type: "string",
              description: `standard ($${prices.standard.amount}) or difficult ($${prices.difficult.amount}: roof, long run, or upper floor)`,
            },
            preferred_windows: { type: "string", description: "Requested 2-hour window, for example Tue 9-11am" },
            sms_consent: { type: "boolean" },
            notes: { type: "string" },
            company_website: { type: "string", description: "Honeypot. Must be empty or omitted." },
          },
        },
      },
      {
        name: "get_booking_status",
        description: "Look up a booking. No token when public_id and the phone number used on the booking are both sent. Other personal details are not returned.",
        inputSchema: {
          type: "object",
          required: ["public_id", "phone"],
          properties: {
            public_id: { type: "string", description: "Job public id, for example BCDV-2026-0008" },
            phone: { type: "string", description: "Phone number used on the booking" },
          },
        },
      },
    ],
  };

  // SEP-2127 server card: identity and transport only. Tools stay on mcp.json
  // and on the live tools/list response. Any URI is valid; this path is the
  // one agents still probe, and the catalog below points at it.
  const serverCard = {
    $schema: "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
    name: "com.bouldercountydryervent/booking",
    version: "1.0.0",
    description: cardDescription,
    title: site.name,
    websiteUrl: `${site.url}/`,
    remotes: [
      {
        type: "streamable-http",
        url: mcpUrl,
        supportedProtocolVersions: ["2024-11-05"],
      },
    ],
  };

  const catalog = {
    specVersion: "1.0",
    entries: [
      {
        identifier: "urn:air:bouldercountydryervent.com:mcp:booking",
        type: "application/mcp-server-card+json",
        url: cardUrl,
      },
    ],
  };

  if (cardDescription.length < 1 || cardDescription.length > 100) {
    throw new Error(`Server card description must be 1–100 characters (got ${cardDescription.length})`);
  }
  if (!/^[a-zA-Z0-9.-]+\/[a-zA-Z0-9._-]+$/.test(serverCard.name)) {
    throw new Error(`Server card name is not reverse-DNS: ${serverCard.name}`);
  }
  if (serverCard.remotes[0].type !== "streamable-http" || serverCard.remotes[0].url !== mcpUrl) {
    throw new Error("Server card remote does not point at the MCP endpoint");
  }

  const llms = `# ${site.name}

> Fixed-price dryer vent cleaning in Boulder County, Colorado. Standard clean $${prices.standard.amount}. Difficult clean (roof, long run, or upper floor) $${prices.difficult.amount}. Pay after the service.

${site.name} cleans one residential dryer vent at a published price. Service area: ${townList}. Address: ${site.addressLine}. Phone: ${site.phoneDisplay}. ${site.hours}. A person confirms a requested 2-hour window within one business day. Holding a time costs nothing. After the first visit, an annual plan is $${prices.annual.amount}.

## Booking

- [Book a visit](${bookUrl}): Request a time on the website. The page shows the published price, then asks for days that work.
- [Phone](${site.phoneHref}): Call ${site.phoneDisplay}.
- [MCP endpoint](${mcpUrl}): Streamable HTTP. POST JSON-RPC (\`initialize\`, then \`tools/call\`) with Content-Type application/json and Accept application/json, text/event-stream. No token. Tools: list_services, check_availability, create_booking, get_booking_status. create_booking needs name, phone, street, and town; leave company_website empty. get_booking_status needs public_id and the phone on the booking.

## Discovery

- [MCP manifest](${site.url}/.well-known/mcp.json): Endpoint, streamable-http transport, and the tool list.
- [MCP server card](${cardUrl}): Server card for the booking endpoint.
- [Domain catalog](${catalogUrl}): Catalog entry that points at the server card.

## Pages

- [Home](${site.url}/): Overview and published prices.
- [The service](${site.url}${routes.service}): What a cleaning includes.
- [Pricing](${site.url}${routes.pricing}): $${prices.standard.amount} standard and $${prices.difficult.amount} difficult.
- [Service areas](${site.url}${routes.areas}): Boulder County towns we cover.
- [Book via agent](${agentsUrl}): Tool fields and curl examples for the MCP booking endpoint.
- [Contact](${site.url}${routes.contact}): Phone, email, and address.
- [About](${site.url}${routes.about}): Who does the work.
`;

  const robots = `User-agent: *
Allow: /

# Machine-readable summary: ${site.url}/llms.txt

Sitemap: ${site.url}/sitemap.xml
`;

  mkdirSync(join(dist, ".well-known", "mcp"), { recursive: true });
  writeFileSync(join(dist, "llms.txt"), llms);
  writeFileSync(join(dist, "robots.txt"), robots);
  writeFileSync(join(dist, ".well-known", "mcp.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(join(dist, ".well-known", "mcp", "server-card.json"), `${JSON.stringify(serverCard, null, 2)}\n`);
  writeFileSync(join(dist, ".well-known", "ai-catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);
}
