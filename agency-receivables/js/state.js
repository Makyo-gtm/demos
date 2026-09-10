// state.js — Observer/pub-sub Store. Single source of truth: every module
// reads via getState()/subscribe() and writes via setState(); nothing else
// holds or mutates its own copy of app data.
(function (root) {
  'use strict';

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createStore(initialState) {
    var initial = deepClone(initialState);
    var state = deepClone(initialState);
    var listeners = [];

    function notify() {
      listeners.forEach(function (fn) { fn(deepClone(state)); });
    }

    function getState() {
      return deepClone(state);
    }

    function setState(updater) {
      var patch = typeof updater === 'function' ? updater(deepClone(state)) : updater;
      state = deepClone(Object.assign({}, state, patch));
      notify();
    }

    function subscribe(fn) {
      listeners.push(fn);
      return function unsubscribe() {
        listeners = listeners.filter(function (l) { return l !== fn; });
      };
    }

    function reset() {
      state = deepClone(initial);
      notify();
    }

    return { getState: getState, setState: setState, subscribe: subscribe, reset: reset };
  }

  var api = { createStore: createStore };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.Demo = root.Demo || {};
    root.Demo.state = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
