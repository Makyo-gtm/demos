// chat.js — Layer 2 UI: floating bottom-right widget matching Makyo's real
// Chat primitive shape (docs/reference/makyo-platform-docs/Chat.md): toggle
// button collapsed by default, header Title/Subtitle, user/assistant avatars.
// All the actual logic (matching, mutation, restart) lives in scenario.js —
// this file only renders messages and wires clicks/submit to it.
(function (root) {
  'use strict';

  function mountChatWidget(rootEl, scenario, onNavigate) {
    onNavigate = onNavigate || function () {};

    rootEl.innerHTML =
      '<button class="chat-toggle" aria-label="Open chat">🤖</button>' +
      '<div class="chat-panel chat-panel--hidden">' +
        '<div class="chat-panel__header">' +
          '<div><div class="chat-panel__title">Chat</div><div class="chat-panel__subtitle">Ask me anything</div></div>' +
          '<button class="chat-panel__restart" type="button">Restart demo</button>' +
        '</div>' +
        '<div class="chat-panel__messages"></div>' +
        '<div class="chat-panel__input-row">' +
          '<input class="chat-panel__input" type="text" placeholder="Type your message" />' +
          '<button class="chat-panel__send" type="button">Send</button>' +
        '</div>' +
      '</div>';

    var toggle = rootEl.querySelector('.chat-toggle');
    var panel = rootEl.querySelector('.chat-panel');
    var messages = rootEl.querySelector('.chat-panel__messages');
    var input = rootEl.querySelector('.chat-panel__input');
    var sendBtn = rootEl.querySelector('.chat-panel__send');
    var restartBtn = rootEl.querySelector('.chat-panel__restart');
    var pendingTimer = null;

    toggle.addEventListener('click', function () {
      panel.classList.toggle('chat-panel--hidden');
    });

    function addMessage(role, text) {
      var msg = document.createElement('div');
      msg.className = 'chat-message chat-message--' + role;

      var avatar = document.createElement('span');
      avatar.className = 'chat-message__avatar';
      avatar.textContent = role === 'user' ? '🧑' : '🤖';

      var bubble = document.createElement('span');
      bubble.className = 'chat-message__bubble';
      bubble.textContent = text;

      msg.appendChild(avatar);
      msg.appendChild(bubble);
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
      var thinking = addMessage('assistant', 'thinking...');
      thinking.querySelector('.chat-message__bubble').classList.add('chat-message__bubble--thinking');
      var step = scenario.currentStep();
      var delay = step ? step.thinkingMs : 500;
      setInputEnabled(false);
      pendingTimer = setTimeout(function () {
        pendingTimer = null;
        var result = scenario.matchInput(text);
        var bubble = thinking.querySelector('.chat-message__bubble');
        bubble.textContent = result.reply;
        bubble.classList.remove('chat-message__bubble--thinking');
        setInputEnabled(true);
        if (result.matched) {
          onNavigate('invoices');
        }
      }, delay);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') handleSend(); });

    restartBtn.addEventListener('click', function () {
      if (pendingTimer) {
        clearTimeout(pendingTimer);
        pendingTimer = null;
        setInputEnabled(true);
      }
      scenario.restart();
      messages.innerHTML = '';
      addMessage('assistant', "Demo restarted — try asking for a tweak.");
      onNavigate('dashboard');
    });

    addMessage('assistant', "Hi! Ask me to tweak something in the app.");
  }

  var api = { mountChatWidget: mountChatWidget };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.Demo = root.Demo || {};
    root.Demo.chat = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
