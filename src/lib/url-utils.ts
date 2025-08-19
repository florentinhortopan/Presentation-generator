/**
 * Safely decode URL parameters with fallback handling
 */
export function safeDecodeURIComponent(encoded: string): string {
  if (!encoded) return '';
  
  try {
    // Try standard decoding first
    return decodeURIComponent(encoded);
  } catch (error) {
    console.warn('Standard URI decode failed, attempting manual decode:', error);
    
    try {
      // Manual hex decoding for malformed URLs
      return encoded.replace(/%([0-9A-F]{2})/gi, (match, hex) => {
        try {
          const charCode = parseInt(hex, 16);
          // Only decode printable ASCII characters to avoid issues
          if (charCode >= 32 && charCode <= 126) {
            return String.fromCharCode(charCode);
          }
          return match; // Keep original for non-printable chars
        } catch {
          return match;
        }
      });
    } catch (manualError) {
      console.warn('Manual decode also failed:', manualError);
      
      // Last resort: return the original string with basic cleanup
      return encoded.replace(/%/g, ''); // Remove % symbols that might cause issues
    }
  }
}

/**
 * Safely encode content for URL parameters
 */
export function safeEncodeURIComponent(content: string): string {
  if (!content) return '';
  
  try {
    return encodeURIComponent(content);
  } catch (error) {
    console.warn('URI encode failed, using base64 fallback:', error);
    
    try {
      // Fallback to base64 encoding if URI encoding fails
      return 'base64:' + btoa(unescape(encodeURIComponent(content)));
    } catch (base64Error) {
      console.error('Base64 encode also failed:', base64Error);
      return '';
    }
  }
}

/**
 * Safely decode content that might be base64 encoded
 */
export function safeDecodeContent(encoded: string): string {
  if (!encoded) return '';
  
  // Check if it's base64 encoded
  if (encoded.startsWith('base64:')) {
    try {
      const base64Content = encoded.substring(7); // Remove 'base64:' prefix
      return decodeURIComponent(escape(atob(base64Content)));
    } catch (error) {
      console.warn('Base64 decode failed:', error);
      return encoded;
    }
  }
  
  // Otherwise use safe URI decode
  return safeDecodeURIComponent(encoded);
}

/**
 * Validate if a string is a valid PRD format
 */
export function isValidPRDContent(content: string): boolean {
  if (!content || content.length < 10) return false;
  
  // Basic checks for PRD format
  const hasFrontmatter = content.startsWith('---') && content.includes('---\n');
  const hasTitle = content.includes('title:') || content.includes('# ');
  
  return hasFrontmatter || hasTitle;
}

/**
 * Clean and validate URL parameters for presentation loading
 */
export function processURLParameter(param: string | null): string | null {
  if (!param) return null;
  
  try {
    const decoded = safeDecodeContent(param);
    
    // Validate the content makes sense
    if (isValidPRDContent(decoded)) {
      return decoded;
    }
    
    console.warn('Decoded content does not appear to be valid PRD format');
    return null;
  } catch (error) {
    console.error('Failed to process URL parameter:', error);
    return null;
  }
}
