/* Booking flow: eligibility → price → request a time → confirmation.
   Pricing rule mirrors src/data/site.mjs: roof/second-story OR a run over
   ~15 ft is the difficult tier; everything else (including "not sure") is standard. */
(function () {
  'use strict';
  var CFG = window.BCDV || {};
  var PRICES = CFG.prices || { standard: 99, difficult: 169, annual: 109, standardNormally: 129 };
  var STANDARD_NORMALLY = PRICES.standardNormally || 129;
  var SPECIAL_THROUGH = CFG.launchSpecialThrough || 'Sunday Sep 20';
  var SLOTS = CFG.slots || []; // Populate in src/data/site.mjs when real capacity exists.
  var ZIPS = CFG.inAreaZips || [];
  var KEY = 'bcdv.book.v2';

  var root = document.querySelector('[data-book]');
  if (!root) return;

  var state = { step: 1, exit: null, run: null, slot: null };
  try { Object.assign(state, JSON.parse(sessionStorage.getItem(KEY) || '{}')); } catch (e) {}
  if (state.step === 4) state.step = 1;

  var steps = root.querySelectorAll('[data-step]');
  var progress = document.querySelectorAll('[data-progress] li');
  var STEP_IDS = { 1: 'eligibility', 2: 'price', 3: 'times', 4: 'confirm' };
  var lastViewedStep = null;

  function track(event, props) {
    if (typeof window.__bcdvTrack === 'function') window.__bcdvTrack(event, props);
  }
  function trackStepView() {
    var id = STEP_IDS[state.step];
    if (!id || lastViewedStep === id) return;
    lastViewedStep = id;
    track('book_step_view', { step: id });
  }

  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function difficult() { return state.exit === 'roof' || state.run === 'far'; }
  function price() { return difficult() ? PRICES.difficult : PRICES.standard; }
  function tierLabel() { return difficult() ? 'Difficult clean' : 'Standard clean'; }

  function render() {
    steps.forEach(function (s) { s.hidden = Number(s.getAttribute('data-step')) !== state.step; });
    progress.forEach(function (li, i) {
      var n = i + 1;
      li.classList.toggle('done', n < state.step);
      li.classList.toggle('current', n === state.step);
    });
    // Step 1 options
    root.querySelectorAll('[data-pick]').forEach(function (b) {
      var group = b.getAttribute('data-group');
      b.setAttribute('aria-checked', String(state[group] === b.getAttribute('data-pick')));
    });
    var next1 = root.querySelector('[data-next="2"]');
    if (next1) next1.disabled = !(state.exit && state.run);
    // Step 2 price
    var d = difficult();
    root.querySelectorAll('[data-price]').forEach(function (el) { el.textContent = '$' + price(); });
    root.querySelectorAll('[data-tier]').forEach(function (el) { el.textContent = tierLabel(); });
    var was = root.querySelector('[data-price-was]');
    if (was) {
      was.hidden = d;
      if (!d) was.textContent = 'Normally $' + STANDARD_NORMALLY;
    }
    var note = root.querySelector('[data-price-note]');
    if (note) note.textContent = d
      ? 'Roof access and long runs take an extra set of rods and about forty minutes more on site. This is the published difficult rate — it will not move at the door.'
      : 'Launch special for one standard clean: $' + PRICES.standard + ' (normally $' + STANDARD_NORMALLY + ') through ' + SPECIAL_THROUGH + '. It covers everything below, and it will not move at the door.';
    // Step 3 slots vs request
    var slotsWrap = root.querySelector('[data-slots]');
    var emptyWrap = root.querySelector('[data-empty]');
    if (slotsWrap && emptyWrap) {
      var has = SLOTS.length > 0;
      slotsWrap.hidden = !has;
      emptyWrap.hidden = has;
      if (has && !slotsWrap.hasChildNodes()) {
        SLOTS.forEach(function (s) {
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'slot blueprint'; b.setAttribute('role', 'radio');
          b.setAttribute('data-slot', s.id);
          b.innerHTML = corners() + '<b></b><span></span><small></small>';
          b.querySelector('b').textContent = s.day;
          b.querySelector('span').textContent = s.window;
          b.querySelector('small').textContent = s.town;
          slotsWrap.appendChild(b);
        });
      }
      slotsWrap.querySelectorAll('[data-slot]').forEach(function (b) {
        b.setAttribute('aria-checked', String(state.slot === b.getAttribute('data-slot')));
      });
    }
    save();
  }

  function corners() { return '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>'; }

  function go(n) {
    var from = state.step;
    if (n > from && STEP_IDS[from]) track('book_step_complete', { step: STEP_IDS[from] });
    state.step = n;
    render();
    trackStepView();
    window.scrollTo({ top: 0, behavior: 'auto' });
    var h = root.querySelector('[data-step="' + n + '"] h1');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  root.addEventListener('click', function (e) {
    var pick = e.target.closest('[data-pick]');
    if (pick) { state[pick.getAttribute('data-group')] = pick.getAttribute('data-pick'); render(); return; }
    var slot = e.target.closest('[data-slot]');
    if (slot) { state.slot = slot.getAttribute('data-slot'); render(); return; }
    var next = e.target.closest('[data-next]');
    if (next) { go(Number(next.getAttribute('data-next'))); return; }
    var restart = e.target.closest('[data-restart]');
    if (restart) { state = { step: 1, exit: null, run: null, slot: null }; try { sessionStorage.removeItem(KEY); } catch (err) {} go(1); }
  });

  /* ZIP live check on the request form */
  var zipInput = root.querySelector('input[name="zip"]');
  var zipHint = root.querySelector('[data-zip-hint]');
  if (zipInput && zipHint) {
    zipInput.addEventListener('input', function () {
      var z = zipInput.value.replace(/\D/g, '').slice(0, 5);
      zipInput.value = z;
      zipHint.className = 'hint';
      if (z.length < 5) { zipHint.textContent = ''; return; }
      if (ZIPS.indexOf(z) !== -1) { zipHint.textContent = 'In our service area.'; zipHint.classList.add('ok'); }
      else { zipHint.textContent = 'Outside the five towns we publish. Send it anyway and we will tell you if a route can reach you.'; zipHint.classList.add('warn'); }
    });
  }

  /* Request form submit */
  var form = root.querySelector('[data-request-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var f = new FormData(form);
      var chosen = SLOTS.filter(function (s) { return s.id === state.slot; })[0];
      var fields = {
        Service: tierLabel() + ' — $' + price() + ' flat',
        'Vent exit': labelFor('exit'),
        'Duct run': labelFor('run'),
        Town: f.get('town'),
        ZIP: f.get('zip'),
        Street: f.get('street'),
        'Preferred days': chosen ? chosen.day + ', ' + chosen.window : (f.get('days') || '—'),
        Name: f.get('name'),
        Phone: f.get('phone'),
        Email: f.get('email'),
        'Annual plan': f.get('annual') ? 'Interested' : 'No',
        'SMS consent': f.get('sms') ? 'Yes' : 'No',
        Notes: f.get('notes'),
        Page: window.location.href
      };
      var btn = form.querySelector('button[type="submit"]');
      var err = form.querySelector('[data-error]');
      btn.disabled = true;
      window.BCDV_deliver('Booking request — ' + fields.Service + ' — ' + (f.get('town') || 'Boulder County'), fields)
        .then(function (res) {
          track('book_submit');
          fillSummary(fields, res);
          go(4);
          btn.disabled = false;
        })
        .catch(function () {
          btn.disabled = false;
          if (err) { err.hidden = false; err.textContent = 'That did not go through. Call ' + CFG.phone + ' and we will book it in a minute.'; }
        });
    });
  }

  function labelFor(group) {
    var b = root.querySelector('[data-group="' + group + '"][data-pick="' + state[group] + '"] b');
    return b ? b.textContent : '—';
  }

  function fillSummary(fields, res) {
    var dl = root.querySelector('[data-summary]');
    if (!dl) return;
    dl.innerHTML = '';
    [['Service', fields.Service], ['Town', fields.Town + (fields.ZIP ? ' · ' + fields.ZIP : '')], ['Preferred days', fields['Preferred days']], ['Contact', fields.Phone]]
      .forEach(function (row) {
        var div = document.createElement('div');
        var dt = document.createElement('dt'); dt.textContent = row[0];
        var dd = document.createElement('dd'); dd.textContent = row[1] || '—';
        div.appendChild(dt); div.appendChild(dd); dl.appendChild(div);
      });
    var h1 = root.querySelector('[data-step="4"] h1');
    if (h1) h1.textContent = res.via === 'endpoint' ? 'Request received' : 'Request ready to send';
    var via = root.querySelector('[data-done-via]');
    if (via) via.textContent = res.via === 'endpoint'
      ? 'Your request is in. We confirm a two-hour window by text or email, usually within one business day. Nothing was charged.'
      : 'Your email app should have opened with the request filled in — press send there and we confirm a two-hour window by text or email, usually within one business day. If it did not open, call us and we will take it over the phone. Nothing was charged.';
  }

  render();
  trackStepView();
})();
