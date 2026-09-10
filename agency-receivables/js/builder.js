// builder.js — Layer 1: Makyo's own app-builder/IDE chrome, wrapped around
// the actual app content (mounted separately by views.js into the canvas
// frame this file exposes). Confirmed structure and content from real
// screenshots/recording frames of the actual builder (kept_0018, kept_0040,
// kept_0050, kept_0053, kept_0058, and a live screenshot of the real
// Clients screen in-builder) — added after the user pointed out this whole
// outer layer was missing entirely; the app content itself (sidebar +
// screens) was already verified separately and is unchanged by this file.
(function (root) {
  'use strict';

  function icon(paths, size) {
    size = size || 16;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="' + size + '" height="' + size + '">' + paths + '</svg>';
  }

  var ICON_BACK = icon('<path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path>');
  var ICON_SPARKLE = icon('<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>');
  var ICON_GRID = icon('<rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect>');
  var ICON_BUG = icon('<path d="m8 2 1.88 1.88"></path><path d="M14.12 3.88 16 2"></path><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"></path><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"></path><path d="M12 20v-9"></path><path d="M6.53 9C4.6 8.8 3 7.1 3 5"></path><path d="M6 13H2"></path><path d="M3 21c0-2.1 1.7-3.9 3.8-4"></path><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"></path><path d="M22 13h-4"></path><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"></path>');
  var ICON_KEYBOARD = icon('<rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="M6 8h.001"></path><path d="M10 8h.001"></path><path d="M14 8h.001"></path><path d="M18 8h.001"></path><path d="M8 12h.001"></path><path d="M12 12h.001"></path><path d="M16 12h.001"></path><path d="M7 16h10"></path>');
  var ICON_NAVIGATOR = icon('<path d="M12 2 4.5 20.29a.55.63 0 0 0 .82.7L12 17l6.68 4a.55.63 0 0 0 .82-.7z"></path>', 14);
  var ICON_THEMES = icon('<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z"></path>', 14);
  var ICON_PUBLISH = icon('<path d="M12 19V5"></path><path d="m5 12 7-7 7 7"></path>', 14);
  var ICON_CHEVRON_DOWN = icon('<path d="m6 9 6 6 6-6"></path>', 12);
  var ICON_SUN = icon('<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>', 16);
  var ICON_BELL = icon('<path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>', 16);
  var ICON_PIN = icon('<path d="M12 17v5"></path><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"></path>', 13);
  var ICON_EXTERNAL = icon('<path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>', 13);
  var ICON_X = icon('<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>', 13);
  var ICON_SEARCH = icon('<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>', 14);
  var ICON_PLUS = icon('<path d="M5 12h14"></path><path d="M12 5v14"></path>', 14);
  var ICON_SORT = icon('<path d="m3 16 4 4 4-4"></path><path d="M7 20V4"></path><path d="m21 8-4-4-4 4"></path><path d="M17 4v16"></path>', 14);
  var ICON_TRASH = icon('<path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>', 14);
  var ICON_LOCK = icon('<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>', 13);
  var ICON_EYE = icon('<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle>', 13);
  var ICON_EYE_OFF = icon('<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path><path d="m2 2 20 20"></path>', 13);
  var ICON_KEBAB = icon('<circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>', 14);
  var ICON_DRAG = icon('<circle cx="9" cy="6" r="1"></circle><circle cx="15" cy="6" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="9" cy="18" r="1"></circle><circle cx="15" cy="18" r="1"></circle>', 12);
  var ICON_CHAT = icon('<path d="M13 21h5a2 2 0 0 0 2-2v-2H7v2a2 2 0 0 0 2 2h4Zm0 0v-6"></path><path d="M8.5 13.5c-3.5 0-5.5-2-5.5-5.5S5 2.5 8.5 2.5h7c3.5 0 5.5 2 5.5 5.5s-2 5.5-5.5 5.5"></path>', 18);
  var ICON_LAYERS = icon('<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"></path><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"></path>', 18);
  var ICON_SQUARE = icon('<rect width="18" height="18" x="3" y="3" rx="2"></rect>', 18);
  var ICON_LIST = icon('<path d="M3 5h.01"></path><path d="M3 12h.01"></path><path d="M3 19h.01"></path><path d="M8 5h13"></path><path d="M8 12h13"></path><path d="M8 19h13"></path>', 18);
  var ICON_SETTINGS = icon('<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle>', 18);
  var ICON_MONITOR = icon('<rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line>');
  var ICON_TABLET = icon('<rect width="16" height="20" x="4" y="2" rx="2"></rect><line x1="12" x2="12.01" y1="18" y2="18"></line>');
  var ICON_MOBILE = icon('<rect width="14" height="20" x="5" y="2" rx="2"></rect><path d="M12 18h.01"></path>');
  var ICON_COLLAPSE = icon('<rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path>');
  var ICON_MAXIMIZE = icon('<path d="M8 3H5a2 2 0 0 0-2 2v3"></path><path d="M21 8V5a2 2 0 0 0-2-2h-3"></path><path d="M3 16v3a2 2 0 0 0 2 2h3"></path><path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>');
  var ICON_UNDO = icon('<path d="M3 7v6h6"></path><path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>');
  var ICON_REDO = icon('<path d="M21 7v6h-6"></path><path d="M21 13a9 9 0 1 1-3-7.7L21 8"></path>');
  var ICON_DOWNLOAD = icon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="M7 10l5 5 5-5"></path><path d="M12 15V3"></path>');
  var ICON_PANEL_RIGHT = icon('<rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M15 3v18"></path>');
  var ICON_EDIT = icon('<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>', 14);
  var ICON_ATTACH = icon('<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>', 16);
  var ICON_SEND = icon('<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path>', 15);
  var ICON_POWER = icon('<path d="M12 2v10"></path><path d="M18.4 6.6a9 9 0 1 1-12.77.04"></path>', 15);

  // Real: 9 screens exist in the builder's own Screens panel - 5 the app
  // nav actually surfaces (Dashboard/Clients/Follow-Ups/Invoice Items/
  // Invoices) plus 4 utility "TOP"-tagged screens (Home/Login/Profile/
  // Edit Profile) that route directly rather than appearing in the app's
  // own sidebar nav - confirmed via a real screenshot of this exact
  // panel. Purely informational here (this panel isn't part of the
  // demo's required click-path), so it's static content, not wired to
  // the actual SCREENS list views.js drives.
  var ALL_SCREENS = [
    { icon: ICON_GRID, name: 'Dashboard', path: '/dashboard', tag: 'ANALYTICS', hidden: false },
    { icon: ICON_LOCK, name: 'Clients', path: '/clients', tag: 'CLIENTS', hidden: false, active: true },
    { icon: ICON_CHAT, name: 'Follow-Ups', path: '/follow-ups', tag: 'INVOICING & COLLECTIONS', hidden: false },
    { icon: ICON_SQUARE, name: 'Invoice Items', path: '/invoice-items', tag: 'INVOICING & COLLECTIONS', hidden: false },
    { icon: ICON_SQUARE, name: 'Invoices', path: '/invoices', tag: 'INVOICING & COLLECTIONS', hidden: false },
    { icon: ICON_MONITOR, name: 'Home', path: '/home', tag: 'TOP', hidden: false },
    { icon: ICON_BACK, name: 'Login', path: '/login', tag: 'TOP', hidden: true },
    { icon: ICON_SETTINGS, name: 'Profile', path: '/profile', tag: 'TOP', hidden: true },
    { icon: ICON_SETTINGS, name: 'Edit Profile', path: '/edit-profile', tag: 'TOP', hidden: true }
  ];

  function panelHeaderHtml(iconHtml, label) {
    return '<div class="builder-panel__header"><span class="builder-panel__header-icon">' + iconHtml + '</span><span class="builder-panel__header-label">' + label + '</span>' +
      '<span class="builder-panel__header-actions">' + ICON_PIN + ICON_EXTERNAL + ICON_X + '</span></div>';
  }

  // Row is two lines: name/path/drag/icon/lock/eye/kebab on the first,
  // the tag pill on its own second line - a long tag like "INVOICING &
  // COLLECTIONS" collided with the name/path text when they shared one
  // row at this panel's real ~300px width, confirmed by actually
  // rendering it.
  function screensListHtml() {
    return ALL_SCREENS.map(function (s) {
      return '<div class="builder-screen-row' + (s.active ? ' builder-screen-row--active' : '') + '">' +
        '<div class="builder-screen-row__main">' +
          '<span class="builder-screen-row__drag">' + ICON_DRAG + '</span>' +
          '<span class="builder-screen-row__icon">' + s.icon + '</span>' +
          '<div class="builder-screen-row__meta"><div class="builder-screen-row__name">' + s.name + '</div><div class="builder-screen-row__path">' + s.path + '</div></div>' +
          '<span class="builder-screen-row__lock">' + ICON_LOCK + '</span>' +
          '<span class="builder-screen-row__eye">' + (s.hidden ? ICON_EYE_OFF : ICON_EYE) + '</span>' +
          '<span class="builder-screen-row__kebab">' + ICON_KEBAB + '</span>' +
        '</div>' +
        '<span class="builder-screen-row__tag">' + s.tag + '</span>' +
        '</div>';
    }).join('');
  }

  // Per-screen "Screen Settings" detail view (Data/Design/Action/Behavior
  // tabs + a General section with Name/Slug/Icon) - real Makyo UI, opened
  // by clicking a screen row's name/path in the Screens list. Unlike the
  // rest of this file, there's no saved screenshot of THIS exact panel for
  // this app; the only evidence is a text description from an unrelated
  // Makyo walkthrough (docs/research/2026-09-04-makyo-kanban-crm-walkthrough.md:
  // "rename via the screen's General properties (Name + auto-updating
  // Slug)") plus the Data/Design/Action/Behavior tab names the user
  // pointed out from their own screenshot. Built from that description,
  // not pixel evidence - lower confidence than the rest of this chrome,
  // and flagged as such rather than presented as verified.
  function screenSettingsHtml(s, idx) {
    var slug = s.path.replace(/^\//, '');
    return (
      '<div class="screen-settings" data-screen-index="' + idx + '" hidden>' +
        '<div class="screen-settings__header">' +
          '<span class="screen-settings__back">' + ICON_BACK + '</span>' +
          '<span class="screen-settings__icon">' + s.icon + '</span>' +
          '<span class="screen-settings__title">' + s.name + '</span>' +
          '<span class="screen-settings__close">' + ICON_X + '</span>' +
        '</div>' +
        '<div class="screen-settings__tabs">' +
          '<span class="screen-settings__tab">Data</span>' +
          '<span class="screen-settings__tab screen-settings__tab--active">Design</span>' +
          '<span class="screen-settings__tab">Action</span>' +
          '<span class="screen-settings__tab">Behavior</span>' +
        '</div>' +
        '<div class="screen-settings__section-label">GENERAL</div>' +
        '<label class="screen-settings__field"><span>Name</span><input type="text" value="' + s.name + '" /></label>' +
        '<label class="screen-settings__field"><span>Slug</span><input type="text" value="' + slug + '" disabled /></label>' +
        '<label class="screen-settings__field"><span>Icon</span><span class="screen-settings__icon-preview">' + s.icon + '</span></label>' +
      '</div>'
    );
  }

  var RAIL_ITEMS = [
    { icon: ICON_SPARKLE, label: 'AI App Generation' },
    { icon: ICON_CHAT, label: 'AI Chat', hook: 'aichat' },
    { icon: ICON_PLUS, label: 'Primitives' },
    { icon: ICON_LAYERS, label: 'Blocks' },
    { icon: ICON_MONITOR, label: 'Screens', active: true },
    { icon: ICON_SQUARE, label: 'Overlays' },
    { icon: ICON_LIST, label: 'Dialogs' },
    { icon: ICON_LIST, label: 'Menus' },
    { icon: ICON_SETTINGS, label: 'Settings' }
  ];

  function topbarHtml(appName, version) {
    return (
      '<div class="builder-topbar">' +
        '<div class="builder-topbar__left">' +
          '<span class="builder-topbar__back">' + ICON_BACK + '</span>' +
          '<div class="builder-topbar__appicon"><img src="images/icon-agency-receivables.svg" alt="" width="20" height="20" /></div>' +
          '<div><div class="builder-topbar__appname">' + appName + ' ' + ICON_CHEVRON_DOWN + '</div><div class="builder-topbar__appversion">' + version + '</div></div>' +
        '</div>' +
        '<div class="builder-topbar__tabs"><span class="builder-topbar__tab builder-topbar__tab--active">Design</span><span class="builder-topbar__tab">Data</span></div>' +
        '<div class="builder-topbar__right">' +
          '<span class="builder-topbar__dot"></span>' +
          '<span class="builder-topbar__icon-btn">' + ICON_SPARKLE + '</span>' +
          '<span class="builder-topbar__icon-btn">' + ICON_GRID + '</span>' +
          '<span class="builder-topbar__icon-btn">' + ICON_BUG + '</span>' +
          '<span class="builder-topbar__icon-btn">' + ICON_KEYBOARD + '</span>' +
          '<span class="builder-topbar__textbtn">' + ICON_NAVIGATOR + ' Navigator</span>' +
          '<span class="builder-topbar__textbtn">' + ICON_THEMES + ' Themes</span>' +
          '<button class="builder-topbar__publish" type="button">' + ICON_PUBLISH + ' Publish ' + ICON_CHEVRON_DOWN + '</button>' +
          '<span class="builder-topbar__icon-btn">' + ICON_SUN + '</span>' +
          '<span class="builder-topbar__icon-btn">' + ICON_BELL + '</span>' +
          '<div class="builder-topbar__avatar"></div>' +
        '</div>' +
      '</div>'
    );
  }

  function noticeBarHtml() {
    return '<div class="builder-noticebar"><span>&#9998; You have edit control.</span><span class="builder-noticebar__release">Release control</span></div>';
  }

  function railHtml() {
    return '<div class="builder-rail">' + RAIL_ITEMS.map(function (item) {
      var extraClass = (item.active ? ' builder-rail__item--active' : '') + (item.hook ? ' builder-rail__item--' + item.hook : '');
      return '<div class="builder-rail__item' + extraClass + '"><span class="builder-rail__icon">' + item.icon + '</span><span class="builder-rail__label">' + item.label + '</span></div>';
    }).join('') + '</div>';
  }

  function panelsHtml() {
    return (
      '<div class="builder-panels">' +
        panelHeaderHtml(ICON_SPARKLE, 'AI App Generation') +
        panelHeaderHtml(ICON_PLUS, 'Add Primitives') +
        '<div class="builder-panel builder-panel--screens">' +
          panelHeaderHtml(ICON_MONITOR, 'Screens') +
          '<div class="builder-screens-list-wrap">' +
            '<div class="builder-screens-toolbar">' +
              '<div class="builder-screens-search">' + ICON_SEARCH + '<input type="text" placeholder="Search pages..." /></div>' +
              '<span class="builder-screens-toolbar__btn">' + ICON_PLUS + '</span>' +
              '<span class="builder-screens-toolbar__btn">' + ICON_SORT + '</span>' +
              '<span class="builder-screens-toolbar__btn">' + ICON_TRASH + '</span>' +
            '</div>' +
            '<div class="builder-screens-label">ALL SCREENS <span class="builder-screens-count">' + ALL_SCREENS.length + '</span></div>' +
            '<div class="builder-screens-list">' + screensListHtml() + '</div>' +
          '</div>' +
          ALL_SCREENS.map(function (s, i) { return screenSettingsHtml(s, i); }).join('') +
        '</div>' +
        // Real: a pinned user footer at the bottom of this column - the
        // logged-in user row plus a "Built on Makyo" badge - confirmed
        // via kept_0062/kept_0063, missing from this file entirely
        // until caught by a direct side-by-side comparison.
        '<div class="builder-panels__footer">' +
          '<div class="builder-panels__user"><div class="builder-panels__avatar"></div><div class="builder-panels__user-meta"><div class="builder-panels__user-name">Apurv Gujar</div><div class="builder-panels__user-role">admin</div></div><span class="builder-panels__power">' + ICON_POWER + '</span></div>' +
          '<div class="builder-panels__badge">&#931; Built on Makyo</div>' +
        '</div>' +
      '</div>'
    );
  }

  function canvasToolbarHtml() {
    return (
      '<div class="builder-canvas-toolbar">' +
        '<span class="builder-canvas-toolbar__icon-btn">' + ICON_COLLAPSE + '</span>' +
        '<div class="builder-canvas-toolbar__devices">' +
          '<span class="builder-canvas-toolbar__icon-btn builder-canvas-toolbar__icon-btn--active">' + ICON_MONITOR + '</span>' +
          '<span class="builder-canvas-toolbar__icon-btn">' + ICON_TABLET + '</span>' +
          '<span class="builder-canvas-toolbar__icon-btn">' + ICON_MOBILE + '</span>' +
        '</div>' +
        '<div class="builder-canvas-toolbar__right">' +
          '<span class="builder-canvas-toolbar__icon-btn">' + ICON_MAXIMIZE + '</span>' +
          '<span class="builder-canvas-toolbar__icon-btn">' + ICON_UNDO + '</span>' +
          '<span class="builder-canvas-toolbar__icon-btn">' + ICON_REDO + '</span>' +
          '<span class="builder-canvas-toolbar__icon-btn">' + ICON_DOWNLOAD + '</span>' +
          '<span class="builder-canvas-toolbar__viewing"><span class="builder-canvas-toolbar__viewing-avatar"></span>Viewing as <strong>Apurv</strong> ' + ICON_CHEVRON_DOWN + '</span>' +
          '<span class="builder-canvas-toolbar__designpreview"><span class="builder-canvas-toolbar__designpreview--active">Design</span><span>Preview</span></span>' +
          '<span class="builder-canvas-toolbar__icon-btn">' + ICON_PANEL_RIGHT + '</span>' +
        '</div>' +
      '</div>'
    );
  }

  // Mounts the full builder chrome into rootEl and returns the empty
  // Real "AI Chat" panel: a floating, overlay panel (drag handle, pin/
  // external-link/close), not embedded in the panels column - confirmed
  // from real recording frames kept_0062/kept_0063. Real content shown
  // there is the confirmed-broken response (raw disconnected JS, then a
  // mixed Excel-formula/web-dev reply - see the design spec's own note
  // on why Layer 2 is deliberately scripted rather than real) - this
  // reuses the exact chrome shape but with OUR scripted, successful
  // replies, per the user's explicit direction to make the two chat
  // tweaks happen through this real surface instead of a floating
  // support-style widget, styled to look like it genuinely works for
  // the recording.
  function aiChatPanelHtml() {
    return (
      '<div class="ai-chat-panel ai-chat-panel--hidden">' +
        '<div class="ai-chat-panel__header">' +
          '<span class="ai-chat-panel__drag">' + ICON_DRAG + '</span>' +
          '<span class="ai-chat-panel__header-icon">' + ICON_SPARKLE + '</span>' +
          '<span class="ai-chat-panel__title">AI Chat</span>' +
          '<span class="ai-chat-panel__header-actions">' + ICON_PIN + ICON_EXTERNAL + '<span class="ai-chat-panel__close">' + ICON_X + '</span></span>' +
        '</div>' +
        '<div class="ai-chat-panel__assistant-row">' +
          '<span class="ai-chat-panel__assistant-icon">' + ICON_CHAT + '</span>' +
          '<span class="ai-chat-panel__assistant-name">Chat Assistant</span>' +
          '<span class="ai-chat-panel__assistant-actions">' + ICON_EDIT + ICON_SETTINGS + ICON_SUN + '</span>' +
        '</div>' +
        '<div class="ai-chat-panel__credits-row"><span class="ai-chat-panel__tokens">&#35; 2,309 tokens left</span><span class="ai-chat-panel__buy">BUY CREDITS +</span></div>' +
        '<div class="ai-chat-panel__banner">Editing in the app builder is free &#8594;' +
          // Not part of the real panel's chrome (the real one has no
          // restart control) - this demo needs one regardless, per the
          // design spec's explicit "visible Restart demo control"
          // requirement, so it's added here as a small, unobtrusive
          // same-row link rather than skipped or invented as fake real UI.
          '<button class="ai-chat-panel__restart" type="button">Restart demo</button>' +
        '</div>' +
        '<div class="ai-chat-panel__messages"></div>' +
        '<div class="ai-chat-panel__input-row">' +
          '<textarea class="ai-chat-panel__input" placeholder="Describe your app..."></textarea>' +
          '<span class="ai-chat-panel__attach">' + ICON_ATTACH + '</span>' +
          '<button class="ai-chat-panel__send" type="button">' + ICON_SEND + '</button>' +
        '</div>' +
      '</div>'
    );
  }

  // Wires the AI Chat panel's interaction to the same scenario.js state
  // machine the rest of this demo's chat-edit logic already uses - only
  // the visual host changes, not the underlying matching/mutation logic.
  function wireAIChatPanel(rootEl, scenario, onNavigate) {
    onNavigate = onNavigate || function () {};
    var panel = rootEl.querySelector('.ai-chat-panel');
    var messages = rootEl.querySelector('.ai-chat-panel__messages');
    var input = rootEl.querySelector('.ai-chat-panel__input');
    var sendBtn = rootEl.querySelector('.ai-chat-panel__send');
    var closeBtn = rootEl.querySelector('.ai-chat-panel__close');
    var restartBtn = rootEl.querySelector('.ai-chat-panel__restart');
    var railItem = rootEl.querySelector('.builder-rail__item--aichat');
    var pendingTimer = null;

    function addMessage(role, text) {
      var msg = document.createElement('div');
      msg.className = 'ai-chat-message ai-chat-message--' + role;
      msg.textContent = text;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
      return msg;
    }

    function setInputEnabled(enabled) {
      input.disabled = !enabled;
      sendBtn.disabled = !enabled;
    }

    function handleSend() {
      if (input.disabled) return;
      var text = input.value.trim();
      if (!text) return;
      addMessage('user', text);
      input.value = '';
      var thinking = addMessage('assistant', 'Thinking...');
      thinking.classList.add('ai-chat-message--thinking');
      var step = scenario.currentStep();
      var delay = step ? step.thinkingMs : 500;
      setInputEnabled(false);
      pendingTimer = setTimeout(function () {
        pendingTimer = null;
        var result = scenario.matchInput(text);
        thinking.textContent = result.reply;
        thinking.classList.remove('ai-chat-message--thinking');
        setInputEnabled(true);
        if (result.matched) {
          onNavigate('invoices');
        }
      }, delay);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });

    if (railItem) {
      railItem.addEventListener('click', function () {
        panel.classList.toggle('ai-chat-panel--hidden');
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        panel.classList.add('ai-chat-panel--hidden');
      });
    }

    addMessage('assistant', 'Hi! Ask me to tweak something in the app.');

    function doRestart() {
      if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; setInputEnabled(true); }
      scenario.restart();
      messages.innerHTML = '';
      addMessage('assistant', 'Demo restarted — try asking for a tweak.');
      onNavigate('dashboard');
    }
    if (restartBtn) { restartBtn.addEventListener('click', doRestart); }

    return { restart: doRestart };
  }

  // "canvas frame" element the caller should mount actual app content
  // into (via views.mountViews(store, canvasFrameEl)) - this file never
  // touches the app content itself.
  // Clicking any element in a group makes it the active one and clears
  // the others - purely a cosmetic selected-state toggle (no content
  // behind these actually changes, same as the rest of this chrome
  // outside Screens/AI Chat/the canvas), added so clicking around during
  // a recording gets visible feedback instead of looking inert.
  function wireExclusiveToggle(rootEl, itemSelector, activeClass) {
    var items = rootEl.querySelectorAll(itemSelector);
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        items.forEach(function (i) { i.classList.remove(activeClass); });
        item.classList.add(activeClass);
      });
    });
  }

  function wireCosmeticToggles(rootEl) {
    wireExclusiveToggle(rootEl, '.builder-rail__item', 'builder-rail__item--active');
    wireExclusiveToggle(rootEl, '.builder-canvas-toolbar__devices .builder-canvas-toolbar__icon-btn', 'builder-canvas-toolbar__icon-btn--active');
    wireExclusiveToggle(rootEl, '.builder-topbar__tab', 'builder-topbar__tab--active');
    wireExclusiveToggle(rootEl, '.builder-canvas-toolbar__designpreview span', 'builder-canvas-toolbar__designpreview--active');
    wireExclusiveToggle(rootEl, '.builder-screen-row', 'builder-screen-row--active');
  }

  // Clicking a screen row's name/path swaps the Screens list for that
  // screen's detail view (see screenSettingsHtml's comment for the
  // evidence this is built from); the row's own selected-state toggle
  // (wireCosmeticToggles above) still fires independently since it's
  // bound to the whole row, not just this inner element.
  function wireScreenSettings(rootEl) {
    var listWrap = rootEl.querySelector('.builder-screens-list-wrap');
    var rows = rootEl.querySelectorAll('.builder-screen-row');
    var panels = rootEl.querySelectorAll('.screen-settings');
    if (!listWrap || !rows.length || !panels.length) return;

    function showList() {
      listWrap.hidden = false;
      panels.forEach(function (p) { p.hidden = true; });
    }
    function showDetail(idx) {
      listWrap.hidden = true;
      panels.forEach(function (p) { p.hidden = p.getAttribute('data-screen-index') !== String(idx); });
    }

    rows.forEach(function (row, idx) {
      var meta = row.querySelector('.builder-screen-row__meta');
      if (!meta) return;
      meta.style.cursor = 'pointer';
      // No stopPropagation: the row's own click listener (wireCosmeticToggles,
      // registered on the row itself) should still fire and apply the
      // existing selected-row highlight - confirmed missing via Playwright
      // during review (clicking the name opened the detail view but left
      // the row unhighlighted, an inconsistency with every other click
      // target on this row).
      meta.addEventListener('click', function () { showDetail(idx); });
    });
    panels.forEach(function (panel) {
      var back = panel.querySelector('.screen-settings__back');
      var close = panel.querySelector('.screen-settings__close');
      if (back) back.addEventListener('click', showList);
      if (close) close.addEventListener('click', showList);
      wireExclusiveToggle(panel, '.screen-settings__tab', 'screen-settings__tab--active');
    });
  }

  function mountBuilderChrome(rootEl, appName, version) {
    rootEl.innerHTML =
      '<div class="builder-shell">' +
        topbarHtml(appName, version) +
        noticeBarHtml() +
        '<div class="builder-body">' +
          railHtml() +
          panelsHtml() +
          '<div class="builder-canvas">' +
            canvasToolbarHtml() +
            '<div class="builder-canvas__frame"></div>' +
          '</div>' +
        '</div>' +
        aiChatPanelHtml() +
      '</div>';
    wireCosmeticToggles(rootEl);
    wireScreenSettings(rootEl);
    return rootEl.querySelector('.builder-canvas__frame');
  }

  var api = { mountBuilderChrome: mountBuilderChrome, wireAIChatPanel: wireAIChatPanel };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.Demo = root.Demo || {};
    root.Demo.builder = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
