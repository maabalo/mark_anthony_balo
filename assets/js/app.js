/* ==========================================================================
   Mark Anthony Balo — Portfolio — app.js
   --------------------------------------------------------------------------
   Small extras on top of a page that works fully without JavaScript:
   the theme button, the "you are here" highlight in the section menu, the
   projects carousel controls, and "save as PDF". Plain script (no modules)
   so it also runs from file://.

   TABLE OF CONTENTS
     01  Settings & DOM references
     02  Theme (auto → light → dark)
     03  Section highlight (which section is on screen)
     04  Projects carousel (arrows, dots, counter)
     05  Save as PDF
     06  Helpers (storage, announcements)
     07  Init
   ========================================================================== */
(function () {
  'use strict';

  /* ==========================================================================
     01  SETTINGS & DOM REFERENCES
     ========================================================================== */
  const THEME_KEY = 'portfolio-theme'; // also read by the inline script in index.html
  const THEMES = ['auto', 'light', 'dark'];
  /** Browser-bar color (meta theme-color) for a manually chosen theme. Matches --bg. */
  const THEME_BAR_COLORS = { light: '#ffffff', dark: '#0b0d10' };
  const SVG_NS = 'http://www.w3.org/2000/svg';
  // A section counts as "on screen" when it crosses this band in the middle of the window.
  const SPY_ROOT_MARGIN = '-35% 0px -60% 0px';

  const els = {
    themeBtn: document.getElementById('themeBtn'),
    pdfBtn: document.getElementById('pdfBtn'),
    year: document.getElementById('year'),
    announcer: document.getElementById('announcer'),
    navLinks: Array.from(document.querySelectorAll('.section-nav a[href^="#"]')),
    projectTrack: document.getElementById('projectTrack'),
    projectDots: document.getElementById('projectDots'),
    projectCount: document.getElementById('projectCount'),
    projectPrev: document.getElementById('projectPrev'),
    projectNext: document.getElementById('projectNext'),
  };

  let currentTheme = 'auto';

  /* ==========================================================================
     02  THEME (the page is dark by default; "auto" follows the system)
     ========================================================================== */
  /** Saved theme, or "auto" when missing/unknown. */
  function readTheme() {
    const saved = readStorage(THEME_KEY);
    return THEMES.includes(saved) ? saved : 'auto';
  }

  /** Apply a theme to the page, the browser bar and the theme button. */
  function applyTheme(theme) {
    currentTheme = theme;
    if (theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);

    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      if (!meta.dataset.default) meta.dataset.default = meta.content;
      meta.content = THEME_BAR_COLORS[theme] || meta.dataset.default;
    });
    const next = nextTheme(theme);
    els.themeBtn.replaceChildren(svgIcon(`theme-${theme}`));
    els.themeBtn.setAttribute('aria-label', `Theme: ${theme}. Switch to ${next}`);
    els.themeBtn.title = `Theme: ${theme} (click for ${next})`;
  }

  /** auto → light → dark → auto */
  function nextTheme(theme) {
    return THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
  }

  /** Theme button: switch to the next theme and remember it. */
  function cycleTheme() {
    const theme = nextTheme(currentTheme);
    applyTheme(theme);
    writeStorage(THEME_KEY, theme);
    announce(`Theme: ${theme}`);
  }

  /* ==========================================================================
     03  SECTION HIGHLIGHT
     The menu link of the section in the middle of the window gets
     aria-current="location" (styled in style.css section 05). At the very
     bottom of the page the last section wins, because a short last section
     may never reach the middle band.
     ========================================================================== */
  /** Mark one menu link as current (by section id). */
  function setCurrentSection(id) {
    els.navLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  /** The sections the menu links point to, in page order. */
  function linkedSections() {
    return els.navLinks
      .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
      .filter(Boolean);
  }

  /** Watch the sections; older browsers without IntersectionObserver simply get no highlight. */
  function watchSections() {
    const sections = linkedSections();
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAtPageBottom()) setCurrentSection(entry.target.id);
        });
      },
      { rootMargin: SPY_ROOT_MARGIN },
    );
    sections.forEach((section) => observer.observe(section));
    window.addEventListener('scroll', () => handleBottom(sections), { passive: true });
  }

  /** True when the page is scrolled all the way down. */
  function isAtPageBottom() {
    return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  }

  /** At the bottom, highlight the last section. */
  function handleBottom(sections) {
    if (isAtPageBottom()) setCurrentSection(sections[sections.length - 1].id);
  }

  /* ==========================================================================
     04  PROJECTS CAROUSEL
     The strip itself is plain CSS scroll-snap (swipe, trackpad and arrow keys
     work natively). This adds the ‹ › buttons, one dot per project, the
     "2 / 5" counter, and screen-reader labels. No auto-play.
     ========================================================================== */
  /** Set up the carousel controls (skipped when the page has no projects strip). */
  function initCarousel() {
    const track = els.projectTrack;
    if (!track) return;
    const slides = projectSlides();
    slides.forEach((slide, index) => labelSlide(slide, index, slides.length));
    els.projectDots.replaceChildren(...slides.map(makeDot));
    els.projectPrev.addEventListener('click', () => goToSlide(currentSlide() - 1));
    els.projectNext.addEventListener('click', () => goToSlide(currentSlide() + 1));
    track.addEventListener('scroll', () => requestAnimationFrame(updateCarousel), { passive: true });
    window.addEventListener('resize', updateCarousel);
    track.closest('.carousel').querySelector('.carousel-controls').hidden = false;
    updateCarousel();
  }

  /** The project cards (list items) in order. */
  function projectSlides() {
    return Array.from(els.projectTrack.children);
  }

  /** A project's name, e.g. "Tessera". */
  function slideName(slide) {
    return slide.querySelector('.project-name').textContent.trim();
  }

  /** Screen readers hear each card as "slide 2 of 5: Vitae". */
  function labelSlide(slide, index, total) {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${total}: ${slideName(slide)}`);
  }

  /** One dot button per project. */
  function makeDot(slide, index) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Project ${index + 1}: ${slideName(slide)}`);
    dot.addEventListener('click', () => goToSlide(index));
    return dot;
  }

  /** Index of the card at the start of the strip (the last one once scrolled to the end). */
  function currentSlide() {
    const track = els.projectTrack;
    const slides = projectSlides();
    if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) return slides.length - 1;
    const distances = slides.map((slide) =>
      Math.abs(slide.offsetLeft - slides[0].offsetLeft - track.scrollLeft),
    );
    return distances.indexOf(Math.min(...distances));
  }

  /** Scroll to a card (clamped to the first and last) and announce it. */
  function goToSlide(index) {
    const slides = projectSlides();
    const target = Math.max(0, Math.min(index, slides.length - 1));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const left = slides[target].offsetLeft - slides[0].offsetLeft;
    els.projectTrack.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
    announce(`Project ${target + 1} of ${slides.length}: ${slideName(slides[target])}`);
  }

  /** Dots, counter and arrow states for the card now in view. */
  function updateCarousel() {
    const index = currentSlide();
    const total = projectSlides().length;
    Array.from(els.projectDots.children).forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    els.projectCount.textContent = `${index + 1} / ${total}`;
    els.projectPrev.setAttribute('aria-disabled', String(index === 0));
    els.projectNext.setAttribute('aria-disabled', String(index === total - 1));
  }

  /* ==========================================================================
     05  SAVE AS PDF
     The browser's print window makes the PDF; the print styles in
     style.css (section 10) turn the page into a one-column résumé.
     ========================================================================== */
  /** Open the print window (choose "Save as PDF" there). */
  function savePdf() {
    try {
      window.print();
    } catch (error) {
      console.error('Portfolio: printing is not available', error);
      announce('Printing is not available in this browser');
    }
  }

  /** Name the PDF after the person while printing (browsers use the page title as the file name). */
  function bindPrintTitle() {
    const pageTitle = document.title;
    window.addEventListener('beforeprint', () => {
      document.title = 'Mark_Anthony_Balo_Resume';
    });
    window.addEventListener('afterprint', () => {
      document.title = pageTitle;
    });
  }

  /* ==========================================================================
     06  HELPERS
     ========================================================================== */
  /** localStorage read that never throws (blocked storage → null). */
  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Portfolio: storage is not available', error);
      return null;
    }
  }

  /** localStorage write that never throws (the theme then lasts only for this visit). */
  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Portfolio: could not save the theme', error);
    }
  }

  /** <svg class="icon"><use href="#i-NAME"/></svg> (icons live in the sprite in index.html). */
  function svgIcon(name) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', `#i-${name}`);
    svg.append(use);
    return svg;
  }

  /** Read a short message to screen-reader users. */
  function announce(message) {
    els.announcer.textContent = '';
    // A short delay makes repeated identical messages announce again.
    setTimeout(() => {
      els.announcer.textContent = message;
    }, 50);
  }

  /* ==========================================================================
     07  INIT
     ========================================================================== */
  /** Start: theme, current year, section highlight, carousel and buttons. */
  function init() {
    applyTheme(readTheme());
    els.year.textContent = String(new Date().getFullYear());
    els.themeBtn.addEventListener('click', cycleTheme);
    els.pdfBtn.addEventListener('click', savePdf);
    bindPrintTitle();
    watchSections();
    initCarousel();
  }

  init();
})();
