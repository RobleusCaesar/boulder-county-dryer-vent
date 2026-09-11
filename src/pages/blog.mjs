import { site, routes, prices } from "../data/site.mjs";
import { esc, attr, corners, join } from "../lib/html.mjs";
import { page, ctaBand } from "../templates/layout.mjs";

const fmtDate = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export function postCard(p, { excerpt = true } = {}) {
  return `
<a href="${routes.post(p.slug)}" class="post-card blueprint card--lift" data-cat="${attr(p.category.toLowerCase())}">
  ${corners()}
  <span class="duotone"><img src="/img/${p.image}-800.jpg" alt="" loading="lazy" width="800" height="600"></span>
  <span class="post-card-body">
    <span class="post-meta"><span class="cat">${esc(p.category)}</span><span>${esc(p.readTime)}</span></span>
    <span class="post-title">${esc(p.title)}</span>
    ${excerpt ? `<span class="post-excerpt">${esc(p.description)}</span><span class="post-date">${fmtDate(p.date)}</span>` : ""}
  </span>
</a>`;
}

export function blogIndex(posts) {
  const [featured, ...rest] = posts;
  const cats = [...new Set(posts.map((p) => p.category))];
  const body = `
<section class="bg-sand bb">
  <div class="wrap section--hero-sm">
    <p class="kicker">Blog</p>
    <h1 class="t-page max-22">Notes from inside Boulder County laundry rooms</h1>
    <p class="lede lede--sm">What we find, what it costs, and what you can check yourself in five minutes.</p>
  </div>
</section>

<section class="bg-white">
  <div class="wrap section--hero-sm">
    <a href="${routes.post(featured.slug)}" class="featured blueprint">
      ${corners()}
      <span class="duotone"><img src="/img/${featured.image}.jpg" alt="" width="1448" height="1086"></span>
      <span class="featured-body">
        <span class="post-meta"><span class="badge">Featured</span><span>${esc(featured.category)} &#183; ${esc(featured.readTime)}</span></span>
        <span class="featured-title">${esc(featured.title)}</span>
        <span class="featured-excerpt">${esc(featured.description)}</span>
        <span class="link-arrow" style="min-height:0">Read the post &#8594;</span>
      </span>
    </a>
  </div>
</section>

<section class="bg-sand bt">
  <div class="wrap section--md">
    <div class="filters" data-filters role="group" aria-label="Filter posts by topic">
      <button type="button" class="filter" data-filter="all" aria-pressed="true">All posts</button>
      ${join(cats, (c) => `<button type="button" class="filter" data-filter="${attr(c.toLowerCase())}" aria-pressed="false">${esc(c)}</button>`)}
    </div>
    <div class="grid grid-cards grid-cards--280">
      ${join(posts, (p) => postCard(p))}
    </div>
  </div>
</section>

${ctaBand({ title: `Done reading? The price is $${prices.standard.amount}.`, lede: "Two questions and you will know your tier, then tell us the days that work.", size: "t-cta--xs", phone: false })}`;

  return page({
    path: routes.blog,
    title: "Blog — dryer vent notes from Boulder County",
    description: "Customer education from Boulder County Dryer Vent: when to clean, what a proper clean includes, warning signs, and why we publish prices.",
    current: "blog",
    body,
  });
}

export function blogPost(post, all) {
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3);
  const body = `
<article>
  <header class="bg-sand bb">
    <div class="wrap wrap--prose" style="padding-top:clamp(30px,4vw,60px);padding-bottom:clamp(30px,4vw,60px)">
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="${routes.home}">Home</a><span>/</span>
        <a href="${routes.blog}">Blog</a><span>/</span>
        <span class="here">${esc(post.category)}</span>
      </nav>
      <span class="post-meta"><span class="cat">${esc(post.category)}</span><span>${esc(post.readTime)}</span></span>
      <h1 class="t-page t-page--sm" style="margin-top:14px">${esc(post.title)}</h1>
      <div class="byline">
        <i><svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true"><path d="M2 13c3 0 4-4 7-4s3.2 3 6 3" stroke="#E8632B" stroke-width="1.6" stroke-linecap="round"></path><path d="M2 17c3.4 0 4.6-3 7.6-3" stroke="#1F2A37" stroke-width="1.2" stroke-linecap="round" opacity="0.45"></path></svg></i>
        <span><b>${esc(site.name)}</b><small>${fmtDate(post.date)}</small></span>
      </div>
    </div>
  </header>

  <figure class="wrap wrap--prose post-hero">
    <span class="blueprint" style="display:block">
      ${corners()}
      <span class="fig-img ar-16-9" style="display:block;background:var(--sand)"><img src="/img/${post.image}.jpg" alt="${attr(post.imageAlt || "")}" width="1448" height="1086"></span>
    </span>
    ${post.imageCaption ? `<figcaption class="cap" style="padding-left:0;padding-right:0">${esc(post.imageCaption)}</figcaption>` : ""}
  </figure>

  <div class="wrap wrap--prose prose">
    ${post.html}
    <div class="blueprint post-cta">
      ${corners()}
      <div>
        <p class="q">Recognise your laundry room in this?</p>
        <p class="s">Two taps for your price and a request for this week&#8217;s openings.</p>
      </div>
      <a href="${routes.book}" class="btn btn--md btn-ember">Book My Visit</a>
    </div>
  </div>
</article>

${related.length ? `
<section class="bg-sand bt">
  <div class="wrap section--md">
    <h2 class="t-block mb-2">Related posts</h2>
    <div class="grid grid-cards grid-cards--270">
      ${join(related, (p) => postCard(p, { excerpt: false }))}
    </div>
  </div>
</section>` : ""}`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: `${site.url}/img/${post.image}.jpg`,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}${routes.post(post.slug)}`,
  });

  return page({
    path: routes.post(post.slug),
    title: post.title,
    description: post.description,
    current: "blog",
    body,
    image: `/img/${post.image}.jpg`,
    ogType: "article",
    jsonLd,
  });
}
