# Next.Education

A free decision engine for your next step in education: compare degrees, certificates, bootcamps, apprenticeships, study abroad and free courses; find scholarships; run the numbers with seven calculators; and get matched with programs.

Static HTML/CSS/vanilla JS, built for **GitHub Pages (free plan, `main` branch, root folder)** and the custom domain **next.education**. Monetised with Google AdSense (`ca-pub-6620975821265271`), consented lead generation, sponsorships, contests and donations.

The concept, research summary (36 sites) and the full phase-by-phase build prompt are in **[PROMPT.md](PROMPT.md)**.

## What's inside

| Area | Pages |
|---|---|
| Lead generation | `match.html` (6-step matcher + advising call), `study-abroad.html` (consultation), `partners.html` (schools), `advertise.html` (media kit) |
| Tools | `tools/` path quiz, ROI, student loan, budget planner, GPA, program comparer, study timer |
| Content | `guides/` (15 long-form guides), `programs.html` (44 program paths), `scholarships.html` (38 official awards), `learn.html` (24 videos + 18 free platforms) |
| Money | `donate.html`, `contests.html`, `contest-rules.html`, `careers.html` |
| Trust and legal | `about.html`, `editorial-standards.html`, `faq.html`, `contact.html`, `privacy.html`, `terms.html`, `disclaimer.html`, `sitemap.html`, `404.html` |
| Technical | `_config.yml`, `_layouts/default.html`, `ads.txt`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `assets/data/search.json` |

## Edit money, forms and contests in one file

`assets/js/config.js`:

- `adsense.slots`: optional manual ad-unit slot IDs (Auto ads already run on every page).
- `forms.formAlias`: after the first live form submission, FormSubmit emails an activation link. Click it, then paste the random alias FormSubmit gives you here. The inbox is stored encoded and is never shown on the site.
- `payments`: Stripe Payment Links, PayPal hosted button ID, GitHub Sponsors, Buy Me a Coffee, Ko-fi. Empty values stay hidden; the pledge form always works.
- `funding`: donation goal and progress (the meter appears once `raised` > 0).
- `contests`: essay prize dates and prize amounts, monthly award amount. **These are real cash commitments.**

## Edit content

GitHub Pages builds this site with Jekyll on every push to `main`. No local build step is needed.

- **Shared header, footer, menus, AdSense snippet and modals:** `_layouts/default.html` (one file for every page).
- **Pages:** each `.html` file at the root, in `guides/` and in `tools/` starts with a small front-matter block (title, description, canonical URL, scripts) followed by the page body. Edit the body between `{% raw %}` and `{% endraw %}` like normal HTML.
- **Data-driven sections:** program paths in `assets/js/programs.js`, scholarships in `assets/js/scholarships.js`, quiz and calculators in `assets/js/tools.js`.
- **New guide:** copy any file in `guides/`, change the front matter and body, then add it to `sitemap.xml` and `assets/data/search.json`.

## Publish on GitHub Pages

1. Repository **Settings > Pages**.
2. **Source:** Deploy from a branch. **Branch:** `main`, folder `/ (root)`. Save.
3. The site goes live at `https://webworksa1.github.io/next-education/` within a few minutes.

## Connect next.education

1. In **Settings > Pages > Custom domain**, enter `next.education` and save (GitHub adds a `CNAME` file).
2. At your domain registrar, set:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` records for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `CNAME` for `www`: `webworksa1.github.io`
3. When the DNS check passes, tick **Enforce HTTPS**.

## Get AdSense approval

1. Publish on `next.education` (AdSense approves top-level domains, not `github.io` sub-paths).
2. AdSense > **Sites** > add `next.education`. The verification snippet is already in every page's `<head>`, and `ads.txt` is at the root.
3. Turn on **Auto ads**. Optionally create in-article, display and multiplex units and paste their slot IDs into `config.js`.
4. AdSense > **Privacy & messaging**: enable the consent message for the EEA, UK and Switzerland.

## Trademark and copyright

Next.Education is an independent website, not affiliated with any company, school or product that uses "Next Education", "NextEducation" or a similar name. Original content © Next.Education, all rights reserved. Embedded videos and linked resources belong to their owners. See `disclaimer.html`.

For enquiries about this website, the domain, sponsorship, advertising or partnership: https://web.works/contact
