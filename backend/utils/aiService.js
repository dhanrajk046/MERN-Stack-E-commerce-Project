const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const XAI_API_URL = "https://api.x.ai/v1/chat/completions";

/**
 * Generate AI Summary, Sentiment, and Trust Score from reviews list.
 * Falls back to heuristic logic if API is unavailable or fails.
 */
const generateReviewDigest = async (productName, reviews) => {
  if (!reviews || reviews.length === 0) {
    return {
      summary: "No reviews submitted yet.",
      sentiment: "Neutral",
      trustScore: 0,
    };
  }

  const apiKey = process.env.XAI_API_KEY;
  if (apiKey && apiKey !== "your_grok_api_key") {
    try {
      const reviewTextList = reviews
        .map((r, i) => `${i + 1}. Rating: ${r.rating}/5, Comment: "${r.comment}"`)
        .join("\n");

      const prompt = `Analyze these customer reviews for the product "${productName}" and summarize customer consensus.
Reviews:
${reviewTextList}

Return your response strictly as a JSON object with the following fields:
{
  "summary": "A 2-3 sentence summary summarizing what customers like or dislike.",
  "sentiment": "Highly Positive" | "Positive" | "Mixed" | "Negative" | "Neutral",
  "trustScore": <an integer between 0 and 100 indicating trust sentiment ratio>
}
Do not return any markdown code blocks, backticks, or extra text. Return ONLY the JSON object.`;

      const response = await fetch(XAI_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "grok-beta",
          messages: [
            { role: "system", content: "You are an expert product analyst that outputs only raw JSON." },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const contentText = data.choices[0].message.content.trim();
        // Remove potential markdown codeblock formatting if Grok includes it
        const cleanJsonString = contentText.replace(/^```json\s*|\s*```$/g, "");
        const parsed = JSON.parse(cleanJsonString);
        if (parsed.summary && parsed.sentiment && typeof parsed.trustScore === "number") {
          return {
            summary: parsed.summary,
            sentiment: parsed.sentiment,
            trustScore: parsed.trustScore,
          };
        }
      } else {
        console.error("Grok API response error status:", response.status);
      }
    } catch (error) {
      console.error("Failed calling Grok API for review digest:", error.message);
    }
  }

  // Fallback heuristic logic if Grok is not configured or calls fail
  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const score = Math.round((averageRating / 5) * 100);

  let sentiment = "Neutral";
  if (averageRating >= 4.5) sentiment = "Highly Positive";
  else if (averageRating >= 3.8) sentiment = "Positive";
  else if (averageRating >= 2.5) sentiment = "Mixed";
  else sentiment = "Negative";

  const positiveWords = ["great", "love", "awesome", "excellent", "best", "perfect", "good", "nice"];
  const negativeWords = ["bad", "poor", "hate", "worst", "broke", "expensive", "fail", "slow"];

  let positiveCount = 0;
  let negativeCount = 0;

  reviews.forEach((r) => {
    const text = r.comment.toLowerCase();
    positiveWords.forEach((w) => { if (text.includes(w)) positiveCount++; });
    negativeWords.forEach((w) => { if (text.includes(w)) negativeCount++; });
  });

  let summary = `Customers generally rate this product at ${averageRating.toFixed(1)}/5 stars. `;
  if (reviews.length === 1) {
    summary += `Based on the single customer review, they noted: "${reviews[0].comment.slice(0, 80)}${reviews[0].comment.length > 80 ? "..." : ""}"`;
  } else if (positiveCount > negativeCount) {
    summary += `Most reviews express satisfaction, particularly praising features and quality. (Local AI Preview)`;
  } else if (negativeCount > positiveCount) {
    summary += `Several reviews raise issues regarding expectations, highlighting areas of improvement. (Local AI Preview)`;
  } else {
    summary += `Feedback is balanced, with users noting both convenient features and minor drawbacks. (Local AI Preview)`;
  }

  return {
    summary,
    sentiment,
    trustScore: score,
  };
};

/**
 * Generate AI Product Description.
 * Falls back to template-based descriptors if API is unavailable or fails.
 */
const generateProductDescription = async (productName, category, keypoints = "") => {
  const apiKey = process.env.XAI_API_KEY;
  if (apiKey && apiKey !== "your_grok_api_key") {
    try {
      const prompt = `Write a premium, engaging, and professional product description for our e-commerce catalog.
Product Name: ${productName}
Category: ${category}
Key Details / Selling Points: ${keypoints}

Write a detailed, high-converting product description paragraph of about 80-120 words. Focus on benefits and utility.`;

      const response = await fetch(XAI_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "grok-beta",
          messages: [
            { role: "system", content: "You are a professional e-commerce copywriter." },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content.trim();
      }
    } catch (error) {
      console.error("Failed calling Grok API for description generation:", error.message);
    }
  }

  // Fallback template descriptors
  const categoryTerms = {
    "Electronics": "high-performance cutting-edge technology designed to streamline your digital lifestyle",
    "Fashion": "comfort-oriented classic wear crafted from top-tier materials to keep you styled and relaxed",
    "Home & Kitchen": "highly durable everyday essential engineered to combine practical utility with elegant home design",
    "Fitness & Outdoors": "premium-grade gear optimized for durability, active performance, and optimal results",
  };

  const term = categoryTerms[category] || "premium essential created to deliver reliability and elite performance";
  const pointsText = keypoints ? ` Featuring highlights such as: ${keypoints}.` : "";

  return `Experience the next level of quality with the all-new ${productName}. As part of our ${category} collection, this is a ${term}, making it an indispensable addition to your setup. Built to withstand daily wear while providing top-of-the-line utility, it promises an unparalleled experience.${pointsText} Invest in excellence today. (Local AI Preview)`;
};

module.exports = {
  generateReviewDigest,
  generateProductDescription,
};
