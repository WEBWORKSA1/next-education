/* Get Matched — multi-step lead generation wizard */
(function () {
  "use strict";
  var NE = window.NE, form = document.getElementById("match-form");
  if (!form || !NE) return;
  var ROOT = window.NE_ROOT || "";
  var steps = Array.prototype.slice.call(form.querySelectorAll(".step"));
  var fill = document.getElementById("progress-fill"), label = document.getElementById("progress-label");
  var back = document.getElementById("wiz-back"), next = document.getElementById("wiz-next"), submit = document.getElementById("wiz-submit");
  var i = 0, KEY = "ne-match";

  // prefill: saved progress, then URL params win
  var saved = NE.store.get(KEY, {}), params = new URLSearchParams(location.search);
  var map = { goal: "goal", who: "who", field: "field", route: "route", level: "level" };
  Object.keys(map).forEach(function (k) { if (params.get(k)) saved[map[k]] = params.get(k); });
  if (params.get("route")) {
    var r = params.get("route");
    saved.route = r;
    if (!saved.goal) saved.goal = /bootcamp/.test(r) ? "bootcamp" : /apprentice/.test(r) ? "apprenticeship" : /cert|diploma/.test(r) ? "certificate" : "degree";
  }
  Object.keys(saved).forEach(function (name) {
    var els = form.querySelectorAll('[name="' + name + '"]');
    Array.prototype.forEach.call(els, function (el) {
      if (el.type === "radio" || el.type === "checkbox") el.checked = (el.value === saved[name]);
      else if (el.tagName !== "BUTTON" && name !== "_gotcha") el.value = saved[name];
    });
  });
  // jump past step 1 if the goal arrived from another page
  if (params.get("goal") || params.get("route")) i = 1;

  function persist() {
    var d = {};
    new FormData(form).forEach(function (v, k) { if (k.charAt(0) !== "_" && ["email", "phone", "first_name", "last_name"].indexOf(k) < 0) d[k] = v; });
    NE.store.set(KEY, d);
  }

  function render() {
    steps.forEach(function (s, n) { s.classList.toggle("active", n === i); });
    var pct = Math.round((i) / (steps.length - 1) * 100);
    fill.style.width = Math.max(6, pct) + "%";
    label.textContent = "Step " + (i + 1) + " of " + steps.length;
    back.style.visibility = i === 0 ? "hidden" : "visible";
    next.hidden = i === steps.length - 1;
    submit.hidden = i !== steps.length - 1;
    var h = steps[i].querySelector("h2"); if (h && document.activeElement !== document.body) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }
  function valid() {
    var ok = true, first = null;
    Array.prototype.forEach.call(steps[i].querySelectorAll("input, select, textarea"), function (f) {
      if (f.closest(".hp")) return;
      var bad = !f.checkValidity(); f.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad && !first) first = f;
    });
    // radio groups marked required via data-required
    Array.prototype.forEach.call(steps[i].querySelectorAll("[data-required]"), function (g) {
      var name = g.getAttribute("data-required");
      if (!form.querySelector('[name="' + name + '"]:checked')) { ok = false; var e = g.querySelector(".group-error"); if (e) e.hidden = false; if (!first) first = g.querySelector("input"); }
      else { var e2 = g.querySelector(".group-error"); if (e2) e2.hidden = true; }
    });
    if (first) { ok = false; first.focus(); if (first.reportValidity) first.reportValidity(); }
    return ok;
  }
  next.addEventListener("click", function () { if (!valid()) return; persist(); i = Math.min(i + 1, steps.length - 1); render(); window.scrollTo({ top: form.getBoundingClientRect().top + scrollY - 110, behavior: "smooth" }); });
  back.addEventListener("click", function () { i = Math.max(0, i - 1); render(); });
  form.addEventListener("change", function (e) {
    persist();
    // auto-advance on single-choice tile steps
    if (e.target.type === "radio" && e.target.closest(".tiles") && steps[i].hasAttribute("data-auto")) {
      setTimeout(function () { if (i < steps.length - 1) { i++; render(); } }, 220);
    }
  });

  function val(n) { var el = form.querySelector('[name="' + n + '"]:checked') || form.querySelector('[name="' + n + '"]'); return el ? el.value : ""; }
  function score() {
    var s = 0, st = val("start"), b = val("budget");
    if (st === "Within 3 months") s += 30; else if (st === "3–6 months") s += 22; else if (st === "6–12 months") s += 12;
    if (b && b !== "Under $2,000 a year" && b !== "Not sure yet") s += 20;
    if (form.querySelector('[name="phone"]').value.trim()) s += 20;
    if (form.querySelector('[name="partner_consent"]').checked) s += 20;
    if (val("level")) s += 10;
    return s;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!valid()) return;
    submit.disabled = true; submit.textContent = "Building your shortlist…";
    var extra = { lead_score: String(score()), lead_type: "Program match" };
    NE.submitForm(form, extra).then(function () {}).catch(function () {}).then(function () {
      showResult();
      var b = NE.store.get("ne-bonus", {}); b.match = true; NE.store.set("ne-bonus", b);
      NE.store.set(KEY, {});
    });
  });

  var ROUTES = {
    degree: { name: "a degree program", tool: ["roi-calculator", "Education ROI calculator"], guide: ["online-degree-checklist", "How to judge an online degree program"] },
    certificate: { name: "a certificate or diploma", tool: ["compare", "Program comparer"], guide: ["free-credentials", "Free and low-cost ways to earn credentials"] },
    bootcamp: { name: "a bootcamp", tool: ["roi-calculator", "Education ROI calculator"], guide: ["coding-bootcamp-checklist", "Coding bootcamps: what to check before you pay"] },
    apprenticeship: { name: "an apprenticeship", tool: ["budget-planner", "Student budget planner"], guide: ["how-to-choose-your-next-education-step", "How to choose your next education step"] },
    abroad: { name: "studying abroad", tool: ["budget-planner", "Student budget planner"], guide: ["study-abroad-timeline", "Study abroad planning timeline"] },
    "career-change": { name: "a career-change credential", tool: ["path-quiz", "Which route fits me?"], guide: ["career-change-retraining", "Changing careers at 30, 40 or 50"] },
    scholarship: { name: "funding your studies", tool: ["loan-calculator", "Student loan calculator"], guide: ["scholarship-strategy", "How to find and win scholarships"] },
    free: { name: "free courses first", tool: ["study-timer", "Focus study timer"], guide: ["learning-how-to-learn", "Evidence-based study techniques"] }
  };
  function showResult() {
    var goal = val("goal") || "degree", r = ROUTES[goal] || ROUTES.degree, field = val("field") || "your field";
    var name = (form.querySelector('[name="first_name"]').value || "").trim();
    var fmt = val("format"), start = val("start"), aid = val("aid");
    var out = document.getElementById("match-result");
    var esc = NE.esc;
    out.innerHTML =
      '<h2>' + (name ? esc(name) + ", here" : "Here") + "'s your starting plan</h2>" +
      '<p class="lede" style="font-size:var(--step-1)">You\'re looking at <strong>' + esc(r.name) + '</strong> in <strong>' + esc(field) + '</strong>' + (fmt && fmt !== "No preference" ? ', <strong>' + esc(fmt.toLowerCase()) + '</strong>' : "") + (start ? ', starting <strong>' + esc(start.toLowerCase()) + '</strong>' : "") + '. Your full report is on its way to your inbox.</p>' +
      '<ol class="steps" style="list-style:none;padding:0;counter-reset:s">' +
      '<li><strong>Shortlist program types.</strong> <a href="' + ROOT + 'programs.html?field=' + encodeURIComponent(field) + '">Open the program explorer</a> filtered to your field and save up to five.</li>' +
      '<li><strong>Check every school\'s accreditation.</strong> Use our <a href="' + ROOT + 'guides/how-to-check-accreditation.html">accreditation guide</a> before you apply anywhere.</li>' +
      '<li><strong>Run the numbers.</strong> Try the <a href="' + ROOT + 'tools/' + r.tool[0] + '.html">' + r.tool[1] + '</a> with real fees.</li>' +
      (aid === "Yes" || goal === "scholarship" ? '<li><strong>Line up funding early.</strong> Start with the <a href="' + ROOT + 'scholarships.html">scholarship finder</a> and read <a href="' + ROOT + 'guides/scholarship-strategy.html">our weekly scholarship system</a>.</li>' : "") +
      '<li><strong>Read one guide before deciding.</strong> <a href="' + ROOT + 'guides/' + r.guide[0] + '.html">' + r.guide[1] + '</a>.</li>' +
      '</ol>' +
      '<div class="card" style="margin-top:1.5rem"><h3>Want a person to look at this with you?</h3><p class="muted">Book a free 20-minute advising call below. No sales script.</p><a class="btn btn-ink" href="#advising">Book a free call</a></div>';
    form.hidden = true;
    out.classList.add("show");
    out.setAttribute("tabindex", "-1"); out.focus();
    window.scrollTo({ top: out.getBoundingClientRect().top + scrollY - 110, behavior: "smooth" });
  }

  render();
})();
