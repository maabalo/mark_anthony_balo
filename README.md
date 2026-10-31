# Mark Anthony Balo — Portfolio

A personal portfolio and resume page. It covers an about section with skills, experience, projects (web apps built with Claude), education and certifications, plus a **save as PDF** button that prints the page as a clean two-page resume.

Open `index.html` in a browser. There's no build step and no framework. The only outside request is for Google Fonts.

This replaces the older page in the parent folder (`Resume_page/index.html`), which used Bootstrap, jQuery and Font Awesome.

---

## Project structure

```
Portfolio/
├── index.html           All content (plain HTML), icon sprite, page metadata
├── README.md            This file
├── package.json         Lint/format scripts (Node is NOT needed to view the page)
├── eslint.config.mjs    JavaScript rules
├── .stylelintrc.json    CSS rules
├── .htmlvalidate.json   HTML rules (Prettier-compatible)
├── .prettierrc.json     Formatting
└── assets/
    ├── css/style.css    Layout, dark/light themes, print (PDF) styles
    └── js/app.js        Theme button, section highlight, save as PDF
```

Each file starts with a **table of contents**, and section numbers in comments refer to it.

---

## Features

- **Two-column layout on desktop.** Name, role, location, section menu and links stay on the left while the content scrolls. Phones get one column.
- **"You are here" menu.** The menu entry for the section on screen gets a longer line.
- **Projects carousel.**
  - One project at a time, with the next card peeking in.
  - Navigate with ‹ › arrows, dots or the "2 / 5" counter; swipe on phones; arrow keys work when it's focused.
  - It never auto-plays.
  - Without JavaScript it's still a scrollable strip, and printing lists every project.
  - To add a project, copy an `<li class="carousel-slide">` in `03 PROJECTS`. The dots and counter update automatically.
- **Dark by default**, with a theme button: auto → light → dark. "Auto" follows the device setting.
- **Save as PDF.** It opens the print window, and the print styles turn the page into a two-page, black-on-white resume:
  - The name, role and contact line appear at the top.
  - The menu, buttons, hobbies line and footer are left out.
  - The file is named `Mark_Anthony_Balo_Resume`.
  - The text stays real text, so applicant tracking systems (ATS) can read it.
- **Works without JavaScript.** All content is in the HTML; JavaScript only adds the extras above.
- **Search and link previews.** It includes a description, Open Graph tags, and structured data (schema.org `Person`).

**No phone number** appears anywhere on the page or in the PDF. That's on purpose, because the page is public.

---

## Edit the content

All text is in **`index.html`**. Find the section by its comment, for example `02 EXPERIENCE`:

| To change            | Where                                                                         |
| -------------------- | ----------------------------------------------------------------------------- |
| Name, role, location | `1. SIDEBAR` at the top of `<header class="sidebar">`                         |
| Contact links        | `.socials` list in the sidebar, and `.print-contact` (the PDF's contact line) |
| About text, skills   | `01 ABOUT`, where each skill is one `<li>`                                    |
| A project            | `03 PROJECTS`: copy an `<li>` with its `<a class=\"project\">` card           |
| A job                | `02 EXPERIENCE`: copy an `<li class="entry">` block, newest first             |
| Education            | `04 EDUCATION` (same block format as jobs)                                    |
| A certification      | `05 CERTIFICATIONS`: copy an `<li class="cert">`                              |
| Search/preview text  | `<title>`, `meta description`, `og:` tags and the JSON-LD block in `<head>`   |

Dates use `<time datetime="2025-01">Jan 2025</time>`. The `datetime` part is the machine-readable date.

### Add a section to the menu

Add a `<section id="NAME" class="section">` in `<main>` and a matching `<li><a href="#NAME">…</a></li>` in `.section-nav`. The highlight picks it up automatically.

### Change colors

Edit the tokens in **`style.css` → section 01**. The light theme appears twice (manual and auto); keep both blocks identical. Print colors are in section 10.

### PDF too long?

The print sizes are in **`style.css` → section 10**. To leave something out of the PDF only, add `class="no-print"` to it.

---

## Code checks

```sh
npm install      # once
npm run lint     # HTML + CSS + JS + formatting
npm run format   # auto-format with Prettier
```

---

## Standards followed

- **Accessibility (WCAG 2.1 AA).**
  - All text has a contrast ratio of at least 4.5:1 in both themes.
  - The page has landmarks (header, nav, main, footer), real headings and lists, and a skip link.
  - Every icon link has a name, and external links say they open in a new tab.
  - The current section is marked with `aria-current`.
  - Theme changes are announced to screen readers, and reduced motion is respected.
- **Responsive and mobile-first.** One column on phones, a dates column from 600px, and a sticky two-column layout from 1024px.
- **Performance and privacy.** No frameworks and no tracking. The icons are one inline SVG sprite.
- **Code style.**
  - Every function has a comment and is no longer than 25 lines.
  - ESLint, Stylelint, html-validate and Prettier all pass.
