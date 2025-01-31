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
- Allow users to select whether they want to generate a brief for a whole website or just a specific page.
- If the user selects a whole website, generate a brief for a whole website. If the user selects a landing page, generate a brief for the specific page.
- If the user selects a whole website, let them select how many pages they want the website to have.

## pro

- More detailed briefs
- Larger brief database
-

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
