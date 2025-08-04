document.addEventListener('DOMContentLoaded', async () => {
  console.log('Popup DOM loaded');
  
  const selectedTextDiv = document.getElementById('selected-text');
  const explainButton = document.getElementById('explain-button');
  const explanationContainer = document.getElementById('explanation-container');
  const explanationDiv = document.getElementById('explanation');
  const loadingDiv = document.getElementById('loading');

  console.log('Elements found:', {
    selectedTextDiv: !!selectedTextDiv,
    explainButton: !!explainButton,
    explanationContainer: !!explanationContainer,
    explanationDiv: !!explanationDiv,
    loadingDiv: !!loadingDiv
  });

  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log('Active tab:', tab);

  // Get selected text from the content script
  console.log('Sending message to content script to get selected text');
  chrome.tabs.sendMessage(tab.id, { action: "getSelectedText" }, (response) => {
    console.log('Response from content script:', response);
    if (response && response.text) {
      console.log('Selected text found:', response.text);
      selectedTextDiv.textContent = response.text;
      explainButton.disabled = false;
    } else {
      console.log('No text selected or error in response');
      selectedTextDiv.textContent = "No text selected. Please select some text on the page.";
      explainButton.disabled = true;
    }
  });

  explainButton.addEventListener('click', async () => {
    console.log('Explain button clicked');
    const text = selectedTextDiv.textContent;
    console.log('Text to explain:', text);
    
    if (!text) {
      console.log('No text to explain, returning');
      return;
    }

    // Show loading state
    console.log('Showing loading state');
    loadingDiv.classList.remove('hidden');
    explanationContainer.classList.add('hidden');
    explainButton.disabled = true;

    try {
      console.log('Sending message to background script');
      // Send the text to the background script for processing
      const response = await chrome.runtime.sendMessage({
        action: "simplifyText",
        text: text
      });
      console.log('Response from background script:', response);

      // Display the explanation
      explanationDiv.textContent = response.explanation;
      explanationContainer.classList.remove('hidden');
      console.log('Explanation displayed successfully');
    } catch (error) {
      console.error('Error in explain button click handler:', error);
      explanationDiv.textContent = "Sorry, there was an error getting the explanation. Please try again.";
      explanationContainer.classList.remove('hidden');
    } finally {
      console.log('Hiding loading state');
      loadingDiv.classList.add('hidden');
      explainButton.disabled = false;
    }
  });
});