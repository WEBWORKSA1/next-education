/* Next.Education calculators and tools — all computation happens in the browser */
(function () {
  "use strict";
  var NE = window.NE || {}, ROOT = window.NE_ROOT || "";
  function $(id) { return document.getElementById(id); }
  function num(id) { var v = parseFloat(($(id) || {}).value); return isNaN(v) ? 0 : v; }
  function cur() { var c = $("currency"); return c ? c.value : "USD"; }
  function money(n) { try { return new Intl.NumberFormat("en-US", { style: "currency", currency: cur(), maximumFractionDigits: 0 }).format(Math.round(n)); } catch (e) { return "$" + Math.round(n); } }
  function on(form, fn) { if (!form) return; form.addEventListener("input", fn); form.addEventListener("change", fn); fn(); }

  /* ---------------- ROI calculator ---------------- */
  var roi = $("roi-form");
  on(roi, function () {
    var cost = num("r-cost"), aid = num("r-aid"), years = Math.max(0.25, num("r-years")), now = num("r-now"), after = num("r-after"),
      forgo = num("r-forgo") / 100, growth = num("r-growth") / 100, horizon = 10;
    var forgone = now * forgo * years, invest = Math.max(0, cost - aid) + forgone;
    var uplift = after - now;
    var cum = -invest, payback = null, rows = [], y;
    for (y = 1; y <= horizon; y++) {
      var gain = uplift * Math.pow(1 + growth, y - 1);
      cum += gain; rows.push(cum);
      if (payback === null && cum >= 0) { var prev = cum - gain; payback = (y - 1) + (gain > 0 ? (-prev / gain) : 0); }
    }
    $("r-invest").textContent = money(invest);
    $("r-forgone").textContent = money(forgone);
    $("r-uplift").textContent = money(uplift) + " / yr";
    $("r-net").textContent = money(cum);
    $("r-roi").textContent = invest > 0 ? Math.round(cum / invest * 100) + "%" : "n/a";
    $("r-payback").textContent = uplift <= 0 ? "Never at this salary" : (payback === null ? "Over " + horizon + " years" : payback.toFixed(1) + " years after you finish");
    var max = Math.max.apply(null, rows.map(Math.abs).concat([invest, 1]));
    $("r-chart").innerHTML = rows.map(function (v, i) {
      return '<div class="bar-row"><span>Year ' + (i + 1) + '</span><span class="bar' + (v < 0 ? " neg" : "") + '"><i style="width:' + Math.max(2, Math.abs(v) / max * 100) + '%"></i></span><span style="text-align:right">' + money(v) + '</span></div>';
    }).join("");
    $("r-verdict").textContent = uplift <= 0 ? "At these numbers the program doesn't pay off financially. That can still be fine for a career you want, but go in knowing it." :
      (payback !== null && payback <= 5 ? "Strong financial case: you recover the full cost within about five years of finishing." :
        (payback !== null ? "Pays off, slowly. Look for cheaper routes, employer support or scholarships to shorten the payback." : "Doesn't pay back within ten years. Re-check the salary assumption or find a cheaper route."));
  });

  /* ---------------- Loan calculator ---------------- */
  var loan = $("loan-form");
  on(loan, function () {
    var P = num("l-amount"), r = num("l-rate") / 100 / 12, n = Math.max(1, Math.round(num("l-years") * 12)), extra = num("l-extra"), grace = Math.round(num("l-grace"));
    if (num("l-accrue") && grace > 0) P = P * Math.pow(1 + r, grace);
    var pay = r === 0 ? P / n : P * r / (1 - Math.pow(1 + r, -n));
    var total = pay * n, interest = total - num("l-amount");
    // with extra payments
    var bal = P, m = 0, intX = 0, yearRows = [], yr = { i: 0, p: 0 };
    while (bal > 0.005 && m < 1200) {
      var it = bal * r, pr = Math.min(bal, pay + extra - it);
      if (pr <= 0) { m = 1200; break; }
      bal -= pr; intX += it; m++; yr.i += it; yr.p += pr;
      if (m % 12 === 0 || bal <= 0.005) { yearRows.push([Math.ceil(m / 12), yr.p, yr.i, Math.max(0, bal)]); yr = { i: 0, p: 0 }; }
    }
    $("l-pay").textContent = money(pay);
    $("l-total").textContent = money(total);
    $("l-int").textContent = money(interest);
    $("l-cap").textContent = money(P);
    $("l-saved").textContent = extra > 0 && m < 1200 ? (n - m) + " months sooner, " + money((pay * n - P) - intX) + " less interest" : "Add an extra monthly amount to see savings";
    $("l-table").innerHTML = yearRows.slice(0, 30).map(function (row) {
      return "<tr><td>Year " + row[0] + "</td><td>" + money(row[1]) + "</td><td>" + money(row[2]) + "</td><td>" + money(row[3]) + "</td></tr>";
    }).join("");
  });

  /* ---------------- Budget planner ---------------- */
  var bud = $("budget-form");
  on(bud, function () {
    var inc = ["b-family", "b-work", "b-schol", "b-other-in"].reduce(function (s, id) { return s + num(id); }, 0);
    var exp = num("b-tuition") / 12 + ["b-rent", "b-food", "b-transport", "b-phone", "b-books", "b-insurance", "b-personal", "b-other-out"].reduce(function (s, id) { return s + num(id); }, 0);
    var gap = inc - exp, yrs = Math.max(0.5, num("b-years"));
    $("b-in").textContent = money(inc);
    $("b-out").textContent = money(exp);
    $("b-gap").textContent = (gap >= 0 ? "+" : "−") + money(Math.abs(gap));
    $("b-gap").style.color = gap >= 0 ? "#8FE3B0" : "#FFB4A0";
    $("b-total").textContent = gap >= 0 ? "Surplus of " + money(gap * 12 * yrs) + " over the program" : "Funding gap of " + money(-gap * 12 * yrs) + " over the program";
    var buf = exp * 3;
    $("b-buffer").textContent = money(buf);
    var items = [["Tuition (monthly share)", num("b-tuition") / 12], ["Rent", num("b-rent")], ["Food", num("b-food")], ["Transport", num("b-transport")], ["Insurance", num("b-insurance")], ["Books and supplies", num("b-books")], ["Phone and internet", num("b-phone")], ["Personal", num("b-personal")], ["Other", num("b-other-out")]];
    var mx = Math.max.apply(null, items.map(function (x) { return x[1]; }).concat([1]));
    $("b-chart").innerHTML = items.filter(function (x) { return x[1] > 0; }).sort(function (a, b) { return b[1] - a[1]; }).map(function (x) {
      return '<div class="bar-row" style="grid-template-columns:120px 1fr 80px"><span>' + x[0] + '</span><span class="bar"><i style="width:' + (x[1] / mx * 100) + '%"></i></span><span style="text-align:right">' + money(x[1]) + '</span></div>';
    }).join("");
  });

  /* ---------------- GPA calculator ---------------- */
  var gpaRows = $("gpa-rows");
  if (gpaRows) {
    var G = { "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "D-": 0.7, "F": 0 };
    var opts = Object.keys(G).map(function (k) { return "<option>" + k + "</option>"; }).join("");
    var addRow = function (name, cr, gr, lvl) {
      var d = document.createElement("div"); d.className = "gpa-row";
      d.innerHTML = '<input type="text" aria-label="Course name" placeholder="Course" value="' + (name || "") + '">' +
        '<input type="number" aria-label="Credits" min="0" step="0.5" value="' + (cr || 3) + '">' +
        '<select aria-label="Grade">' + opts + '</select>' +
        '<button class="icon-btn" type="button" aria-label="Remove course">×</button>';
      d.querySelector("select").value = gr || "A";
      var lv = document.createElement("select"); lv.setAttribute("aria-label", "Course level"); lv.innerHTML = '<option value="0">Regular</option><option value="0.5">Honours (+0.5)</option><option value="1">AP / IB / college (+1.0)</option>';
      lv.value = lvl || "0"; lv.style.gridColumn = "1 / -1"; lv.style.display = $("g-weighted").checked ? "" : "none";
      d.appendChild(lv);
      d.querySelector("button").addEventListener("click", function () { d.remove(); calcGpa(); });
      gpaRows.appendChild(d);
    };
    var calcGpa = function () {
      var tc = 0, tp = 0, tw = 0, w = $("g-weighted").checked;
      Array.prototype.forEach.call(gpaRows.querySelectorAll(".gpa-row"), function (r) {
        var sel = r.querySelectorAll("select"), cr = parseFloat(r.querySelector('input[type=number]').value) || 0, g = G[sel[0].value];
        sel[1].style.display = w ? "" : "none";
        tc += cr; tp += g * cr; tw += (g > 0 ? g + parseFloat(sel[1].value) : 0) * cr;
      });
      var gpa = tc ? tp / tc : 0;
      $("g-result").textContent = gpa.toFixed(2);
      $("g-weighted-out").textContent = w && tc ? (tw / tc).toFixed(2) : "n/a";
      $("g-credits").textContent = tc;
      // target helper
      var cg = num("g-cur"), cc = num("g-cur-cr"), tg = num("g-target"), rem = num("g-rem");
      if (rem > 0 && tg > 0) {
        var need = (tg * (cc + rem) - cg * cc) / rem;
        $("g-need").textContent = need > 4 ? "Above 4.0, not reachable in " + rem + " credits" : (need <= 0 ? "Already there" : need.toFixed(2) + " average needed");
      } else { $("g-need").textContent = "Fill in the target fields"; }
    };
    [["Calculus", 4, "A-"], ["English", 3, "B+"], ["Biology", 4, "A"], ["History", 3, "B"]].forEach(function (r) { addRow(r[0], r[1], r[2]); });
    $("g-add").addEventListener("click", function () { addRow("", 3, "A"); calcGpa(); });
    $("gpa-form").addEventListener("input", calcGpa); $("gpa-form").addEventListener("change", calcGpa);
    calcGpa();
  }

  /* ---------------- Path quiz ---------------- */
  var quiz = $("quiz-form");
  if (quiz) {
    var R = { degree: "Degree", certificate: "Certificate", bootcamp: "Bootcamp", apprenticeship: "Apprenticeship", abroad: "Study abroad", free: "Free-first" };
    var INFO = {
      degree: ["A degree fits your goal", "You're aiming at a field where the credential is the gate, and you can invest the time. Shortlist accredited programs, then attack the cost with scholarships.", "guides/online-degree-checklist.html", "How to judge a degree program"],
      certificate: ["A certificate is your fastest credible step", "You want a job-ready skill in months, not years. Pick a credential employers in your field actually ask for, ideally one that stacks into a diploma or degree later.", "guides/free-credentials.html", "Low-cost credentials that count"],
      bootcamp: ["A bootcamp could fit, if the outcomes are real", "You want an intensive switch into tech and can commit full attention for a few months. Test your interest free first and demand audited outcomes data.", "guides/coding-bootcamp-checklist.html", "What to check before you pay"],
      apprenticeship: ["An apprenticeship fits how you like to learn", "You learn best by doing and want to earn while training. Skilled trades offer paid routes to a licensed career.", "guides/how-to-choose-your-next-education-step.html", "Compare every route"],
      abroad: ["Studying abroad matches your ambitions", "You want an international career, network or experience. Start 12 to 18 months ahead: tests, funding and visas take time.", "guides/study-abroad-timeline.html", "Your study-abroad timeline"],
      free: ["Start free, then commit", "You're still exploring. Spend four to six weeks on free courses in your top two fields before paying for anything. It's the cheapest information you'll ever buy.", "learn.html", "Open the free learning hub"]
    };
    var qs = Array.prototype.slice.call(quiz.querySelectorAll(".step")), qi = 0;
    var qBack = $("q-back"), qNext = $("q-next"), qFill = $("q-fill"), qLabel = $("q-label");
    var qRender = function () {
      qs.forEach(function (s, n) { s.classList.toggle("active", n === qi); });
      qFill.style.width = Math.max(6, qi / (qs.length) * 100) + "%"; qLabel.textContent = "Question " + (qi + 1) + " of " + qs.length;
      qBack.style.visibility = qi ? "visible" : "hidden";
      qNext.textContent = qi === qs.length - 1 ? "See my result" : "Next";
    };
    var answered = function () { return !!qs[qi].querySelector("input:checked"); };
    quiz.addEventListener("change", function () { setTimeout(function () { if (answered() && qi < qs.length - 1) { qi++; qRender(); } }, 220); });
    qBack.addEventListener("click", function () { qi = Math.max(0, qi - 1); qRender(); });
    qNext.addEventListener("click", function () {
      if (!answered()) { qs[qi].querySelector(".group-error").hidden = false; return; }
      if (qi < qs.length - 1) { qi++; qRender(); return; }
      var sc = { degree: 0, certificate: 0, bootcamp: 0, apprenticeship: 0, abroad: 0, free: 0 };
      Array.prototype.forEach.call(quiz.querySelectorAll("input:checked"), function (inp) {
        (inp.getAttribute("data-w") || "").split(",").forEach(function (pair) { var p = pair.split(":"); if (sc[p[0]] !== undefined) sc[p[0]] += parseFloat(p[1]); });
      });
      var ranked = Object.keys(sc).sort(function (a, b) { return sc[b] - sc[a]; }), top = ranked[0], second = ranked[1], info = INFO[top];
      var b = NE.store ? NE.store.get("ne-bonus", {}) : {}; b.quiz = true; if (NE.store) NE.store.set("ne-bonus", b);
      quiz.hidden = true;
      var out = $("quiz-result");
      out.innerHTML = '<p class="progress-label">Your result</p><h2>' + info[0] + '</h2><p class="lede" style="font-size:var(--step-1)">' + info[1] + '</p>' +
        '<p><strong>Runner-up:</strong> ' + R[second] + '. Worth comparing side by side.</p>' +
        '<div class="hero-ctas"><a class="btn btn-lg" href="' + ROOT + 'match.html?goal=' + (top === "free" ? "free" : top) + '">Get matched for ' + R[top].toLowerCase() + ' programs</a><a class="btn btn-ghost btn-lg" href="' + ROOT + info[2] + '">' + info[3] + '</a></div>' +
        '<div class="card" style="margin-top:1rem"><h3>Email me this result</h3><p class="muted small">Plus a short guide for your route. You also get a bonus entry in the monthly award.</p>' +
        '<form id="quiz-mail" class="form-grid" data-subject="Path quiz result"><input type="hidden" name="quiz_result" value="' + R[top] + ' (runner-up ' + R[second] + ')">' +
        '<div><label for="qm-name">First name</label><input id="qm-name" name="name" required autocomplete="given-name"></div><div><label for="qm-email">Email</label><input id="qm-email" name="email" type="email" required autocomplete="email"></div>' +
        '<div class="full"><label class="check"><input type="checkbox" name="consent" value="yes" required><span>Email me my result and occasional Next.Education updates. Unsubscribe any time.</span></label></div>' +
        '<div class="hp" aria-hidden="true"><input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></div>' +
        '<div class="full"><button class="btn btn-ink" type="submit">Email my result</button></div></form></div>';
      out.classList.add("show"); out.setAttribute("tabindex", "-1"); out.focus();
      var qm = $("quiz-mail");
      qm.addEventListener("submit", function (e) {
        e.preventDefault(); if (!qm.checkValidity()) { qm.reportValidity(); return; }
        var btn = qm.querySelector("button"); btn.disabled = true; btn.textContent = "Sending…";
        NE.submitForm(qm).then(function () {}).catch(function () {}).then(function () { qm.innerHTML = '<p class="form-status show ok full">Sent. Check your inbox in a few minutes.</p>'; });
      });
    });
    qRender();
  }

  /* ---------------- Program comparer ---------------- */
  var cmp = $("compare-form");
  on(cmp, function () {
    var cols = [0, 1, 2].map(function (i) {
      var g = function (k) { var el = cmp.querySelector('[name="' + k + i + '"]'); return el ? el.value : ""; };
      return { name: g("name") || "Program " + (i + 1), cost: parseFloat(g("cost")) || 0, months: parseFloat(g("months")) || 0, outcome: parseFloat(g("outcome")) || 0, acc: g("acc"), fmt: g("fmt"), filled: !!(g("cost") || g("months")) };
    }).filter(function (c) { return c.filled; });
    var out = $("c-out");
    if (cols.length < 2) { out.innerHTML = "<p>Fill in at least two programs to compare.</p>"; return; }
    var best = function (key, low) { return cols.slice().sort(function (a, b) { return low ? a[key] - b[key] : b[key] - a[key]; })[0].name; };
    var cheapest = best("cost", true), fastest = best("months", true), outcomes = best("outcome", false);
    var scoreOf = function (c) {
      var maxC = Math.max.apply(null, cols.map(function (x) { return x.cost || 1; })), maxM = Math.max.apply(null, cols.map(function (x) { return x.months || 1; }));
      return Math.round((1 - c.cost / maxC) * 30 + (1 - c.months / maxM) * 20 + c.outcome * 0.4 + (c.acc === "Yes" ? 10 : -25));
    };
    var ranked = cols.slice().sort(function (a, b) { return scoreOf(b) - scoreOf(a); });
    out.innerHTML = '<h3>Your comparison</h3><dl><dt>Lowest cost</dt><dd>' + NE.esc(cheapest) + '</dd><dt>Fastest</dt><dd>' + NE.esc(fastest) + '</dd><dt>Best reported outcomes</dt><dd>' + NE.esc(outcomes) + '</dd>' +
      cols.map(function (c) { return '<dt>' + NE.esc(c.name) + ' monthly cost</dt><dd>' + (c.months ? money(c.cost / c.months) : "n/a") + '</dd>'; }).join("") + '</dl>' +
      '<p style="margin-top:1rem">Overall lean: <strong style="color:#FFD166">' + NE.esc(ranked[0].name) + '</strong> (cost 30%, time 20%, outcomes 40%, with a heavy penalty for unverified accreditation).</p>' +
      (cols.some(function (c) { return c.acc !== "Yes"; }) ? '<p>One or more programs has unconfirmed accreditation. <a style="color:#FFD166" href="' + ROOT + 'guides/how-to-check-accreditation.html">Check it before you go further.</a></p>' : "");
  });

  /* ---------------- Study timer ---------------- */
  var face = $("t-face");
  if (face) {
    var mode = "focus", left = 25 * 60, timer = null, count = NE.store ? NE.store.get("ne-sessions", 0) : 0;
    var lens = function () { return { focus: num("t-focus") * 60, short: num("t-short") * 60, long: num("t-long") * 60 }; };
    var draw = function () {
      var m = Math.floor(left / 60), s = left % 60, txt = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
      face.textContent = txt; document.title = txt + " · " + (mode === "focus" ? "Focus" : "Break") + " | Next.Education";
      $("t-mode").textContent = mode === "focus" ? "Focus session" : (mode === "short" ? "Short break" : "Long break");
      $("t-count").textContent = count;
    };
    var beep = function () { try { var a = new (window.AudioContext || window.webkitAudioContext)(), o = a.createOscillator(), g = a.createGain(); o.connect(g); g.connect(a.destination); o.frequency.value = 660; g.gain.value = 0.08; o.start(); setTimeout(function () { o.stop(); a.close(); }, 450); } catch (e) {} };
    var setMode = function (m) { mode = m; left = lens()[m]; Array.prototype.forEach.call(document.querySelectorAll("[data-mode]"), function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m); }); draw(); };
    var tick = function () {
      left--; if (left >= 0) { draw(); return; }
      beep();
      if (mode === "focus") { count++; if (NE.store) NE.store.set("ne-sessions", count); setMode(count % 4 === 0 ? "long" : "short"); } else setMode("focus");
    };
    $("t-start").addEventListener("click", function () {
      if (timer) { clearInterval(timer); timer = null; this.textContent = "Resume"; }
      else { timer = setInterval(tick, 1000); this.textContent = "Pause"; }
    });
    $("t-reset").addEventListener("click", function () { clearInterval(timer); timer = null; $("t-start").textContent = "Start"; setMode(mode); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-mode]"), function (b) { b.addEventListener("click", function () { clearInterval(timer); timer = null; $("t-start").textContent = "Start"; setMode(b.getAttribute("data-mode")); }); });
    ["t-focus", "t-short", "t-long"].forEach(function (id) { $(id).addEventListener("change", function () { if (!timer) setMode(mode); }); });
    $("t-clear").addEventListener("click", function () { count = 0; if (NE.store) NE.store.set("ne-sessions", 0); draw(); });
    setMode("focus");
  }
})();
