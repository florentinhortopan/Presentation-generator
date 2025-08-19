# AI Presentation Engine 🎯

Transform your PRD (Product Requirements Document) markdown files into beautiful, interactive presentations with dynamic theming and seamless Figma integration.

## Features ✨

- **Dynamic Theming**: Automatically adapts visual style based on PRD metadata
- **ASCII Diagram Support**: Beautiful rendering of technical diagrams with syntax highlighting
- **Figma Integration**: Embed Figma designs and prototypes directly in slides
- **Responsive Design**: Perfect for Mac displays with fullscreen support
- **Smooth Transitions**: Professional presentation experience with Framer Motion
- **Dark Mode Optimized**: Beautiful dark theme perfect for presentations
- **Keyboard Navigation**: Full keyboard support for seamless presenting

## Getting Started 🚀

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-pres

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## PRD Format 📝

Your PRD files should be markdown with YAML frontmatter. Here's the structure:

### Frontmatter Schema

```yaml
---
title: "Your Presentation Title"
subtitle: "Optional subtitle"
author: "Author Name"
date: "2024-01-15"
version: "1.0"
description: "Brief description"
theme:
  primaryColor: "hsl(210, 40%, 98%)"
  secondaryColor: "hsl(217, 91%, 60%)"
  backgroundColor: "hsl(224, 71%, 4%)"
  textColor: "hsl(210, 40%, 98%)"
  accentColor: "hsl(142, 76%, 36%)"
  fontFamily: "Inter, system-ui, sans-serif"
  fontSize:
    title: "3rem"
    subtitle: "1.5rem"
    body: "1.125rem"
    caption: "0.875rem"
voice:
  tone: "professional" # professional | casual | technical | creative | minimal
  style: "formal" # formal | conversational | storytelling | data-driven
---
```

### Content Structure

Separate slides using `---` or `## Slide` markers:

```markdown
# First Slide Title

Your slide content here...

---

# Second Slide Title

More content...
```

### Supported Content Types

#### Text Content
Regular markdown with emphasis, lists, and formatting.

#### ASCII Diagrams
Use code blocks with backticks or raw ASCII art:

```
┌─────────────────┐    ┌─────────────────┐
│   Component A   │───▶│   Component B   │
└─────────────────┘    └─────────────────┘
```

#### Figma Embeds
Include Figma links in your markdown:

```markdown
[Design System](https://www.figma.com/file/your-figma-url)
```

#### Quotes
Use markdown quote syntax:

```markdown
> "Great design is not just what it looks like and feels like. Design is how it works." — Steve Jobs
```

#### Lists
Standard markdown lists with automatic styling:

```markdown
- Feature 1
- Feature 2
- Feature 3
```

## Theming System 🎨

The presentation engine supports dynamic theming through the frontmatter. Each PRD can define its own:

- **Color Palette**: Primary, secondary, background, text, and accent colors
- **Typography**: Font family and size scale
- **Voice & Tone**: Affects content presentation style
- **Animation**: Transition timing and easing

### Example Themes

Check the `examples/` directory for:
- `minimal-design-prd.md` - Clean, monospace aesthetic
- `vibrant-startup-prd.md` - Bold, colorful startup vibe

## Keyboard Shortcuts ⌨️

When presenting:

- `→` or `Space` - Next slide
- `←` - Previous slide  
- `Home` - First slide
- `End` - Last slide
- `F` or `F11` - Toggle fullscreen
- `Esc` - Exit fullscreen

## Technology Stack 🛠️

- **Framework**: Next.js 14 with TypeScript
- **UI Components**: Shadcn/UI with Tailwind CSS
- **Animations**: Framer Motion
- **Parsing**: Gray Matter + Unified + Remark
- **Icons**: Lucide React

## Development 👩‍💻

### Project Structure

```
src/
├── app/                 # Next.js app router
├── components/
│   ├── ui/             # Shadcn UI components
│   └── presentation/   # Presentation-specific components
├── lib/                # Utilities and parsers
└── types/              # TypeScript definitions
```

### Key Components

- `PresentationViewer` - Main presentation container
- `SlideRenderer` - Renders individual slides with content types
- `AsciiDiagramRenderer` - Handles ASCII diagram styling
- `FigmaEmbed` - Manages Figma iframe embeds
- `PRDParser` - Parses markdown to presentation data

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap 🗺️

- [ ] Export to PDF/PowerPoint
- [ ] Collaborative editing
- [ ] Template library
- [ ] Analytics and engagement metrics
- [ ] API for programmatic generation
- [ ] Multi-language support

---

Built with ❤️ using Next.js, TypeScript, and Shadcn/UI