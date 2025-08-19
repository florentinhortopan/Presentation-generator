---
title: "AI & Design — Ten Slides to Kickstart"
author: "PUXA"
tone: "witty-professional"
primary_color: "#69F0AE"
secondary_color: "#40C4FF"
voice: "concise"
---

# 1) Title — AI & Design
AI is changing how we **research, ideate, prototype, and ship**. This deck maps the landscape and shows practical workflows you can adopt today.

- What’s different with AI
- Where it helps (and hurts)
- How to measure impact
- Guardrails that keep you safe

<!-- @slide:generate type="hero" style="dark" transition="fade" -->

---

# 2) Why AI Now
- Foundation models lower the cost of exploration and iteration
- Designers can test more directions with fewer handoffs
- Engineering gets clearer specs from generative prototypes
- Teams move from *document-first* to *experience-first* collaboration

<!-- @slide:generate type="bullet" style="contrast" transition="fade" -->

---

# 3) Roles of AI in the Design Process
- **Research Assistant** — collects and clusters insights
- **Ideation Partner** — generates variations, styles, and narratives
- **Critic** — flags inconsistencies, accessibility, and edge cases
- **Curator** — ranks options by goals, constraints, or brand voice

<!-- @slide:generate type="list" style="accent" transition="fade" -->

---

# 4) Before vs After (ASCII Workflow)
```
Before (Linear)
[ Brief ]
   |
   v
[ Wireframes ] -> [ Hi-Fi ] -> [ Spec Doc ] -> [ Slides ]
   |                |             |               |
   +-- Feedback ----+-------------+---------------+

After (AI-Accelerated)
[ Brief / PRD.md ]
       |
       v
[ Generative Drafts ] <-> [ Critiques / Fixes ]
       |
       v
[ PUXA: PRD → Slides ] -> [ Share / Iterate ]
```
Key shift: **single source of truth** (PRD) → *presentation-ready* artifacts.

<!-- @slide:generate type="ascii" style="grid" transition="slide" -->

---

# 5) The Design Data Flywheel (ASCII)
```
[ Usage Telemetry ] --> [ Insights ]
         ^                 |
         |                 v
[ Shipped UI ] <-- [ AI Proposals ] <-- [ PRD + Brand Tokens ]
         ^                                 |
         |---------------------------------|
                 (Feedback & Training)
```
Outcome: **each release improves the next** via structured feedback.

<!-- @slide:generate type="ascii" style="highlight" transition="slide" -->

---

# 6) UX Patterns for AI Features
- **Transparent suggestions** with accept/edit/why controls
- **Inline provenance** for sources, versions, and diffs
- **Safe defaults** with reversible actions and local previews
- **Latency masking**: optimistic UI, staged results
- **Escalation paths** from automation → manual control

<!-- @slide:generate type="bullet" style="contrast" transition="fade" -->

---

# 7) Risks & Guardrails
- **Hallucination** → verification steps, confidence labels
- **Bias & harm** → diverse datasets, bias tests, red-team reviews
- **Privacy** → on-device options, minimization, clear consent
- **Security** → input/output filtering, rate limits, audit trails
- **Sustainability** → measure cost/latency/energy per feature

<!-- @slide:generate type="list" style="callout" transition="fade" -->

---

# 8) Measuring Impact
- **Time-to-iterate** (idea → testable mock)
- **Spec clarity score** (ambiguity, TODOs, contradictions)
- **Prototype coverage** (edge cases, a11y, locales)
- **User task success** & **time-on-task**
- **Adoption** of AI-assisted flows vs manual baselines

<!-- @slide:generate type="list" style="accent" transition="fade" -->

---

# 9) Case Study: PRD → Slides with PUXA
1. Write the PRD in Markdown with slide hooks
2. Paste into the app and **Generate**
3. OpenAI returns **HTML sections** and a player
4. Share the URL; iterate on content, auto-regenerate

![Figma Frame](https://via.placeholder.com/1200x650.png?text=Figma+Frame+Export)

<!-- @slide:generate type="image" style="showcase" transition="slide" -->

---

# 10) What To Do Next (Summary)
- Start with **one** flow: research or prototyping
- Establish **metrics** and a weekly review ritual
- Pilot with real users; collect **provenance + feedback**
- Bake guardrails into UI—not policy docs alone
- Let the **PRD be the product**—source of truth for content and slides

**Call to action:** Turn this PRD into a deck with PUXA and present it to your team this week.

<!-- @slide:generate type="summary" style="closing" transition="flip" -->
