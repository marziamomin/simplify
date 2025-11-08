// Import API configuration (config.js is gitignored)
importScripts('config.js');

console.log('Background script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  
  if (request.action === "simplifyText") {
    console.log('Processing simplifyText request with text:', request.text);
    simplifyText(request.text)
      .then(explanation => {
        console.log('Simplify text successful, explanation:', explanation);
        sendResponse({ explanation });
      })
      .catch(error => {
        console.error('Simplify text failed:', error);
        sendResponse({ error: error.message });
      });
    return true; // Required for async response
  } else {
    console.log('Unknown action received:', request.action);
  }
});

async function simplifyText(text) {
  console.log('Starting simplifyText function with text:', text);
  
  const prompt = `Please explain the following text in simple terms that a 5 year old can understand: "${text}"`;
  console.log('Generated prompt:', prompt);

  console.log('Making API request to Gemini');
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  console.log('API response status:', response.status);
  console.log('API response ok:', response.ok);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API response error:', errorText);
    throw new Error('Failed to get explanation from Gemini API');
  }

  const data = await response.json();
  console.log('API response data:', data);
  
  const explanation = data.candidates[0].content.parts[0].text;
  console.log('Extracted explanation:', explanation);
  return explanation;
}