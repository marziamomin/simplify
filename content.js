console.log('Content script loaded');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.action === "getSelectedText") {
    console.log('Getting selected text');
    const selectedText = window.getSelection().toString().trim();
    console.log('Selected text:', selectedText);
    sendResponse({ text: selectedText });
  } else {
    console.log('Unknown action received in content script:', request.action);
  }
});