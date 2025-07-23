document.addEventListener('DOMContentLoaded', async () => {
  const selectedTextDiv = document.getElementById('selected-text');
  const explainButton = document.getElementById('explain-button');
  const explanationContainer = document.getElementById('explanation-container');
  const explanationDiv = document.getElementById('explanation');
  const loadingDiv = document.getElementById('loading');

  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Get selected text from the content script
  chrome.tabs.sendMessage(tab.id, { action: "getSelectedText" }, (response) => {
    if (response && response.text) {
      selectedTextDiv.textContent = response.text;
      explainButton.disabled = false;
    } else {
      selectedTextDiv.textContent = "No text selected. Please select some text on the page.";
      explainButton.disabled = true;
    }
  });

  explainButton.addEventListener('click', async () => {
    const text = selectedTextDiv.textContent;
    if (!text) return;

    // Show loading state
    loadingDiv.classList.remove('hidden');
    explanationContainer.classList.add('hidden');
    explainButton.disabled = true;

    try {
      // Send the text to the background script for processing
      const response = await chrome.runtime.sendMessage({
        action: "simplifyText",
        text: text
      });

      // Display the explanation
      explanationDiv.textContent = response.explanation;
      explanationContainer.classList.remove('hidden');
    } catch (error) {
      explanationDiv.textContent = "Sorry, there was an error getting the explanation. Please try again.";
      explanationContainer.classList.remove('hidden');
    } finally {
      loadingDiv.classList.add('hidden');
      explainButton.disabled = false;
    }
  });
});