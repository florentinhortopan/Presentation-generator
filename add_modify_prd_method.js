const fs = require('fs');

let content = fs.readFileSync('src/lib/ai-slide-generator-v2.ts', 'utf8');

// Add the modifyPRD method
const modifyPRDMethod = `
  /**
   * Modify a PRD based on user description using AI
   */
  async modifyPRD(prdContent: string, modificationDescription: string): Promise<string> {
    console.log('🤖 Modifying PRD with description:', modificationDescription);
    
    const systemPrompt = \`You are an expert PRD (Product Requirements Document) editor. 
    
Your task is to modify the provided PRD based on the user's description while maintaining:
- The original structure and format
- All existing content unless specifically asked to remove
- The markdown formatting and frontmatter
- Professional tone and quality

MODIFICATION GUIDELINES:
- Add new slides/sections if requested
- Modify existing content based on the description
- Maintain consistent formatting
- Preserve all metadata (frontmatter)
- Keep the same slide structure and numbering
- Ensure the result is a valid markdown PRD

RESPONSE FORMAT:
Return ONLY the complete modified PRD content in markdown format.
Do not include any explanations or additional text outside the PRD content.\`;

    const userPrompt = \`Original PRD Content:
\${prdContent}

User's Modification Request:
\${modificationDescription}

Please modify the PRD according to the user's request and return the complete updated PRD content.\`;

    try {
      const response = await this.callOpenAI(systemPrompt, userPrompt);
      
      // Clean up the response to ensure it's just the PRD content
      let modifiedContent = response.trim();
      
      // Remove any markdown code block markers if present
      modifiedContent = modifiedContent.replace(/^```markdown\\n?/, '').replace(/\\n?```$/, '');
      
      // Ensure the content starts with frontmatter or a heading
      if (!modifiedContent.startsWith('---') && !modifiedContent.startsWith('#')) {
        throw new Error('AI response does not appear to be a valid PRD format');
      }
      
      console.log('✅ PRD modification completed successfully');
      return modifiedContent;
      
    } catch (error) {
      console.error('❌ PRD modification failed:', error);
      throw new Error(\`Failed to modify PRD: \${error instanceof Error ? error.message : 'Unknown error'}\`);
    }
  }
`;

// Add the method to the class
content = content.replace(
  /  \/\*\*\n   \* Create a beautiful fallback slide\n   \*\/\n  private createFallbackSlide\(content: string, slideNumber: number\): string \{[\s\S]*?\n  \}/,
  `  /**
   * Create a beautiful fallback slide
   */
  private createFallbackSlide(content: string, slideNumber: number): string {
    // ... existing code ...
  }

  ${modifyPRDMethod}`
);

fs.writeFileSync('src/lib/ai-slide-generator-v2.ts', content);
console.log('✅ Added modifyPRD method to AI generator!');
