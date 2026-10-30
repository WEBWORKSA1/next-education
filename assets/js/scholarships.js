/* Scholarship finder — long-running awards linked to the funder's official site */
(function () {
  "use strict";
  var NE = window.NE, grid = document.getElementById("schol-grid");
  if (!grid || !NE) return;
  var ROOT = window.NE_ROOT || "";
  // name, host, levels, who can apply, funding, url, note
  var S = [
    ["Chevening Scholarships", "United Kingdom", "Master's", "International (eligible countries)", "Full", "https://www.chevening.org", "UK government awards for one-year master's degrees, aimed at future leaders."],
    ["Commonwealth Scholarships", "United Kingdom", "Master's, PhD", "Citizens of eligible Commonwealth countries", "Full", "https://cscuk.fcdo.gov.uk", "Postgraduate study in the UK for candidates from low and middle-income Commonwealth countries."],
    ["Rhodes Scholarship", "United Kingdom", "Master's, PhD", "Eligible countries worldwide", "Full", "https://www.rhodeshouse.ox.ac.uk", "Postgraduate study at the University of Oxford."],
    ["Clarendon Fund", "United Kingdom", "Master's, PhD", "International and UK", "Full", "https://www.ox.ac.uk/clarendon", "Oxford graduate scholarships awarded on academic merit."],
    ["Gates Cambridge Scholarship", "United Kingdom", "Master's, PhD", "Citizens of any country outside the UK", "Full", "https://www.gatescambridge.org", "Full-cost postgraduate scholarships at the University of Cambridge."],
    ["Marshall Scholarship", "United Kingdom", "Master's, PhD", "US citizens", "Full", "https://www.marshallscholarship.org", "Graduate study at any UK university for American students."],
    ["Fulbright Program", "United States", "Master's, PhD, research", "International (via national Fulbright commissions)", "Varies", "https://foreign.fulbrightonline.org", "US government exchange awards for graduate study and research."],
    ["Knight-Hennessy Scholars", "United States", "Master's, PhD, professional", "Worldwide", "Full", "https://knight-hennessy.stanford.edu", "Full funding for any graduate degree at Stanford University."],
    ["The Gates Scholarship", "United States", "Undergraduate", "US high-school seniors with financial need", "Full", "https://www.thegatesscholarship.org", "Last-dollar scholarship for outstanding, Pell-eligible minority students."],
    ["Coca-Cola Scholars Program", "United States", "Undergraduate", "US high-school seniors", "Partial", "https://www.coca-colascholarsfoundation.org", "Achievement-based awards for leadership and service."],
    ["Jack Kent Cooke College Scholarship", "United States", "Undergraduate", "High-achieving students with financial need", "Partial", "https://www.jkcf.org", "Large multi-year awards plus advising."],
    ["QuestBridge National College Match", "United States", "Undergraduate", "Low-income high-school seniors", "Full", "https://www.questbridge.org", "Full four-year scholarships at partner colleges."],
    ["Dell Scholars Program", "United States", "Undergraduate", "Pell-eligible students", "Partial", "https://www.dellscholars.org", "Funding plus a laptop, textbooks and ongoing support."],
    ["Hispanic Scholarship Fund", "United States", "Undergraduate, graduate", "Students of Hispanic heritage", "Partial", "https://www.hsf.net", "Merit-based awards and scholar support services."],
    ["UNCF Scholarships", "United States", "Undergraduate", "Students including those at HBCUs", "Partial", "https://uncf.org", "Hundreds of scholarship programs through one organisation."],
    ["Federal Pell Grant", "United States", "Undergraduate", "US students with financial need", "Partial", "https://studentaid.gov", "Need-based federal grant you don't repay. Apply through the FAFSA."],
    ["Loran Award", "Canada", "Undergraduate", "Canadian high-school students", "Full", "https://loranscholar.ca", "Character-based award with tuition, stipend and mentorship."],
    ["Schulich Leader Scholarships", "Canada", "Undergraduate (STEM)", "Graduating Canadian high-school students", "Partial", "https://www.schulichleaders.com", "Major STEM scholarships at partner universities."],
    ["Canada Student Grants", "Canada", "Undergraduate, college", "Canadian students with financial need", "Partial", "https://www.canada.ca/en/services/benefits/education/student-aid.html", "Federal grants applied for through your province or territory."],
    ["National Scholarship Portal", "India", "School to postgraduate", "Indian students", "Varies", "https://scholarships.gov.in", "One portal for central and state government scholarships."],
    ["Inlaks Shivdasani Scholarships", "India", "Master's, PhD", "Indian citizens studying abroad", "Full", "https://www.inlaksfoundation.org", "Funding for top universities in the US, UK and Europe."],
    ["K.C. Mahindra Scholarships", "India", "Postgraduate abroad", "Indian students", "Partial", "https://www.kcmet.org", "Interest-free loan scholarships for postgraduate study abroad."],
    ["DAAD Scholarships", "Germany", "Master's, PhD, research", "International", "Varies", "https://www.daad.de/en/", "Germany's academic exchange service, with a searchable funding database."],
    ["Erasmus Mundus Joint Masters", "Europe", "Master's", "Worldwide", "Full", "https://erasmus-plus.ec.europa.eu", "EU-funded master's taught across universities in several countries."],
    ["Eiffel Excellence Scholarship", "France", "Master's, PhD", "International", "Partial", "https://www.campusfrance.org", "French government awards, applied for through French institutions."],
    ["Swiss Government Excellence Scholarships", "Switzerland", "PhD, postdoc, research", "International", "Full", "https://www.sbfi.admin.ch", "Research scholarships at Swiss universities."],
    ["Swedish Institute Scholarships for Global Professionals", "Sweden", "Master's", "Professionals from eligible countries", "Full", "https://si.se/en/", "Master's study in Sweden for future leaders."],
    ["Stipendium Hungaricum", "Hungary", "Undergraduate, master's, PhD", "Citizens of partner countries", "Full", "https://stipendiumhungaricum.hu", "Hungarian government scholarships at many universities."],
    ["Türkiye Scholarships", "Türkiye", "Undergraduate to PhD", "International", "Full", "https://www.turkiyeburslari.gov.tr", "Government scholarships covering tuition, housing and a stipend."],
    ["Government of Ireland International Education Scholarships", "Ireland", "Master's, PhD", "Students from eligible countries", "Partial", "https://hea.ie", "One-year awards for international students at Irish institutions."],
    ["MEXT Scholarship", "Japan", "Undergraduate, master's, PhD", "International", "Full", "https://www.studyinjapan.go.jp/en/", "Japanese government scholarships, usually applied for through embassies."],
    ["Global Korea Scholarship", "South Korea", "Undergraduate, graduate", "International", "Full", "https://www.studyinkorea.go.kr", "Korean government scholarships including language training."],
    ["Schwarzman Scholars", "China", "Master's", "Worldwide", "Full", "https://www.schwarzmanscholars.org", "One-year master's at Tsinghua University in Beijing."],
    ["Yenching Academy", "China", "Master's", "Worldwide", "Full", "https://yenchingacademy.pku.edu.cn", "Interdisciplinary China studies at Peking University."],
    ["Australia Awards", "Australia", "Undergraduate, master's", "Citizens of eligible partner countries", "Full", "https://www.dfat.gov.au/people-to-people/australia-awards", "Australian government development scholarships."],
    ["Manaaki New Zealand Scholarships", "New Zealand", "Undergraduate, master's, PhD", "Citizens of eligible countries", "Full", "https://www.nzscholarships.govt.nz", "New Zealand government scholarships for study in NZ."],
    ["Mastercard Foundation Scholars Program", "Africa and partners", "Undergraduate, master's", "Young people from Africa", "Full", "https://mastercardfdn.org", "Comprehensive scholarships at partner universities."],
    ["Aga Khan Foundation International Scholarships", "Worldwide", "Master's, PhD", "Students from select developing countries", "Partial", "https://www.akdn.org", "Postgraduate funding on a 50% grant, 50% loan basis."]
  ];
  var lvl = document.getElementById("s-level"), host = document.getElementById("s-host"), fund = document.getElementById("s-fund"), q = document.getElementById("s-q");
  var hosts = []; S.forEach(function (s) { if (hosts.indexOf(s[1]) < 0) hosts.push(s[1]); });
  hosts.sort().forEach(function (h) { var o = document.createElement("option"); o.textContent = h; host.appendChild(o); });
  var C = window.NE_CONFIG || {}, own = C.contests || null;

  function render() {
    var L = lvl.value, H = host.value, F = fund.value, Q = q.value.trim().toLowerCase();
    var list = S.filter(function (s) {
      var lv = s[2].toLowerCase();
      var levelOk = !L || (L === "ug" && /undergrad|school/.test(lv)) || (L === "masters" && /master|postgraduate|graduate|professional/.test(lv)) || (L === "phd" && /phd|research|doctor|postdoc/.test(lv));
      return levelOk && (!H || s[1] === H) && (!F || s[4] === F) && (!Q || (s.join(" ")).toLowerCase().indexOf(Q) > -1);
    });
    document.getElementById("s-count").textContent = list.length + " scholarship" + (list.length === 1 ? "" : "s") + " and grant programs";
    var ownCard = own ? '<article class="card" style="border:2px solid var(--pencil)"><div class="meta"><span class="tag tag-ad">Next.Education award</span><span>Any level</span></div><h3>' + NE.esc(own.monthly.name) + '</h3><p class="muted">A ' + NE.money(own.monthly.amount, own.monthly.currency) + ' award every month. No essay: enter with a short form.</p><a class="btn btn-sm" href="' + ROOT + 'contests.html#monthly">Enter free</a></article>' : "";
    grid.innerHTML = (!L && !H && !F && !Q ? ownCard : "") + (list.length ? list.map(function (s) {
      return '<article class="card"><div class="meta"><span class="tag">' + NE.esc(s[4]) + ' funding</span><span>' + NE.esc(s[1]) + '</span></div>' +
        '<h3>' + NE.esc(s[0]) + '</h3><p class="muted">' + NE.esc(s[6]) + '</p>' +
        '<p class="small"><strong>Level:</strong> ' + NE.esc(s[2]) + '<br><strong>Who can apply:</strong> ' + NE.esc(s[3]) + '</p>' +
        '<a class="btn btn-sm btn-ghost" href="' + s[5] + '" target="_blank" rel="noopener">Official site</a></article>';
    }).join("") : '<div class="empty" style="grid-column:1/-1"><p><strong>No scholarships match those filters.</strong></p><p>Try a broader level or region, or <a href="#alerts">get alerts</a> for new awards.</p></div>');
  }
  [lvl, host, fund].forEach(function (s) { s.addEventListener("change", render); });
  q.addEventListener("input", render);
  render();
})();
