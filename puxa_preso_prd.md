---
title: "PUXA Preso – AI-Driven Presentation Generator"
author: "PUXA"
tone: "professional"
primary_color: "#00E0FF"
secondary_color: "#FF00AA"
voice: "engaging"
---

# Product Overview
PUXA Preso is a web app that generates **interactive, fullscreen presentations** directly from Markdown PRDs.  
It uses Shadcn UI components, Tailwind, and Framer Motion for styling and transitions.  

- **Input**: PRD in Markdown.  
- **Output**: Interactive HTML slides.  
- **Style**: Dark theme, responsive, smooth transitions.  
- **Sharing**: Unique URLs per deck.  

---

# Core Features
- Paste/upload Markdown PRDs → generate deck instantly.  
- Render **text, ASCII diagrams, and images (Figma exports)**.  
- Support for **PRD metadata** to adapt style, tone, and colors.  
- Authoring UI for editing PRDs in-browser.  
- Shareable presentation URLs.  

<!-- @slide:generate type="list" style="accent" -->

---

# Before AI Workflow (Design & Engineering)

```
[ Idea ]
   |
   v
[ Designer creates wireframes ]
   |
   v
[ Engineer interprets & re-builds ]
   |
   v
[ PM documents everything ]
   |
   v
[ Presentation manually assembled ]
```

- **Manual hand-offs**.  
- **Duplicated effort** (wireframes → specs → slides).  
- **Slow iteration cycles**.  

<!-- @slide:generate type="ascii" style="grid" -->

---

# After AI Workflow with PUXA

```
[ Idea ]
   |
   v
[ Unified PRD in Markdown ]
   |
   v
[ PUXA parses PRD ]
   |
   v
[ Slides auto-generated ]
   |
   v
[ Designers & Engineers iterate visually in real-time ]
```

- **Single source of truth**: PRD → slides.  
- **Faster iteration** with AI assistance.  
- **Shared understanding** across roles.  

<!-- @slide:generate type="ascii" style="highlight" transition="slide" -->

---

# Figma Integration
![Figma Export Example](https://via.placeholder.com/800x400.png?text=Figma+Export)  

Drop Figma frames directly into PRDs and watch them appear live in slides.  

<!-- @slide:generate type="image" style="showcase" -->

---

# Slide Generation API Template

```md
SYSTEM:
You are a slide generator AI. 
Convert structured Markdown PRDs into styled HTML slides.
Use TailwindCSS + Shadcn UI for styling.
Use Framer Motion for transitions.

USER INPUT:
{slide_content}

DIRECTIVES:
Slides contain hooks in comments:
<!-- @slide:generate type="{type}" style="{style}" transition="{transition}" -->

- type: hero | bullet | list | ascii | image | summary
- style: dark | contrast | accent | showcase | grid | highlight | callout | closing
- transition: fade | slide | flip | none

OUTPUT RULES:
1. Wrap slide in <section>...</section>.
2. Apply Tailwind + Shadcn classes.
3. Animate using Framer Motion with {transition}.
4. Render ASCII in <pre class="font-mono">.
5. Render lists with <ul class="list-disc">.
6. Render images with responsive container + rounded corners.
7. Keep tone/style aligned with PRD metadata.

EXAMPLE:

INPUT:
```
# Problem
- Teams spend hours crafting decks manually
- Workflows are fragmented and linear
```

DIRECTIVE:
<!-- @slide:generate type="bullet" style="contrast" transition="fade" -->

OUTPUT:
<section class="w-full h-screen flex flex-col justify-center items-center bg-black text-white px-12">
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
    <h1 class="text-4xl font-bold mb-8 text-teal-400">Problem</h1>
    <ul class="list-disc text-xl space-y-4 pl-6">
      <li>Teams spend hours crafting decks manually</li>
      <li>Workflows are fragmented and linear</li>
    </ul>
  </motion.div>
</section>
```

---

# Technical Requirements
- **Frontend**: Next.js + Tailwind + Shadcn UI.  
- **Markdown Parsing**: remark + rehype + custom transformer.  
- **Transitions**: Framer Motion.  
- **State**: Zustand or Context.  
- **Persistence**: LocalStorage (MVP), Supabase (future).  
- **Hosting**: Vercel.  

---

# Key Takeaways
- **Input**: PRD in Markdown.  
- **Process**: Parsed + converted by OpenAI API into slides.  
- **Output**: Interactive, styled, sharable deck.  
- **Value**: Saves time, aligns teams, automates workflow storytelling.  

<!-- @slide:generate type="summary" style="callout" -->
