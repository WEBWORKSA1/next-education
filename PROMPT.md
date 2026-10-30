# Next.Education: concept and phase-wise build prompt

This file documents (1) the business concept chosen for the domain **Next.Education**, (2) what was learned from 36 world-class education sites, and (3) a phase-by-phase prompt that rebuilds or extends this website with any capable AI coding assistant. The live code in this repository is the output of these phases.

---

## 1. The concept: a decision engine for "what's next" in education

**One line:** Next.Education helps students, parents and career-changers choose their next education step (degree, certificate, bootcamp, apprenticeship, study abroad or free courses), find the money to pay for it, and get matched with programs.

**Why this concept beats the alternatives for this domain**

| Option considered | Verdict | Reason |
|---|---|---|
| EdTech news / blog | Rejected | Low-CPC B2B audience, crowded by funded newsrooms, weak lead value |
| Course marketplace | Rejected | Needs supply-side contracts and payments before revenue; thin margins |
| Tutoring marketplace | Rejected | Two-sided cold start, trust and safety burden with minors |
| **Decision engine + lead generation** | **Chosen** | The name literally answers "what's next?"; it monetises the highest-value moment in education (choosing and paying), and it stacks four revenue streams on one audience |

**Why the numbers favour it (2025–2026 benchmarks)**

- Education is a premium ad vertical. Search advertisers in education paid about **$6.23 per click** in 2025 vs **$5.26** across all industries, with an average **cost per lead of about $90**. Advertisers paying more per click raises what AdSense publishers earn on education pages.
- Institutions pay heavily for enquiries. Online, professional and continuing-education programs average about **$140 per inquiry**; third-party lead aggregators charge **$100–$300 per inquiry**; graduate programs cluster around **$140–$200 per lead**.
- The intent is high and recurring. Every year a new cohort of school-leavers, graduate applicants and career-changers searches the same decision questions.

**Revenue stack (in order of expected size once traffic exists)**

