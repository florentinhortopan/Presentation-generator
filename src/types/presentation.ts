export interface PresentationTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: {
    title: string;
    subtitle: string;
    body: string;
    caption: string;
  };
  spacing: {
    section: string;
    paragraph: string;
  };
  animation: {
    duration: number;
    easing: string;
  };
}

export interface SlideContent {
  type: 'title' | 'content' | 'diagram' | 'image' | 'quote' | 'list';
  title?: string;
  subtitle?: string;
  content?: string;
  items?: string[];
  source?: string;
  figmaUrl?: string;
  asciiDiagram?: string;
}

export interface Slide {
  id: string;
  title: string;
  content: SlideContent[];
  notes?: string;
  transition?: 'fade' | 'slide' | 'zoom' | 'flip';
  slideType?: 'hero' | 'bullet' | 'list' | 'ascii' | 'image' | 'summary';
  slideStyle?: 'dark' | 'contrast' | 'accent' | 'showcase' | 'grid' | 'highlight' | 'callout' | 'closing';
  directives?: Record<string, string>;
  aiGeneratedHtml?: string; // AI-generated HTML content
}

export interface PresentationMeta {
  title: string;
  subtitle?: string;
  author: string;
  date?: string;
  version?: string;
  description?: string;
  theme: PresentationTheme;
  voice: {
    tone: 'professional' | 'casual' | 'technical' | 'creative' | 'minimal';
    style: 'formal' | 'conversational' | 'storytelling' | 'data-driven';
  };
}

export interface Presentation {
  meta: PresentationMeta;
  slides: Slide[];
}
