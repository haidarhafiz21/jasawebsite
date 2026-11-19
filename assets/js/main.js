/* =========================================================
   Haidar Hafiz — Jasa Pembuatan Website
   Interaksi & animasi halaman (tanpa framework).
   ---------------------------------------------------------
   Nomor WhatsApp tujuan formulir: ubah WA_NUMBER di bawah
   (format internasional tanpa "+", mis. 6285230732988).
   ========================================================= */
(function () {
  'use strict';

  var WA_NUMBER = '6285230732988';

  var doc = document.documentElement;
  var body = document.body;
  window.__siteReady = true;

  var ANIM = doc.classList.contains('js');
  var mq = function (q) { return window.matchMedia(q); };
  var onMQ = function (m, fn) { if (m.addEventListener) m.addEventListener('change', fn); else if (m.addListener) m.addListener(fn); };
  var reduce = mq('(prefers-reduced-motion: reduce)');
  var fine = mq('(hover: hover) and (pointer: fine)');
  var wide = mq('(min-width: 961px)');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var getY = function () { return window.pageYOffset || doc.scrollTop || 0; };
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Scroll halus (Lenis) — hanya untuk mouse/trackpad ---------- */
  var lenis = null;
  if (ANIM && window.Lenis && !reduce.matches && fine.matches) {
    try {
      lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    } catch (err) { lenis = null; }
  }

  /* ---------- Satu loop animasi untuk semua efek ---------- */
  var tasks = [];
  var rafId = 0, idle = 0;
  var sy = getY(), vel = 0;

  function frame(t) {
    if (lenis) lenis.raf(t);
    var y = getY();
    vel = y - sy; sy = y;
    for (var i = 0; i < tasks.length; i++) tasks[i](t);
    if (lenis || idle-- > 0) rafId = requestAnimationFrame(frame);
    else rafId = 0;
  }
  function wake(n) {
    idle = Math.max(idle, n || 40);
    if (!rafId) rafId = requestAnimationFrame(frame);
  }
  wake(10);
  window.addEventListener('scroll', function () { wake(40); }, { passive: true });
  window.addEventListener('resize', function () { wake(40); }, { passive: true });

  /* ---------- Header: muncul/sembunyi mengikuti arah gulir, gelap di atas hero ---------- */
  var hdr = $('#hdr');
  var heroCard = $('.hero__card');
  var hdrHidden = false, hdrScrolled = false, hdrDark = hdr.classList.contains('hdr--dark'), anchorY = sy;
  tasks.push(function () {
    var scrolled = sy > 8;
    if (scrolled !== hdrScrolled) { hdrScrolled = scrolled; hdr.classList.toggle('is-scrolled', scrolled); }
    if (heroCard) {
      var dark = heroCard.getBoundingClientRect().bottom > hdr.offsetHeight * 0.55;
      if (dark !== hdrDark) { hdrDark = dark; hdr.classList.toggle('hdr--dark', dark); }
    }
    if (doc.classList.contains('menu-open')) { anchorY = sy; return; }
    var dy = sy - anchorY;
    if (Math.abs(dy) > 8) {
      var hide = dy > 0 && sy > 160;
      if (hide !== hdrHidden) { hdrHidden = hide; hdr.classList.toggle('is-hidden', hide); }
      anchorY = sy;
    }
  });
  hdr.addEventListener('focusin', function () { hdrHidden = false; hdr.classList.remove('is-hidden'); });

  /* ---------- Menu HP ---------- */
  var menu = $('#menu');
  var burger = $('#burger');
  $$('.menu__nav a').forEach(function (a, i) { a.style.setProperty('--i', i); });

  function setMenu(open) {
    if (open === menu.classList.contains('is-open')) return;
    menu.classList.toggle('is-open', open);
    doc.classList.toggle('menu-open', open);
    if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    if (open) {
      hdrHidden = false; hdr.classList.remove('is-hidden');
      if (lenis) lenis.stop();
      doc.style.overflow = 'hidden';
      var first = menu.querySelector('a');
      setTimeout(function () { if (menu.classList.contains('is-open') && first) first.focus({ preventScroll: true }); }, 380);
    } else {
      doc.style.overflow = '';
      if (lenis) lenis.start();
    }
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); burger.focus(); }
  });
  onMQ(mq('(min-width: 1101px)'), function (e) { if (e.matches) setMenu(false); });

  /* ---------- Tautan internal (#...) dengan gulir halus ---------- */
  function scrollToTarget(target) {
    var now = getY();
    var top = typeof target === 'number' ? target : target.getBoundingClientRect().top + now - 8;
    top = Math.max(0, top);
    if (lenis) {
      // samakan dulu posisi Lenis dengan posisi gulir sebenarnya, lalu meluncur ke tujuan
      lenis.scrollTo(now, { immediate: true, force: true });
      lenis.scrollTo(top, { duration: 1.5, force: true, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
      return;
    }
    window.scrollTo({ top: top, behavior: reduce.matches ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var target = document.getElementById(id.slice(1));
    if (!target) return;
    e.preventDefault();
    var wasOpen = menu.classList.contains('is-open');
    if (wasOpen) setMenu(false);
    var go = function () { scrollToTarget(id === '#beranda' ? 0 : target); };
    if (wasOpen) setTimeout(go, 60); else go();
    if (a.classList.contains('skip')) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });

  /* ---------- Penanda menu aktif ---------- */
  var spyLinks = $$('.nav a[data-spy]');
  if (hasIO && spyLinks.length) {
    var spyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        spyLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('data-spy') === en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spyLinks.forEach(function (l) { var s = document.getElementById(l.getAttribute('data-spy')); if (s) spyIO.observe(s); });
    var heroSec = document.getElementById('beranda');
    if (heroSec) spyIO.observe(heroSec);
  }

  /* ---------- Gambar muncul halus setelah termuat ---------- */
  $$('.work__media img, .about__visual img').forEach(function (img) {
    var ok = function () { img.classList.add('is-ok'); };
    if (img.complete && img.naturalWidth) ok();
    else { img.addEventListener('load', ok, { once: true }); img.addEventListener('error', ok, { once: true }); }
  });

  /* ---------- Tahun di footer ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Tanya jawab (accordion) ---------- */
  $$('.acc__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.acc__item');
      var open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      wake(60);
    });
  });

  /* ---------- Formulir → WhatsApp ---------- */
  var form = $('#form');
  if (form) {
    var F = form.elements;
    var rules = [
      ['nama', function (v) { return v.trim().length >= 2; }],
      ['jenis', function (v) { return !!v; }],
      ['pesan', function (v) { return v.trim().length >= 5; }]
    ];
    var clearErr = function (e) {
      var fld = e.target.closest && e.target.closest('.field');
      if (fld && fld.classList.contains('is-invalid')) {
        fld.classList.remove('is-invalid');
        e.target.setAttribute('aria-invalid', 'false');
      }
    };
    form.addEventListener('input', clearErr);
    form.addEventListener('change', clearErr);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      rules.forEach(function (r) {
        var el = F[r[0]];
        var bad = !r[1](el.value);
        el.closest('.field').classList.toggle('is-invalid', bad);
        el.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad && !firstBad) firstBad = el;
      });
      if (firstBad) { firstBad.focus(); return; }

      var lines = ['Halo Haidar, saya ingin konsultasi pembuatan website.', '', 'Nama: ' + F.nama.value.trim()];
      if (F.usaha.value.trim()) lines.push('Usaha: ' + F.usaha.value.trim());
      lines.push('Jenis website: ' + F.jenis.value);
      if (F.budget.value) lines.push('Budget: ' + F.budget.value);
      lines.push('', F.pesan.value.trim());

      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
      var win = window.open(url, '_blank');
      if (win) { try { win.opener = null; } catch (err) { /* abaikan */ } }
      else window.location.href = url;
    });

    // Tombol "Pilih paket" → isi otomatis jenis website di formulir
    $$('[data-plan]').forEach(function (a) {
      a.addEventListener('click', function () {
        var sel = F.jenis;
        var val = a.getAttribute('data-plan');
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].text === val) { sel.selectedIndex = i; break; }
        }
        sel.closest('.field').classList.remove('is-invalid');
        setTimeout(function () {
          form.classList.remove('is-flash');
          void form.offsetWidth;
          form.classList.add('is-flash');
        }, lenis ? 1300 : 800);
      });
    });
  }

  /* ---------- Tombol WhatsApp melayang ---------- */
  var waf = $('#waFloat');
  if (waf && hasIO) {
    var pastHero = false, inContact = false;
    var updWA = function () { waf.classList.toggle('is-shown', pastHero && !inContact); };
    // muncul begitu hero sudah tergulir melewati 25% atas layar
    new IntersectionObserver(function (en) { pastHero = !en[0].isIntersecting; updWA(); }, { threshold: 0, rootMargin: '-25% 0px 0px 0px' }).observe($('.hero'));
    new IntersectionObserver(function (en) { inContact = en[0].isIntersecting; updWA(); }, { threshold: 0.12 }).observe($('#kontak'));
  } else if (waf) {
    waf.classList.add('is-shown');
  }

  /* ---------- Cuplikan karya di hero (berganti otomatis) ---------- */
  var reel = $('#reel');
  var reelVisible = true;
  if (reel) {
    var DUR = 5.6;
    reel.style.setProperty('--dur', DUR + 's');
    var dSlides = $$('.reel__screen .reel__img', reel);
    var mSlides = $$('.reel__phone .reel__img', reel);
    var dots = $$('.reel__dot', reel);
    var cap = $('#reelCap'), rNo = $('#reelNo'), rName = $('#reelName'), rCat = $('#reelCat'), rUrl = $('#reelUrl');
    var tgl = $('#reelToggle');
    var ri = 0, userStop = false, hoverStop = false, focusStop = false, swapT = 0;
    var auto = function () { return !reduce.matches && !userStop; };

    var loadImg = function (img) {
      var s = img.getAttribute('data-srcset');
      if (s) { img.srcset = s; img.removeAttribute('data-srcset'); }
    };
    var loadAll = function () { dSlides.concat(mSlides).forEach(loadImg); };
    if (document.readyState === 'complete') setTimeout(loadAll, 400);
    else window.addEventListener('load', function () { setTimeout(loadAll, 400); });

    var syncPause = function () {
      var p = userStop || hoverStop || focusStop || !reelVisible || document.hidden || reduce.matches;
      reel.classList.toggle('is-paused', p);
    };

    var show = function (n) {
      n = (n + dSlides.length) % dSlides.length;
      if (n === ri) return;
      var leaving = [dSlides[ri], mSlides[ri]];
      leaving.forEach(function (el) {
        el.classList.remove('is-on');
        el.classList.add('is-off');
        setTimeout(function () { if (!el.classList.contains('is-on')) el.classList.remove('is-off'); }, 1300);
      });
      ri = n;
      [dSlides[ri], mSlides[ri]].forEach(function (el) {
        loadImg(el);
        el.classList.remove('is-off');
        el.classList.add('is-on');
      });
      dots.forEach(function (d, i) {
        var on = i === ri;
        d.classList.toggle('is-on', on);
        if (on) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      var d = dots[ri];
      cap.classList.add('is-swap');
      clearTimeout(swapT);
      swapT = setTimeout(function () {
        rNo.textContent = (ri < 9 ? '0' : '') + (ri + 1);
        rName.textContent = d.getAttribute('data-name');
        if (rCat) rCat.textContent = d.getAttribute('data-cat') || '';
        rUrl.textContent = d.getAttribute('data-url');
        cap.classList.remove('is-swap');
      }, 230);
    };

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { show(i); });
      // garis progres yang penuh = waktunya pindah ke cuplikan berikutnya
      d.firstElementChild.addEventListener('animationend', function () {
        if (i === ri && auto() && !reel.classList.contains('is-paused')) show(ri + 1);
      });
    });

    tgl.addEventListener('click', function () {
      userStop = !userStop;
      reel.classList.toggle('is-stopped', userStop);
      tgl.setAttribute('aria-label', userStop ? 'Putar cuplikan' : 'Jeda cuplikan');
      syncPause();
    });
    if (reduce.matches) { tgl.hidden = true; }

    reel.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hoverStop = true; syncPause(); } });
    reel.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hoverStop = false; syncPause(); } });
    reel.addEventListener('focusin', function () { focusStop = true; syncPause(); });
    reel.addEventListener('focusout', function (e) { if (!reel.contains(e.relatedTarget)) { focusStop = false; syncPause(); } });
    document.addEventListener('visibilitychange', syncPause);
    if (hasIO) {
      new IntersectionObserver(function (en) { reelVisible = en[0].isIntersecting; syncPause(); }, { threshold: 0.15 }).observe(reel);
    }
    syncPause();
  }

  // Tanpa animasi (JS terlambat/ dimatikan pengguna): selesai di sini, konten sudah tampil normal.
  if (!ANIM) return;

  /* =========================================================
     ANIMASI
     ========================================================= */

  /* ---------- Pecah judul per kata ---------- */
  function splitWords(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
        if (ch.nodeType === 3) {
          var frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span');
            w.className = 'w';
            var inner = document.createElement('span');
            inner.className = 'w__i';
            inner.textContent = part;
            inner.style.setProperty('--i', i++);
            w.appendChild(inner);
            frag.appendChild(w);
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1) {
          walk(ch);
        }
      });
    })(el);
  }
  $$('[data-split]').forEach(splitWords);

  /* ---------- Muncul saat digulir ---------- */
  $$('[data-reveal="stagger"]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
  });

  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count')) || 0;
    var t0 = performance.now(), dur = 1500;
    el.textContent = '0';
    (function step(t) {
      var k = clamp((t - t0) / dur, 0, 1);
      el.textContent = String(Math.round(end * (1 - Math.pow(1 - k, 4))));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  var revealEls = $$('[data-reveal], [data-split]').filter(function (el) { return !el.closest('.hero'); });
  if (hasIO && !reduce.matches) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        revealIO.unobserve(el);
        el.classList.add('is-in');
        var mode = el.getAttribute('data-reveal');
        var n = mode === 'stagger' ? el.children.length : 0;
        if (mode !== null && mode !== 'group') {
          setTimeout(function () { el.classList.add('is-done'); }, 1650 + n * 85);
        }
        $$('[data-count]', el).forEach(countUp);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in', 'is-done'); });
  }

  /* ---------- Kata yang berganti di judul hero ---------- */
  var rot = $('#rot');
  var rotWords = rot ? $$('.rot__w', rot) : [];
  var rotI = 0;
  function sizeRot() {
    if (!rot) return;
    var pad = parseFloat(getComputedStyle(rot).paddingLeft) || 0;
    rot.style.width = (rotWords[rotI].offsetWidth + pad * 2) + 'px';
  }
  function nextWord() {
    if (document.hidden || !reelVisible && getY() > window.innerHeight) return;
    var cur = rotWords[rotI];
    rotI = (rotI + 1) % rotWords.length;
    var nx = rotWords[rotI];
    cur.classList.remove('is-on');
    cur.classList.add('is-out');
    setTimeout(function () { cur.classList.remove('is-out'); }, 950);
    nx.classList.remove('is-out');
    nx.classList.add('is-on');
    sizeRot();
  }

  /* ---------- Intro hero (setelah font siap, maks. 1,2 dtk) ---------- */
  var introDone = false;
  function intro() {
    if (introDone) return;
    introDone = true;
    if (rot) { rot.style.transition = 'none'; sizeRot(); void rot.offsetWidth; rot.style.transition = ''; }
    body.classList.add('is-loaded');
    var l1 = $('.hero__l1');
    if (l1) l1.classList.add('is-in');
    if (rot && rotWords.length > 1 && !reduce.matches) setTimeout(function () { setInterval(nextWord, 2600); }, 1400);
  }
  var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 1200); })]).then(function () {
    requestAnimationFrame(function () { requestAnimationFrame(intro); });
  });
  window.addEventListener('resize', function () { if (introDone) sizeRot(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (introDone) sizeRot(); });

  /* ---------- Teks berjalan: makin cepat saat halaman digulir ---------- */
  var track = $('#marquee');
  if (track && track.animate && !reduce.matches) {
    try {
      var anim = track.animate(
        [{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(-50%,0,0)' }],
        { duration: 46000, iterations: Infinity }
      );
      var rate = 1;
      tasks.push(function () {
        var target = 1 + Math.min(Math.abs(vel) * 0.07, 4);
        var next = lerp(rate, target, 0.08);
        if (Math.abs(next - rate) > 0.002) { rate = next; anim.playbackRate = rate; wake(2); }
      });
      if (hasIO) {
        new IntersectionObserver(function (en) {
          if (en[0].isIntersecting) anim.play(); else anim.pause();
        }).observe(track);
      }
    } catch (err) { /* browser lama: teks diam */ }
  }

  /* ---------- Garis proses kerja ---------- */
  var steps = $('#steps');
  var stepsY = -1;
  if (steps && hasIO) {
    var lineWrap = $('.steps__line', steps);
    var lineFill = $('.steps__line span', steps);
    var stepEls = $$('.step', steps);
    var stepsVis = false;
    new IntersectionObserver(function (en) { stepsVis = en[0].isIntersecting; if (stepsVis) wake(20); }, { rootMargin: '10% 0px' }).observe(steps);
    tasks.push(function () {
      if (!stepsVis || stepsY === sy) return;
      stepsY = sy;
      var vh = window.innerHeight;
      if (lineWrap.offsetWidth > 0) {
        var r = steps.getBoundingClientRect();
        var p = reduce.matches ? 1 : clamp((vh * 0.8 - r.top) / (vh * 0.45), 0, 1);
        lineFill.style.setProperty('--p', p.toFixed(4));
        var lr = lineWrap.getBoundingClientRect();
        stepEls.forEach(function (s) {
          var nr = s.firstElementChild.getBoundingClientRect();
          var pos = Math.max(0.02, (nr.left + nr.width / 2 - lr.left) / lr.width);
          s.classList.toggle('is-active', p >= pos);
        });
      } else {
        stepEls.forEach(function (s) {
          var nr = s.firstElementChild.getBoundingClientRect();
          s.classList.toggle('is-active', nr.top + nr.height / 2 < vh * 0.72);
        });
      }
    });
  }

  /* ---------- Efek khusus layar besar + mouse ---------- */
  var richOn = function () { return wide.matches && fine.matches && !reduce.matches; };
  var pxOn = richOn();

  // Parallax gulir (data-speed). Memakai properti `translate`, jadi tidak bentrok dengan animasi `transform`.
  var pxEls = $$('[data-speed]').map(function (el) {
    return { el: el, speed: parseFloat(el.getAttribute('data-speed')) || 0, cur: 0, vis: false };
  });
  if (hasIO) {
    var pxIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        for (var i = 0; i < pxEls.length; i++) if (pxEls[i].el === en.target) pxEls[i].vis = en.isIntersecting;
      });
      wake(10);
    }, { rootMargin: '25% 0px' });
    pxEls.forEach(function (p) { pxIO.observe(p.el); });
  }
  var pxY = -1;
  tasks.push(function () {
    if (!pxOn || pxY === sy) return;
    pxY = sy;
    var vh = window.innerHeight;
    for (var i = 0; i < pxEls.length; i++) {
      var p = pxEls[i];
      if (!p.vis) continue;
      var r = p.el.getBoundingClientRect();
      var center = r.top - p.cur + r.height / 2;
      var y = (center - vh / 2) * p.speed;
      if (Math.abs(y - p.cur) > 0.05) { p.cur = y; p.el.style.translate = '0 ' + y.toFixed(2) + 'px'; }
    }
  });

  // Tombol "magnet"
  $$('.magnetic').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      if (!pxOn || e.pointerType !== 'mouse') return;
      var r = el.getBoundingClientRect();
      var x = e.clientX - (r.left + r.width / 2);
      var y = e.clientY - (r.top + r.height / 2);
      el.style.translate = (x * 0.16).toFixed(1) + 'px ' + (y * 0.26).toFixed(1) + 'px';
    });
    el.addEventListener('pointerleave', function () { el.style.translate = ''; });
  });

  // Jika ukuran layar / jenis input berubah, efek dinyalakan atau dibersihkan
  function refreshRich() {
    var on = richOn();
    if (on === pxOn) return;
    pxOn = on; pxY = -1;
    if (!on) {
      pxEls.forEach(function (p) { p.cur = 0; p.el.style.translate = ''; });
    }
    wake(10);
  }
  onMQ(wide, refreshRich);
  onMQ(fine, refreshRich);
  onMQ(reduce, refreshRich);
  window.addEventListener('resize', function () { pxY = -1; stepsY = -1; });
})();
