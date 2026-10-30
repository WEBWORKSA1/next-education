/* Next.Education — shared behaviour (vanilla JS, no dependencies) */
(function () {
  "use strict";
  var C = window.NE_CONFIG || {};
  var ROOT = window.NE_ROOT || "";
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var sess = {
    get: function (k, d) { try { var v = sessionStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  window.NE = { store: store, sess: sess, $: $, $$: $$ };

  /* ---------- theme ---------- */
  var themeBtn = $("#theme-toggle");
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    if (themeBtn) themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    store.set("ne-theme", t); applyTheme(t);
  });

  /* ---------- drawer ---------- */
  var drawer = $("#drawer");
  function openDrawer(o) {
    if (!drawer) return;
    drawer.classList.toggle("open", o);
    $("#menu-btn").setAttribute("aria-expanded", o ? "true" : "false");
    document.body.style.overflow = o ? "hidden" : "";
    if (o) { var f = $("a", drawer); if (f) f.focus(); }
  }
  if ($("#menu-btn")) $("#menu-btn").addEventListener("click", function () { openDrawer(true); });
  $$("[data-close-drawer]").forEach(function (b) { b.addEventListener("click", function () { openDrawer(false); }); });

  /* ---------- modals ---------- */
  function openModal(id) {
    var m = document.getElementById(id); if (!m) return;
    m.classList.add("open"); m.setAttribute("aria-hidden", "false");
    var f = $("input, button, a", $(".modal-card", m)); if (f) setTimeout(function () { f.focus(); }, 30);
  }
  function closeModal(m) { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); }
  $$("[data-close-modal]").forEach(function (b) {
    b.addEventListener("click", function () { closeModal(b.closest(".modal")); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { $$(".modal.open").forEach(closeModal); openDrawer(false); }
    var tag = (e.target.tagName || "").toLowerCase();
    if (e.key === "/" && tag !== "input" && tag !== "textarea" && tag !== "select") { e.preventDefault(); openSearch(); }
  });

  /* ---------- site search (client-side JSON index) ---------- */
  var searchIndex = null;
  function openSearch() {
    openModal("search-modal");
    if (!searchIndex) {
      fetch(ROOT + "assets/data/search.json").then(function (r) { return r.json(); }).then(function (d) { searchIndex = d; runSearch(); }).catch(function () {});
    }
  }
  function runSearch() {
    var input = $("#search-input"), out = $("#search-results");
    if (!input || !out || !searchIndex) return;
    var q = input.value.trim().toLowerCase();
    var terms = q.split(/\s+/).filter(Boolean);
    var res = searchIndex.map(function (p) {
      var hay = (p.t + " " + p.d + " " + (p.k || "")).toLowerCase(), score = 0;
      terms.forEach(function (t) { if (hay.indexOf(t) > -1) score += (p.t.toLowerCase().indexOf(t) > -1 ? 3 : 1); });
      return { p: p, s: terms.length ? score : (p.f ? 1 : 0) };
    }).filter(function (r) { return r.s > 0; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 12);
    out.innerHTML = res.length ? res.map(function (r) {
      return '<li><a href="' + ROOT + r.p.u + '">' + esc(r.p.t) + '<small>' + esc(r.p.d) + '</small></a></li>';
    }).join("") : '<li class="muted" style="padding:.7rem .8rem">No pages match "' + esc(q) + '". Try "scholarship", "loan" or "nursing".</li>';
  }
  $$("[data-open-search]").forEach(function (b) { b.addEventListener("click", openSearch); });
  if ($("#search-input")) $("#search-input").addEventListener("input", runSearch);

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  window.NE.esc = esc;

  /* ---------- attribution capture (for lead quality) ---------- */
  (function () {
    var p = new URLSearchParams(location.search), utm = sess.get("ne-utm", {});
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach(function (k) { if (p.get(k)) utm[k] = p.get(k); });
    if (!utm.landing) { utm.landing = location.pathname; utm.referrer = document.referrer || "direct"; }
    sess.set("ne-utm", utm);
  })();

  /* ---------- contact channel (never rendered) ---------- */
  function inbox() {
    try { return atob(String(C.forms.inbox).split("").reverse().join("")); } catch (e) { return ""; }
  }
  function endpoint() {
    var id = (C.forms && C.forms.formAlias) ? C.forms.formAlias : inbox();
    return "https://formsubmit.co/ajax/" + encodeURIComponent(id);
  }
  window.NE.mailto = function (subject, body) {
    var a = inbox(); if (!a) { location.href = ROOT + "contact.html"; return; }
    location.href = "mailto:" + a + "?subject=" + encodeURIComponent(subject || "Next.Education inquiry") + (body ? "&body=" + encodeURIComponent(body) : "");
  };
  $$("[data-mail]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); window.NE.mailto(a.getAttribute("data-mail") || "Next.Education inquiry"); });
  });

  /* ---------- forms ---------- */
  function setStatus(form, ok, msg) {
    var s = $(".form-status", form);
    if (!s) { s = document.createElement("div"); s.className = "form-status"; s.setAttribute("role", "status"); s.setAttribute("aria-live", "polite"); form.appendChild(s); }
    s.className = "form-status show " + (ok ? "ok" : "err");
    s.innerHTML = msg;
  }
  function validate(form) {
    var first = null;
    $$("input, select, textarea", form).forEach(function (f) {
      if (f.closest(".hp")) return;
      var bad = !f.checkValidity();
      f.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad && !first) first = f;
    });
    if (first) { first.focus(); first.reportValidity && first.reportValidity(); }
    return !first;
  }
  window.NE.submitForm = function (form, extra) {
    var fd = new FormData(form);
    if (fd.get("_gotcha")) return Promise.resolve({ ok: true, spam: true });
    fd.delete("_gotcha");
    var utm = sess.get("ne-utm", {});
    Object.keys(utm).forEach(function (k) { fd.append("meta_" + k, utm[k]); });
    fd.append("meta_page", location.pathname);
    fd.append("meta_submitted", new Date().toISOString());
    fd.append("_subject", (form.getAttribute("data-subject") || "Next.Education form") + " | " + (fd.get("name") || fd.get("email") || "visitor"));
    fd.append("_template", "table");
    fd.append("_captcha", "false");
    if (extra) Object.keys(extra).forEach(function (k) { fd.append(k, extra[k]); });
    return fetch(endpoint(), { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); });
  };
  $$("form[data-ne-form]").forEach(function (form) {
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var btn = $("button[type=submit]", form), label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      window.NE.submitForm(form).then(function (r) {
        if (r.ok || (r.j && /activat/i.test(r.j.message || ""))) {
          setStatus(form, true, form.getAttribute("data-success") || "Thanks. Your message is in and we'll reply within two business days.");
          if (form.hasAttribute("data-bonus")) { var b = store.get("ne-bonus", {}); b[form.getAttribute("data-bonus")] = true; store.set("ne-bonus", b); }
          form.reset();
          document.dispatchEvent(new CustomEvent("ne:submitted", { detail: { form: form } }));
        } else { throw new Error("bad"); }
      }).catch(function () {
        setStatus(form, false, 'That didn\'t send, likely a network or blocker issue. <button type="button" class="link-btn" data-mail-fallback>Email us instead</button> and we\'ll pick it up from there.');
        var fb = $("[data-mail-fallback]", form);
        if (fb) fb.addEventListener("click", function () {
          var body = []; new FormData(form).forEach(function (v, k) { if (k.charAt(0) !== "_" && typeof v === "string") body.push(k + ": " + v); });
          window.NE.mailto(form.getAttribute("data-subject") || "Next.Education inquiry", body.join("\n"));
        });
      }).then(function () { if (btn) { btn.disabled = false; btn.textContent = label; } });
    });
  });

  /* ---------- AdSense manual units (only when slot IDs exist) ---------- */
  $$(".ad-slot[data-ad]").forEach(function (el) {
    var slot = C.adsense && C.adsense.slots ? C.adsense.slots[el.getAttribute("data-ad")] : "";
    if (!slot) { el.remove(); return; }
    var fmt = el.getAttribute("data-ad") === "inArticle" ? ' data-ad-layout="in-article" data-ad-format="fluid"' : (el.getAttribute("data-ad") === "multiplex" ? ' data-ad-format="autorelaxed"' : ' data-ad-format="auto" data-full-width-responsive="true"');
    el.innerHTML = '<span class="ad-label">Advertisement</span><ins class="adsbygoogle" style="display:block" data-ad-client="' + C.adsense.client + '" data-ad-slot="' + slot + '"' + fmt + '></ins>';
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  });

  /* ---------- cookie notice ---------- */
  var cookie = $("#cookie");
  if (cookie && !store.get("ne-consent", null)) cookie.classList.add("show");
  $$("[data-consent]").forEach(function (b) {
    b.addEventListener("click", function () {
      store.set("ne-consent", b.getAttribute("data-consent"));
      cookie.classList.remove("show");
    });
  });

  /* ---------- video facades (privacy-enhanced embeds) ---------- */
  $$(".video[data-id]").forEach(function (v) {
    var id = v.getAttribute("data-id"), title = v.getAttribute("data-title") || "Play video";
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-label", "Play: " + title);
    b.style.backgroundImage = "url(https://i.ytimg.com/vi/" + id + "/hqdefault.jpg)";
    b.addEventListener("click", function () {
      v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + esc(title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
    });
    v.appendChild(b);
  });

  /* ---------- sticky mobile CTA + back to top ---------- */
  var sticky = $("#sticky-cta"), top = $("#to-top");
  var stickyOff = document.body.hasAttribute("data-no-sticky") || sess.get("ne-sticky-off", false);
  function onScroll() {
    var y = window.scrollY;
    if (sticky && !stickyOff) { var on = y > 650; sticky.classList.toggle("show", on); document.body.classList.toggle("has-sticky", on); }
    if (top) top.classList.toggle("show", y > 900);
    var rp = $("#read-progress");
    if (rp) { var h = document.documentElement.scrollHeight - innerHeight; rp.style.width = (h > 0 ? Math.min(100, y / h * 100) : 0) + "%"; }
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if ($("#sticky-close")) $("#sticky-close").addEventListener("click", function () { stickyOff = true; sess.set("ne-sticky-off", true); sticky.classList.remove("show"); document.body.classList.remove("has-sticky"); });
  if (top) top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- exit-intent offer (desktop only, max once a week, never on form pages) ---------- */
  if (!document.body.hasAttribute("data-no-exit") && matchMedia("(pointer:fine)").matches) {
    var last = store.get("ne-exit", 0);
    if (Date.now() - last > 7 * 864e5) {
      var armed = false; setTimeout(function () { armed = true; }, 12000);
      document.addEventListener("mouseout", function h(e) {
        if (!armed || e.relatedTarget || e.clientY > 8) return;
        document.removeEventListener("mouseout", h);
        store.set("ne-exit", Date.now()); openModal("exit-modal");
      });
    }
  }

  /* ---------- table of contents highlight ---------- */
  var tocLinks = $$(".toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {}; tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { tocLinks.forEach(function (a) { a.classList.remove("active"); }); var a = map[en.target.id]; if (a) a.classList.add("active"); } });
    }, { rootMargin: "-20% 0px -70% 0px" });
    Object.keys(map).forEach(function (id) { var h = document.getElementById(id); if (h) io.observe(h); });
  }

  /* ---------- share ---------- */
  $$("[data-copy-link]").forEach(function (b) {
    b.addEventListener("click", function () {
      var done = function () { b.textContent = "Link copied"; setTimeout(function () { b.textContent = "Copy link"; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done); else done();
    });
  });

  /* ---------- quick-start forms that hand off to the matcher ---------- */
  $$("form[data-handoff]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var p = new URLSearchParams(new FormData(f)).toString();
      location.href = ROOT + "match.html" + (p ? "?" + p : "");
    });
  });

  /* ---------- config-driven text (prizes, dates) ---------- */
  function money(n, cur) { try { return new Intl.NumberFormat("en-US", { style: "currency", currency: cur || "USD", maximumFractionDigits: 0 }).format(n); } catch (e) { return "$" + n; } }
  window.NE.money = money;
  if (C.contests) {
    var es = C.contests.essay, mo = C.contests.monthly;
    var total = es.prizes.reduce(function (s, p) { return s + p.amount; }, 0);
    var fmtDate = function (d) { var x = /T/.test(d) ? new Date(d) : new Date(d + "T12:00:00-05:00"); return x.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" }); };
    var vals = {
      "essay-name": es.name, "essay-season": es.season, "essay-total": money(total, es.currency),
      "essay-first": money(es.prizes[0].amount, es.currency), "essay-second": money(es.prizes[1].amount, es.currency), "essay-third": money(es.prizes[2].amount, es.currency),
      "essay-opens": fmtDate(es.opens), "essay-closes": fmtDate(es.closes), "essay-winners": fmtDate(es.winnersBy),
      "monthly-name": mo.name, "monthly-amount": money(mo.amount, mo.currency)
    };
    $$("[data-c]").forEach(function (el) { var k = el.getAttribute("data-c"); if (vals[k]) el.textContent = vals[k]; });
  }

  /* footer year */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
