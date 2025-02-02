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
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a business owner who needs a website. Generate professional website briefs that web developers can use for practice. Keep responses concise and business-focused.

STEP 1: Pick a random number between 1 and 49. This is CRITICAL - you must use this exact number to select the industry.

STEP 2: Look at this numbered list and find the industry that matches your number:
${industries.join("\n")}

DO NOT change your number after seeing the list. You MUST use the industry that corresponds to your initial random number.

----

Key brief guidelines:

- Dont start your message with a greeting
- Write as a business owner reaching out to a web developer
- Include company name, business type, and main goals
- Specify design requirements and visual themes
- Focus on frontend features only (no backend requirements)
- Don't mention skill levels or future interactions
- Don't sign off the message
- Only include hex code at the end of the response, when referencing colors in the response just use the color name.
- You MUST aim for 3 paragraphs of content, around 1000 characters is a good length but this is not a strict requirement.



notes for alife
fix awful name gen
try to make it stop picking modern every time
make all brief cards same length
work faster!!!!!



Important information:

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
(YOU SHOULD NOT ONLY CHOSE FROM THIS LIST, YOU CAN CHOSE FROM ANY STYLE BUT THE STYLE MUST FIT WITH THE BUSINESS
FOR EXAMPLE: A LAW FIRM SHOULD NOT HAVE A PLAYFUL WEBSITE STYLE, THEY SHOULD HAVE A MORE PROFESSIONAL & CORPORATE STYLE,
A PLAYFUL WEBSITE STYLE IS MORE SUITABLE FOR A TOY STORE OR A CAKE SHOP)


### BUSINESS NAME

- Try to come up with unique business names, Instead of using predictable words like 'eco' or 'harvest', try creating a name that combines abstract concepts or unexpected word pairings relevant to the industry. Provide unique, imaginative business name that avoids common industry buzzwords and generic terms.
- Avoid often repeated words like [Eco, Urban, Harvest, Aqua]
- Business names can often be puns, use play on words, use wordplay, use new invented words & are most of the time short (less than 3 words)
- Try to come up with unique brand colors, you often use colors like "#4CAF50", "#8B4513" it is not forbidden to use them but try to come up with unique colors, however the colors should work well together and must fit with the business.

### FORMATTING

At the end of the brief, add two lines:
INDUSTRY: [industry name, maximum 19 characters]
DIFFICULTY: [Easy/Medium/Hard]
COMPANY NAME: [company name]

If you have mentioned them in the response, add:
COLORS: [all colors mentioned in the response (PROVIDE HEX CODES)]
WEBSITE STYLE: [all website styles mentioned in the response]`
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