// Content modification utilities for internal linking

export interface InternalLinkInsert {
  keyword: string;
  url: string;
  recipeName: string;
}

/**
 * Insert internal links into content
 * @param content - The original content
 * @param linksToInsert - Array of links to insert
 * @returns Modified content with internal links
 */
export function insertInternalLinks(
  content: string, 
  linksToInsert: InternalLinkInsert[]
): string {
  let modifiedContent = content;
  
  linksToInsert.forEach(({ keyword, url, recipeName }) => {
    // Create case-insensitive regex that only matches whole words
    const regex = new RegExp(`\\b(${escapeRegex(keyword)})\\b`, 'gi');
    
    // Only replace the first occurrence to avoid over-linking
    let replaced = false;
    modifiedContent = modifiedContent.replace(regex, (match) => {
      if (!replaced && !isAlreadyLinked(modifiedContent, match)) {
        replaced = true;
        return `<a href="${url}" title="${recipeName}" class="internal-link text-green-600 hover:text-green-700 underline">${match}</a>`;
      }
      return match;
    });
  });
  
  return modifiedContent;
}

/**
 * Remove internal links from content
 * @param content - Content with internal links
 * @returns Clean content without internal links
 */
export function removeInternalLinks(content: string): string {
  // Remove internal links but keep the text content
  return content.replace(
    /<a[^>]*class="internal-link"[^>]*>(.*?)<\/a>/gi,
    '$1'
  );
}

/**
 * Extract current internal links from content
 * @param content - Content to analyze
 * @returns Array of current internal links
 */
export function extractInternalLinks(content: string): Array<{
  keyword: string;
  url: string;
  fullMatch: string;
}> {
  const links: Array<{ keyword: string; url: string; fullMatch: string }> = [];
  const regex = /<a[^>]*href="([^"]*)"[^>]*class="internal-link"[^>]*>(.*?)<\/a>/gi;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push({
      url: match[1],
      keyword: match[2],
      fullMatch: match[0]
    });
  }
  
  return links;
}

/**
 * Check if a keyword is already linked in the content
 * @param content - Content to check
 * @param keyword - Keyword to check
 * @returns True if already linked
 */
function isAlreadyLinked(content: string, keyword: string): boolean {
  const regex = new RegExp(`<a[^>]*>.*?${escapeRegex(keyword)}.*?</a>`, 'gi');
  return regex.test(content);
}

/**
 * Escape special regex characters
 * @param text - Text to escape
 * @returns Escaped text
 */
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate slug from text
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/[\s-]+/g, '-') // Replace spaces and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Suggest internal links based on content analysis
 * @param content - Content to analyze
 * @param availableRecipes - Available recipes for linking
 * @returns Suggested internal links
 */
export function suggestInternalLinks(
  content: string,
  availableRecipes: Array<{
    id: string;
    title: string;
    slug?: string;
    ingredients?: string[];
    tags?: string[];
    category?: string;
  }>
): InternalLinkInsert[] {
  const suggestions: InternalLinkInsert[] = [];
  const contentLower = content.toLowerCase();
  
  // Extract potential keywords from content
  const words = contentLower.match(/\b\w{4,}\b/g) || [];
  const uniqueWords = [...new Set(words)];
  
  availableRecipes.forEach(recipe => {
    // Check if recipe title or parts of it appear in content
    const titleWords = recipe.title.toLowerCase().split(/\s+/);
    
    titleWords.forEach(word => {
      if (word.length > 3 && uniqueWords.includes(word)) {
        const slug = recipe.slug || generateSlug(recipe.title);
        suggestions.push({
          keyword: word,
          url: `/recipes/${slug}`,
          recipeName: recipe.title
        });
      }
    });
    
    // Check ingredients
    if (recipe.ingredients) {
      recipe.ingredients.forEach(ingredient => {
        const ingredientWords = ingredient.toLowerCase().split(/\s+/);
        ingredientWords.forEach(word => {
          if (word.length > 3 && uniqueWords.includes(word)) {
            const slug = recipe.slug || generateSlug(recipe.title);
            suggestions.push({
              keyword: word,
              url: `/recipes/${slug}`,
              recipeName: recipe.title
            });
          }
        });
      });
    }
    
    // Check tags
    if (recipe.tags) {
      recipe.tags.forEach(tag => {
        if (tag.length > 3 && contentLower.includes(tag.toLowerCase())) {
          const slug = recipe.slug || generateSlug(recipe.title);
          suggestions.push({
            keyword: tag,
            url: `/recipes/${slug}`,
            recipeName: recipe.title
          });
        }
      });
    }
  });
  
  // Remove duplicates and limit suggestions
  const uniqueSuggestions = suggestions
    .filter((suggestion, index, self) => 
      index === self.findIndex(s => s.keyword === suggestion.keyword)
    )
    .slice(0, 10); // Limit to 10 suggestions
  
  return uniqueSuggestions;
}

const ContentModifier = {
  insertInternalLinks,
  removeInternalLinks,
  extractInternalLinks,
  generateSlug,
  suggestInternalLinks
};

export default ContentModifier;
