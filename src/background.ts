// Background service worker for HMR and extension logic
console.log('AI Selector background script loaded');

// Basic listener to keep the worker alive during development if needed
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});
