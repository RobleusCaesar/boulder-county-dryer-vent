// Tiny HTML helpers shared by every template.

export const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const attr = (s) => esc(s).replace(/'/g, "&#39;");

/** Meta-refresh alias page (e.g. /terms/ → /legal/terms/). Not added to the sitemap. */
export function redirectPage(title, target) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title>
<meta http-equiv="refresh" content="0; url=${target}">
<link rel="canonical" href="${target}">
<meta name="robots" content="noindex">
</head><body><p>Moved to <a href="${target}">${esc(target)}</a>.</p></body></html>`;
}

// The four "+" registration marks every blueprint object wears.
export const corners = () =>
  '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>';

export const join = (arr, fn = (x) => x) => arr.map(fn).join("\n");

// Inline SVG icons (Lucide-style, stroke 1.5–1.8).
export const icons = {
  check: (color = "#2E8B57", size = 16) =>
    `<svg viewBox="0 0 16 16" width="${size}" height="${size}" fill="none" aria-hidden="true"><path d="M3 8.5l3 3 7-7" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
  arrow: () =>
    '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true"><path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  chevron: () =>
    '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  warn: () =>
    '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true"><path d="M10 3l7 13H3z" stroke="#E8632B" stroke-width="1.5" stroke-linejoin="round"></path><path d="M10 8v3.5M10 13.4v.6" stroke="#E8632B" stroke-width="1.5" stroke-linecap="round"></path></svg>',
  info: () =>
    '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.5" stroke="#416180" stroke-width="1.5"></circle><path d="M10 6.5v.5M10 9.5v4" stroke="#416180" stroke-width="1.5" stroke-linecap="round"></path></svg>',
  star: (size = 22) =>
    `<svg viewBox="0 0 20 20" width="${size}" height="${size}" aria-hidden="true"><path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z" fill="#E8632B"></path></svg>`,
  bigCheck: () =>
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true"><path d="M5 13l4.5 4.5L19 7" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  drag: () =>
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="M9 7L5 12l4 5m6-10l4 5-4 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  mark: (size = 18) =>
    `<svg viewBox="0 0 20 20" width="${size}" height="${size}" fill="none" aria-hidden="true"><path d="M2 13c3 0 4-4 7-4s3.2 3 6 3" stroke="#E8632B" stroke-width="1.6" stroke-linecap="round"></path><path d="M2 17c3.4 0 4.6-3 7.6-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.45"></path></svg>`,
  wave: (w = 260, h = 22, sw = 2.4) =>
    `<svg viewBox="0 0 260 22" width="${w}" height="${h}" fill="none" aria-hidden="true" class="hero-wave"><path d="M2 17C46 17 60 5 104 5c38 0 50 12 92 12 24 0 40-5 62-11" stroke="#E8632B" stroke-width="${sw}" stroke-linecap="round"></path></svg>`,
};

export const checkList = (items, cls = "check-list") =>
  `<ul class="${cls}">${join(items, (b) => `<li>${icons.check()}<span>${esc(b)}</span></li>`)}</ul>`;

export const faqList = (faqs) =>
  `<div class="faq-list">${join(
    faqs,
    (f) => `<details class="faq blueprint">${corners()}<summary><span>${esc(f.q)}</span><i>${icons.chevron()}</i></summary><p>${esc(f.a)}</p></details>`,
  )}</div>`;
