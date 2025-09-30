const client = require("../config/openaiclient");

// Generic AI generator
async function generate_ai(prompt) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini", // lightweight and fast
    messages: [
      { role: "system", content: "You are a helpful tutor." },
      { role: "user", content: prompt },
    ],
  });

  return completion.choices[0].message.content.trim();
}

// // Utility: clean numbered list into array
// function parseListResponse(response) {
//   return response
//     .split("\n")
//     .map((line) =>
//       line
//         // remove numbering (1., 1), etc.)
//         .replace(/^\s*\d+[\.\)]\s*/, "")
//         // remove markdown bullets (*, -, #, etc.)
//         .replace(/^[\*\-#]+\s*/, "")
//         // remove leading/trailing spaces
//         .trim()
//     )
//     .filter((line) => line.length > 0);
// }
// Utility: remove unwanted markdown symbols
function cleanText(text) {
  return text
    .replace(/[*#_`~>-]+/g, "")   // remove markdown bullets, bold, headers, etc.
    .replace(/\s+/g, " ")          // collapse multiple spaces
    .trim();
}

// Utility: clean numbered list into array
function parseListResponse(response) {
  return response
    .split("\n")
    .map((line) =>
      line
        // remove numbering (1., 1), etc.)
        .replace(/^\s*\d+[\.\)]\s*/, "")
        // remove markdown bullets (*, -, #, >, etc.)
        .replace(/^[\*\-#>]+\s*/, "")
        .trim()
    )
    .map(cleanText) // apply stronger cleaning
    .filter((line) => line.length > 0);
}


// Generate exactly 5 main topics for a course
async function generate_maintopics(title) {
  const prompt = `
You are an AI course generator.
Course Title: "${title}".

Return exactly 5 concise main questions that represent the core topics of this course.
Strict rules:
- Format as a plain numbered list (1. ..., 2. ..., etc).
- No markdown (*, -, #, or headings).
- Exactly 5 items, no more, no less.
`;

  const response = await generate_ai(prompt);
  const topics = parseListResponse(response);

  return topics.slice(0, 5);
}

// Generate 3–4 subtopics for a given main question
async function generate_subtopic(main_topic) {
  const prompt = `
You are an AI assistant.
Main question: "${main_topic}".

Return 3 to 4 clear subtopics that break this question down.
Strict rules:
- Format as a plain numbered list (1. ..., 2. ...).
- Each subtopic should be a short phrase (max 12 words).
- No markdown (*, -, #, or headings).
- Minimum 3 items, maximum 4.
`;

  const response = await generate_ai(prompt);
  const subtopics = parseListResponse(response);

  return subtopics.slice(0, 4);
}

module.exports = { generate_ai, generate_maintopics, generate_subtopic };
