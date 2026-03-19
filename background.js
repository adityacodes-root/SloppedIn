const GEMINI_API_KEY = "Get your own";
const GEMINI_MODEL = "gemini-2.5-flash";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "SLOP_IT") {
    return false;
  }

  generateLinkedInPost(message.text)
    .then((generatedText) => sendResponse({ success: true, generatedText }))
    .catch((error) => {
      console.error("SloppedIn request failed:", error);
      sendResponse({
        success: false,
        error: error.message || "Unable to generate post."
      });
    });

  return true;
});

async function generateLinkedInPost(userText) {
  const prompt = buildPrompt(userText);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const errorBody = await safeReadError(response);
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const generatedText =
    data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("").trim() || "";

  if (!generatedText) {
    throw new Error("Gemini returned an empty response.");
  }

  return generatedText;
}

function buildPrompt(userText) {
  return [
    "Rewrite the following draft as an aggressively LinkedIn-style post.",
    "Requirements:",
    "- Keep the exact core topic intact.",
    "- Do not sanitize, soften, euphemize, or redirect the topic.",
    "- If the draft is vulgar, absurd, embarrassing, or chaotic, keep that exact premise and treat it with dead-serious LinkedIn energy.",
    "- Preserve the user's main wording where possible.",
    "- Use short paragraphs.",
    "- Include 3 to 5 concise lessons, takeaways, or implementation ideas.",
    "- Make it narcissistic, self-congratulatory, self-important, and deeply cringe.",
    "- The narrator should sound absurdly proud of themselves, even when the event is disgusting, humiliating, or stupid.",
    "- Do not frame the event as a failure to humbly recover from. Frame it as a legendary leadership moment, an elite mindset shift, or a world-class learning experience.",
    "- Lean into executive self-mythologizing, founder ego, fake wisdom, and performative insight.",
    "- It should feel unintentionally hilarious because of how seriously and proudly the narrator presents something ridiculous.",
    "- Use light to moderate emoji usage.",
    "- Make it sound like a founder, operator, or thought leader extracting business lessons from the exact event described.",
    "- Do not replace the topic with a safer or more professional topic.",
    "- Do not add disclaimers, apologies, or moral commentary.",
    "- Return only the final post text with no extra commentary.",
    "",
    "Draft:",
    userText
  ].join("\n");
}

async function safeReadError(response) {
  try {
    const data = await response.json();
    return data?.error?.message || JSON.stringify(data);
  } catch (_error) {
    return response.statusText || "Unknown error";
  }
}
