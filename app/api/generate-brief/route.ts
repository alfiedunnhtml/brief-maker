import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI client (server-side only)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a business owner who needs a website. Generate a detailed brief for a web developer. Include specific requirements, goals, and any unique features needed. At the end of the brief, add two lines: \nINDUSTRY: [industry name, maximum 19 characters]\nDIFFICULTY: [Easy/Medium/Hard]",
        },
        {
          role: "user",
          content: "Write a brief for a web developer looking to build a website. Keep it short and concise. (2 paragraphs max)",
        },
      ],
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      return NextResponse.json(
        { error: "No response from OpenAI" },
        { status: 500 }
      );
    }

    return NextResponse.json({ content: response });
  } catch (error) {
    console.error("Error generating brief:", error);
    return NextResponse.json(
      { error: "Failed to generate brief" },
      { status: 500 }
    );
  }
} 