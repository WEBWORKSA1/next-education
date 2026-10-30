/* Home hero: interactive route map */
(function () {
  "use strict";
  var svg = document.getElementById("route-map");
  if (!svg) return;
  var ROOT = window.NE_ROOT || "";
  var routes = [
    { k: "degree", name: "Degree", c: "var(--r-degree)", time: "2–5 years", cost: "$$ to $$$$", best: "Regulated careers", blurb: "Bachelor's, master's and doctorates. The longest route, and the one many licensed professions require." },
    { k: "certificate", name: "Certificate", c: "var(--r-cert)", time: "3–12 months", cost: "$ to $$", best: "Fast upskilling", blurb: "Focused credentials and diplomas that add one job-ready skill set, often online and part-time." },
    { k: "bootcamp", name: "Bootcamp", c: "var(--r-boot)", time: "12–26 weeks", cost: "$$ to $$$", best: "Switching into tech", blurb: "Intensive, project-based training in coding, data, UX or cybersecurity. Check outcomes before you pay." },
    { k: "apprenticeship", name: "Apprenticeship", c: "var(--r-appr)", time: "1–5 years", cost: "Paid to train", best: "Skilled trades", blurb: "Earn while you learn on the job, with classroom blocks, toward a recognised trade qualification." },
    { k: "abroad", name: "Study abroad", c: "var(--r-abroad)", time: "1–4 years", cost: "$$ to $$$$", best: "Global careers", blurb: "Earn your qualification in another country. Plan 12–18 months ahead for tests, funding and visas." },
    { k: "free", name: "Free courses", c: "var(--r-free)", time: "Self-paced", cost: "Free to $", best: "Testing an interest", blurb: "Open courses and video lectures from top universities. The cheapest way to find out what you enjoy." }
  ];
  var schol = { k: "scholarship", name: "Scholarships and aid", c: "var(--r-schol)", time: "Year-round", cost: "Lowers any route", best: "Everyone", blurb: "Scholarships, grants and bursaries cut the cost of every route. Start looking before you apply to programs." };

  var NS = "http://www.w3.org/2000/svg";
  var ox = 60, oy = 216, stX = 540, bend = 140;
  var targets = [58, 122, 186, 250, 314, 378];
  function el(n, a) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); return e; }

  var gLines = el("g", {}), gStations = el("g", {});
  svg.appendChild(gLines);

  // scholarship interchange line
  var sx = 392;
  var sLine = el("path", { d: "M" + sx + " 34 V 404", class: "line draw", stroke: schol.c, "stroke-dasharray": "2 12", style: "--len:400;--d:1.1s;stroke-width:6" });
  sLine.style.strokeDasharray = "2 12"; sLine.classList.remove("draw");
  gLines.appendChild(sLine);

  var lineEls = {};
  routes.forEach(function (r, i) {
    var sy = oy - 22.5 + i * 9, ty = targets[i], dy = ty - sy, x2 = bend + Math.abs(dy);
    var d = "M" + ox + " " + sy + " H " + bend + " L " + x2 + " " + ty + " H " + stX;
    var p = el("path", { d: d, class: "line draw", stroke: r.c });
    gLines.appendChild(p);
    var len = p.getTotalLength ? Math.ceil(p.getTotalLength()) : 700;
    p.style.setProperty("--len", len); p.style.setProperty("--d", (i * 0.08) + "s");
    lineEls[r.k] = p;
    // interchange tick where the line crosses the scholarship line
    gStations.appendChild(el("circle", { cx: sx, cy: ty, r: 5, fill: "var(--card)", stroke: "var(--ink)", "stroke-width": 2.5 }));
    var st = el("g", { class: "station", tabindex: "0", role: "button", "aria-label": r.name + " route: show details", "data-k": r.k });
    st.appendChild(el("circle", { cx: stX, cy: ty, r: 10, stroke: r.c }));
    var t = el("text", { x: stX + 20, y: ty + 5 }); t.textContent = r.name; st.appendChild(t);
    gStations.appendChild(st);
  });
  // scholarship station
  var ss = el("g", { class: "station", tabindex: "0", role: "button", "aria-label": "Scholarships and aid: show details", "data-k": "scholarship" });
  ss.appendChild(el("circle", { cx: sx, cy: 20, r: 10, stroke: schol.c }));
  var stt = el("text", { x: sx + 18, y: 25 }); stt.textContent = "Scholarships and aid"; ss.appendChild(stt);
  gStations.appendChild(ss);
  // origin
  var og = el("g", { class: "origin" });
  og.appendChild(el("circle", { cx: ox, cy: oy, r: 15 }));
  og.appendChild(el("circle", { cx: ox, cy: oy, r: 6, fill: "var(--pencil)" }));
  var ot = el("text", { x: ox - 34, y: oy + 42 }); ot.textContent = "You are here"; og.appendChild(ot);
  gStations.appendChild(og);
  svg.appendChild(gStations);

  var panel = document.getElementById("route-panel");
  function show(k) {
    var r = k === "scholarship" ? schol : routes.filter(function (x) { return x.k === k; })[0];
    if (!r || !panel) return;
    Object.keys(lineEls).forEach(function (key) { lineEls[key].classList.toggle("dim", k !== "scholarship" && key !== k); });
    Array.prototype.forEach.call(svg.querySelectorAll(".station"), function (s) { s.classList.toggle("active", s.getAttribute("data-k") === k); });
    var href = k === "scholarship" ? ROOT + "scholarships.html" : ROOT + "match.html?goal=" + k;
    var label = k === "scholarship" ? "Find scholarships" : "Start this route";
    panel.innerHTML = '<h3><span class="swatch" style="background:' + r.c + '"></span>' + r.name + '</h3>' +
      '<a class="btn btn-sm" href="' + href + '">' + label + '</a>' +
      '<dl><div><dt>Typical time</dt><dd>' + r.time + '</dd></div><div><dt>Typical cost</dt><dd>' + r.cost + '</dd></div><div><dt>Best for</dt><dd>' + r.best + '</dd></div></dl>' +
      '<p>' + r.blurb + '</p>';
  }
  Array.prototype.forEach.call(svg.querySelectorAll(".station"), function (s) {
    s.addEventListener("click", function () { show(s.getAttribute("data-k")); });
    s.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(s.getAttribute("data-k")); } });
  });
  show("degree");
})();
