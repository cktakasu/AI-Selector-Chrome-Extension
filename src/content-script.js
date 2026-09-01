/**
 * AI Selector - Content Script
 * Lightweight auto-fill for AI service chat inputs.
 */
(() => {
  const SELECTORS = {
    'claude.ai': [
      'div[contenteditable="true"].ProseMirror',
      'div[contenteditable="true"][data-placeholder]',
      'div[contenteditable="true"]'
    ],
    'gemini.google.com': [
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"]'
    ],
    'manus.im': [
      'textarea',
      'div[contenteditable="true"]'
    ],
    'genspark.ai': [
      'textarea',
      'div[contenteditable="true"]'
    ]
  };

  const MAX_WAIT_MS = 10000;
  const MAX_AGE_MS = 30000;
  const SUBMIT_DELAY_MS = 300;
  const POLL_INTERVAL_MS = 200;
  const PENDING_PROMPTS_KEY = 'pendingPrompts';

  const hostname = location.hostname;

  const storage = typeof browser !== 'undefined' && browser.storage
    ? browser.storage
    : (typeof chrome !== 'undefined' && chrome.storage ? chrome.storage : null);
  if (!storage) return;

  const normalizeHost = (host) => String(host || '').replace(/^www\./, '');

  const hostMatches = (entryHost, pageHost) => {
    const a = normalizeHost(entryHost);
    const b = normalizeHost(pageHost);
    return b === a || b.endsWith(`.${a}`);
  };

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
    if (e.isComposing || e.keyCode === 229) return;
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
  let selectors = null;
  for (const key in SELECTORS) {
    if (hostname === key || hostname.endsWith(`.${key}`)) {
      selectors = SELECTORS[key];
      break;
    }
  }
  if (!selectors) return;

  const isUsableInput = (el) => {
    if (!el || el.disabled) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  const queryByPriority = (selectorList) => {
    for (let i = 0; i < selectorList.length; i++) {
      const nodes = document.querySelectorAll(selectorList[i]);
      for (let j = 0; j < nodes.length; j++) {
        if (isUsableInput(nodes[j])) return nodes[j];
      }
    }
    return null;
  };

  const submit = (el) => {
    const form = el.closest('form');
    if (form) {
      const btn = form.querySelector('button[type="submit"], button:not([type="button"])');
      if (btn) { btn.click(); return; }
    }
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true, cancelable: true }));
    el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));
  };

  const fillElement = (el, text) => {
    el.focus();
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      el.value = text;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // Modern contenteditable fill with InputEvent
      el.textContent = text;
      el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    }
    setTimeout(() => submit(el), SUBMIT_DELAY_MS);
  };

  const waitAndFill = (text) => {
    const deadline = Date.now() + MAX_WAIT_MS;

    const poll = () => {
      const el = queryByPriority(selectors);
      if (el) {
        fillElement(el, text);
        return;
      }
      if (Date.now() < deadline) {
        setTimeout(poll, POLL_INTERVAL_MS);
      }
    };

    poll();
  };

  const claimPendingPrompt = (list) => {
    if (!Array.isArray(list)) return { claimed: null, remaining: [] };
    const now = Date.now();
    let claimed = null;
    const remaining = [];
    for (const item of list) {
      if (!item || typeof item.prompt !== 'string' || typeof item.host !== 'string') continue;
      if (typeof item.timestamp !== 'number' || now - item.timestamp > MAX_AGE_MS) continue;
      if (!claimed && hostMatches(item.host, hostname)) {
        claimed = item;
        continue;
      }
      remaining.push(item);
    }
    return { claimed, remaining };
  };

  try {
    storage.local.get([PENDING_PROMPTS_KEY], (data) => {
      const { claimed, remaining } = claimPendingPrompt(data?.[PENDING_PROMPTS_KEY]);
      if (!claimed) return;

      try { storage.local.set({ [PENDING_PROMPTS_KEY]: remaining }); } catch (_) { /* noop */ }
      waitAndFill(claimed.prompt);
    });
  } catch (_) { /* extension context invalidated */ }
})();
