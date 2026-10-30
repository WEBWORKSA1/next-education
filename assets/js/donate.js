/* Donate page: frequency toggle, amount picker, payment buttons from config, pledge handoff */
(function () {
  "use strict";
  var NE = window.NE, C = window.NE_CONFIG || {};
  var box = document.getElementById("donate-box");
  if (!box || !NE) return;
  var freq = "monthly", amount = 25;
  var AM = { monthly: [5, 10, 25, 50, 100], once: [25, 50, 100, 250, 500] };
  var IMPACT = {
    5: "keeps a free tool online and maintained", 10: "funds research time on a new guide", 25: "adds to the student prize pool",
    50: "helps pay a student contributor", 100: "sponsors a monthly award entry pool", 250: "funds a new free tool", 500: "underwrites a contest runner-up prize"
  };
  var amountsEl = document.getElementById("amounts"), custom = document.getElementById("d-custom"), impact = document.getElementById("d-impact");
  function cur() { return (C.funding && C.funding.currency) || "USD"; }
  function drawAmounts() {
    amountsEl.innerHTML = AM[freq].map(function (a) {
      return '<button class="amount" type="button" data-a="' + a + '" aria-pressed="' + (a === amount) + '">' + NE.money(a, cur()) + '</button>';
    }).join("") + '<label class="visually-hidden" for="d-custom">Other amount</label>';
    update();
  }
  function update() {
    var a = parseFloat(custom.value) || amount;
    var key = Object.keys(IMPACT).map(Number).filter(function (k) { return k <= a; }).pop() || 5;
    var fee = document.getElementById("d-fees").checked ? Math.round((a * 0.029 + 0.3) * 100) / 100 : 0;
    impact.textContent = NE.money(a, cur()) + (freq === "monthly" ? " a month " : " ") + IMPACT[key] + (fee ? ". With fees covered: " + NE.money(a + fee, cur()) + "." : ".");
    document.getElementById("p-amount").value = a + (fee ? " (+" + fee + " fees)" : "");
    document.getElementById("p-freq").value = freq === "monthly" ? "Monthly" : "One-time";
    document.getElementById("p-purpose").value = document.getElementById("d-purpose").value;
  }
  amountsEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-a]"); if (!b) return;
    amount = parseFloat(b.getAttribute("data-a")); custom.value = "";
    Array.prototype.forEach.call(amountsEl.querySelectorAll(".amount"), function (x) { x.setAttribute("aria-pressed", x === b); });
    update();
  });
  custom.addEventListener("input", function () { Array.prototype.forEach.call(amountsEl.querySelectorAll(".amount"), function (x) { x.setAttribute("aria-pressed", "false"); }); update(); });
  document.getElementById("d-fees").addEventListener("change", update);
  document.getElementById("d-purpose").addEventListener("change", update);
  Array.prototype.forEach.call(document.querySelectorAll("[data-freq]"), function (b) {
    b.addEventListener("click", function () {
      freq = b.getAttribute("data-freq"); amount = freq === "monthly" ? 25 : 100;
      Array.prototype.forEach.call(document.querySelectorAll("[data-freq]"), function (x) { x.setAttribute("aria-pressed", x === b); });
      drawAmounts();
    });
  });

  // payment buttons from config (only those with a value render)
  var p = C.payments || {}, pay = document.getElementById("pay-buttons"), html = "";
  if (p.stripeMonthly) html += '<a class="btn btn-block" data-show="monthly" href="' + p.stripeMonthly + '" target="_blank" rel="noopener">Give monthly by card</a>';
  if (p.stripeOneTime) html += '<a class="btn btn-block" data-show="once" href="' + p.stripeOneTime + '" target="_blank" rel="noopener">Give once by card</a>';
  if (p.paypalHostedButtonId) html += '<a class="btn btn-ink btn-block" href="https://www.paypal.com/donate/?hosted_button_id=' + encodeURIComponent(p.paypalHostedButtonId) + '" target="_blank" rel="noopener">Give with PayPal</a>';
  if (p.githubSponsors) html += '<a class="btn btn-ghost btn-block" href="' + p.githubSponsors + '" target="_blank" rel="noopener">GitHub Sponsors</a>';
  if (p.buyMeACoffee) html += '<a class="btn btn-ghost btn-block" href="' + p.buyMeACoffee + '" target="_blank" rel="noopener">Buy Me a Coffee</a>';
  if (p.kofi) html += '<a class="btn btn-ghost btn-block" href="' + p.kofi + '" target="_blank" rel="noopener">Ko-fi</a>';
  if (html) { pay.innerHTML = html; pay.hidden = false; document.getElementById("pledge-intro").textContent = "Prefer a personal follow-up, a bank transfer or an invoice? Pledge below and we'll send secure payment details."; }

  // funding meter only once there's progress to show
  var f = C.funding || {};
  if (f.raised > 0) {
    var m = document.getElementById("meter-wrap"); m.hidden = false;
    document.getElementById("meter-fill").style.width = Math.min(100, f.raised / f.goal * 100) + "%";
    document.getElementById("meter-text").textContent = NE.money(f.raised, cur()) + " raised of " + NE.money(f.goal, cur()) + (f.supporters ? " from " + f.supporters + " supporters" : "");
  }
  var goalEl = document.getElementById("goal-text"); if (goalEl && f.goal) goalEl.textContent = NE.money(f.goal, cur());
  drawAmounts();
})();
