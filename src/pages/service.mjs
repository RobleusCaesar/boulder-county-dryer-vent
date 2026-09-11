import { site, routes, prices, serviceSteps, serviceIncluded, serviceWarnings, serviceFaqs } from "../data/site.mjs";
import { esc, corners, join, icons, checkList, faqList } from "../lib/html.mjs";
import { page, ctaBand, bookBtn } from "../templates/layout.mjs";

export function servicePage() {
  const body = `
<section class="bg-sand bb">
  <div class="wrap section--hero grid grid-2 center">
    <div>
      <p class="kicker">The service</p>
      <h1 class="t-page">What a dryer vent cleaning actually involves</h1>
      <p class="lede lede--tight" style="margin-bottom:26px">About an hour at your house, one tech, one vacuum, and a duct that moves air the way the manufacturer intended. Here is every step, in order.</p>
      <div class="actions">
        ${bookBtn(`Book My Visit · $${prices.standard.amount}`)}
        <a href="${routes.pricing}" class="btn btn-outline-ink">See pricing</a>
      </div>
    </div>
    <figure class="blueprint">
      ${corners()}
      <span class="fig-img ar-16-9"><img src="/img/laundry-room.jpg" alt="Technician with a rotary brush at a laundry-room dryer connection" width="1448" height="1086"></span>
    </figure>
  </div>
</section>

<section class="bg-white">
  <div class="wrap section">
    <p class="kicker">How a visit works</p>
    <h2 class="t-section t-section--sm max-24 mb-4">Five steps, about an hour</h2>
    <div class="steps">
      ${join(
        serviceSteps,
        (s) => `<div class="step"><div class="step-rail"><span class="num">${s.n}</span><i></i></div><div class="step-body"><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></div></div>`,
      )}
    </div>
  </div>
</section>

<section class="bg-sand bt bb">
  <div class="wrap section grid grid-2 start">
    <div>
      <p class="kicker">What&#8217;s included</p>
      <h2 class="t-section t-section--sm" style="margin-bottom:16px">Everything in the flat price</h2>
      <p class="body-lg" style="max-width:44ch;margin-bottom:22px">There is no upgraded version of this service. One tier of work, done the same way at every house.</p>
      <a href="${routes.book}" class="btn btn--md btn-ember">Book My Visit</a>
    </div>
    <ul class="check-list check-list--boxed">
      ${join(serviceIncluded, (inc) => `<li class="blueprint">${corners()}${icons.check("#2E8B57", 17)}<span>${esc(inc)}</span></li>`)}
    </ul>
  </div>
</section>

<section class="bg-white">
  <div class="wrap section">
    <div class="blueprint card card--accent card--pad-xl">
      ${corners()}
      <h2 class="t-section t-section--sm" style="font-size:clamp(28px,4.2vw,44px);margin-bottom:8px">When to call sooner</h2>
      <p class="body-lg" style="max-width:56ch;margin-bottom:22px">Any one of these means the duct is restricted now, not next year. Do not wait for the annual visit.</p>
      <div class="warnings">
        ${join(serviceWarnings, (w) => `<div class="warning">${icons.warn()}<span>${esc(w)}</span></div>`)}
      </div>
    </div>
  </div>
</section>

<section class="bg-sand bt">
  <div class="wrap wrap--narrow section">
    <h2 class="t-section t-section--sm mb-2">Common questions</h2>
    ${faqList(serviceFaqs)}
  </div>
</section>

${ctaBand({ lede: "Two questions, then your published price and a request for the days that work." })}`;

  return page({
    path: routes.service,
    title: "The service — what a dryer vent cleaning involves",
    description: `Every step of a Boulder County Dryer Vent visit: airflow reading, rotary brush of the full run, hood and flapper, before-and-after photos. About an hour, $${prices.standard.amount} flat for most homes.`,
    current: "service",
    body,
  });
}
