/**
 * AI Selector - Content Script
 * Lightweight auto-fill for AI service chat inputs.
 */
(function () {
  var SELECTORS = {
    'claude.ai': 'div[contenteditable="true"].ProseMirror, div[contenteditable="true"][data-placeholder], div[contenteditable="true"]',
    'gemini.google.com': 'div[contenteditable="true"][role="textbox"], div[contenteditable="true"]',
    'manus.im': 'textarea, div[contenteditable="true"]',
    'genspark.ai': 'textarea, div[contenteditable="true"]'
  };

  var MAX_WAIT_MS = 10000;
  var MAX_AGE_MS = 30000;
  var SUBMIT_DELAY_MS = 300;
  var POLL_INTERVAL_MS = 200;
  var STORAGE_KEYS = ['pendingPrompt', 'timestamp'];

  var hostname = location.hostname;
  var selector = null;
  for (var key in SELECTORS) {
    if (hostname === key || hostname.endsWith('.' + key)) {
      selector = SELECTORS[key];
      break;
    }
  }
  if (!selector) return;

  var storage = typeof browser !== 'undefined' && browser.storage
    ? browser.storage
    : (typeof chrome !== 'undefined' && chrome.storage ? chrome.storage : null);
  if (!storage) return;

  function submit(el) {
    var form = el.closest('form');
    if (form) {
      var btn = form.querySelector('button[type="submit"], button:not([type="button"])');
      if (btn) { btn.click(); return; }
    }
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true, cancelable: true }));
    el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));
  }

  function fillElement(el, text, onFilled) {
    el.focus();
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      el.value = text;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // Modern contenteditable fill with InputEvent
      el.textContent = text;
      el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    }
    onFilled();
    setTimeout(function () { submit(el); }, SUBMIT_DELAY_MS);
  }

  function waitAndFill(text, onFilled) {
    var deadline = Date.now() + MAX_WAIT_MS;

    function poll() {
      var el = document.querySelector(selector);
      if (el) {
        fillElement(el, text, onFilled);
        return;
      }
      if (Date.now() < deadline) {
        setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    poll();
  }

  try {
    storage.local.get(STORAGE_KEYS, function (data) {
      if (!data || !data.pendingPrompt) return;
      if (Date.now() - data.timestamp > MAX_AGE_MS) return;

      waitAndFill(data.pendingPrompt, function () {
        // Delay removal to allow multiple tabs to read the pending prompt in multi-select mode
        setTimeout(function() {
          try { storage.local.remove(STORAGE_KEYS); } catch (_) { /* noop */ }
        }, 2000);
      });
    });
  } catch (_) { /* extension context invalidated */ }
})();
