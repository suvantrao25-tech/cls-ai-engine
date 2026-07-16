const axios = require("axios");

const generateResponse = async (text) => {

  let systemPrompt =
    "You are a professional AI writing assistant.";

  if (text.startsWith("Blog Writer:")) {
    systemPrompt = `
You are an expert Blog Writer.

Write:
- SEO optimized blog
- Catchy title
- Headings
- Conclusion
- 800-1200 words
- Human-like writing
`;
  }

  else if (text.startsWith("SEO Writer:")) {
    systemPrompt = `
You are an SEO expert.

Generate ONLY:

- SEO Title
- Meta Description
- Focus Keyword
- Secondary Keywords
- URL Slug
- H1
- H2 Headings
- FAQs

Do NOT write a full blog.
`;
  }

  else if (text.startsWith("Email Writer:")) {
    systemPrompt = `
You are a professional email copywriter.

Write a professional email with:

- Subject
- Greeting
- Body
- Closing
`;
  }

  else if (text.startsWith("Social Media Post:")) {
    systemPrompt = `
You are a social media expert.

Create an engaging post with:

- Hook
- Main content
- CTA
- Emojis
- Hashtags
`;
  }

  else if (text.startsWith("Product Description:")) {
    systemPrompt = `
You are an ecommerce copywriter.

Generate:

- Product Title
- Product Description
- Features
- Benefits
- Call To Action
`;
  }

  try {

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: text,
          },
        ],

        temperature: 0.7,
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {

    console.log(
      "GROQ ERROR:",
      error.response?.data || error.message
    );

    return "AI temporarily unavailable";
  }
};

module.exports = { generateResponse };