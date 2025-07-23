// actual Gemini API key
const GEMINI_API_KEY = 'AIzaSyCIIM_meDxlotSay3m0omUl1xgElBpr6qo';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "simplifyText") {
    simplifyText(request.text)
      .then(explanation => sendResponse({ explanation }))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Required for async response
  }
});

async function simplifyText(text) {
  const prompt = `Please explain the following text in simple terms that anyone can understand: "${text}"`;

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

  if (!response.ok) {
    throw new Error('Failed to get explanation from Gemini API');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}