/* AegisCare research site — behaviour (vanilla JS, no libraries).
   The site still reads fine with JavaScript off; this file adds the theme toggle and animations. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- theme toggle (remembered in the browser) ---- */
  var root = document.documentElement;
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('aegis-theme', t); } catch (e) {}
    var m = $('meta[name="theme-color"]'); if (m) m.setAttribute('content', t === 'light' ? '#EDF2FF' : '#0F0E1E');
    $$('.theme-btn').forEach(function (b) { b.setAttribute('aria-label', t === 'light' ? 'Switch to dark mode' : 'Switch to light mode'); b.setAttribute('aria-pressed', t === 'light'); });
  }
  setTheme(root.getAttribute('data-theme') || 'dark');
  $$('.theme-btn').forEach(function (b) {
    b.addEventListener('click', function () { setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'); });
  });

  /* ---- mobile menu ---- */
  var burger = $('.burger'), menu = $('.menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });
  }

  /* ---- scroll progress, nav shadow, back-to-top ---- */
  var bar = $('.progress'), nav = $('.nav'), top = $('.totop');
  function onScroll() {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight, y = window.scrollY;
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (nav) nav.classList.toggle('scrolled', y > 8);
    if (top) top.classList.toggle('show', y > 700);
    $$('.tline').forEach(function (t) {
      var r = t.getBoundingClientRect(), p = (innerHeight * .6 - r.top) / r.height;
      t.style.setProperty('--fill', Math.max(0, Math.min(1, p)) * 100 + '%');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (top) top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---- reveal on scroll ---- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* ---- count-up numbers ---- */
  function count(el) {
    var end = parseFloat(el.getAttribute('data-count')), dur = 1400, t0 = null;
    if (reduce) { el.textContent = end; return; }
    function f(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(end * e); if (p < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { count(e.target); co.unobserve(e.target); } }); }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { co.observe(el); });
  }

  /* ---- rotating word in hero ---- */
  var rot = $('.rot');
  if (rot && !reduce) {
    var words = rot.getAttribute('data-words').split('|'), i = 0;
    setInterval(function () {
      rot.classList.add('out');
      setTimeout(function () { i = (i + 1) % words.length; rot.textContent = words[i]; rot.classList.remove('out'); }, 320);
    }, 2400);
  }

  /* ---- spotlight follows the cursor on cards ---- */
  document.addEventListener('pointermove', function (e) {
    var c = e.target.closest && e.target.closest('.card'); if (!c) return;
    var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---- simulated pipeline console (illustration only) ---- */
  var con = $('#console');
  if (con) {
    var body = $('.body', con);
    var script = [
      ['<span class="k">mqtt</span> imu/6-axis  ax=0.03 ay=-0.01 az=0.99'],
      ['<span class="k">window</span> 20 samples  features=52'],
      ['<span class="k">rf</span> class=walking  conf=0.93'],
      ['<span class="k">fall_engine</span> tilt=9°  stay_down=no  <span class="ok">no fall</span>'],
      ['<span class="k">mqtt</span> imu/6-axis  ax=0.71 ay=0.42 az=0.18'],
      ['<span class="k">rf</span> class=fall_forward  conf=0.88'],
      ['<span class="k">fall_engine</span> tilt=74°  stay_down=yes  <span class="no">FALL CONFIRMED</span>'],
      ['<span class="k">xgboost</span> 9 features → tier=<span class="wn">caregiver alert</span>'],
      ['<span class="k">notify</span> caregiver  <span class="ok">sent</span>']
    ], n = 0;
    function line() {
      var d = document.createElement('div'); d.className = 'ln'; d.innerHTML = script[n % script.length][0]; body.appendChild(d);
      while (body.children.length > 4) body.removeChild(body.firstChild);
      n++;
    }
    line(); line();
    if (!reduce) setInterval(line, 1500);
  }

  /* ---- lightbox for diagrams ---- */
  var lb = document.createElement('div'); lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-label', 'Enlarged diagram');
  lb.innerHTML = '<button class="icon-btn" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="pic"><img alt=""></div>';
  document.body.appendChild(lb);
  var lbi = $('img', lb), last;
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; if (last) last.focus(); }
  $$('.plate').forEach(function (p) {
    p.setAttribute('tabindex', '0'); p.setAttribute('role', 'button');
    var im = $('img', p); p.setAttribute('aria-label', 'Enlarge: ' + (im.alt || 'diagram'));
    function open() { last = p; lbi.src = im.currentSrc || im.src; lbi.alt = im.alt; lb.classList.add('open'); document.body.style.overflow = 'hidden'; $('button', lb).focus(); }
    p.addEventListener('click', open);
    p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });

  /* ---- on-this-page highlight (feature pages) ---- */
  var toc = $$('.toc a');
  if (toc.length && 'IntersectionObserver' in window) {
    var secs = toc.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { toc.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); } });
    }, { rootMargin: '-30% 0px -60% 0px' });
    secs.forEach(function (s) { so.observe(s); });
  }

  /* ---- Fall Engine demo (component 1) ---- */
  var fe = $('#fall-demo');
  if (fe) {
    var conf = $('#in-conf'), tilt = $('#in-tilt'), stay = $('#in-stay');
    var out = { conf: $('#v-conf'), tilt: $('#v-tilt'), stay: $('#v-stay') };
    var pill = { conf: $('#p-conf'), tilt: $('#p-tilt'), stay: $('#p-stay') };
    var verdict = $('#verdict'), vbig = $('#v-big'), vtxt = $('#v-txt'), score = $('#score'), scoreV = $('#score-v');
    function setPill(k, ok) { pill[k].textContent = ok ? 'Agrees' : 'Not met'; pill[k].className = 'status-pill ' + (ok ? 'pass' : 'fail'); }
    function upd() {
      [conf, tilt].forEach(function (r) { r.style.setProperty('--p', (r.value - r.min) / (r.max - r.min) * 100 + '%'); });
      var c = +conf.value, t = +tilt.value, s = stay.checked;
      out.conf.textContent = c + '%'; out.tilt.textContent = t + '°'; out.stay.textContent = s ? 'Stays down' : 'Gets up';
      var a = c >= 60, b = t >= 30; setPill('conf', a); setPill('tilt', b); setPill('stay', s);
      var n = (a ? 1 : 0) + (b ? 1 : 0) + (s ? 1 : 0);
      var risk = Math.round(Math.min(100, (c * .4 + Math.min(t, 90) / 90 * 100 * .35 + (s ? 25 : 0))));
      score.style.setProperty('--s', risk + '%'); scoreV.textContent = risk + ' / 100';
      verdict.classList.remove('fall', 'ok');
      if (n === 3) { verdict.classList.add('fall'); vbig.textContent = 'Fall confirmed'; vtxt.textContent = 'Classifier, body tilt and stay-down check all agree. The caregiver is alerted with the reasons.'; }
      else {
        verdict.classList.add('ok'); vbig.textContent = 'No fall confirmed';
        var miss = []; if (!a) miss.push('classifier confidence is below 60%'); if (!b) miss.push('tilt is below 30°'); if (!s) miss.push('the person gets back up');
        vtxt.textContent = 'Not confirmed because ' + miss.join(' and ') + '. One signal alone never raises an alarm.';
      }
    }
    [conf, tilt, stay].forEach(function (e) { e.addEventListener('input', upd); });
    $$('[data-preset]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = b.getAttribute('data-preset').split(',');
        conf.value = p[0]; tilt.value = p[1]; stay.checked = p[2] === '1'; upd();
      });
    });
    upd();
  }

  /* ---- research archive: filters + check which files are uploaded ---- */
  var flt = $$('.filters button');
  if (flt.length) {
    flt.forEach(function (b) {
      b.addEventListener('click', function () {
        flt.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true');
        var k = b.getAttribute('data-f');
        $$('.file').forEach(function (f) { f.classList.toggle('hide', k !== 'all' && f.getAttribute('data-kind') !== k); });
        $$('.stage').forEach(function (s) { s.style.display = $$('.file:not(.hide)', s).length ? '' : 'none'; });
      });
    });
  }
  function human(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  if (/^https?:$/.test(location.protocol)) {
    $$('.file').forEach(function (f) {
      var a = $('a[download]', f); if (!a) return;
      fetch(a.getAttribute('href'), { method: 'HEAD' }).then(function (r) {
        if (r.status === 404) { f.classList.add('pending'); return; }
        var l = r.headers.get('content-length'); if (l && r.ok) { var s = $('.size', f); if (s) s.textContent = human(+l); }
      }).catch(function () {});
    });
  }

  if (reduce) $$('svg').forEach(function (s) { if (s.pauseAnimations) s.pauseAnimations(); });

  /* ---- footer year ---- */
  $$('.yr').forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
