/* Boulder County Dryer Vent — shared behaviour. No dependencies. */
(function () {
  'use strict';
  var CFG = window.BCDV || {};

  /* ── First-party analytics beacon (no-op when endpoint is empty) ─ */
  function track(event, props) {
    var endpoint = CFG.analyticsEndpoint;
    if (!endpoint || !event) return;
    var body = {
      event: String(event),
      path: location.pathname + location.search,
      referrer: document.referrer || '',
      ts: new Date().toISOString()
    };
    if (props && typeof props === 'object') {
      Object.keys(props).forEach(function (k) {
        if (/^(name|email|phone|street)$/i.test(k)) return;
        if (props[k] == null) return;
        body[k] = props[k];
      });
    }
    var json = JSON.stringify(body);
    try {
      if (navigator.sendBeacon) {
        var blob = new Blob([json], { type: 'application/json' });
        if (navigator.sendBeacon(endpoint, blob)) return;
      }
    } catch (err) { /* fall through to fetch */ }
    try {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
        keepalive: true,
        credentials: 'omit'
      }).catch(function () {});
    } catch (err) { /* never block UX */ }
  }
  window.__bcdvTrack = track;
  CFG.track = track;

  track('pageview');

  document.addEventListener('click', function (e) {
    var el = e.target.closest('a[href]');
    if (!el) return;
    var href = el.getAttribute('href') || '';
    if (el.hasAttribute('data-book-cta') ||
        ((el.classList.contains('btn') || el.classList.contains('book')) && /\/book\/?(\?|#|$)/.test(href))) {
      track('book_cta_click');
    }
  });

  /* ── Mobile menu ─────────────────────────────────────────────────── */
  var openBtn = document.querySelector('[data-menu-open]');
  var overlay = document.querySelector('[data-menu]');
  if (openBtn && overlay) {
    var closeBtn = overlay.querySelector('[data-menu-close]');
    var lastFocus = null;
    function setMenu(open) {
      overlay.classList.toggle('is-open', open);
      overlay.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);
      openBtn.setAttribute('aria-expanded', String(open));
      if (open) { lastFocus = document.activeElement; (closeBtn || overlay).focus(); }
      else if (lastFocus) { lastFocus.focus(); }
    }
    openBtn.addEventListener('click', function () { setMenu(true); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
    overlay.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('is-open')) setMenu(false); });
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  /* ── Before / after reveal slider ────────────────────────────────── */
  document.querySelectorAll('[data-reveal]').forEach(function (fig) {
    var range = fig.querySelector('input[type="range"]');
    if (!range) return;
    var apply = function () { fig.style.setProperty('--reveal', range.value + '%'); };
    range.addEventListener('input', apply);
    apply();
  });

  /* ── Blog category filter ────────────────────────────────────────── */
  var filters = document.querySelector('[data-filters]');
  if (filters) {
    var cards = document.querySelectorAll('[data-cat]');
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      var cat = btn.getAttribute('data-filter');
      filters.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      cards.forEach(function (c) { c.hidden = cat !== 'all' && c.getAttribute('data-cat') !== cat; });
    });
  }

  /* ── Forms: POST to an endpoint when configured, else compose an email ─ */
  function encodeBody(lines) { return encodeURIComponent(lines.join('\n')); }

  function mailtoFor(subject, lines) {
    return 'mailto:' + CFG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeBody(lines);
  }

  // Returns a promise resolving to { via: 'endpoint' | 'mailto' }.
  function deliver(subject, fields) {
    var lines = Object.keys(fields).map(function (k) { return k + ': ' + (fields[k] || '—'); });
    if (CFG.formEndpoint) {
      return fetch(CFG.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.assign({ _subject: subject }, fields))
      }).then(function (r) {
        if (!r.ok) throw new Error('endpoint ' + r.status);
        return { via: 'endpoint' };
      });
    }
    window.location.href = mailtoFor(subject, lines);
    return Promise.resolve({ via: 'mailto', mailto: mailtoFor(subject, lines) });
  }
  window.BCDV_deliver = deliver;

  /* ── Contact form ────────────────────────────────────────────────── */
  var contact = document.querySelector('[data-contact-form]');
  if (contact) {
    var done = document.querySelector('[data-contact-done]');
    var err = contact.querySelector('[data-error]');
    contact.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!contact.reportValidity()) return;
      var f = new FormData(contact);
      var fields = {
        Name: f.get('name'), Phone: f.get('phone'), Email: f.get('email'), Message: f.get('message'),
        Page: window.location.href
      };
      var btn = contact.querySelector('button[type="submit"]');
      btn.disabled = true;
      deliver('Website message from ' + (f.get('name') || 'a visitor'), fields).then(function (res) {
        contact.hidden = true;
        if (done) {
          done.hidden = false;
          var via = done.querySelector('[data-via]');
          if (via) via.textContent = res.via === 'endpoint'
            ? 'Your message is on its way. We answer during office hours, usually within a few hours.'
            : 'Your email app should have opened with the message filled in — press send there. If it did not open, call or email us directly below.';
          var link = done.querySelector('[data-mailto]');
          if (link && res.mailto) { link.href = res.mailto; link.hidden = false; }
          done.focus();
        }
      }).catch(function () {
        btn.disabled = false;
        if (err) { err.hidden = false; err.textContent = 'That did not go through. Call ' + CFG.phone + ' or email ' + CFG.email + '.'; }
      });
    });
  }
})();
