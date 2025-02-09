import OpenAI from "openai";
import { NextResponse } from "next/server";



const industries = [
  "1. Food & Beverage",
  "2. Construction",
  "3. Landscaping",
  "4. E-commerce",
  "5. Real Estate",
  "6. Healthcare",
  "7. Education",
  "8. Retail",
  "9. Financial Services",
  "10. Insurance",
  "11. IT Services",
  "12. Telecommunications",
  "13. Media & Events",
  "14. Automotive Sales",
  "15. Logistics",
  "16. Manufacturing",
  "17. Hospitality",
  "18. Fitness & Wellness",
  "19. Marketing",
  "20. Legal Services",
  "21. Consulting",
  "22. Home Renovation",
  "23. Agriculture",
  "24. Renewable Energy",
  "25. Event Planning",
  "26. Fashion",
  "27. Gaming & eSports",
  "28. Art & Design",
  "29. Security Services",
  "30. HR & Recruitment",
  "31. Print & Publishing",
  "32. Cleaning Services",
  "33. Pet Care",
  "34. Beauty & Care",
  "35. Social Media",
  "36. Government Services",
  "37. Aviation",
  "38. Pharmaceuticals",
  "39. Waste Management",
  "40. Cybersecurity",
  "41. Music & Arts",
  "42. Non-Profit",
  "43. Interior Design",
  "44. Mining",
  "45. SaaS Solutions",
  "46. Sports & Recreation",
  "47. Engineering",
  "48. Courier Services",
  "49. Photography",
];

// Initialize OpenAI client (server-side only)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    const randomNumber2 = Math.floor(Math.random() * 49) + 1;
    const difficulty = randomNumber === 1 ? "Easy" : randomNumber === 2 ? "Medium" : randomNumber === 3 ? "Medium" : randomNumber === 4 ? "Difficult" : "Hard";
    
    // Get the selected industry (subtract 1 since array is 0-indexed)
    const selectedIndustry = industries[randomNumber2 - 1].split(". ")[1];
    console.log(`difficulty: ${randomNumber}, ${difficulty} ---  Industry: ${randomNumber2}, ${selectedIndustry}`);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a business owner who needs a website. Generate professional website briefs that web developers can use for practice. Keep responses concise and business-focused.



Key brief guidelines:
**You must follow these guidelines strictly**

- Dont start your message with a greeting
- Write as a business owner reaching out to a web developer
- Include company name & business type
- Specify design requirements and visual themes
- Avoid repeating yourself, dont ask for high quality images, if you have already referenced them in the brief. Your last paragraph can be a summary, so it is ok to repeat yourself, but your first 2 paragraphs should be unique.
- You must talk about the home page at some point in your response
- Must include atleast 5 main deliverables
- Avoid being too vague, be specific about what you want, the developer needs to know what you want.
- Don't mention skill level
- Don't mention the difficulty of the project
- Don't mention future interactions
- Don't use the word "deliverable" or "deliverables" in your response, until the end of the response, when you are listing the deliverables.
- Don't sign off the message
- You MUST include hex codes for colors you have referenced, at the end of the response. When referencing colors in the brief, just use the color name, never use hex codes.
- You MUST aim for 3 paragraphs of content, around 1200 characters is a good length but this is not a strict requirement.
- The brief section of the response should end naturally, dont end it with a list of requirements or by explaining the requirements.



Important information:

### INDUSTRY

- The industry you have selected is ${selectedIndustry}
- The business you create must be relevant to the industry you have selected.
- The brief, deliverables, website style, colors and business name must be relevant to the industry you have selected.

### DIFFICULTY

- There are 4 levels of difficulty: Easy, Medium, Difficult, Hard
- The chosen difficulty of this project is ${difficulty}

The ${difficulty} relates to how skilled the developer needs to be to complete the project.


### DELIVERABLES

- Must include atleast 5 deliverables
- Do not include more than 9 deliverables
- Deliverables must be specific, and not vague.
- Deliverables must be relevant to the industry you selected.
- Deliverables must be achievable for the difficulty level you have selected.
- Deliverables should be things the developer can build or accomplish, they should be able to be ticked off, they should not be vague like:
  - "A website that is easy to use"
  - "Homepage design"


### WEBSITE STYLE

- Chose from a variety of website styles, some could include:
  - Minimalist
  - Modern
  - Corporate
  - Dark Mode
  - Retro
  - Futuristic
  - Neumorphism
  - Glassmorphism
  - Elegant
  - Playful
(YOU SHOULD NOT CHOSE ONLY FROM THIS LIST, YOU CAN CHOSE FROM ANY STYLE BUT THE STYLE MUST FIT WITH THE BUSINESS)


### BUSINESS NAME

- Try to come up with unique business names, Instead of using predictable words like 'eco' or 'harvest', try creating a name that combines abstract concepts or unexpected word pairings relevant to the industry. Provide unique, imaginative business name that avoids common industry buzzwords and generic terms.
- Avoid often repeated words like [Eco, Urban, Harvest, Aqua]
- Business names can often be puns, use play on words, use wordplay, use new invented words & are most of the time short (less than 3 words)
- Try to come up with unique brand colors, you often use colors like "#4CAF50", "#8B4513" it is not forbidden to use them but try to come up with unique colors, however the colors should work well together and must fit with the business.



### FORMATTING

At the end of the brief, add these lines:
INDUSTRY: [industry name, maximum 19 characters]
DIFFICULTY: [The difficulty you picked]
COMPANY NAME: [company name]
DELIVERABLES: [all deliverables mentioned in the response, specific things you have asked the developer to build / features you have asked for (MUST BE SEPERATED BY COMMAS)]
COLORS: [all colors mentioned in the response (PROVIDE HEX CODES)]
WEBSITE STYLE: [all website styles mentioned in the response]

`

        },
        {
          role: "user",
          content: "Write an email style message with a professional brief for a web developer you are reaching out to build a website. Include specific requirements and visual design preferences."
        }
      ],
      temperature: 1,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      return NextResponse.json(
        { error: "No response generated from OpenAI" },
        { status: 500 }
      );
    }

    return NextResponse.json({ content: response });
  } catch (error) {
    console.error("Error generating brief:", error);
    
    // Handle specific OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      const status = error.status || 500;
      return NextResponse.json(
        { error: error.message || "OpenAI API error" },
        { status }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate brief. Please try again later." },
      { status: 500 }
    );
  }
} 