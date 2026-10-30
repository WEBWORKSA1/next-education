/* Contests: entry window state, essay word counter, bonus entries */
(function () {
  "use strict";
  var NE = window.NE, C = (window.NE_CONFIG || {}).contests;
  if (!NE || !C) return;
  var now = new Date(), opens = new Date(C.essay.opens + "T00:00:00-05:00"), closes = new Date(C.essay.closes);
  var state = now < opens ? "soon" : (now > closes ? "closed" : "open");
  var interest = document.getElementById("essay-interest"), entry = document.getElementById("essay-entry"), closed = document.getElementById("essay-closed"), badge = document.getElementById("essay-state");
  if (interest) interest.hidden = state !== "soon";
  if (entry) entry.hidden = state !== "open";
  if (closed) closed.hidden = state !== "closed";
  if (badge) badge.textContent = state === "soon" ? "Opening soon" : (state === "open" ? "Open for entries" : "Entries closed");

  // live word counter
  var ta = document.getElementById("e-essay"), wc = document.getElementById("e-wc");
  if (ta && wc) {
    var count = function () {
      var n = (ta.value.trim().match(/\S+/g) || []).length;
      wc.textContent = n + " / 600 words";
      wc.style.color = n > 600 ? "var(--warn)" : "var(--muted)";
      ta.setCustomValidity(n > 600 ? "Please keep your essay to 600 words or fewer." : (n < 150 && n > 0 ? "Essays need at least 150 words." : ""));
    };
    ta.addEventListener("input", count); count();
  }

  // bonus entries for the monthly award
  var b = NE.store.get("ne-bonus", {});
  var items = [["quiz", "Complete the route quiz", 1, "tools/path-quiz.html"], ["newsletter", "Subscribe to any newsletter", 1, "#nl-email"], ["match", "Finish a program match", 2, "match.html"], ["shortlist", "Save a program to your shortlist", 1, "programs.html"]];
  var list = document.getElementById("bonus-list"), total = 1, ROOT = window.NE_ROOT || "";
  if (list) {
    list.innerHTML = items.map(function (it) {
      var done = !!b[it[0]]; if (done) total += it[2];
      return '<li style="display:flex;justify-content:space-between;gap:1rem"><span>' + (done ? "✓ " : "") + (done ? it[1] : '<a href="' + (it[3].charAt(0) === "#" ? it[3] : ROOT + it[3]) + '">' + it[1] + '</a>') + '</span><strong>+' + it[2] + '</strong></li>';
    }).join("");
    document.getElementById("bonus-total").textContent = total;
    var hid = document.getElementById("m-bonus"); if (hid) hid.value = total + " (" + Object.keys(b).filter(function (k) { return b[k]; }).join(", ") + ")";
  }
  // current month label
  var ml = document.getElementById("month-label");
  if (ml) ml.textContent = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
})();
