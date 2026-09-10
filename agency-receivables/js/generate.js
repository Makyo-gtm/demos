// generate.js — Layer 1: the "AI builds your app" illusion, rebuilt to match
// the real captured Makyo interface (docs/research/2026-09-09-makyo-interface-pixel-reference.md)
// rather than an invented single-progress-bar screen: the real "Describe your
// app" entry screen, the real two-panel build-steps sequence with a live
// preview, and the real "YOUR APP IS READY" completion modal. Step labels/
// order/badges are the exact, confirmed real ones; the real recording took
// 1m28s total, deliberately compressed here so it reads as punchy on video.
(function (root) {
  'use strict';

  var GENERATION_STEPS = [
    { label: 'Understanding your idea', durationMs: 900, badges: ['AI'] },
    { label: 'Designing your data', durationMs: 1100, badges: ['AI'] },
    { label: 'Building your database', durationMs: 1200, badges: ['SCRIPT', 'AI'] },
    { label: 'Working out what to measure', durationMs: 900, badges: ['AI', 'SCRIPT'] },
    { label: 'Creating your app', durationMs: 1000, badges: ['SCRIPT'] },
    { label: 'Choosing a look', durationMs: 800, badges: ['SCRIPT'] },
    { label: 'Planning your screens', durationMs: 1000, badges: ['SCRIPT'] },
    { label: 'Building your screens', durationMs: 1300, badges: ['SCRIPT', 'AI'] }
  ];

  function runGenerationSequence(steps, onStep, onComplete, setTimeoutFn) {
    var timer = setTimeoutFn || (typeof setTimeout !== 'undefined' ? setTimeout : null);
    var i = 0;
    function next() {
      if (i >= steps.length) { onComplete(); return; }
      var step = steps[i];
      onStep(step, i);
      var idx = i;
      i += 1;
      timer(next, step.durationMs);
    }
    next();
  }

  // The real textarea starts genuinely empty (confirmed from the real
  // saved HTML: no value, placeholder only) and the real "Start Building"
  // button starts disabled until it has content - the presenter actually
  // pastes a prompt in as part of the demo, rather than it being
  // pre-filled. The prompt text itself now lives only in
  // PRESENTER-GUIDE.html, ready to copy/paste, not hardcoded into this
  // screen's markup.

  // Verbatim real placeholder text, confirmed directly from a live
  // screenshot of the actual "Describe your app" screen (2026-09-09,
  // v0.4.259) — not shortened, and there are no icon buttons inside the
  // textarea (an earlier version of this file invented both).
  var TEXTAREA_PLACEHOLDER = 'e.g. A CRM for a small design agency — track clients, projects, invoices and tasks. Each project belongs to a client and has a status and a budget...';

  // The real mascot illustration — an actual asset (images/makyo-mascot.png),
  // not a hand-drawn approximation. Supplied directly by the user, saved
  // locally, referenced as a real <img>, for genuine pixel fidelity here
  // rather than an SVG guess.
  var ROBOT_IMG = '<img class="describe-mascot-img" src="images/makyo-mascot.png" alt="Makyo robot mascot" />';

  // Real intermediate screen (Create new app → "What would you like to
  // build?") confirmed via a live screenshot, 2026-09-09 — not present in
  // (or at least not caught by) the original recon recording's 1fps frame
  // capture. Two option cards; only "Generate with AI" is wired live, since
  // that is the path this whole demo depicts — "Start from Scratch" stays
  // decorative, matching how every other non-taken real option in this demo
  // (the idea-suggestion cards, the Plan/Build-equivalent chrome) is handled.
  // Real Lucide icon path data, copied verbatim from the actual saved page
  // (Makyo's own shell chrome uses the Lucide icon set, not emoji — an
  // earlier version of this file used emoji as a placeholder).
  var ICON_PEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path></svg>';
  var ICON_SPARKLES = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path><path d="M20 2v4"></path><path d="M22 4h-4"></path><circle cx="4" cy="20" r="2"></circle></svg>';
  // Real "Reset" icon (lucide-rotate-ccw), from the real Describe-your-app
  // page's own markup — that button is genuinely disabled there while the
  // textarea is empty, same real behavior now given to Start Building.
  var ICON_RESET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>';

  // Real Lucide icon path data for the org-level sidebar, copied verbatim
  // from the actual saved page — confirmed real icon per nav item (house,
  // grid-3x3, database, book-open, bot, credit-card, users, shield,
  // hard-drive, briefcase, plug, trash-2).
  var SIDEBAR_ICONS = {
    Welcome: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>',
    Apps: '<rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M3 15h18"></path><path d="M9 3v18"></path><path d="M15 3v18"></path>',
    Databases: '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path>',
    'Knowledge Bases': '<path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>',
    Agents: '<path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path>',
    Billing: '<rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line>',
    Members: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle>',
    'Access Control': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>',
    Storage: '<line x1="22" x2="2" y1="12" y2="12"></line><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" x2="6.01" y1="16" y2="16"></line><line x1="10" x2="10.01" y1="16" y2="16"></line>',
    Teams: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect>',
    Connectors: '<path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"></path>',
    Trash: '<path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>'
  };
  var SIDEBAR_MAIN_ITEMS = ['Welcome', 'Apps', 'Databases', 'Knowledge Bases', 'Agents', 'Billing', 'Members', 'Access Control', 'Storage', 'Teams', 'Connectors'];

  // Real org-switcher icon (arrow-left-right), copied verbatim from the
  // actual saved page. The topbar's sun/bell/avatar were emoji in an
  // earlier version of this file — emoji render as full-color glyphs, not
  // the thin thin outline icons the real interface actually uses, so they
  // read visibly wrong next to everything else. Replaced with real-style
  // Lucide outline icons (sun, bell, circle-user — all standard, unmodified
  // icons from the same set already confirmed in use throughout this shell).
  var ICON_SWAP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M8 3 4 7l4 4"></path><path d="M4 7h16"></path><path d="m16 21 4-4-4-4"></path><path d="M20 17H4"></path></svg>';
  var ICON_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>';
  var ICON_BELL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>';
  var ICON_USER_CIRCLE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855"></path></svg>';
  // Real ready-modal icon, from the recon recording (kept_0014): a
  // rounded-square badge containing a layout/dashboard glyph. The
  // recording frame is too small to read the exact icon at full
  // fidelity, so this uses lucide's layout-dashboard (a real, standard
  // icon, not invented) as the closest disclosed match rather than the
  // literal camera emoji an earlier version of this file used (which
  // also ignored CSS color entirely, same bug class as the app-card
  // status icon fixed earlier this session).
  var ICON_LAYOUT_DASHBOARD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>';

  // The persistent org-level sidebar — appears on the Apps list and the
  // "Create new app" choice screen, confirmed via real screenshots; NOT on
  // "Describe your app" (that screen replaces it with its own layout, also
  // confirmed via real screenshots). Only "Apps" is ever the active item in
  // this demo (nothing else in the sidebar is part of the real click path
  // per the user's own scoping — decorative only, matching every other
  // non-taken option elsewhere in this build).
  function renderOrgSidebar() {
    var items = SIDEBAR_MAIN_ITEMS.map(function (label) {
      var active = label === 'Apps';
      return '<button class="org-sidebar__item' + (active ? ' org-sidebar__item--active' : '') + '"><span class="org-sidebar__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + SIDEBAR_ICONS[label] + '</svg></span>' + label + '</button>';
    }).join('');
    return (
      '<aside class="org-sidebar">' +
        '<div class="org-sidebar__org"><span class="org-sidebar__avatar">a</span><div class="org-sidebar__org-text"><div class="org-sidebar__org-name">Demo Org</div><div class="org-sidebar__org-plan">Pro Plan</div></div><span class="org-sidebar__swap">' + ICON_SWAP + '</span></div>' +
        '<nav class="org-sidebar__nav">' + items + '</nav>' +
        '<div class="org-sidebar__trash"><button class="org-sidebar__item"><span class="org-sidebar__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + SIDEBAR_ICONS.Trash + '</svg></span>Trash</button></div>' +
      '</aside>'
    );
  }

  // The real Makyo wordmark — an actual vector logotype, not styled text.
  // Extracted verbatim from the real saved page's own <svg> markup
  // (Makyo App 0.html); an earlier version of this file approximated it
  // as "&Sigma; MAKYO" set in the generated-app's heading font, which
  // looked nothing like the real logo. fill="var(--foreground)"/
  // class="text-foreground" swapped for this file's own --shell-fg token.
  var WORDMARK_SVG = '<svg width="132" height="26" viewBox="0 0 338 64" xmlns="http://www.w3.org/2000/svg" style="color: var(--shell-fg);" class="describe-topbar__logo"><g clip-path="url(#clip0_3936_412575)"><path d="M58.2527 0H5.06155C2.26622 0 0 2.29112 0 5.10708V58.8828C0 61.7089 2.26622 64 5.06155 64H58.2527C61.0381 64 63.3043 61.7089 63.3043 58.8828V5.10708C63.3043 2.29112 61.0381 0 58.2527 0ZM48.3193 18.5207H23.8502L34.9916 29.7341V34.2154L23.8502 45.4793H48.3193V52.2113H14.985V44.8939L27.7537 31.995L14.985 19.0456V11.7786H48.3193V18.5207V18.5207Z" fill="var(--shell-fg)"></path><path d="M93.4608 15.1357L106.221 28.0363L119.029 15.1357H126.218V48.8316H119.553V24.0894L108.459 35.3534H104.031L92.8893 24.0894V48.8316H86.2231V15.1357H93.4607H93.4608Z" fill="currentColor"></path><path d="M141.216 48.8315L157.88 15.1357H164.546L181.211 48.8315H172.879L161.214 25.2445L149.548 48.8315H141.216H141.216Z" fill="currentColor"></path><path d="M196.209 15.1357H202.875V28.6139H206.208L221.206 15.1357H231.205L212.874 31.984L231.205 48.8315H221.206L206.208 35.3533H202.875V48.8315H196.209V15.1357Z" fill="currentColor"></path><path d="M253.963 15.1357L264.772 27.218L275.627 15.1357H284.769L268.104 33.8612V48.8315H261.438V33.8612L244.774 15.1357H253.963V15.1357Z" fill="currentColor"></path><path d="M298.101 25.1482C298.101 23.7689 298.362 22.4693 298.886 21.2494C299.41 20.0303 300.116 18.9713 301.005 18.0726C301.894 17.1746 302.941 16.4602 304.148 15.9307C305.354 15.4012 306.639 15.1357 308.004 15.1357H328.097C329.462 15.1357 330.747 15.4012 331.954 15.9307C333.16 16.4602 334.207 17.1746 335.096 18.0726C335.984 18.9714 336.691 20.0303 337.215 21.2494C337.739 22.4692 338 23.7689 338 25.1482V38.819C338 40.1991 337.739 41.4987 337.215 42.7185C336.691 43.9384 335.984 44.9973 335.096 45.8953C334.207 46.7941 333.16 47.5078 331.954 48.0373C330.747 48.5667 329.462 48.8315 328.097 48.8315H308.004C306.639 48.8315 305.354 48.5667 304.148 48.0373C302.941 47.5078 301.894 46.7941 301.005 45.8953C300.116 44.9973 299.41 43.9384 298.886 42.7185C298.362 41.4987 298.101 40.199 298.101 38.819V25.1482ZM304.767 38.819C304.767 39.7178 305.084 40.4879 305.719 41.1294C306.354 41.7717 307.115 42.092 308.004 42.092H328.097C329.018 42.092 329.787 41.7717 330.406 41.1294C331.025 40.4879 331.335 39.7177 331.335 38.819V25.1482C331.335 24.2503 331.025 23.4801 330.406 22.8378C329.787 22.1963 329.018 21.8752 328.097 21.8752H308.004C307.115 21.8752 306.354 22.1963 305.719 22.8378C305.084 23.4802 304.767 24.2503 304.767 25.1482V38.819Z" fill="currentColor"></path></g><defs><clippath id="clip0_3936_412575"><rect width="338" height="64" fill="white"></rect></clippath></defs></svg>';

  function shellTopbarHtml() {
    return '<div class="describe-topbar"><span class="describe-topbar__wordmark">' + WORDMARK_SVG + '<span class="describe-topbar__version">v0.4.259</span></span>' +
      '<span class="describe-topbar__icons">' + ICON_SUN + ICON_BELL + ICON_USER_CIRCLE + '</span></div>';
  }

  var ICON_FUNNEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path></svg>';
  // Real icon for the "Import and export JSON" button — an earlier version
  // of this file mislabeled this as a "sort" button; the icon shape was
  // already correct by coincidence (confirmed: real class is
  // lucide-arrow-down-up, identical path data), only the label was wrong.
  var ICON_IMPORT_EXPORT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="m3 16 4 4 4-4"></path><path d="M7 20V4"></path><path d="m21 8-4-4-4 4"></path><path d="M17 4v16"></path></svg>';
  // Real icon for the "Building" status badge (lucide-construction), amber —
  // confirmed the TEXT next to it is plain muted gray, not amber; only the
  // icon itself carries the color. An earlier version of this file colored
  // both, and separately used an emoji for the icon (which ignores CSS
  // color entirely), so the intended amber never actually rendered.
  var ICON_CONSTRUCTION = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" class="app-card__status-icon"><rect x="2" y="6" width="20" height="8" rx="1"></rect><path d="M17 14v7"></path><path d="M7 14v7"></path><path d="M17 3v3"></path><path d="M7 3v3"></path><path d="M10 14 2.3 6.3"></path><path d="m14 6 7.7 7.7"></path><path d="m8 6 8 8"></path></svg>';

  // Real app-card content: icon background colors (rgb(44,62,80) /
  // rgb(74,144,226)) and descriptions are verbatim from the real saved
  // page, not truncated/approximated. Icon images are the real Twemoji SVG
  // assets Makyo itself serves (images/icon-*.svg), not an emoji character
  // — emoji render inconsistently across OSes/fonts; the real app uses
  // actual image assets for exactly this reason.
  function appCardHtml(iconBg, iconSrc, name, desc, team, when) {
    return '<div class="app-card"><div class="app-card__icon" style="background:' + iconBg + ';"><img src="' + iconSrc + '" alt="" width="28" height="28" /></div>' +
      '<div><div class="app-card__name">' + name + '</div>' +
      '<div class="app-card__status">' + ICON_CONSTRUCTION + '<span>Building</span></div>' +
      '<div class="app-card__desc">' + desc + '</div>' +
      '<div class="app-card__meta"><span class="app-card__team">' + team + '</span><span>' + when + '</span></div></div></div>';
  }

  // Page 1 of the real flow: the org-level Apps list — confirmed via a real
  // saved page (Makyo App 0.html, 2026-09-09, the actual /apps route).
  // Shows this demo's own app plus a second, unrelated real app exactly as
  // seen (both "Building" status, matching what was actually on screen) —
  // org name genericized to "Demo Org" rather than reproducing anyone's
  // real account name.
  function mountAppsList(rootEl, onCreateNew) {
    rootEl.innerHTML =
      '<div class="org-shell">' +
        shellTopbarHtml() +
        '<div class="org-shell__body">' +
          renderOrgSidebar() +
          '<div class="org-shell__main">' +
            '<div class="org-subheader">' +
              '<h1 class="org-subheader__title">Apps</h1>' +
              '<div class="org-subheader__stats">2 applications &middot; 5 generated with AI &middot; ~18 hours saved</div>' +
            '</div>' +
            '<div class="org-content">' +
              '<div class="apps-toolbar">' +
                '<input class="apps-search" type="text" placeholder="Search apps across organizations..." />' +
                '<div class="apps-toolbar__right">' +
                  '<div class="apps-toolbar__btn">Last Edited &#9662;</div>' +
                  '<div class="apps-toolbar__btn">' + ICON_FUNNEL + ' Filters</div>' +
                  '<div class="apps-toolbar__btn apps-toolbar__btn--icon" title="Import and export JSON">' + ICON_IMPORT_EXPORT + '</div>' +
                  '<button class="apps-create-btn" type="button">&#10024; Create New</button>' +
                '</div>' +
              '</div>' +
              '<div class="apps-grid">' +
                appCardHtml('rgb(44, 62, 80)', 'images/icon-agency-receivables.svg', 'Agency Receivables', 'An internal financial management tool for tracking agency invoices, monitoring aging accounts, and logging collection follow-ups.', 'Demo team', '5 hours ago') +
                appCardHtml('rgb(74, 144, 226)', 'images/icon-production-pipeline.svg', 'Production Pipeline', 'An internal workflow management tool des...', 'Demo team', '4 days ago') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    rootEl.querySelector('.apps-create-btn').addEventListener('click', onCreateNew);
  }

  function mountCreateChoice(rootEl, onChooseAI) {
    rootEl.innerHTML =
      '<div class="org-shell">' +
        shellTopbarHtml() +
        '<div class="org-shell__body">' +
          renderOrgSidebar() +
          '<div class="org-shell__main">' +
            '<div class="org-subheader">' +
              '<h1 class="org-subheader__title">Create new app</h1>' +
            '</div>' +
            '<div class="org-content">' +
              '<div class="create-choice-body">' +
                '<h2 class="create-choice-h2">What would you like to build?</h2>' +
                '<p class="create-choice-subtitle">Choose your preferred method to create your next amazing application</p>' +
                '<div class="create-choice-cards">' +
                  '<div class="create-choice-card">' +
                    '<div class="create-choice-card__icon">' + ICON_PEN + '</div>' +
                    '<h3>Start from Scratch</h3>' +
                    '<p>Full creative control with a blank canvas. Perfect for unique projects that need custom design.</p>' +
                    '<div class="create-choice-tags"><span>Complete control</span><span>Custom design</span><span>No limitations</span></div>' +
                  '</div>' +
                  '<div class="create-choice-card create-choice-card--ai" tabindex="0">' +
                    '<div class="create-choice-card__icon">' + ICON_SPARKLES + '</div>' +
                    '<h3>Generate with AI</h3>' +
                    '<p>Let AI do the heavy lifting to create your app idea and design it for you with your brand colors and logo</p>' +
                    '<div class="create-choice-tags"><span>Natural language</span><span>Smart layouts</span><span>Instant results</span></div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    rootEl.querySelector('.create-choice-card--ai').addEventListener('click', onChooseAI);
  }

  function mountPromptBox(rootEl, onSubmit) {
    // Real layout, confirmed directly from the real saved page (Makyo App
    // 3.html) and a live screenshot the user provided of the actual
    // /app-gen screen: an asymmetric 25%/75% grid (a bordered <aside> for
    // the form, a plain <section> for the mascot), not a centered 1fr/1fr
    // pair. The textarea is genuinely EMPTY (placeholder only, no value)
    // and Start Building starts disabled until it has content - an
    // earlier version of this file pre-filled the textarea with demo copy
    // and left the button always clickable, which is real functional
    // behavior this screen needs to get right, not just a visual detail.
    rootEl.innerHTML =
      '<div class="describe-screen">' +
        // Real: three large, softly-blurred ambient color blobs behind
        // everything (absolutely positioned, not a CSS gradient) -
        // confirmed directly from the real saved page's own markup. This
        // is the "subtle tint/gradient" visible faintly behind both the
        // left form panel and the right mascot panel; an earlier version
        // of this screen had no background decoration at all.
        '<div class="describe-bg-glow" aria-hidden="true">' +
          '<div class="describe-bg-glow__blob describe-bg-glow__blob--1"></div>' +
          '<div class="describe-bg-glow__blob describe-bg-glow__blob--2"></div>' +
          '<div class="describe-bg-glow__blob describe-bg-glow__blob--3"></div>' +
        '</div>' +
        shellTopbarHtml() +
        '<div class="describe-back">&larr; Back to Create new app</div>' +
        '<div class="describe-grid">' +
          '<aside class="describe-aside">' +
            '<h1 class="describe-title">Describe your app</h1>' +
            '<p class="describe-subtitle">Tell us what to build and we generate the database, theme and screens for you.</p>' +
            '<div class="describe-reset-row"><span class="describe-reset">' + ICON_RESET + ' Reset</span></div>' +
            '<textarea class="describe-textarea" placeholder="' + TEXTAREA_PLACEHOLDER + '"></textarea>' +
            '<details class="describe-ai-engine"><summary>AI engine <span>(optional)</span></summary></details>' +
            '<button class="describe-submit" type="button" disabled>' + ICON_SPARKLES + ' Start Building</button>' +
            '<p class="describe-helper">Describe your app to start building</p>' +
          '</aside>' +
          '<section class="describe-preview">' +
            '<div class="describe-preview-inner">' +
              ROBOT_IMG +
              '<p class="describe-mascot-caption">Makyo is ready for your instructions&hellip;</p>' +
            '</div>' +
          '</section>' +
        '</div>' +
      '</div>';

    var textarea = rootEl.querySelector('.describe-textarea');
    var submitBtn = rootEl.querySelector('.describe-submit');

    textarea.addEventListener('input', function () {
      submitBtn.disabled = textarea.value.trim().length === 0;
    });

    submitBtn.addEventListener('click', function () {
      if (submitBtn.disabled) { return; }
      onSubmit(textarea.value);
    });
  }

  // Real app-summary content, from the actual recon recording
  // (docs/research/2026-09-09-recon-recording-findings.md). modules
  // added after re-checking kept_0012 directly - the card also has a
  // MODULES section, a Model badge, and a live time/tokens/cost stats
  // line that this file never built at all until now.
  var APP_SUMMARY = {
    name: 'Agency Receivables',
    tagline: 'Streamline client billing and collections tracking',
    description: 'An internal financial management tool for tracking agency invoices, monitoring aging accounts, and logging collection follow-ups.',
    domain: 'Accounts Receivable &amp; Collections',
    type: 'Web Development Agency',
    modules: ['Clients', 'Invoicing &amp; Collections'],
    model: 'gemini-3.1-flash-lite'
  };

  function appSummaryPanelHtml() {
    return (
      '<div class="gen-summary-card">' +
        '<div class="gen-summary-card__icon">&#10024;</div>' +
        '<div class="gen-summary-card__name">' + APP_SUMMARY.name + '</div>' +
        '<div class="gen-summary-card__tagline">' + APP_SUMMARY.tagline + '</div>' +
        '<p class="gen-summary-card__desc">' + APP_SUMMARY.description + '</p>' +
        '<div class="gen-summary-card__fields">' +
          '<div><div class="gen-summary-card__field-label">Domain</div><div class="gen-summary-card__field-value">' + APP_SUMMARY.domain + '</div></div>' +
          '<div><div class="gen-summary-card__field-label">Type</div><div class="gen-summary-card__field-value">' + APP_SUMMARY.type + '</div></div>' +
        '</div>' +
        '<div class="gen-summary-card__field-label">Modules</div>' +
        '<div class="gen-summary-card__tags">' + APP_SUMMARY.modules.map(function (m) { return '<span>' + m + '</span>'; }).join('') + '</div>' +
        '<div class="gen-summary-card__divider"></div>' +
        '<div class="gen-summary-card__model">Model: ' + APP_SUMMARY.model + '</div>' +
        '<div class="gen-summary-card__stats"><span class="gen-summary-card__stats-time">0s</span> &middot; <span class="gen-summary-card__stats-tokens">0</span> tokens &middot; <span class="gen-summary-card__stats-cost">$0.0000</span></div>' +
      '</div>' +
      '<div class="gen-look-card">' +
        '<div class="gen-look-card__title">&#127912; Look</div>' +
        '<div class="gen-look-swatches">' +
          '<span class="gen-swatch" style="background:#0f172a;"></span>' +
          '<span class="gen-swatch" style="background:#2563eb;"></span>' +
          '<span class="gen-swatch" style="background:#0891b2;"></span>' +
          '<span class="gen-swatch" style="background:#f8fafc;border:1px solid #cbd5e1;"></span>' +
        '</div>' +
        '<div class="gen-look-fonts"><div><div class="gen-summary-card__field-label">Heading font</div><div class="gen-summary-card__field-value">Space Grotesk</div></div><div><div class="gen-summary-card__field-label">Body font</div><div class="gen-summary-card__field-value">IBM Plex Sans</div></div></div>' +
        '<div class="gen-look-tags"><span>Palette: Cool</span><span>Colors: Vivid</span><span>Corners: Sharp</span><span>Borders: Hairline</span></div>' +
      '</div>'
    );
  }

  // Real: while the app is being generated, the third column starts as a
  // plain centered spinner + "Opening your app..." (recon recording
  // kept_0012) - confirmed via the recording, NOT a live preview from
  // the very start, which an earlier version of this file assumed.
  function genOpeningHtml() {
    return '<div class="gen-preview-opening"><div class="gen-spinner"></div><div class="gen-preview-opening__label">Opening your app&hellip;</div></div>';
  }

  // Real: once generation reaches the screens-building steps, this
  // column swaps to an actual miniature recreation of the app's own
  // shell - its own sidebar (icon/name/version, search, nav) plus its
  // own Dashboard content pane - confirmed frame-by-frame against the
  // recon recording (kept_0013). An earlier version of this file only
  // put a flat card+3-widgets here with no nested sidebar/nav/tabs at
  // all, which is why the whole panel read as structurally wrong.
  function genPreviewShellHtml() {
    return (
      '<div class="gen-preview-shell">' +
        '<div class="gen-preview-shell__sidebar">' +
          '<div class="gen-preview-shell__appbar">' +
            '<div class="gen-preview-shell__appicon"><img src="images/icon-agency-receivables.svg" alt="" width="16" height="16" /></div>' +
            '<div class="gen-preview-shell__appmeta"><div class="gen-preview-shell__appname">' + APP_SUMMARY.name + '</div><div class="gen-preview-shell__appversion">Draft &middot; v0.0.20</div></div>' +
            ICON_SUN +
          '</div>' +
          '<input class="gen-preview-shell__search" type="text" placeholder="Search..." />' +
          '<div class="gen-preview-shell__navlabel">NO TAGS SCREENS</div>' +
          '<div class="gen-preview-shell__nav">' +
            '<div class="gen-preview-shell__navitem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">' + SIDEBAR_ICONS.Welcome + '</svg> Home</div>' +
            '<div class="gen-preview-shell__navitem">' + ICON_USER_CIRCLE + ' Profile</div>' +
            '<div class="gen-preview-shell__navitem gen-preview-shell__navitem--active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">' + SIDEBAR_ICONS.Apps + '</svg> Dashboard</div>' +
          '</div>' +
        '</div>' +
        '<div class="gen-preview-shell__content">' +
          '<div class="gen-preview-shell__tabs"><span class="gen-preview-shell__tab gen-preview-shell__tab--active">My Profile</span><span class="gen-preview-shell__tab">Edit Profile</span></div>' +
          '<div class="gen-preview-shell__toolbar"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">' + SIDEBAR_ICONS.Apps + '</svg> Dashboard</span>' + ICON_SUN + '</div>' +
          '<div class="gen-live-preview__title-row">' +
            '<div><div class="gen-live-preview__title">Dashboard</div><div class="gen-live-preview__subtitle">Overview of your key metrics and recent activity</div></div>' +
            '<button class="gen-preview-shell__customize" type="button">Customize</button>' +
          '</div>' +
          '<div class="gen-live-preview__card"><strong>Payment status</strong><div class="gen-loading">Loading&hellip;</div></div>' +
          '<div class="gen-live-preview__row">' +
            '<div class="gen-live-preview__widget"><div class="gen-live-preview__widget-label">User</div><div class="gen-loading">Loading&hellip;</div></div>' +
            '<div class="gen-live-preview__widget"><div class="gen-live-preview__widget-label">Follow-up Methods</div><div class="gen-loading">Loading&hellip;</div></div>' +
            '<div class="gen-live-preview__widget"><div class="gen-live-preview__widget-label">Top Clients</div><div class="gen-loading">Loading&hellip;</div></div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function readyModalHtml() {
    return (
      '<div class="ready-modal-backdrop">' +
        '<div class="ready-modal">' +
          '<div class="ready-modal__icon">' + ICON_LAYOUT_DASHBOARD + '</div>' +
          '<div class="ready-modal__badge">&#10003; YOUR APP IS READY</div>' +
          '<div class="ready-modal__name">' + APP_SUMMARY.name + '</div>' +
          '<div class="ready-modal__tagline">' + APP_SUMMARY.tagline + '.</div>' +
          '<div class="ready-modal__countdown">Opening the app builder in <span class="ready-modal__countdown-n">4</span>s</div>' +
          '<div class="ready-modal__bar"><div class="ready-modal__bar-fill"></div></div>' +
          '<div class="ready-modal__buttons">' +
            '<button class="ready-modal__cancel" type="button">Cancel</button>' +
            '<button class="ready-modal__open" type="button">Open now &rarr;</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  // Real: THREE panels visible at once throughout, not two - confirmed
  // frame-by-frame against the recon recording (kept_0012/0013). The
  // middle panel (app summary + Look cards) never disappears; a THIRD,
  // separate panel appears alongside it, starting as a plain spinner and
  // filling in with a live app-shell preview once screen-building starts.
  // An earlier version of this file only had two panels and left the
  // entire right two-thirds of the screen blank - confirmed both from
  // the recording and from the user's own screenshot of this exact bug.
  //
  // Trigger index: kept_0012 (7/8 steps done - everything through
  // "Planning your screens" checked, "Building your screens" not yet
  // started) still shows the spinner; kept_0013 (mid "Building your
  // screens", its own 5/13-screens sub-progress showing) already shows
  // the full preview shell. So the real swap happens once the LAST step
  // begins, not one step earlier - this was triggering on index 6
  // ("Planning your screens" starting), a full step too early.
  var LIVE_PREVIEW_FROM_STEP = 7;

  function mountGenerationOverlay(rootEl, steps, onComplete) {
    rootEl.innerHTML =
      '<div class="gen-screen">' +
        '<div class="gen-panel gen-panel--steps">' +
          '<div class="gen-steps-title">BUILD STEPS</div>' +
          '<div class="gen-steps-list"></div>' +
          '<div class="gen-progress-row"><div class="gen-progress-bar"><div class="gen-progress-bar__fill"></div></div><span class="gen-progress-label"></span></div>' +
          // Real: a running "AI USAGE SO FAR" tally at the bottom of this
          // panel, visible in both kept_0012 and kept_0013 - an earlier
          // version of this file never built this section at all. Uses
          // representative round numbers rather than the recording's
          // exact session-specific API costs (those are Apurv's real
          // per-run usage, not fixed product copy), but trends upward
          // the same way: negligible until the AI-badged steps run, then
          // climbing substantially during the final screens-building step.
          '<div class="gen-usage">' +
            '<div class="gen-usage__title">AI USAGE SO FAR</div>' +
            '<div class="gen-usage__row"><span>Tokens</span><span class="gen-usage__tokens">0</span></div>' +
            '<div class="gen-usage__row"><span>Cost</span><span class="gen-usage__cost">$0.0000</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="gen-panel gen-panel--summary"></div>' +
        '<div class="gen-panel gen-panel--preview"></div>' +
      '</div>';

    var stepsListEl = rootEl.querySelector('.gen-steps-list');
    var barFillEl = rootEl.querySelector('.gen-progress-bar__fill');
    var progressLabelEl = rootEl.querySelector('.gen-progress-label');
    var summaryPanelEl = rootEl.querySelector('.gen-panel--summary');
    var previewPanelEl = rootEl.querySelector('.gen-panel--preview');
    var usageTokensEl = rootEl.querySelector('.gen-usage__tokens');
    var usageCostEl = rootEl.querySelector('.gen-usage__cost');
    var runningTokens = 0;
    var runningCost = 0;
    var startTime = Date.now();
    // Per-AI-step token increments, roughly matching the real
    // progression seen across the recording frames (small through the
    // early AI steps, then a large jump on the final screens-building
    // step, which is also AI-badged and does most of the real work).
    var AI_STEP_TOKEN_INCREMENTS = [18000, 22000, 21000, 13000, 92000];

    steps.forEach(function (step) {
      var row = document.createElement('div');
      row.className = 'gen-step';
      row.innerHTML =
        '<span class="gen-step__check"></span>' +
        '<span class="gen-step__label">' + step.label + '</span>' +
        '<span class="gen-step__badges">' + step.badges.map(function (b) { return '<span class="gen-step__badge gen-step__badge--' + b.toLowerCase() + '">' + b + '</span>'; }).join('') + '</span>';
      stepsListEl.appendChild(row);
    });

    summaryPanelEl.innerHTML = appSummaryPanelHtml();
    previewPanelEl.innerHTML = genOpeningHtml();

    // Real: the app-summary card shows the same running tokens/cost
    // total as the steps panel's AI USAGE SO FAR section (confirmed:
    // both read 74,076 tokens in the same recording frame), plus an
    // elapsed-time readout - kept in sync with the same running totals.
    // Queried only now, after summaryPanelEl actually has this markup -
    // querying before the innerHTML assignment above returned null for
    // all three and threw the first time the AI-usage code ran, which
    // silently halted the whole generation sequence after step 1.
    var statsTimeEl = rootEl.querySelector('.gen-summary-card__stats-time');
    var statsTokensEl = rootEl.querySelector('.gen-summary-card__stats-tokens');
    var statsCostEl = rootEl.querySelector('.gen-summary-card__stats-cost');

    var aiStepsSeen = 0;

    runGenerationSequence(steps, function (step, index) {
      var rows = stepsListEl.querySelectorAll('.gen-step');
      rows[index].classList.add('gen-step--done');
      var pct = Math.round(((index + 1) / steps.length) * 100);
      barFillEl.style.width = pct + '%';
      progressLabelEl.textContent = (index + 1) + '/' + steps.length + ' steps · ' + pct + '%';
      if (step.badges.indexOf('AI') !== -1 && aiStepsSeen < AI_STEP_TOKEN_INCREMENTS.length) {
        runningTokens += AI_STEP_TOKEN_INCREMENTS[aiStepsSeen];
        runningCost += AI_STEP_TOKEN_INCREMENTS[aiStepsSeen] * 0.00000036;
        aiStepsSeen += 1;
        var tokensStr = runningTokens.toLocaleString('en-US');
        var costStr = '$' + runningCost.toFixed(4);
        usageTokensEl.textContent = tokensStr;
        usageCostEl.textContent = costStr;
        statsTokensEl.textContent = tokensStr;
        statsCostEl.textContent = costStr;
      }
      var elapsedS = Math.round((Date.now() - startTime) / 1000);
      statsTimeEl.textContent = elapsedS < 60 ? elapsedS + 's' : Math.floor(elapsedS / 60) + 'm ' + (elapsedS % 60) + 's';
      if (index === LIVE_PREVIEW_FROM_STEP) {
        previewPanelEl.innerHTML = genPreviewShellHtml();
      }
    }, function () {
      showReadyModal(rootEl, onComplete);
    });
  }

  function showReadyModal(rootEl, onComplete) {
    var modalHost = document.createElement('div');
    modalHost.innerHTML = readyModalHtml();
    rootEl.appendChild(modalHost.firstChild);

    var done = false;
    var intervalId = null;
    function finish() {
      if (done) return;
      done = true;
      if (intervalId !== null) clearInterval(intervalId);
      onComplete();
    }

    rootEl.querySelector('.ready-modal__open').addEventListener('click', finish);
    rootEl.querySelector('.ready-modal__cancel').addEventListener('click', finish);

    var countdownEl = rootEl.querySelector('.ready-modal__countdown-n');
    var barFillEl = rootEl.querySelector('.ready-modal__bar-fill');
    var remaining = 4;
    barFillEl.style.width = '0%';
    intervalId = setInterval(function () {
      remaining -= 1;
      barFillEl.style.width = Math.round(((4 - remaining) / 4) * 100) + '%';
      if (remaining <= 0) {
        clearInterval(intervalId);
        finish();
        return;
      }
      countdownEl.textContent = String(remaining);
    }, 1000);
  }

  var api = {
    GENERATION_STEPS: GENERATION_STEPS,
    runGenerationSequence: runGenerationSequence,
    mountAppsList: mountAppsList,
    mountCreateChoice: mountCreateChoice,
    mountPromptBox: mountPromptBox,
    mountGenerationOverlay: mountGenerationOverlay
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.Demo = root.Demo || {};
    root.Demo.generate = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
