import { site, routes, prices, towns, booking } from "../data/site.mjs";
import { esc, attr, corners, join, icons, checkList } from "../lib/html.mjs";
import { page, header } from "../templates/layout.mjs";

const optButton = (group, o) => `
<button type="button" role="radio" aria-checked="false" class="opt blueprint" data-group="${group}" data-pick="${o.id}">
  ${corners()}
  <span class="dot"></span>
  <span class="opt-text"><b>${esc(o.label)}</b><small>${esc(o.hint)}</small></span>
</button>`;

export function bookPage() {
  const body = `
<div class="book-page" data-book>
  <div class="book-progress">
    <div class="wrap wrap--narrow">
      <ol class="progress" data-progress aria-label="Booking progress">
        <li class="current"><i></i><span><b>01</b><em>Eligibility</em></span></li>
        <li><i></i><span><b>02</b><em>Price</em></span></li>
        <li><i></i><span><b>03</b><em>Times</em></span></li>
      </ol>
    </div>
  </div>

  <div class="wrap wrap--narrow book-main">

    <section class="book-step" data-step="1">
      <p class="kicker">Step one of three</p>
      <h1 class="book-h1">Two questions about the vent</h1>
      <p class="book-lede">This is all it takes to know your price. No address, no email, nothing to install.</p>

      <fieldset class="q">
        <legend>Where does the vent exit the house?</legend>
        <div class="opts" role="radiogroup" aria-label="Where the vent exits">
          ${join(booking.exitOptions, (o) => optButton("exit", o))}
        </div>
      </fieldset>

      <fieldset class="q">
        <legend>How far is the dryer from that exit?</legend>
        <div class="opts" role="radiogroup" aria-label="Distance from dryer to exit">
          ${join(booking.runOptions, (o) => optButton("run", o))}
        </div>
      </fieldset>

      <button type="button" class="btn btn-ember blueprint btn--block book-cta" data-next="2" disabled>
        ${corners()}Show my price ${icons.arrow()}
      </button>
      <p class="book-fine">Not sure? <a href="${site.phoneHref}">Call ${site.phoneDisplay}</a> and we will work it out in a minute.</p>
    </section>

    <section class="book-step" data-step="2" hidden>
      <p class="kicker">Step two of three</p>
      <h1 class="book-h1" style="margin-bottom:clamp(22px,3vw,32px)">Here is your price</h1>
      <div class="blueprint price-plate">
        ${corners()}
        <span class="tier-pill">${icons.check("#2E8B57", 14)}<span data-tier>Standard clean</span></span>
        <div class="price-big"><b data-price>$${prices.standard.amount}</b><span>flat</span></div>
        <p class="price-note" data-price-note></p>
        ${checkList(booking.included)}
      </div>
      <div class="blueprint info-box">
        ${corners()}
        ${icons.info()}
        <p>After this visit, the annual plan keeps the same clean at <strong>$${prices.annual.amount}</strong> a year, same month every year. Tick the box on the next step and we set it up.</p>
      </div>
      <button type="button" class="btn btn-ember blueprint btn--block book-cta" data-next="3" style="margin-top:20px">${corners()}Continue — request my visit</button>
      <p class="book-fine">Next you’ll pick days that work — holding a time costs nothing.</p>
      <button type="button" class="text-btn book-back" data-next="1">&#8592; Change my answers</button>
    </section>

    <section class="book-step" data-step="3" hidden>
      <p class="kicker">Step three of three</p>
      <h1 class="book-h1">We’ll confirm a 2-hour window in 1 business day</h1>
      <p class="book-lede" style="margin-bottom:clamp(22px,3vw,32px)">3–4 business days out is typical right now. Holding a time costs nothing.</p>

      <div class="slots" data-slots hidden role="radiogroup" aria-label="Open times"></div>

      <div class="blueprint empty-cal" data-empty>
        ${corners()}
        <h2>${esc(booking.emptyCalendarTitle)}</h2>
        <p>We do not show placeholder appointment slots. Leave your details and the days that suit you, and you get first pick when the next route through your town opens. Your price stays <strong data-price>$${prices.standard.amount}</strong>.</p>

        <form class="form" data-request-form novalidate>
          <div class="form-2">
            <div class="field"><label for="b-name">Name</label><input id="b-name" name="name" class="input" type="text" required autocomplete="name" placeholder="Jane Doe"></div>
            <div class="field"><label for="b-phone">Mobile phone</label><input id="b-phone" name="phone" class="input" type="tel" required autocomplete="tel" placeholder="(303) 555-0134"></div>
          </div>
          <div class="field"><label for="b-email">Email</label><input id="b-email" name="email" class="input" type="email" required autocomplete="email" placeholder="you@example.com"></div>
          <div class="form-2">
            <div class="field">
              <label for="b-town">Town</label>
              <select id="b-town" name="town" class="input" required>
                <option value="" selected disabled>Choose a town</option>
                ${join(towns, (t) => `<option value="${attr(t.name)}">${esc(t.name)}, CO</option>`)}
                <option value="Other">Somewhere else in Boulder County</option>
              </select>
            </div>
            <div class="field">
              <label for="b-zip">ZIP</label>
              <input id="b-zip" name="zip" class="input" type="text" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" required placeholder="80301">
              <p class="hint" data-zip-hint aria-live="polite"></p>
            </div>
          </div>
          <div class="field"><label for="b-street">Street address</label><input id="b-street" name="street" class="input" type="text" required autocomplete="street-address" placeholder="1234 Example St"></div>
          <div class="field"><label for="b-days">Days and times that work</label><input id="b-days" name="days" class="input" type="text" placeholder="Weekday mornings, or any Saturday"></div>
          <div class="field"><label for="b-notes">Notes (gate codes, dryer location, anything unusual)</label><textarea id="b-notes" name="notes" class="input" style="min-height:96px"></textarea></div>
          <label class="checkbox"><input type="checkbox" name="annual" value="yes"> Set me up on the annual plan after this visit ($${prices.annual.amount}/year, cancel any year).</label>
          <label class="checkbox"><input type="checkbox" name="sms" value="yes"> Text me about this appointment. Frequency varies, message and data rates may apply, reply STOP to opt out. Not required to book.</label>
          <button type="submit" class="btn btn-ember blueprint btn--block book-cta">${corners()}Request my visit</button>
          <p class="book-fine">Prefer to talk? <a href="${site.phoneHref}">${site.phoneDisplay}</a></p>
          <p class="form-error" data-error hidden></p>
          <p class="form-note">Nothing is charged. You pay after the visit. <a href="${routes.terms}">Terms</a> &#183; <a href="${routes.privacy}">Privacy</a></p>
        </form>
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:10px 22px;justify-content:center;margin-top:16px">
        <button type="button" class="text-btn" data-next="2">&#8592; Back to price</button>
      </div>
    </section>

    <section class="book-step" data-step="4" hidden>
      <div class="blueprint done-card">
        ${corners()}
        <span class="done-mark">${icons.bigCheck()}</span>
        <h1>Request received</h1>
        <p data-done-via></p>
        <dl class="summary" data-summary></dl>
        <div class="actions actions--confirm" style="margin-top:24px">
          <a href="${site.phoneHref}" class="btn btn--md btn-outline-ink btn--phone">${site.phoneDisplay}</a>
          <a href="${routes.home}" class="btn btn--md btn-quiet">Back to home</a>
          <button type="button" class="btn btn--md btn-quiet" data-restart>Start over</button>
        </div>
      </div>
    </section>

  </div>

  <div class="book-foot">
    <div class="wrap wrap--narrow">
      <span>${esc(site.name)} &#183; ${site.phoneDisplay}</span>
      <a href="${routes.terms}">Terms</a>
      <a href="${routes.privacy}">Privacy</a>
    </div>
  </div>
</div>`;

  return page({
    path: routes.book,
    title: "Book My Visit — see your price in two taps",
    description: `Two questions about your dryer vent, your published price ($${prices.standard.amount} or $${prices.difficult.amount}), then request the days that work. No card to hold a time.`,
    current: "",
    body,
    bare: true,
    customHeader: header(""),
    noBar: true,
    scripts: ["/js/book.js"],
  });
}
