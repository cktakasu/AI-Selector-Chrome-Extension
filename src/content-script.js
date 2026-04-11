/**
 * AI Selector - Content Script
 * Lightweight auto-fill for AI service chat inputs.
 */
(() => {
  const SELECTORS = {
    'claude.ai': 'div[contenteditable="true"].ProseMirror, div[contenteditable="true"][data-placeholder], div[contenteditable="true"]',
    'gemini.google.com': 'div[contenteditable="true"][role="textbox"], div[contenteditable="true"]',
    'manus.im': 'textarea, div[contenteditable="true"]',
    'genspark.ai': 'textarea, div[contenteditable="true"]'
  };

  const MAX_WAIT_MS = 10000;
  const MAX_AGE_MS = 30000;
  const SUBMIT_DELAY_MS = 300;
  const POLL_INTERVAL_MS = 200;
  const STORAGE_KEYS = ['pendingPrompt', 'timestamp'];

  const hostname = location.hostname;

  const storage = typeof browser !== 'undefined' && browser.storage
    ? browser.storage
    : (typeof chrome !== 'undefined' && chrome.storage ? chrome.storage : null);
  if (!storage) return;

  // === Enter Key Newline Mode ===
  let enterNewlineMode = false;

  try {
    storage.local.get(['aiSelectorEnterNewline'], (data) => {
      enterNewlineMode = !!data?.aiSelectorEnterNewline;
    });
    storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && 'aiSelectorEnterNewline' in changes) {
        enterNewlineMode = !!changes.aiSelectorEnterNewline.newValue;
      }
    });
  } catch (_) { /* extension context invalidated */ }

  window.addEventListener('keydown', (e) => {
    if (!enterNewlineMode) return;
    if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;

    const target = e.target;
    if (!target) return;
    const isEditable = target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true';
    if (!isEditable) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    if (target.tagName === 'TEXTAREA') {
      const start = target.selectionStart;
      const end = target.selectionEnd;
      target.value = target.value.slice(0, start) + '\n' + target.value.slice(end);
      target.selectionStart = target.selectionEnd = start + 1;
      target.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // execCommand fires a trusted beforeinput event internally,
      // making it compatible with ProseMirror and other modern editors.
      document.execCommand('insertLineBreak');
    }
  }, true);

  // === Prompt Injection ===
  let selector = null;
  for (const key in SELECTORS) {
    if (hostname === key || hostname.endsWith(`.${key}`)) {
      selector = SELECTORS[key];
      break;
    }
  }
  if (!selector) return;

  const submit = (el) => {
    const form = el.closest('form');
    if (form) {
      const btn = form.querySelector('button[type="submit"], button:not([type="button"])');
      if (btn) { btn.click(); return; }
    }
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true, cancelable: true }));
    el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));
  };

  const fillElement = (el, text, onFilled) => {
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
    setTimeout(() => submit(el), SUBMIT_DELAY_MS);
  };

  const waitAndFill = (text, onFilled) => {
    const deadline = Date.now() + MAX_WAIT_MS;

    const poll = () => {
      const el = document.querySelector(selector);
      if (el) {
        fillElement(el, text, onFilled);
        return;
      }
      if (Date.now() < deadline) {
        setTimeout(poll, POLL_INTERVAL_MS);
      }
    };

    poll();
  };

  try {
    storage.local.get(STORAGE_KEYS, (data) => {
      if (!data || !data.pendingPrompt) return;
      if (Date.now() - data.timestamp > MAX_AGE_MS) return;

      waitAndFill(data.pendingPrompt, () => {
        // Delay removal to allow multiple tabs to read the pending prompt in multi-select mode
        setTimeout(() => {
          try { storage.local.remove(STORAGE_KEYS); } catch (_) { /* noop */ }
        }, 2000);
      });
    });
  } catch (_) { /* extension context invalidated */ }
})();
