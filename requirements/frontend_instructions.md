# Project Overview

Use this guide to build a web app where users can generate random web design briefs that are presented to them in the form of a client who is looking for a new website. You will use OpenAI's API to generate the briefs.

# Feature requirements

- We will use Next.js, Shadcn, Supabase, Clerk
- Create a button that users can click to generate a new brief, calling the OpenAI API to generate the brief.
- Have a nice UI & loading animation when the brief is being generated. ✅
- Display all the briefs ever generated in a grid. ✅
- Assign 2 catagory tags to each brief, one for the industry and one for the estimated difficulty. ✅
- Allow users to click on a brief to view it. ✅
- Allow users to like a brief, add it to a favorites list, and view their favorites list. ✅
- Allow users to leave comments on a brief.
- Allow users to select difficulty of brief
- Allow users to scroll through all the briefs ever generated.

## Base Features

- Allow users to "generate brief", this picks a random brief from the basic brief database.
- Brief contains:
  - Industry
  - Brand colors
  - Website style
- Mark briefs as completed

## pro

- Allow users to generate AI generated briefs, these briefs will be more detailed and will include more information about the website.
- Brief contains:

  - Detailed proposal description
  - Industry
  - Brand colors
  - Website style
  - Deliverables
  - Difficulty

- Access to all briefs ever generated.
- Select difficulty of brief
- Mark briefs as in progress
- Mark briefs as completed
- Tick off deliverables as they are completed

# Relevant documentation

## How to use OpenAI API

import OpenAI from "openai";

const openai = new OpenAI();

const completion = await openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{ role: "system", content: "You are business business owner who is looking for a new website." },
{
role: "user",
content: "Write a brief for a web developer looking to build a website.",
},
],
store: true,
});

# Current file structure (you HAVE TO follow structure below)

BRIEF-MAKER/
├── .next/
├── app/
│ ├── fonts/
│ │ ├── GeistMonoVF.woff
│ │ └── GeistVF.woff
│ ├── favicon.ico
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx
├── components/
│ └── ui/
│ ├── button.tsx
│ ├── card.tsx
│ └── input.tsx
├── lib/
│ └── utils.ts
├── requirements/
│ └── frontend_instructions.md
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

# Rules

- All new components should go in /components and be named like example-component.tsx unless otherwise specified.
- All new pages go in /app
