/* Program explorer — 40+ program paths with filters and a saved shortlist */
(function () {
  "use strict";
  var NE = window.NE, grid = document.getElementById("program-grid");
  if (!grid || !NE) return;
  var ROOT = window.NE_ROOT || "";
  // route: degree | certificate | bootcamp | apprenticeship ; cost: 1-4 bands ; outlook: strong | steady
  var P = [
    ["registered-nursing", "Registered nursing (BSN / BScN)", "Healthcare and nursing", "degree", "Online, Hybrid, On campus", "3–4 years", 3, "strong", "The standard route to RN licensure in many countries. Clinical placements are always in person.", "Licensure exam and registration with your nursing regulator"],
    ["practical-nursing", "Practical nursing diploma (LPN / RPN)", "Healthcare and nursing", "certificate", "Hybrid, On campus", "1–2 years", 2, "strong", "A faster entry into nursing with a bridge to RN later.", "Licensing exam set by your state or province"],
    ["nurse-practitioner", "Nurse practitioner (MSN / DNP)", "Healthcare and nursing", "degree", "Online, Hybrid", "2–4 years", 4, "strong", "Advanced practice for experienced RNs: diagnose, prescribe and manage care.", "Needs an RN licence and clinical experience first"],
    ["personal-support-worker", "Personal support worker / nursing assistant", "Healthcare and nursing", "certificate", "Hybrid, On campus", "6–12 months", 1, "strong", "Hands-on care roles in long-term care, home care and hospitals.", "Registry or certification rules vary by region"],
    ["medical-assistant", "Medical assistant certificate", "Healthcare and nursing", "certificate", "Online, Hybrid, On campus", "9–12 months", 2, "strong", "Clinical and admin support in clinics. A common first step into healthcare.", "Optional national certification in some countries"],
    ["radiologic-technology", "Radiologic / imaging technology", "Healthcare and nursing", "degree", "On campus", "2–4 years", 3, "strong", "X-ray, CT and MRI imaging. Heavy clinical component.", "Certification by your national or state body"],
    ["dental-hygiene", "Dental hygiene", "Healthcare and nursing", "degree", "On campus", "2–3 years", 3, "strong", "Preventive oral care with a regulated scope of practice.", "Licensing exam required"],
    ["public-health", "Public health (MPH)", "Healthcare and nursing", "degree", "Online, Hybrid, On campus", "1–2 years", 3, "steady", "Population health, epidemiology and health policy.", "Check accreditation by your country's public-health body"],
    ["health-administration", "Healthcare administration (MHA)", "Business and management", "degree", "Online, Hybrid", "1–2 years", 3, "strong", "Lead hospitals, clinics and health systems.", "Some roles prefer clinical background"],
    ["mba", "MBA (full-time, part-time or online)", "Business and management", "degree", "Online, Hybrid, On campus", "1–2 years", 4, "steady", "General management, strategy and leadership. Network matters as much as the syllabus.", "Look for recognised business-school accreditation"],
    ["business-bachelors", "Business administration (bachelor's)", "Business and management", "degree", "Online, Hybrid, On campus", "3–4 years", 3, "steady", "Broad foundation in finance, marketing, operations and management.", "Specialise in year two or three"],
    ["accounting", "Accounting degree and professional designation", "Business and management", "degree", "Online, Hybrid, On campus", "3–5 years", 3, "steady", "The route to CPA, CA or ACCA-type designations.", "Designation exams and experience requirements"],
    ["project-management", "Project management certification", "Business and management", "certificate", "Online", "2–6 months", 1, "steady", "Recognised PM credentials that boost almost any career.", "Some certifications need documented experience"],
    ["digital-marketing", "Digital marketing certificate", "Business and management", "certificate", "Online", "2–6 months", 1, "steady", "SEO, paid ads, analytics and content. Portfolio beats credentials here.", "Free vendor certifications are a good start"],
    ["supply-chain", "Supply chain and logistics", "Business and management", "certificate", "Online, Hybrid", "6–12 months", 2, "steady", "Procurement, operations and logistics roles.", "Professional certifications available"],
    ["computer-science", "Computer science (bachelor's)", "Computer science and IT", "degree", "Online, Hybrid, On campus", "3–4 years", 3, "strong", "Algorithms, systems and software. The broadest tech foundation.", "Strong maths helps"],
    ["software-bootcamp", "Software engineering bootcamp", "Computer science and IT", "bootcamp", "Online, On campus", "12–26 weeks", 3, "steady", "Full-stack web development, fast. Outcomes vary widely by provider.", "Verify audited job-placement data"],
    ["cloud-certs", "Cloud certifications (AWS, Azure, Google Cloud)", "Computer science and IT", "certificate", "Online", "1–6 months", 1, "strong", "Vendor certifications for cloud architecture and operations.", "Exam fees; hands-on labs recommended"],
    ["it-support", "IT support certificate", "Computer science and IT", "certificate", "Online", "3–6 months", 1, "steady", "Help-desk and systems basics. A common door into tech.", "Industry certifications available"],
    ["ux-design", "UX / UI design certificate or bootcamp", "Design and creative", "bootcamp", "Online", "12–24 weeks", 2, "steady", "User research, wireframing and prototyping. You're hired on your portfolio.", "Build 3 strong case studies"],
    ["graphic-design", "Graphic design (diploma or degree)", "Design and creative", "degree", "Hybrid, On campus", "2–4 years", 3, "steady", "Visual communication, branding and layout.", "Portfolio review at admission"],
    ["data-analytics", "Data analytics certificate", "Data and AI", "certificate", "Online", "3–9 months", 1, "strong", "Spreadsheets, SQL, dashboards and basic statistics.", "Show projects with public data"],
    ["data-science-masters", "Master's in data science", "Data and AI", "degree", "Online, Hybrid, On campus", "1–2 years", 4, "strong", "Statistics, machine learning and data engineering at depth.", "Programming and maths prerequisites"],
    ["ai-ml", "AI and machine learning certificate", "Data and AI", "certificate", "Online", "3–12 months", 2, "strong", "Applied ML, deep learning and working with AI models.", "Python and linear algebra first"],
    ["data-bootcamp", "Data science bootcamp", "Data and AI", "bootcamp", "Online", "12–24 weeks", 3, "steady", "Python, ML and portfolio projects in an intensive format.", "Check outcomes reporting carefully"],
    ["cybersecurity-cert", "Cybersecurity certificate", "Cybersecurity", "certificate", "Online", "3–9 months", 2, "strong", "Security fundamentals, networking and entry certifications.", "Industry certifications are widely requested"],
    ["cybersecurity-degree", "Cybersecurity (bachelor's or master's)", "Cybersecurity", "degree", "Online, Hybrid, On campus", "1–4 years", 3, "strong", "Security engineering, risk and incident response.", "Some roles require security clearance"],
    ["cyber-bootcamp", "Cybersecurity bootcamp", "Cybersecurity", "bootcamp", "Online", "12–24 weeks", 3, "steady", "Hands-on labs for SOC analyst and similar roles.", "Pair with a recognised certification"],
    ["engineering", "Engineering (civil, mechanical, electrical)", "Engineering", "degree", "On campus", "4 years", 3, "strong", "Accredited engineering degrees lead to professional licensure.", "Check engineering-accreditation status"],
    ["engineering-tech", "Engineering technology diploma", "Engineering", "certificate", "Hybrid, On campus", "2–3 years", 2, "steady", "Applied, lab-heavy training for technologist roles.", "Professional technologist designations available"],
    ["teaching", "Teaching credential / B.Ed.", "Education and teaching", "degree", "Hybrid, On campus", "1–4 years", 2, "strong", "The route to a licensed classroom teacher role.", "Certification by your state, province or national body"],
    ["early-childhood", "Early childhood education diploma", "Education and teaching", "certificate", "Hybrid, On campus", "1–2 years", 2, "strong", "Work in child care and early-learning programs.", "Registration rules vary"],
    ["tesol", "TESOL / TEFL certificate", "Education and teaching", "certificate", "Online, Hybrid", "1–4 months", 1, "steady", "Teach English at home or abroad.", "Look for courses with observed teaching practice"],
    ["psychology", "Psychology (bachelor's)", "Psychology and social work", "degree", "Online, Hybrid, On campus", "3–4 years", 3, "steady", "Human behaviour and research methods. Licensed practice needs graduate study.", "Plan for a master's or doctorate to practise"],
    ["social-work", "Social work (BSW / MSW)", "Psychology and social work", "degree", "Online, Hybrid, On campus", "2–4 years", 3, "strong", "Counselling, case management and advocacy roles.", "Registration with your social-work regulator"],
    ["counselling", "Counselling / mental health counselling (master's)", "Psychology and social work", "degree", "Online, Hybrid", "2–3 years", 3, "strong", "Clinical counselling with supervised practice hours.", "Licensure varies by state or province"],
    ["paralegal", "Paralegal certificate", "Law and legal studies", "certificate", "Online, Hybrid", "6–12 months", 2, "steady", "Legal research, drafting and case support.", "Some regions license paralegals"],
    ["law", "Law degree (JD / LLB)", "Law and legal studies", "degree", "On campus", "3 years", 4, "steady", "The route to practising law, followed by bar or licensing exams.", "Admission tests apply in many countries"],
    ["electrician", "Electrician apprenticeship", "Skilled trades", "apprenticeship", "On campus", "4–5 years", 1, "strong", "Earn while you learn toward a licensed trade.", "Find an employer sponsor"],
    ["plumbing", "Plumbing apprenticeship", "Skilled trades", "apprenticeship", "On campus", "4–5 years", 1, "strong", "Paid on-the-job training with classroom blocks.", "Licensing exam at the end"],
    ["hvac", "HVAC technician certificate", "Skilled trades", "certificate", "On campus", "6–12 months", 2, "strong", "Heating, cooling and refrigeration systems.", "Refrigerant-handling certification often required"],
    ["welding", "Welding certificate", "Skilled trades", "certificate", "On campus", "6–12 months", 2, "steady", "Industrial and structural welding processes.", "Welding certifications by process"],
    ["culinary", "Culinary arts and hospitality", "Design and creative", "certificate", "On campus", "1–2 years", 2, "steady", "Professional kitchens, hotels and events.", "Food-safety certification"],
    ["phd", "PhD / research doctorate", "Engineering", "degree", "On campus", "3–6 years", 1, "steady", "Original research. Many programs are funded with a stipend.", "Find a supervisor before you apply"]
  ];
  var FIELD = ["Healthcare and nursing", "Business and management", "Computer science and IT", "Data and AI", "Cybersecurity", "Engineering", "Education and teaching", "Psychology and social work", "Law and legal studies", "Design and creative", "Skilled trades"];
  var ROUTE = { degree: ["Degree", "var(--r-degree)"], certificate: ["Certificate / diploma", "var(--r-cert)"], bootcamp: ["Bootcamp", "var(--r-boot)"], apprenticeship: ["Apprenticeship", "var(--r-appr)"] };
  var fField = document.getElementById("f-field"), fRoute = document.getElementById("f-route"), fFormat = document.getElementById("f-format"), fQ = document.getElementById("f-q"), fSaved = document.getElementById("f-saved");
  FIELD.forEach(function (f) { var o = document.createElement("option"); o.textContent = f; fField.appendChild(o); });
  var params = new URLSearchParams(location.search);
  if (params.get("field") && FIELD.indexOf(params.get("field")) > -1) fField.value = params.get("field");
  if (params.get("route") && ROUTE[params.get("route")]) fRoute.value = params.get("route");
  var saved = NE.store.get("ne-shortlist", []);

  function cost(n) { return ["Free–$", "$", "$$", "$$$", "$$$$"][n] || "$$"; }
  function render() {
    var q = fQ.value.trim().toLowerCase(), f = fField.value, r = fRoute.value, fm = fFormat.value, onlySaved = fSaved.getAttribute("aria-pressed") === "true";
    var list = P.filter(function (p) {
      return (!f || p[2] === f) && (!r || p[3] === r) && (!fm || p[4].indexOf(fm) > -1) && (!onlySaved || saved.indexOf(p[0]) > -1) &&
        (!q || (p[1] + " " + p[2] + " " + p[8]).toLowerCase().indexOf(q) > -1);
    });
    document.getElementById("result-count").textContent = list.length + " program path" + (list.length === 1 ? "" : "s") + (saved.length ? " · " + saved.length + " saved" : "");
    var featured = '<article class="ticket" style="--route:var(--pencil)"><div class="ticket-main"><span class="tag tag-ad">Featured program slot</span><h3>Your program could appear here</h3><p>Schools and training providers can feature accredited programs to students filtering for this field. Always labelled.</p></div><div class="ticket-stub"><span class="muted">For institutions</span><a class="btn btn-sm btn-ink" href="' + ROOT + 'partners.html">Feature a program</a></div></article>';
    grid.innerHTML = list.length ? list.map(function (p, idx) {
      var on = saved.indexOf(p[0]) > -1, rt = ROUTE[p[3]];
      return (idx === 6 ? featured : "") + '<article class="ticket" style="--route:' + rt[1] + '">' +
        '<button class="icon-btn save" type="button" data-save="' + p[0] + '" aria-pressed="' + on + '" aria-label="' + (on ? "Remove from" : "Save to") + ' shortlist: ' + NE.esc(p[1]) + '"><svg viewBox="0 0 24 24" width="18" height="18" fill="' + (on ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z"/></svg></button>' +
        '<div class="ticket-main"><span class="tag">' + rt[0] + '</span><h3>' + NE.esc(p[1]) + '</h3><p>' + NE.esc(p[8]) + '</p><p class="small muted" style="margin-top:.5rem">' + NE.esc(p[9]) + '</p></div>' +
        '<div class="ticket-stub"><dl><div><dt>Time</dt><dd>' + p[5] + '</dd></div><div><dt>Cost</dt><dd>' + cost(p[6]) + '</dd></div><div><dt>Formats</dt><dd>' + p[4] + '</dd></div><div><dt>Outlook</dt><dd>' + (p[7] === "strong" ? "Strong demand" : "Steady") + '</dd></div></dl>' +
        '<a class="btn btn-sm" href="' + ROOT + 'match.html?route=' + p[0] + '&field=' + encodeURIComponent(p[2]) + '">Find programs</a></div></article>';
    }).join("") : '<div class="empty" style="grid-column:1/-1"><p><strong>No program paths match those filters.</strong></p><p>Clear a filter, or <a href="' + ROOT + 'match.html">get matched</a> and we\'ll suggest options.</p></div>';
  }
  grid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-save]"); if (!b) return;
    var id = b.getAttribute("data-save"), k = saved.indexOf(id);
    if (k > -1) saved.splice(k, 1); else saved.push(id);
    NE.store.set("ne-shortlist", saved);
    if (saved.length) { var bb = NE.store.get("ne-bonus", {}); bb.shortlist = true; NE.store.set("ne-bonus", bb); }
    render();
  });
  [fField, fRoute, fFormat].forEach(function (s) { s.addEventListener("change", render); });
  fQ.addEventListener("input", render);
  fSaved.addEventListener("click", function () { fSaved.setAttribute("aria-pressed", fSaved.getAttribute("aria-pressed") === "true" ? "false" : "true"); render(); });
  document.getElementById("f-reset").addEventListener("click", function () { fField.value = ""; fRoute.value = ""; fFormat.value = ""; fQ.value = ""; fSaved.setAttribute("aria-pressed", "false"); render(); });
  render();
})();
