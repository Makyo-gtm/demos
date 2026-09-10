// scenario.js — Layer 2's linear state machine. One current-step pointer per
// session; incoming text is matched only against the CURRENT step's keywords
// (match scope, per the design spec's audit fix), so steps can't fire out of order.
(function (root) {
  'use strict';

  // The design spec called for a 400-800ms "thinking" delay; the user, who
  // is the one recording, asked for ~3s instead - long enough that the
  // change visibly lands as a response to the request rather than appearing
  // instantly alongside it. The "Thinking..." indicator shows throughout,
  // so the wait reads as work happening, not as a frozen UI.
  var THINKING_MS = 3000;

  var SCENARIO_STEPS = [
    {
      id: 'highlight-overdue',
      triggerKeywords: ['red', 'stand out', 'highlight'],
      thinkingMs: THINKING_MS,
      reply: 'Done — overdue invoices are now highlighted in red.',
      mutation: function (store) {
        store.setState(function (s) { return Object.assign({}, s, { highlightOverdue: true }); });
      }
    },
    {
      id: 'sort-most-overdue',
      triggerKeywords: ['sort', 'most overdue', 'order', 'first'],
      thinkingMs: THINKING_MS,
      reply: 'Sorted — the most overdue invoices are now at the top.',
      mutation: function (store) {
        store.setState(function (s) { return Object.assign({}, s, { sortMode: 'mostOverdue' }); });
      }
    }
  ];

  function createScenario(store) {
    var currentStepIndex = 0;

    function currentStep() {
      return SCENARIO_STEPS[currentStepIndex] || null;
    }

    function isComplete() {
      return currentStepIndex >= SCENARIO_STEPS.length;
    }

    function matchInput(text) {
      var step = currentStep();
      if (!step) {
        return { matched: false, reply: "The demo's already showing every tweak — try Restart to run it again." };
      }
      var lower = String(text).toLowerCase();
      var matched = step.triggerKeywords.some(function (kw) { return lower.indexOf(kw) !== -1; });
      if (!matched) {
        // Unmatched-input rule: short, generic in-character reply, no advance.
        return { matched: false, reply: 'Let me take a look at that...' };
      }
      step.mutation(store);
      currentStepIndex += 1;
      return { matched: true, reply: step.reply };
    }

    function restart() {
      currentStepIndex = 0;
      store.reset();
    }

    return { matchInput: matchInput, restart: restart, currentStep: currentStep, isComplete: isComplete };
  }

  var api = { SCENARIO_STEPS: SCENARIO_STEPS, createScenario: createScenario };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.Demo = root.Demo || {};
    root.Demo.scenario = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
