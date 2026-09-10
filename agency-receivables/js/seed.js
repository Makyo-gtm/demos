// seed.js — hand-authored seed data, verbatim from
// docs/specs/2026-09-09-ar-collections-recon-app.md's "Use this exact data" section.
// Never Makyo-generated content (confirmed 2026-09-09: Makyo substitutes its own
// data even when given exact seed data — see docs/research/2026-09-09-recon-recording-findings.md).
(function (root) {
  'use strict';

  var DEMO_NOW = '2026-09-09'; // fixed reference date — never new Date(). See plan Global Constraints.

  var CLIENTS = [
    { id: 'harbor-vine', name: 'Harbor & Vine Wine Bar', email: 'hello@harborandvine.com', phone: '(206) 555-0114' },
    { id: 'meridian-fitness', name: 'Meridian Fitness Studio', email: 'billing@meridianfitness.com', phone: '(206) 555-0177' },
    { id: 'bluepeak-retail', name: 'Bluepeak Retail Co.', email: 'orders@bluepeakretail.com', phone: '(206) 555-0142' },
    { id: 'nolan-cross', name: 'Nolan & Cross Law Group', email: 'accounts@nolancrosslaw.com', phone: '(206) 555-0199' },
    { id: 'cedar-grove', name: 'Cedar Grove Dental', email: 'office@cedargrovedental.com', phone: '(206) 555-0163' },
    { id: 'alta-property', name: 'Alta Property Management', email: 'ap@altapropertymgmt.com', phone: '(206) 555-0128' },
    { id: 'sunroot-cafe', name: 'Sunroot Café', email: 'hi@sunrootcafe.com', phone: '(206) 555-0155' }
  ];

  var INVOICES = [
    { id: 'INV-1001', clientId: 'harbor-vine', description: 'Website Redesign — Deposit (50%)', amount: 3750, issueDate: '2026-06-15', dueDate: '2026-06-29', paid: true, paidDate: '2026-06-27' },
    { id: 'INV-1002', clientId: 'harbor-vine', description: 'Website Redesign — Final Payment on Launch', amount: 3750, issueDate: '2026-08-01', dueDate: '2026-08-15', paid: false, paidDate: null },
    { id: 'INV-1003', clientId: 'meridian-fitness', description: 'Monthly Hosting & Maintenance Retainer — June', amount: 250, issueDate: '2026-06-01', dueDate: '2026-06-10', paid: true, paidDate: '2026-06-09' },
    { id: 'INV-1004', clientId: 'meridian-fitness', description: 'Monthly Hosting & Maintenance Retainer — July', amount: 250, issueDate: '2026-07-01', dueDate: '2026-07-10', paid: false, paidDate: null },
    { id: 'INV-1005', clientId: 'meridian-fitness', description: 'Monthly Hosting & Maintenance Retainer — August', amount: 250, issueDate: '2026-08-01', dueDate: '2026-08-10', paid: false, paidDate: null },
    { id: 'INV-1006', clientId: 'meridian-fitness', description: 'Monthly Hosting & Maintenance Retainer — September', amount: 250, issueDate: '2026-09-01', dueDate: '2026-09-10', paid: false, paidDate: null },
    { id: 'INV-1007', clientId: 'bluepeak-retail', description: 'E-commerce Platform Build — Deposit', amount: 4000, issueDate: '2026-05-01', dueDate: '2026-05-15', paid: true, paidDate: '2026-05-14' },
    { id: 'INV-1008', clientId: 'bluepeak-retail', description: 'E-commerce Platform Build — Milestone: Design Approved', amount: 4000, issueDate: '2026-06-01', dueDate: '2026-06-15', paid: true, paidDate: '2026-06-13' },
    { id: 'INV-1009', clientId: 'bluepeak-retail', description: 'E-commerce Platform Build — Final Payment', amount: 4000, issueDate: '2026-07-01', dueDate: '2026-07-15', paid: true, paidDate: '2026-07-16' },
    { id: 'INV-1010', clientId: 'nolan-cross', description: 'Website Security Audit', amount: 900, issueDate: '2026-05-20', dueDate: '2026-06-03', paid: false, paidDate: null },
    { id: 'INV-1011', clientId: 'nolan-cross', description: 'Monthly Hosting & Maintenance Retainer — July', amount: 200, issueDate: '2026-07-15', dueDate: '2026-07-25', paid: true, paidDate: '2026-07-24' },
    { id: 'INV-1012', clientId: 'nolan-cross', description: 'Monthly Hosting & Maintenance Retainer — August', amount: 200, issueDate: '2026-08-15', dueDate: '2026-08-25', paid: false, paidDate: null },
    { id: 'INV-1013', clientId: 'cedar-grove', description: 'Landing Page — New Patient Campaign', amount: 1800, issueDate: '2026-07-10', dueDate: '2026-07-24', paid: false, paidDate: null },
    { id: 'INV-1014', clientId: 'alta-property', description: 'Website Redesign — Deposit', amount: 2500, issueDate: '2026-08-01', dueDate: '2026-08-15', paid: true, paidDate: '2026-08-14' },
    { id: 'INV-1015', clientId: 'alta-property', description: 'Website Redesign — Final Payment', amount: 2500, issueDate: '2026-09-06', dueDate: '2026-09-20', paid: false, paidDate: null },
    { id: 'INV-1016', clientId: 'sunroot-cafe', description: 'Monthly Hosting & Maintenance Retainer — August', amount: 150, issueDate: '2026-08-01', dueDate: '2026-08-10', paid: true, paidDate: '2026-08-09' },
    { id: 'INV-1017', clientId: 'sunroot-cafe', description: 'Monthly Hosting & Maintenance Retainer — September', amount: 150, issueDate: '2026-09-01', dueDate: '2026-09-10', paid: false, paidDate: null }
  ];

  // Real, reusable Follow-Up note copy, from the actual Makyo recon generation
  // (docs/research/2026-09-09-recon-recording-findings.md) — reused near-verbatim.
  var FOLLOW_UPS = [
    { id: 'FU-1', invoiceId: 'INV-1004', sentDate: '2026-08-05', method: 'Email', note: 'Sent initial payment reminder for overdue invoice.' },
    { id: 'FU-2', invoiceId: 'INV-1010', sentDate: '2026-07-01', method: 'Phone', note: 'Spoke with office manager; payment promised by Friday.' },
    { id: 'FU-3', invoiceId: 'INV-1010', sentDate: '2026-08-20', method: 'Phone', note: 'Left voicemail for billing department.' }
  ];

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createSeed() {
    return {
      clients: deepClone(CLIENTS),
      invoices: deepClone(INVOICES),
      followUps: deepClone(FOLLOW_UPS)
    };
  }

  var api = { DEMO_NOW: DEMO_NOW, createSeed: createSeed };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.Demo = root.Demo || {};
    root.Demo.seed = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
