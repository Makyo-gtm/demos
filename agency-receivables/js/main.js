// main.js — bootstraps the whole demo. Loaded last, after every other script tag.
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var seed = window.Demo.seed;
    var state = window.Demo.state;
    var scenario = window.Demo.scenario;
    var views = window.Demo.views;
    var generate = window.Demo.generate;
    var builder = window.Demo.builder;
    // chat.js (the floating bottom-right widget) is no longer wired in -
    // the two chat tweaks now happen through the real AI Chat builder
    // panel instead, per the user's explicit direction. The file and its
    // #chat-root div are left in place (chat.js still loads, scenario.js
    // is shared by both), just not mounted from here.

    var generateRoot = document.getElementById('generate-root');
    var appRoot = document.getElementById('app-root');

    function buildInitialState() {
      var s = seed.createSeed();
      return Object.assign({}, s, { highlightOverdue: false, sortMode: 'dueDate' });
    }

    var store = state.createStore(buildInitialState());

    function revealApp() {
      generateRoot.classList.add('is-hidden');
      appRoot.classList.remove('is-hidden');
      // The reveal shows the real app inside Makyo's own builder chrome,
      // not the app standing alone — confirmed via real screenshots the
      // user pointed out this file was missing entirely. builder.js owns
      // everything except the actual app content; that's still views.js,
      // mounted unchanged into the canvas frame builder.js hands back.
      var canvasFrame = builder.mountBuilderChrome(appRoot, 'Agency Receivables', 'Draft - v0.51');
      var viewsController = views.mountViews(store, canvasFrame);
      // The two chat tweaks now happen through the real "AI Chat" builder
      // panel (click it in the left rail) instead of a floating support-
      // style widget — per the user's explicit direction, styled to look
      // like it genuinely works for the recording. chatRoot/chat.js are
      // no longer used for this; left in the DOM but never mounted.
      builder.wireAIChatPanel(appRoot, scenario.createScenario(store), viewsController.navigateTo);
    }

    function startGeneration(promptText) {
      generateRoot.innerHTML = '';
      generate.mountGenerationOverlay(generateRoot, generate.GENERATION_STEPS, revealApp);
    }

    function showDescribeScreen() {
      generateRoot.innerHTML = '';
      generate.mountPromptBox(generateRoot, startGeneration);
    }

    function showCreateChoice() {
      generateRoot.innerHTML = '';
      generate.mountCreateChoice(generateRoot, showDescribeScreen);
    }

    generate.mountAppsList(generateRoot, showCreateChoice);
  });
})();
