const axios = require("axios");

const generateResponse = async (text) => {

  let systemPrompt =
    "You are a professional AI writing assistant.";

  if (text.startsWith("Blog Writer:")) {

systemPrompt = `
You are an expert SEO Blog Writer.

IMPORTANT:
Return ONLY Markdown formatted blog content.

Rules:

- First line must start with #
The FIRST line MUST start with:

# Blog Title

Use Markdown headings only.

Example:

# Blog Title

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

Output must contain ONLY the blog article.

End the article immediately after the Conclusion.
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

        temperature: 0.7,
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

  let result = response.data.choices[0].message.content;
// ===============================
// Remove unwanted sections after conclusion
// ===============================

const cutSections = [
  "Additional Tips",
  "Additional Tips for Parents",
  "Extra Tips",
  "Bonus Tips",
  "References",
  "Sources",
  "Image Credits"
];


cutSections.forEach((section)=>{

  const index = result.toLowerCase()
  .indexOf(section.toLowerCase());

  if(index !== -1){

    result = result.substring(0,index);

  }

});

// ===============================
// Remove unwanted ending sections
// ===============================

const removeAfter = [
  "References",
  "Image Credits",
  "Sources",
  "Citations"
];


removeAfter.forEach((section)=>{

  const index = result.toLowerCase()
  .indexOf(section.toLowerCase());

  if(index !== -1){

    result = result.substring(0,index);

  }

});


// Remove research citations like (Author, 2025)
result = result.replace(/\([^)]*\d{4}[^)]*\)/g,"");


// Remove extra spaces
result = result.trim();
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
 





let lines = result.split("\n");

let titleAdded = false;

lines = lines.map((line,index)=>{

  let clean = line.trim();


  if(!clean){
    return line;
  }
  

  // Already markdown
  if(clean.startsWith("#")){
    return line;
  }


  // Remove unwanted title label
  if(clean.startsWith("Title:")){
    clean = clean.replace("Title:","").trim();
  }


  // First line H1
  if(!titleAdded){

    titleAdded = true;

    if(!clean.startsWith("#")){
        return "# " + clean;
    }

}


  // Detect headings
  if(
clean.length <= 60 &&
clean.length >= 5 &&
!clean.endsWith(".") &&
!clean.includes(":") &&
!clean.startsWith("-") &&
(
clean.toLowerCase().includes("introduction") ||
clean.toLowerCase().includes("conclusion") ||
clean.toLowerCase().includes("benefits") ||
clean.toLowerCase().includes("tips") ||
clean.toLowerCase().includes("guide") ||
clean.toLowerCase().includes("importance") ||
clean.toLowerCase().includes("how") 
)
){

return "## " + clean;

}


  return line;

});
// Convert array back to text
result = lines.join("\n");




// Remove extra blank lines
result = result.replace(/\n{3,}/g, "\n\n");





// Remove Title label
result = result.replace(/^Title:\s*/i, "# ");

// Convert Introduction heading
result = result.replace(/^Introduction$/im, "## Introduction");

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