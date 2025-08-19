---
title: "PUXA Preso – AI-Driven Presentation Generator"
author: "PUXA"
tone: "professional"
primary_color: "#00E0FF"
secondary_color: "#FF00AA"
voice: "engaging"
theme:
  backgroundColor: "hsl(224, 71%, 4%)"
  textColor: "hsl(210, 40%, 98%)"
  fontFamily: "Inter, system-ui, sans-serif"
---

# Product Overview

PUXA Preso is a web app that generates **interactive, fullscreen presentations** directly from Markdown PRDs.

It uses Shadcn UI components, Tailwind, and Framer Motion for styling and transitions.

## Key Benefits

- **Input**: PRD in Markdown
- **Output**: Interactive HTML slides
- **Style**: Dark theme, responsive, smooth transitions
- **Sharing**: Unique URLs per deck

<!-- @slide:generate type="hero" style="showcase" transition="fade" -->

---

# Core Features

Transform your workflow with these powerful capabilities:

- Paste/upload Markdown PRDs → generate deck instantly
- Render **text, ASCII diagrams, and images (Figma exports)**
- Support for **PRD metadata** to adapt style, tone, and colors
- Authoring UI for editing PRDs in-browser
- Shareable presentation URLs

<!-- @slide:generate type="bullet" style="accent" transition="slide" -->

---

# Before AI Workflow

## Traditional Design & Engineering Process

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

**Problems:**
- Manual hand-offs
- Duplicated effort (wireframes → specs → slides)
- Slow iteration cycles

<!-- @slide:generate type="ascii" style="contrast" transition="slide" -->

---

# After AI Workflow with PUXA

## Streamlined Process

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

**Benefits:**
- Single source of truth: PRD → slides
- Faster iteration with AI assistance
- Shared understanding across roles

<!-- @slide:generate type="ascii" style="highlight" transition="slide" -->

---

# Technical Architecture

## Technology Stack

- **Frontend**: Next.js + Tailwind + Shadcn UI
- **Markdown Parsing**: remark + rehype + custom transformer
- **Transitions**: Framer Motion
- **State**: React Context + hooks
- **Persistence**: LocalStorage (MVP), Database (future)
- **Hosting**: Vercel

## Key Components

- PRD Parser with directive support
- Dynamic theme engine
- Slide type system (hero, bullet, ascii, image, summary)
- Style variations (dark, contrast, accent, showcase)

<!-- @slide:generate type="list" style="grid" transition="fade" -->

---

# Slide Generation Directives

## Powerful Customization

Every slide can include generation hints in comments:

```markdown
<!-- @slide:generate type="bullet" style="accent" transition="slide" -->
```

**Available Types:**
- `hero` - Title slides with large text
- `bullet` - Bulleted lists with emphasis
- `ascii` - Technical diagrams
- `image` - Visual content showcase
- `summary` - Closing/recap slides

**Style Options:**
- `dark`, `contrast`, `accent`, `showcase`, `grid`, `highlight`

<!-- @slide:generate type="ascii" style="callout" transition="flip" -->

---

# Key Takeaways

## The PUXA Advantage

> Transform PRDs into presentations automatically, saving time and aligning teams through visual storytelling.

**Core Value Proposition:**
- **Input**: PRD in Markdown
- **Process**: Parsed + enhanced by AI into slides  
- **Output**: Interactive, styled, shareable deck
- **Value**: Saves time, aligns teams, automates workflow storytelling

Ready to revolutionize your presentation workflow?

<!-- @slide:generate type="summary" style="closing" transition="fade" -->
