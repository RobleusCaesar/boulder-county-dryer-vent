import { site, routes, prices, priceCards, routeFillNote, pricingRules, planBullets, pricingFaqs } from "../data/site.mjs";
import { esc, corners, join, checkList, faqList } from "../lib/html.mjs";
import { page, ctaBand, pageHero } from "../templates/layout.mjs";
import { priceCardHtml } from "./home.mjs";

const diagram = () => `
<figure class="blueprint" style="background:#fff">
  ${corners()}
  <svg viewBox="0 0 400 300" fill="none" role="img" aria-label="Diagram: a two-story home with a side-wall termination priced as standard and a roof termination priced as difficult" style="display:block;width:100%;height:auto">
    <path d="M60 270V150l90-60 90 60v120z" stroke="#1F2A37" stroke-width="1.5"></path>
    <path d="M60 150h180" stroke="#1F2A37" stroke-width="1" opacity="0.4"></path>
    <path d="M60 210h180" stroke="#1F2A37" stroke-width="1" opacity="0.4"></path>
    <rect x="86" y="225" width="34" height="34" stroke="#1F2A37" stroke-width="1.2"></rect>
    <circle cx="103" cy="242" r="10" stroke="#1F2A37" stroke-width="1.2"></circle>
    <path d="M120 242h44" stroke="#E8632B" stroke-width="2" stroke-dasharray="5 4"></path>
    <path d="M164 242h76" stroke="#E8632B" stroke-width="2"></path>
    <rect x="240" y="234" width="16" height="16" fill="#E8632B"></rect>
    <text x="266" y="240" font-family="Barlow Condensed, sans-serif" font-size="17" font-weight="600" fill="#1F2A37">SIDE WALL</text>
    <text x="266" y="260" font-family="Barlow, sans-serif" font-size="14" fill="#6B7280">Standard · $${prices.standard.amount}</text>
    <path d="M150 130V96" stroke="#597ea3" stroke-width="2"></path>
    <path d="M150 96l-16 10m16-10l16 10" stroke="#597ea3" stroke-width="1.6"></path>
    <rect x="142" y="76" width="16" height="16" fill="#597ea3"></rect>
    <text x="176" y="84" font-family="Barlow Condensed, sans-serif" font-size="17" font-weight="600" fill="#1F2A37">ROOF</text>
    <text x="176" y="104" font-family="Barlow, sans-serif" font-size="14" fill="#6B7280">Difficult · $${prices.difficult.amount}</text>
    <path d="M103 242c0 0 0-60 47-60" stroke="#597ea3" stroke-width="1.4" stroke-dasharray="5 4"></path>
  </svg>
  <figcaption class="cap" style="padding:10px 14px">The same dryer, two terminations. Ladder time is the only difference in the price.</figcaption>
</figure>`;

export function pricingPage() {
  const body = `
${pageHero({
  kicker: "Pricing",
  title: "Three numbers. That is the whole price list.",
  size: "t-page--lg max-20",
  lede: "No estimate visit, no per-foot charges, no weekend surcharge. You see which tier you are in before you book, and it does not change once we are at the door.",
})}

<section class="bg-white">
  <div class="wrap section">
    <div class="grid grid-cards grid-cards--280">
      ${join(priceCards, (p) => priceCardHtml(p))}
    </div>
    <p class="note" style="margin-top:22px">${esc(routeFillNote)}</p>
  </div>
</section>

<section class="bg-sand bt bb">
  <div class="wrap section">
    <p class="kicker">How we decide</p>
    <h2 class="t-section t-section--sm max-26 mb-3">Standard or difficult comes down to where the duct ends</h2>
    <div class="grid grid-2 center">
      ${diagram()}
      <div class="rules">
        ${join(pricingRules, (r) => `<div class="blueprint rule">${corners()}<h3>${esc(r.q)}</h3><p>${esc(r.a)}</p></div>`)}
        <a href="${routes.book}" class="btn btn-ember" style="display:flex">Find my tier in two taps</a>
      </div>
    </div>
  </div>
</section>

<section class="bg-white">
  <div class="wrap section grid grid-2 start">
    <div>
      <p class="kicker">Annual plan</p>
      <h2 class="t-section t-section--sm" style="margin-bottom:14px">$${prices.annual.amount} a year, and you stop thinking about it</h2>
      <p class="body-lg">Most homes need this once a year. After your first visit, the plan is the same clean at $20 off, scheduled the same month every year, with a reminder from us a week ahead so you can move it if the week is bad.</p>
      <p class="body-lg">Cancel any year, no fee, no phone tree. Ask about it when you book or mention it in your request notes.</p>
    </div>
    <div class="blueprint card card--accent card--pad-lg">
      ${corners()}
      <h3 style="margin:0 0 12px;font-size:23px;text-transform:uppercase">What the plan includes</h3>
      ${checkList(planBullets)}
      <a href="${routes.book}" class="btn btn--md btn-ember" style="display:flex;margin-top:20px">Book your first visit</a>
    </div>
  </div>
</section>

<section class="bg-sand bt">
  <div class="wrap wrap--narrow section">
    <h2 class="t-section t-section--sm mb-2">Pricing questions</h2>
    ${faqList(pricingFaqs)}
  </div>
</section>

${ctaBand({ lede: "Two questions, then your published price and a request for the days that work." })}`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pricingFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  });

  return page({
    path: routes.pricing,
    title: "Pricing — three published numbers",
    description: `Dryer vent cleaning prices in Boulder County: $${prices.standard.amount} standard, $${prices.difficult.amount} difficult (roof or long run), $${prices.annual.amount}/year annual plan. No estimate visit, no trip charge, price locked before you book.`,
    current: "pricing",
    body,
    jsonLd,
  });
}
