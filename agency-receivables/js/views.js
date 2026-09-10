// views.js — renders the end-user-facing screens from Store state, matching
// the real captured Makyo interface (docs/research/2026-09-09-makyo-interface-pixel-reference.md):
// left sidebar nav, PROJECT-eyebrow list headers, plain data tables, a
// Payment-status card + bar/donut/ranked-list Dashboard row, pagination chrome.
// This is UI/DOM code: verified visually against the real frames, not
// unit-tested, per the design spec's own test-plan scope.
(function (root) {
  'use strict';

  var derive = (typeof module !== 'undefined' && module.exports) ? require('./derive.js') : root.Demo.derive;
  var seed = (typeof module !== 'undefined' && module.exports) ? require('./seed.js') : root.Demo.seed;

  // Real generated app has exactly these 4 screens with data behind them
  // (plus Invoice Items, which this demo has no line-item data for, and no
  // separate Aging screen — the real generation never built one either).
  // Order matches the real sidebar exactly (confirmed via a real "focus
  // mode" recording frame, kept_0050): Follow-Ups, then Invoice Items,
  // then Invoices, not Invoices-then-Follow-Ups as an earlier version of
  // this file had it.
  var SCREENS = ['dashboard', 'clients', 'followups', 'invoices'];
  var SCREEN_META = {
    dashboard: { label: 'Dashboard', group: 'ANALYTICS SCREENS' },
    clients: { label: 'Clients', group: 'CLIENTS SCREENS' },
    invoices: { label: 'Invoices', group: 'INVOICING & COLLECTIONS SCREENS' },
    followups: { label: 'Follow-Ups', group: 'INVOICING & COLLECTIONS SCREENS' }
  };

  function money(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Real Makyo renders dates long-form ("Sep 11, 2026"), not ISO - confirmed
  // in kept_0058 (Invoices) and kept_0053 (Follow-Ups), where every date cell
  // reads e.g. "Aug 20, 2026, 12:53 AM". The real app also shows a time
  // because its generated rows carried timestamps; ours are date-only, so
  // this formats the date part and stops there rather than inventing a time.
  // Parsed by string split, not new Date(iso) - the latter parses as UTC and
  // renders the previous day in any negative-offset timezone.
  var MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function longDate(iso) {
    if (!iso) return '';
    var parts = String(iso).split('-');
    if (parts.length !== 3) return iso;
    var month = MONTH_NAMES[parseInt(parts[1], 10) - 1];
    if (!month) return iso;
    return month + ' ' + parseInt(parts[2], 10) + ', ' + parts[0];
  }

  function computedInvoices(state) {
    return state.invoices.map(function (inv) { return derive.withComputedFields(inv, seed.DEMO_NOW); });
  }

  function clientName(state, clientId) {
    var c = state.clients.filter(function (c) { return c.id === clientId; })[0];
    return c ? c.name : clientId;
  }

  // Real Invoices/Follow-Ups tables both have a "Client Email Lookup"
  // column (confirmed via real recording frames kept_0058/kept_0053) -
  // a relationship lookup field, same Makyo mechanism this project's own
  // research docs already document. The client email data already
  // existed in seed.js; this just surfaces it as its own column, which
  // an earlier version of this file never did.
  function clientEmail(state, clientId) {
    var c = state.clients.filter(function (c) { return c.id === clientId; })[0];
    return c ? c.email : '';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
    });
  }

  // ---- Shared chrome ----

  function renderSidebar(activeScreen, onNavigate) {
    var nav = document.createElement('div');
    nav.className = 'app-sidebar';

    var brand = document.createElement('div');
    brand.className = 'app-sidebar__brand';
    brand.innerHTML =
      '<div class="app-sidebar__icon"><img src="images/icon-agency-receivables.svg" alt="" width="20" height="20" /></div>' +
      '<div><div class="app-sidebar__name">Agency Receivables</div><div class="app-sidebar__version">Draft &middot; v0.1.0</div></div>';
    nav.appendChild(brand);

    var search = document.createElement('div');
    search.className = 'app-sidebar__search';
    search.textContent = 'Search...';
    nav.appendChild(search);

    var groups = [];
    SCREENS.forEach(function (screen) {
      var meta = SCREEN_META[screen];
      if (groups.indexOf(meta.group) === -1) groups.push(meta.group);
    });

    groups.forEach(function (group) {
      var label = document.createElement('div');
      label.className = 'app-sidebar__group';
      label.textContent = group;
      nav.appendChild(label);

      SCREENS.filter(function (s) { return SCREEN_META[s].group === group; }).forEach(function (screen) {
        var btn = document.createElement('button');
        btn.className = 'app-sidebar__item' + (screen === activeScreen ? ' app-sidebar__item--active' : '');
        btn.textContent = SCREEN_META[screen].label;
        btn.addEventListener('click', function () { onNavigate(screen); });
        nav.appendChild(btn);

        // Real sidebar has a real "Invoice Items" screen right after
        // Follow-Ups (confirmed via kept_0050/kept_0055) - this demo has
        // no line-item data behind it, so it's decorative-only (no click
        // handler), same treatment as the other look-correct-only
        // controls throughout this project, rather than inventing a
        // screen's worth of data just to make it clickable.
        if (screen === 'followups') {
          var itemsBtn = document.createElement('button');
          itemsBtn.className = 'app-sidebar__item';
          itemsBtn.textContent = 'Invoice Items';
          nav.appendChild(itemsBtn);
        }
      });
    });

    return nav;
  }

  function renderBreadcrumb(activeScreen) {
    var el = document.createElement('div');
    el.className = 'app-breadcrumb';
    el.innerHTML = '<span class="app-breadcrumb__link">Home</span><span class="app-breadcrumb__link">Profile</span>';
    var strip = document.createElement('div');
    strip.className = 'app-screen-strip';
    strip.textContent = SCREEN_META[activeScreen].label;
    var wrap = document.createElement('div');
    wrap.appendChild(el);
    wrap.appendChild(strip);
    return wrap;
  }

  function listHeader(eyebrow, title, subtitle, buttonLabel) {
    return (
      '<div class="list-header">' +
        '<div class="list-header__eyebrow">' + eyebrow + '</div>' +
        '<h2 class="list-header__title">' + title + '</h2>' +
        '<p class="list-header__subtitle">' + subtitle + '</p>' +
        '<button class="list-header__button" type="button">+ ' + buttonLabel + '</button>' +
      '</div>'
    );
  }

  function searchRow(extraFilterLabel) {
    return (
      '<div class="list-search-row">' +
        '<input class="list-search" type="text" placeholder="Search..." />' +
        (extraFilterLabel ? '<div class="list-filter">' + extraFilterLabel + ' &#9662;</div>' : '') +
      '</div>'
    );
  }

  function pagination(pageCount) {
    var pages = [1, 2, '…', pageCount].filter(function (p, i, arr) { return arr.indexOf(p) === i; });
    var html = '<div class="pagination"><button type="button">&lsaquo; Previous</button>';
    pages.forEach(function (p) {
      html += '<button type="button" class="' + (p === 1 ? 'pagination__page--active' : '') + '">' + p + '</button>';
    });
    html += '<button type="button">Next &rsaquo;</button></div>';
    return html;
  }

  // ---- Hand-rolled charts (no external library, per the zero-dependency constraint) ----

  function renderBarChartSvg(points) {
    var w = 220, h = 120, barGap = 12;
    var max = Math.max.apply(null, points.map(function (p) { return p.value; })) || 1;
    var barW = (w - barGap * (points.length + 1)) / points.length;
    var bars = points.map(function (p, i) {
      var barH = Math.round((p.value / max) * (h - 24));
      var x = barGap + i * (barW + barGap);
      var y = h - 24 - barH;
      return '<rect x="' + x + '" y="' + y + '" width="' + barW + '" height="' + Math.max(barH, 2) + '" fill="var(--color-blue)" rx="1"></rect>' +
        '<text x="' + (x + barW / 2) + '" y="' + (h - 8) + '" font-size="9" fill="#64748b" text-anchor="middle">' + p.label + '</text>';
    }).join('');
    return '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' + bars + '</svg>';
  }

  function renderDonutChartSvg(segments, centerLabel) {
    var size = 120, r = 44, cx = size / 2, cy = size / 2;
    var total = segments.reduce(function (s, seg) { return s + seg.value; }, 0) || 1;
    var circumference = 2 * Math.PI * r;
    var offset = 0;
    var circles = segments.map(function (seg) {
      var frac = seg.value / total;
      var dash = frac * circumference;
      var el = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + seg.color + '" stroke-width="16" ' +
        'stroke-dasharray="' + dash + ' ' + (circumference - dash) + '" stroke-dashoffset="' + (-offset) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"></circle>';
      offset += dash;
      return el;
    }).join('');
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' + circles +
      '<text x="' + cx + '" y="' + (cy + 4) + '" font-size="14" font-weight="700" fill="#0f172a" text-anchor="middle">' + centerLabel + '</text></svg>';
  }

  // ---- Screens ----

  function renderDashboard(state) {
    var invoices = computedInvoices(state);
    var unpaidCount = invoices.filter(function (i) { return !i.paid; }).length;

    // "Invoices by month" bar chart — real data (issue month), standing in for
    // the real interface's "User activity this year" widget, which has no
    // equivalent concept in an AR/collections tool.
    var byMonth = {};
    state.invoices.forEach(function (inv) {
      var m = inv.issueDate.slice(0, 7);
      byMonth[m] = (byMonth[m] || 0) + 1;
    });
    var monthLabels = { '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep' };
    var barPoints = Object.keys(byMonth).sort().map(function (m) {
      return { label: monthLabels[m.slice(5, 7)] || m, value: byMonth[m] };
    });

    // "Follow-up methods" donut — real data, direct match to the real widget.
    var emailCount = state.followUps.filter(function (f) { return f.method === 'Email'; }).length;
    var phoneCount = state.followUps.filter(function (f) { return f.method === 'Phone'; }).length;
    var donutSvg = renderDonutChartSvg(
      [{ value: emailCount, color: 'var(--color-blue)' }, { value: phoneCount, color: 'var(--color-teal)' }],
      String(emailCount + phoneCount)
    );

    var byClient = {};
    invoices.filter(function (i) { return !i.paid; }).forEach(function (i) {
      byClient[i.clientId] = (byClient[i.clientId] || 0) + i.amount;
    });
    var topClients = Object.keys(byClient)
      .map(function (id) { return { id: id, name: clientName(state, id), total: byClient[id] }; })
      .sort(function (a, b) { return b.total - a.total; })
      .slice(0, 5);
    var maxClientTotal = Math.max.apply(null, topClients.map(function (c) { return c.total; })) || 1;
    var barColors = ['var(--color-navy)', 'var(--color-blue)', 'var(--color-teal)', '#64748b', '#94a3b8'];
    var topClientsTotal = topClients.reduce(function (s, c) { return s + c.total; }, 0);

    var recent = invoices.slice().sort(function (a, b) { return new Date(b.issueDate) - new Date(a.issueDate); }).slice(0, 6);

    // "Due This Week" — proactive counterpart to the reactive overdue/aging
    // story: invoices not yet late but due within the next 7 days. Not a
    // Makyo-evidenced widget (the real recording never showed one) - this is
    // demo content, not builder chrome, so it follows the app's own real data
    // rather than pixel evidence. Sorted soonest-due first.
    var dueSoon = invoices
      .filter(function (i) { return !i.paid && i.daysOverdue < 0 && i.daysOverdue >= -7; })
      .sort(function (a, b) { return b.daysOverdue - a.daysOverdue; });

    var el = document.createElement('div');
    el.className = 'screen screen--dashboard';
    el.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;">' +
        '<div><h2 class="list-header__title" style="margin-bottom:2px;">Dashboard</h2>' +
        '<p class="list-header__subtitle" style="margin-bottom:var(--space-4);">Overview of your key metrics and recent activity</p></div>' +
        '<button class="list-header__button" type="button">Customize</button>' +
      '</div>' +
      '<div class="payment-status-card">' +
        '<h3>Payment status</h3>' +
        '<div class="payment-status-card__stat">' +
          '<div class="payment-status-card__label">Unpaid invoices</div>' +
          '<div class="payment-status-card__value">' + unpaidCount + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="dashboard-row">' +
        '<div class="chart-card"><div class="chart-card__header"><h3>Invoices by month</h3></div>' + renderBarChartSvg(barPoints) + '</div>' +
        '<div class="chart-card"><div class="chart-card__header"><h3>Follow-up methods</h3><span class="chart-card__filter">All</span></div>' +
          donutSvg +
          '<div class="donut-legend"><span><span class="donut-legend__dot" style="background:var(--color-blue);"></span>Email</span><span><span class="donut-legend__dot" style="background:var(--color-teal);"></span>Phone</span></div>' +
        '</div>' +
        '<div class="chart-card"><div class="chart-card__header"><h3>Top clients by outstanding balance</h3><span class="chart-card__filter">All</span></div>' +
          '<div class="chart-card__total">Total: ' + money(topClientsTotal) + '</div>' +
          '<div class="rank-bars" style="margin-top:var(--space-2);">' +
            topClients.map(function (c, i) {
              var pct = Math.max(20, Math.round((c.total / maxClientTotal) * 100));
              return '<div class="rank-bar"><div class="rank-bar__fill" style="width:' + pct + '%;background:' + barColors[i % barColors.length] + ';"></div><div class="rank-bar__label" style="width:' + pct + '%;">' + escapeHtml(c.name) + '</div></div>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>' +
      (dueSoon.length ?
        '<div class="due-soon-card">' +
          '<h3>Due This Week</h3>' +
          '<div class="due-soon-card__list">' +
            dueSoon.map(function (i) {
              var daysUntil = -i.daysOverdue;
              var urgency = daysUntil <= 2 ? 'due-soon-row--urgent' : 'due-soon-row--soon';
              var dueLabel = daysUntil === 1 ? 'Due tomorrow' : 'Due in ' + daysUntil + ' days';
              return '<div class="due-soon-row ' + urgency + '">' +
                '<div class="due-soon-row__main">' +
                  '<span class="due-soon-row__id">' + i.id + '</span>' +
                  '<span class="due-soon-row__client">' + escapeHtml(clientName(state, i.clientId)) + '</span>' +
                '</div>' +
                '<div class="due-soon-row__meta">' +
                  '<span class="due-soon-row__amount">' + money(i.amount) + '</span>' +
                  '<span class="due-soon-row__pill">' + dueLabel + '</span>' +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' : ''
      ) +
      '<h3 class="section-title">Recent Invoices</h3>' +
      '<div class="invoice-card-grid">' +
        recent.map(function (i) {
          return '<div class="invoice-mini-card"><div class="invoice-mini-card__number">' + i.id + '</div><div class="invoice-mini-card__date">' + longDate(i.issueDate) + '</div><span class="invoice-mini-card__menu">&#8942;</span></div>';
        }).join('') +
      '</div>' +
      pagination(3);
    return el;
  }

  function renderClients(state, onLogFollowUp) {
    var el = document.createElement('div');
    el.className = 'screen screen--clients';
    el.innerHTML =
      listHeader('PROJECT', 'Clients', 'Manage client contact information and collections', 'New Client') +
      searchRow();
    var grid = document.createElement('div');
    grid.className = 'client-grid';
    state.clients.forEach(function (client) {
      var card = document.createElement('div');
      card.className = 'client-card';
      card.innerHTML =
        '<div class="client-card__name">' + escapeHtml(client.name) + '</div>' +
        '<div class="client-card__actions">' +
          '<span class="icon-btn" title="' + escapeHtml(client.phone) + '">&#9742;</span>' +
          '<span class="icon-btn" title="' + escapeHtml(client.email) + '">&#9993;</span>' +
          '<span class="icon-btn icon-btn--kebab">&#8942;</span>' +
        '</div>';
      grid.appendChild(card);
    });
    el.appendChild(grid);
    var pageEl = document.createElement('div');
    pageEl.innerHTML = pagination(3);
    el.appendChild(pageEl.firstChild);
    return el;
  }

  function renderInvoices(state, onLogFollowUp) {
    var invoices = computedInvoices(state);
    var sorted = state.sortMode === 'mostOverdue'
      ? derive.sortInvoicesByMostOverdue(invoices)
      : derive.sortInvoicesByDueDate(invoices);

    var el = document.createElement('div');
    el.className = 'screen screen--invoices';
    el.innerHTML =
      listHeader('PROJECT', 'Invoices', 'Track client payments and manage collections', 'New Invoice') +
      searchRow();

    var table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML = '<thead><tr><th>Invoice Number</th><th>Client Name</th><th>Amount</th><th>Paid</th><th>Issue Date</th><th>Due Date</th><th>Client Email Lookup</th><th>Actions</th></tr></thead>';
    var tbody = document.createElement('tbody');
    sorted.forEach(function (inv) {
      var tr = document.createElement('tr');
      var isOverdueHighlighted = state.highlightOverdue && !inv.paid && inv.daysOverdue > 0;
      if (isOverdueHighlighted) tr.className = 'invoice-row--overdue';
      // Invoice Number is plain text here, NOT the linked-relation pill used
      // on Follow-Ups: real Makyo pills a field only when it's a relation to
      // another table (Follow-Ups -> Invoice, kept_0053), and renders a
      // table's own field as plain text (kept_0058). This file pilled both
      // until a side-by-side against those two frames caught it.
      tr.innerHTML =
        '<td>' + inv.id + '</td>' +
        '<td>' + escapeHtml(clientName(state, inv.clientId)) + '</td>' +
        '<td>' + money(inv.amount) + '</td>' +
        '<td>' + (inv.paid ? 'Yes' : 'No') + '</td>' +
        '<td class="date-cell">' + longDate(inv.issueDate) + '</td>' +
        '<td class="date-cell">' + longDate(inv.dueDate) + '</td>' +
        '<td class="lookup-cell">' + escapeHtml(clientEmail(state, inv.clientId)) + '</td>' +
        '<td class="actions-cell"></td>';
      if (!inv.paid && inv.daysOverdue > 0) {
        var btn = document.createElement('button');
        btn.className = 'btn-follow-up';
        btn.textContent = 'Log follow-up';
        btn.addEventListener('click', function () { onLogFollowUp(inv.id); });
        tr.lastElementChild.appendChild(btn);
      }
      // Every row carries a kebab in real Makyo, whether or not it has any
      // other action - without this, paid rows rendered a visibly empty
      // Actions cell that the real table never has.
      var kebab = document.createElement('span');
      kebab.className = 'row-menu';
      kebab.innerHTML = '&#8942;';
      tr.lastElementChild.appendChild(kebab);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    el.appendChild(table);
    return el;
  }

  function renderFollowUps(state) {
    var el = document.createElement('div');
    el.className = 'screen screen--followups';
    el.innerHTML =
      listHeader('PROJECT', 'Follow-Ups', 'Track and manage overdue payment communications', 'New Follow-Up') +
      searchRow('Method');

    var table = document.createElement('table');
    table.className = 'data-table';
    // Real table also has a Client Email Lookup column (same relationship
    // lookup as Invoices) and an Actions column with a real kebab menu -
    // an earlier version of this file had neither.
    table.innerHTML = '<thead><tr><th>Invoice Number</th><th>Sent Date</th><th>Method</th><th>Client Email Lookup</th><th>Note</th><th>Actions</th></tr></thead>';
    var tbody = document.createElement('tbody');
    state.followUps.slice().sort(function (a, b) { return new Date(b.sentDate) - new Date(a.sentDate); }).forEach(function (f) {
      var tr = document.createElement('tr');
      var methodClass = f.method === 'Email' ? 'method-pill--email' : 'method-pill--phone';
      var linkedInvoice = state.invoices.filter(function (inv) { return inv.id === f.invoiceId; })[0];
      var lookupEmail = linkedInvoice ? clientEmail(state, linkedInvoice.clientId) : '';
      tr.innerHTML =
        '<td><span class="id-pill">&#128279; ' + f.invoiceId + '</span></td>' +
        '<td class="date-cell">' + longDate(f.sentDate) + '</td>' +
        '<td><span class="method-pill ' + methodClass + '">' + f.method + '</span></td>' +
        '<td class="lookup-cell">' + escapeHtml(lookupEmail) + '</td>' +
        '<td>' + escapeHtml(f.note) + '</td>' +
        '<td><span class="row-menu">&#8942;</span></td>';
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    el.appendChild(table);
    return el;
  }

  function mountViews(store, rootEl, options) {
    options = options || {};
    var activeScreen = 'dashboard';

    function navigateTo(screen) {
      if (SCREENS.indexOf(screen) === -1) return;
      activeScreen = screen;
      render();
    }

    function onLogFollowUp(invoiceId) {
      store.setState(function (s) {
        var newFollowUp = { id: 'FU-' + (s.followUps.length + 1), invoiceId: invoiceId, sentDate: seed.DEMO_NOW, method: 'Email', note: 'Payment reminder sent.' };
        return Object.assign({}, s, { followUps: s.followUps.concat([newFollowUp]) });
      });
    }

    function render() {
      var state = store.getState();
      rootEl.innerHTML = '';
      var shell = document.createElement('div');
      shell.className = 'app-shell';
      shell.appendChild(renderSidebar(activeScreen, navigateTo));

      var main = document.createElement('div');
      main.className = 'app-main';
      main.appendChild(renderBreadcrumb(activeScreen));

      var screenEl;
      if (activeScreen === 'dashboard') screenEl = renderDashboard(state);
      else if (activeScreen === 'clients') screenEl = renderClients(state, onLogFollowUp);
      else if (activeScreen === 'invoices') screenEl = renderInvoices(state, onLogFollowUp);
      else screenEl = renderFollowUps(state);
      main.appendChild(screenEl);

      shell.appendChild(main);
      rootEl.appendChild(shell);
    }

    store.subscribe(render);
    render();

    return { navigateTo: navigateTo };
  }

  var api = { mountViews: mountViews, renderDashboard: renderDashboard, renderInvoices: renderInvoices, renderClients: renderClients, renderFollowUps: renderFollowUps };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.Demo = root.Demo || {};
    root.Demo.views = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
