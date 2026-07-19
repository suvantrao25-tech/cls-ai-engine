const axios = require("axios");

const generateResponse = async (text) => {

  text = `${text}

Create a complete SEO blog article.

Minimum length: 1200 words.
Use proper Markdown headings.
Do not stop early.
Finish the complete conclusion.`;

  let systemPrompt =
    "You are a professional AI writing assistant.";

  if (text.startsWith("Blog Writer:")) {

systemPrompt = `
You are an expert SEO Blog Writer.

IMPORTANT:
Return ONLY Markdown formatted blog content.

Rules:

The first line must be the article title in Markdown H1 format.

Example:

# Your Blog Title

## Introduction

Content...

## Main Section

Content...

### Sub Section

Content...

## Conclusion

Content...

Do NOT include ANY extra SEO information.

NEVER write:

Title:
Subtitle:
Meta Description:
SEO Title:
Keywords:
Keyword Density:
Header Tags:
H1:
H2:
H3:
Image Suggestions:
Image Optimization:
Word Count:
Target Audience:
Recommendations:
Final Thoughts:
Actionable Tips:
Call-to-Action:
Call To Action:
CTA:
SEO Notes:
References:
Sources:
Image Credits:
Note:

Write a complete long-form SEO article.

STRICT LENGTH REQUIREMENT:

Generate a long detailed article.

Target length:
1200+ words.

IMPORTANT:
Do not try to count words.
Focus on writing a complete detailed article.

Minimum sections:
- Introduction
- 5 Main Sections
- Conclusion

Each section must contain detailed paragraphs.

Never finish after only a few paragraphs.

Do not end until the article reaches minimum 1200 words.

Required structure:

# Title

## Introduction
(150-200 words)

## Main Section
(700-900 words)

## Additional Sections
(200-300 words)

## Conclusion
(150-200 words)

IMPORTANT:
Do not stop early.
Do not summarize.
Do not end before completing the Conclusion.

Before finishing, check that the article is at least 1200 words.
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
        model: "llama-3.3-70b-versatile",
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

        temperature: 0.5,
        max_tokens: 8000,

      },

      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

  let result = response.data.choices[0].message.content;
  console.log("AI LENGTH:", result.length);
console.log("FINISH:", response.data.choices[0].finish_reason);
// ===============================
// Remove unwanted sections after conclusion
// ===============================



// ===============================
// Remove unwanted ending sections
// ===============================







// Remove research citations like (Author, 2025)


// Remove extra spaces
result = result.trim();
// ===============================
// CLS Markdown Heading Formatter
// ===============================

result = result.replace(/^([^\n#]+)$/m, "# $1");

result = result.replace(
/^(Introduction|Main Section|Sub Section|Conclusion)$/gm,
"## $1"
);

result = result.replace(
/^Sub Section:\s*(.*)$/gm,
"### $1"
);

// ===============================
// Markdown Heading Fix
// ===============================

let blogLines = result.split("\n");

blogLines = blogLines.map((line,index)=>{

  let text = line.trim();

  if(!text) return line;


  if(index === 0){
    return "# " + text.replace(/^#+\s*/,"");
  }


  const headings = [
    "Introduction",
    "Main Section",
    "What is Artificial Intelligence?",
    "Conclusion"
  ];


  if(headings.includes(text)){
    return "## " + text;
  }


  return line;

});


result = blogLines.join("\n");
  // Remove unwanted AI SEO sections

const unwantedSections = [
"Keyword Density:",
"Keywords:",
"Meta Description:",
"SEO Title:",
"SEO Notes:",
"Header Tags:",
"Image Suggestions:",
"Image Optimization:",
"Internal Link Suggestions:",
"Internal Links:",
"Target Audience:",
"Word Count:",
"Call-to-Action:",
"Call To Action:",
"Final Thoughts:",
"Actionable Tips:",
"Recommendations:",
"Note:"
];


unwantedSections.forEach((section)=>{

const index = result.toLowerCase()
.indexOf(section.toLowerCase());

if(index !== -1){

result = result.substring(0,index);

}

});


// Remove Title label
result = result.replace(/^Title:\s*/im,"# ");


// Remove Subtitle
result = result.replace(/^Subtitle:.*$/im,"");


// Convert headings
result = result.replace(/^Introduction:?$/im,
"## Introduction");


result = result.replace(/^Conclusion:?$/im,
"## Conclusion");


// Clean spaces
result=result.trim();
 










// Remove extra blank lines
result = result.replace(/\n{3,}/g, "\n\n");





// Remove Title label
result = result.replace(/^Title:\s*/i, "# ");

// Convert Introduction heading
result = result.replace(/^Introduction$/im, "## Introduction");

// Remove accidental H1 from first paragraph
result = result.replace(
  /(## Introduction)\n#\s+/i,
  "$1\n\n"
);

// Convert Conclusion heading
result = result.replace(/^Conclusion$/im, "## Conclusion");



console.log(result);
return result;



  } catch (error) {

    console.log(
      "GROQ ERROR:",
      error.response?.data || error.message
    );

    return "AI temporarily unavailable";
  }
};

module.exports = { generateResponse };