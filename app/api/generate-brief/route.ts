import OpenAI from "openai";
import { NextResponse } from "next/server";

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

Key guidelines:
- Dont start your message with a greeting
- Write as a business owner reaching out to a web developer
- Include company name, business type, and main goals
- Specify design requirements and visual themes
- Focus on frontend features only (no backend requirements)
- Don't mention skill levels or future interactions
- Don't sign off the message
- Keep the brief under 3 paragraphs

At the end of the brief, add two lines:
INDUSTRY: [industry name, maximum 19 characters]
DIFFICULTY: [Easy/Medium/Hard]
COMPANY NAME: [company name]`
        },
        {
          role: "user",
          content: "Write an email style message with a professional brief for a web developer you are reaching out to build a website. Include specific requirements and visual design preferences."
        }
      ],
      temperature: 0.7,
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