# Resume page — notes for Claude

Read this first when working here. Update it whenever the process, a decision or a rule changes (what changed goes in CHANGELOG.md).

## What it is
- Mark Anthony Balo's resume/portfolio page. Live: https://maabalo.github.io/mark_anthony_balo/ · Repo: github.com/maabalo/mark_anthony_balo (**public**: everything committed here is visible to anyone).
- Track: **Small tool** (static page).

## Stack and structure
- Plain HTML, CSS, JavaScript, no build step: `index.html`, `assets/css/style.css`, `assets/js/app.js` (theme, section highlight, Save as PDF), `assets/images/` (project screenshots and the link preview image).
- Sections: 01 about · 02 projects (3 featured cards with screenshots + "more projects") · 03 experience · 04 skills · 05 education & certifications.

## Run, test, deploy
- Open `index.html` directly, or serve the folder locally; check phone and desktop with Playwright.
- Lint (html-validate, stylelint, eslint, prettier) in a temporary copy, then delete it.
- Save as PDF must stay **2 pages**, black on white, with screenshots hidden.
- Deploy: push to `main` → GitHub Pages (about 1 min). **Push only when the user says so.**

## Rules and decisions (don't undo without asking)
- **Never upload `Resume_page/Profile.pdf`** (it has the phone number) or any phone number.
- Positioning: **Web & AI Developer**; Accenture job title kept in the sidebar and Experience.
- **Never invent numbers** (apps built, hours saved): the user will supply real ones.
- Education dates are correct as shown (BS 2015–2016).
- Tentorium (renamed from Next Camp, 2026-11-13; live at tentorium.vercel.app) is a "**web app**", not an "app". Projects were built with Claude as coding partner (footer says so).
- Tentorium's screenshot (`assets/images/tentorium.jpg`, 1200 × 750, day look) shows its About page because permission for some campsite photos is unconfirmed. `preview.jpg` (1200 × 630, top of this page) shows the card too: remake both if the card changes.
- Certifications: Power Apps and Microsoft 365 courses merged; "Thriving Mind" removed (can be restored).

## Open items
- Real numbers for Experience when the user has them; LinkedIn headline to match.