1. **Lead generation**: consented "Get matched", advising-call and study-abroad-consultation enquiries sold per lead or as flat monthly partner fees to accredited schools and licensed providers.
2. **Google AdSense**: on long-form guides, tool pages and finders (education-intent pages carry premium CPCs).
3. **Sponsorships and direct ads**: featured program slots, sponsored guides, tool "presented by" placements, newsletter sponsorship, named student prizes.
4. **Reader donations**: monthly and one-time support, directed to operations, promotion, hiring, contests and new tools.
5. **Asset upside**: the domain and site are positioned for acquisition or partnership (every page links to the owner's business contact).

**Illustrative unit economics (an assumption to test, not a forecast):** at 50,000 monthly sessions, a 1.5% match completion rate gives 750 enquiries/month. If 40% opt in to partner contact and sell at $25–$60, that is roughly **$7,500–$18,000/month** in lead revenue, before AdSense, sponsorships and donations. Validate CPLs with real partners before relying on them.

**The bold path vs the safe path**

- *Safe:* AdSense plus newsletter only. Simple, but lower revenue per visitor.
- *Bold (built in):* turn the match flow into a lead marketplace with school partners, run a funded monthly award as a list-builder, and publish programmatic "best online [program] in [country]" pages at scale. Higher revenue ceiling; needs consent discipline and partner vetting.

---

## 2. Research: 36 world-class sites reviewed

**Degree and college discovery:** BestColleges, Niche, Appily (formerly Cappex), BigFuture (College Board), OnlineU, Study.com, Shiksha, Collegedunia, TopUniversities (QS), Times Higher Education, Unigo, Course Report.
**Scholarships, funding and study abroad:** Scholarships.com, Bold.org, Fastweb, Going Merry, ScholarshipOwl, Mastersportal (Studyportals), IDP, Leverage Edu, ApplyBoard, Khan Academy donate flow, Chegg, Scholarships360.
**Learning platforms and content hubs:** Khan Academy, Coursera, edX, Alison, Class Central, freeCodeCamp, Duolingo, Codecademy, Brilliant, Edutopia, EdSurge, upGrad, FutureLearn.
(US News and Udemy blocked automated review; substitutes were used.)

**Patterns adopted (ranked by revenue/conversion impact)**

1. Multi-step "Get matched" wizard: easy preference questions first, contact details last, visible "Step X of N" progress (QS, OnlineU, Course Report).
2. Hero as a selector, not just a button: route chips/stations that open the matcher pre-filled via URL parameters (Course Report, Coursera, Brilliant).
3. Granular, unticked consent: report consent, partner-contact consent ("not a condition of purchase"), and newsletter as separate boxes (Course Report, Fastweb, Unigo), which also meets Canada's CASL.
4. Labelled "Featured" program slots inside listings, plus an advertiser disclosure (OnlineU, Course Report, Bold).
5. In-house contests as the list-builder: a judged essay prize plus a no-essay monthly award with bonus entries for using tools, full official rules, winners wall (Niche, BigFuture, Unigo, ScholarshipOwl).
6. Quiz lead magnets with the email capture on the result screen (IDP, Codecademy, Mastersportal).
7. Free calculators and tools for repeat visits and dwell time (Alison, Collegedunia, Niche).
8. Trust stack for E-E-A-T: bylines, "updated" dates, sources, methodology/editorial page, "how we make money" (BestColleges, EdSurge, Coursera).
9. Donation page: monthly/one-time toggle, amount tiles with impact lines, purpose allocation, cover-fees option, employer match, "other ways to give", honest not-tax-deductible statement (Khan Academy, freeCodeCamp, Bold).
10. Audience fork: student / career-changer / parent / school (Bold, ApplyBoard, Unigo).
11. Persistent consult panel and short consultation form beside a benefits list for study abroad (IDP, Leverage Edu).
12. Saved shortlist in the browser and an exit-intent offer on desktop (Edutopia, Mastersportal).
13. Newsletter with list choice (weekly digest / scholarship alerts / monthly top five) (EdSurge).
14. B2B pages: advertise, for schools, sponsor a prize, media-kit form (THE, Niche, Fastweb).
15. Avoid: contradictory stats, "0+" counters rendered by JavaScript, pre-ticked or data-sale consent, identical "Learn more" buttons, fake testimonials.

---

## 3. The phase-wise build prompt

Paste each phase into an AI coding assistant in order. Each phase assumes the previous one is done.

### Phase 0: ground rules (include with every phase)

```
You are building "Next.Education", a static, multi-page website for the domain next.education.
Hard constraints:
- Pure static HTML/CSS/vanilla JS. No frameworks, no build server, no backend. Must run on GitHub Pages free plan from the main branch root. Use GitHub Pages' built-in Jekyll only for a shared layout (_layouts/default.html + front matter); no custom plugins.
- All internal links relative so the site works at https://<user>.github.io/next-education/ and at https://next.education/.
- Put this exact Google AdSense snippet in the <head> of every page:
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>
  Publisher ID: ca-pub-6620975821265271. Add ads.txt: "google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0".
  Use Auto ads; only render manual ad units when real slot IDs are configured (no empty ad boxes).
- At the top of every page, a bar linking to https://web.works/contact with the text:
  "Contact, if you are interested in this website, domain name, sponsorship, advertisement or partnership."
- Every form and contact link delivers to ONE owner inbox ([OWNER_INBOX]). That address must never appear in page text, HTML attributes, or plain source: store it encoded (e.g. reversed base64) in config.js, decode only at submit/click time, deliver forms via FormSubmit's AJAX endpoint (later swap in FormSubmit's random alias), and open mail only through a JS-built mailto behind an "Email us" link.
- Brand is always written "Next.Education" with the dot. Never "NextEducation". Include a trademark/copyright disclosure stating independence from any entity using "Next Education" or similar names.
- AdSense-safe content: original, substantial, accurate; no fake reviews/testimonials/stats; no "coming soon" pages; clear navigation, About, Contact, Privacy, Terms.
```

### Phase 1: design system and layout shell

```
Create assets/css/style.css and one shared layout (_layouts/default.html) that GitHub Pages' Jekyll wraps around every page; each page is HTML with front matter (title, description, canonical, nav, root, scripts) and its body wrapped in {% raw %}...{% endraw %}.
Design concept: "education as a route map". Graph-paper ground (#F6F8FC with #E1E7F2 grid), ink-blue type (#14213D), one action colour, pencil yellow (#FFB703), and transit-line colours reserved for six routes (degree #2457D6, certificate #0E9F8A, bootcamp #E4572E, apprenticeship #3F8F3A, study abroad #7048E8, free #D6336C; scholarships #C98A00).
Type: Bricolage Grotesque (display) + Atkinson Hyperlegible (body/UI), from Google Fonts.
Layout shell: top notice bar, sticky header (logo, nav: Programs, Scholarships, Tools, Learn, Guides, Study abroad, Contests; search, theme toggle, Donate, Get matched), mobile drawer, newsletter band with list choice, 5-column footer with trademark notice and funding disclosure, sticky mobile CTA, back-to-top, cookie notice (Accept all / Essential only => non-personalised ads), site search modal over a generated JSON index ("/" shortcut), desktop-only exit-intent offer (max once a week, never on form pages), dark mode respecting prefers-color-scheme.
Quality floor: responsive to 360px, visible focus, reduced-motion support, no horizontal overflow, [hidden] always wins.
```

### Phase 2: home page

```
Hero: headline "Where does your education go next?", primary CTA "Get matched free", secondary "Take the 7-question quiz", and an interactive SVG route map: "You are here" origin, six coloured lines to stations (Degree, Certificate, Bootcamp, Apprenticeship, Study abroad, Free courses) plus a dashed Scholarships interchange line crossing all routes. Lines draw in once on load. Selecting a station updates a panel (typical time, cost band, best for, blurb) with "Start this route" => match.html?goal=<route>.
Then: audience fork (finishing school / changing careers / parent / school), six-route comparison table, step 1 of the matcher inline (hands off to match.html), tools grid, latest guides, essay-prize band, three video facades, scholarship alerts form, donate/partner/careers trio, FAQ with FAQPage schema.
```

### Phase 3: lead-generation engine (highest priority)

```
match.html: 6-step wizard. 1) goal tiles (auto-advance) 2) field tiles 3) level + format + pace 4) country, destination, start window 5) budget band, aid need, highest education 6) first/last name, email, optional phone, best time, three separate consent boxes (report: required; partner contact by email/phone/text incl. automated, "not a condition of purchase": optional; newsletter: optional).
Behaviour: progress bar, per-step validation, save progress to localStorage (never contact fields), URL prefill (goal, who, field, route), lead score (start window, budget, phone, partner consent), attribution capture (utm_*, gclid, landing page, referrer) sent as hidden fields, honeypot anti-spam.
After submit: on-screen personalised plan (route, field, five steps linking to explorer, accreditation guide, the right tool, funding, one guide) + "Book a free advising call".
Also build: advising-call form (match.html#advising), study-abroad consultation form with phone/WhatsApp and partner opt-in, school partnership form (partners.html), media-kit form (advertise.html). Every form uses the shared FormSubmit handler with a success message and an "Email us instead" fallback on failure.
```

### Phase 4: free tools (each its own SEO page with 300+ words of explanation and FAQ)

```
tools/path-quiz.html (7 weighted questions => route + runner-up + email-my-result capture),
tools/roi-calculator.html (cost, aid, length, % income forgone, current vs expected salary, growth => payback, 10-year net, ROI, yearly bar chart),
tools/loan-calculator.html (amortisation, grace-period capitalisation, extra payments => months and interest saved, yearly schedule, country notes),
tools/budget-planner.html (income vs expenses incl. tuition/12 => monthly gap, total over program, 3-month buffer, category bars),
tools/gpa-calculator.html (4.0 scale, weighted honours/AP, target-GPA helper),
tools/compare.html (up to 3 programs: cost, months, format, accreditation, outcomes => cheapest, fastest, best outcomes, weighted lean, accreditation warning),
tools/study-timer.html (Pomodoro with settings, session count, tone, tab-title countdown).
All computation in the browser; currency selector where relevant.
```

### Phase 5: content and discovery

```
Guides: 15+ original long-form guides (1,100–1,600 words) in six categories (Planning, Programs, Paying for school, Study abroad, Learning, Careers), each with lede, 5–8 H2 sections, two in-article ad markers, one match CTA, FAQ (FAQPage schema), 3–6 authoritative sources, Article schema, sticky table of contents, reading progress, related guides, share buttons, correction link. Never invent statistics, prices or deadlines; point to the official source instead.
programs.html: 40+ program-path "tickets" (route, field, formats, time, cost band, outlook, licensing gate), filters (search, field, route, format, saved only), browser-saved shortlist, a labelled "Featured program slot" for partners, "Find programs" => matcher prefilled.
scholarships.html: 35+ long-running official awards (host, level, who can apply, funding type, official link), filters, never-pay-to-apply warning, in-house award card, alerts sign-up.
learn.html: 24 verified YouTube videos via privacy-enhanced click-to-load facades with category filters, plus 18 free course/textbook platforms, a 4-step "finish free courses" method and a resource-suggestion form.
study-abroad.html: 12 destinations with official study portals and immigration links, consultation form, 18-month timeline.
```

### Phase 6: monetisation and community

```
donate.html: monthly/one-time toggle, amount tiles with impact lines, custom amount, purpose selector (operations, promotions & marketing, hiring talent, contests & prizes, new tools), cover-fees option, payment buttons rendered only when configured in config.js (Stripe Payment Links, PayPal hosted button ID, GitHub Sponsors, Buy Me a Coffee, Ko-fi), always-available pledge form, planned allocation bars, funding meter shown only once there is progress, not-tax-deductible statement.
contests.html + contest-rules.html: judged essay prize (prompt, 600 words, 4 x 25% rubric, dates/prizes from config, notify-me form before opening, live word counter), no-essay monthly award with bonus entries for quiz/newsletter/match/shortlist and a free alternative entry, winners wall, sponsor-a-prize band; 16-section official rules (eligibility incl. Canada excluding Quebec, skill-testing question, verification, taxes, publicity, privacy).
careers.html: 8 paid remote roles (writer, advisor, video creator, campus ambassador, SEO/growth, partnerships, scholarship researcher, front-end developer), application form, process timeline.
advertise.html and partners.html: placements, standards for partners, media-kit and partnership forms, link to the owner's business contact for domain/acquisition enquiries.
```

### Phase 7: trust and legal

```
about.html (mission, what we do, how we make money, independence), editorial-standards.html, faq.html, contact.html (topic prefill via ?topic=, JS-built "Email us" link), privacy.html (forms, FormSubmit, local storage, AdSense cookie wording and opt-outs, YouTube, Google Fonts, retention, GDPR/UK GDPR/CPRA/PIPEDA/Quebec Law 25/DPDP/Australian Privacy Act rights, children), terms.html, disclaimer.html (trademark disclosure, copyright notice, advertising disclosure, general disclaimer), sitemap.html, 404.html (works from any URL depth).
```

### Phase 8: SEO and technical

```
Per page: unique title and meta description, canonical to https://next.education/..., Open Graph and Twitter tags with a 1200x630 image, BreadcrumbList schema; WebSite + Organization schema on home; FAQPage on pages with FAQs; Article on guides. Generate sitemap.xml and a search index. robots.txt (allow Mediapartners-Google), ads.txt, manifest.webmanifest, SVG favicon and 512px PNG logo. Lazy video facades, deferred scripts, no layout shift from ads.
```

### Phase 9: QA and launch

```
Automated checks: every page loads with zero JS errors at 1280px and 375px with no horizontal overflow; all internal links and anchors resolve; matcher, quiz, calculators, finders, donate, contests and contact forms work end to end (mock the form endpoint); honeypot blocks bots; the owner inbox string never appears in any built file or rendered DOM; dark mode keeps buttons legible.
Deploy: push to main, enable GitHub Pages (Settings > Pages > Deploy from branch > main > / (root)), then add the custom domain.
```

### Phase 10: growth and expansion roadmap

```
1. Programmatic SEO: "best online [program] in [country]", "[program] vs [program]", "[country] student visa checklist" pages generated from the program and destination data.
2. Partner marketplace: onboard 5–10 accredited schools on cost-per-lead; add a real featured-listing feed and deliver leads to their CRMs (webhook/Zapier) with consent records.
3. Newsletter cadence: weekly digest + scholarship alerts; sell one sponsor slot per issue.
4. YouTube channel: walkthroughs of each tool, embedded back into tool pages.
5. Country hubs (India, Canada, UK, US, Australia) and translated versions (Hindi, French) for the largest audiences.
6. Accounts (Supabase) for saved shortlists, deadline reminders and application tracking once traffic justifies it.
```

---

## 4. Owner launch checklist

- [ ] GitHub Pages: Settings > Pages > Source "Deploy from a branch", Branch `main`, folder `/ (root)`.
- [ ] Custom domain: in Settings > Pages add `next.education`; at the registrar point the apex to GitHub Pages (A: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153; AAAA: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153) and `www` CNAME to `webworksa1.github.io`; tick "Enforce HTTPS".
- [ ] Forms: submit one test from the live site, click FormSubmit's activation email, then paste the random alias it provides into `assets/js/config.js` > `forms.formAlias`.
- [ ] AdSense: add next.education in AdSense > Sites, confirm ads.txt is found, turn on Auto ads, and enable Google's consent message (Privacy & messaging) for the EEA, UK and Switzerland.
- [ ] Payments: paste any Stripe/PayPal/Ko-fi/BMC/GitHub Sponsors links into `config.js` > `payments`.
- [ ] Contests: confirm prize amounts and dates in `config.js` > `contests` (these are real cash commitments); have the official rules reviewed for your jurisdiction (Quebec RACJ rules are why Quebec is excluded).
