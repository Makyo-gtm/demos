// derive.js — pure functions over invoice data. No DOM, no I/O, no Date.now().
(function (root) {
  'use strict';

  var MS_PER_DAY = 24 * 60 * 60 * 1000;

  function computeDaysOverdue(dueDateISO, nowISO) {
    var due = new Date(dueDateISO + 'T00:00:00Z');
    var now = new Date(nowISO + 'T00:00:00Z');
    return Math.floor((now - due) / MS_PER_DAY);
  }

  function computeAgingBucket(paid, daysOverdue) {
    if (paid) return 'Paid';
    if (daysOverdue <= 0) return 'Current';
    if (daysOverdue <= 30) return '1-30';
    if (daysOverdue <= 60) return '31-60';
    if (daysOverdue <= 90) return '61-90';
    return '90+';
  }

  function withComputedFields(invoice, nowISO) {
    var daysOverdue = invoice.paid ? null : computeDaysOverdue(invoice.dueDate, nowISO);
    var bucketInput = daysOverdue === null ? -1 : daysOverdue;
    return Object.assign({}, invoice, {
      daysOverdue: daysOverdue,
      agingBucket: computeAgingBucket(invoice.paid, bucketInput)
    });
  }

  function computeClientTotal(invoices, clientId) {
    return invoices
      .filter(function (inv) { return inv.clientId === clientId && !inv.paid; })
      .reduce(function (sum, inv) { return sum + inv.amount; }, 0);
  }

  function sortInvoicesByMostOverdue(invoices) {
    return invoices.slice().sort(function (a, b) {
      var aRank = a.paid ? -Infinity : (a.daysOverdue == null ? 0 : a.daysOverdue);
      var bRank = b.paid ? -Infinity : (b.daysOverdue == null ? 0 : b.daysOverdue);
      return bRank - aRank;
    });
  }

  function sortInvoicesByDueDate(invoices) {
    return invoices.slice().sort(function (a, b) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }

  var api = {
    computeDaysOverdue: computeDaysOverdue,
    computeAgingBucket: computeAgingBucket,
    withComputedFields: withComputedFields,
    computeClientTotal: computeClientTotal,
    sortInvoicesByMostOverdue: sortInvoicesByMostOverdue,
    sortInvoicesByDueDate: sortInvoicesByDueDate
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.Demo = root.Demo || {};
    root.Demo.derive = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
