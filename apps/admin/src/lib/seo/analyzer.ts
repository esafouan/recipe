// SEO Data type for analysis
interface SEOData {
  title: string;
  seoTitle?: string;
  description: string;
  seoDescription?: string;
  content?: string;
  tags?: string[];
  seoKeywords?: string[];
  ingredients?: string[];
  instructions?: string[];
  category?: string;
  imageUrl?: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  difficulty?: string;
  nutrition?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
    [key: string]: unknown;
  };
}

export interface SEOAnalysis {
  score: number; // 0-100
  issues: SEOIssue[];
  suggestions: SEOSuggestion[];
  checklist: SEOChecklistItem[];
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'title' | 'description' | 'keywords' | 'content' | 'images' | 'structure';
  message: string;
  impact: 'high' | 'medium' | 'low';
}

export interface SEOSuggestion {
  category: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SEOChecklistItem {
  check: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
}

export class SEOAnalyzer {
  // Analyze a recipe post for SEO
  static analyzeRecipe(data: {
    title: string;
    description: string;
    content?: string;
    tags?: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    ingredients?: string[];
    instructions?: string[];
    category?: string;
    imageUrl?: string;
    servings?: number;
    prepTime?: number;
    cookTime?: number;
    totalTime?: number;
    difficulty?: string;
    nutrition?: Record<string, unknown>;
  }): SEOAnalysis {
    const issues: SEOIssue[] = [];
    const suggestions: SEOSuggestion[] = [];
    const checklist: SEOChecklistItem[] = [];

    // Analyze different SEO aspects
    this.analyzeTitleSEO(data, issues, suggestions, checklist);
    this.analyzeDescriptionSEO(data, issues, suggestions, checklist);
    this.analyzeKeywordsSEO(data, issues, suggestions, checklist);
    this.analyzeContentSEO(data, issues, suggestions, checklist);
    this.analyzeImagesSEO(data, issues, suggestions);
    this.analyzeStructureSEO(data, issues, suggestions);

    // Calculate overall score
    const score = this.calculateOverallScore(issues, checklist);

    return {
      score,
      issues,
      suggestions,
      checklist
    };
  }

  private static analyzeTitleSEO(
    data: SEOData,
    issues: SEOIssue[],
    suggestions: SEOSuggestion[],
    checklist: SEOChecklistItem[]
  ): void {
    const title = data.seoTitle || data.title;
    const titleLength = title.length;

    // Title length check
    if (titleLength < 30) {
      issues.push({
        type: 'warning',
        category: 'title',
        message: 'Title is too short. Recommended length is 30-60 characters.',
        impact: 'medium'
      });
      checklist.push({
        check: 'Title Length',
        status: 'warning',
        description: `Title is ${titleLength} characters (recommended: 30-60)`
      });
    } else if (titleLength > 60) {
      issues.push({
        type: 'error',
        category: 'title',
        message: 'Title is too long. It may be truncated in search results.',
        impact: 'high'
      });
      checklist.push({
        check: 'Title Length',
        status: 'fail',
        description: `Title is ${titleLength} characters (recommended: 30-60)`
      });
    } else {
      checklist.push({
        check: 'Title Length',
        status: 'pass',
        description: `Title is ${titleLength} characters (optimal)`
      });
    }

    // Title keyword optimization
    const hasKeywords = data.tags && data.tags.some(tag => 
      title.toLowerCase().includes(tag.toLowerCase())
    );

    if (!hasKeywords) {
      suggestions.push({
        category: 'Title Optimization',
        suggestion: 'Include relevant keywords from your tags in the title for better SEO.',
        priority: 'medium'
      });
    }

    // Recipe-specific title suggestions
    if (!title.toLowerCase().includes('recipe')) {
      suggestions.push({
        category: 'Recipe SEO',
        suggestion: 'Consider including the word "recipe" in your title for better recipe search visibility.',
        priority: 'medium'
      });
    }
  }

  private static analyzeDescriptionSEO(
    data: SEOData,
    issues: SEOIssue[],
    suggestions: SEOSuggestion[],
    checklist: SEOChecklistItem[]
  ): void {
    const description = data.seoDescription || data.description;
    const descLength = description.length;

    // Description length check
    if (descLength < 120) {
      issues.push({
        type: 'warning',
        category: 'description',
        message: 'Meta description is too short. Recommended length is 120-160 characters.',
        impact: 'medium'
      });
      checklist.push({
        check: 'Meta Description Length',
        status: 'warning',
        description: `Description is ${descLength} characters (recommended: 120-160)`
      });
    } else if (descLength > 160) {
      issues.push({
        type: 'error',
        category: 'description',
        message: 'Meta description is too long. It may be truncated in search results.',
        impact: 'high'
      });
      checklist.push({
        check: 'Meta Description Length',
        status: 'fail',
        description: `Description is ${descLength} characters (recommended: 120-160)`
      });
    } else {
      checklist.push({
        check: 'Meta Description Length',
        status: 'pass',
        description: `Description is ${descLength} characters (optimal)`
      });
    }

    // Keywords in description
    const hasKeywords = data.seoKeywords && data.seoKeywords.length > 0 && 
      data.seoKeywords.some(keyword => 
        description.toLowerCase().includes(keyword.toLowerCase())
      );

    if (!hasKeywords && data.seoKeywords && data.seoKeywords.length > 0) {
      suggestions.push({
        category: 'Description Optimization',
        suggestion: 'Include your target keywords naturally in the meta description.',
        priority: 'high'
      });
    }
  }

  private static analyzeKeywordsSEO(
    data: SEOData,
    issues: SEOIssue[],
    suggestions: SEOSuggestion[],
    checklist: SEOChecklistItem[]
  ): void {
    const keywords = data.seoKeywords || [];
    const tags = data.tags || [];

    if (keywords.length === 0) {
      issues.push({
        type: 'warning',
        category: 'keywords',
        message: 'No SEO keywords defined. Add relevant keywords for better search visibility.',
        impact: 'medium'
      });
      checklist.push({
        check: 'SEO Keywords',
        status: 'warning',
        description: 'No SEO keywords defined'
      });
    } else {
      checklist.push({
        check: 'SEO Keywords',
        status: 'pass',
        description: `${keywords.length} SEO keywords defined`
      });
    }

    if (tags.length === 0) {
      issues.push({
        type: 'warning',
        category: 'keywords',
        message: 'No tags defined. Tags help with categorization and SEO.',
        impact: 'medium'
      });
    }

    // Keyword density analysis would go here for content
    if (data.content && keywords.length > 0) {
      const content = data.content.toLowerCase();
      const overOptimized = keywords.some(keyword => {
        const matches = (content.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        const density = (matches / content.split(' ').length) * 100;
        return density > 3; // More than 3% keyword density
      });

      if (overOptimized) {
        issues.push({
          type: 'warning',
          category: 'keywords',
          message: 'Keyword density may be too high. Use keywords naturally.',
          impact: 'medium'
        });
      }
    }
  }

  private static analyzeContentSEO(
    data: SEOData,
    issues: SEOIssue[],
    suggestions: SEOSuggestion[],
    checklist: SEOChecklistItem[]
  ): void {
    const content = data.content || '';
    const wordCount = content.split(' ').filter(word => word.length > 0).length;

    if (wordCount < 300) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Content is too short. Aim for at least 300 words for better SEO.',
        impact: 'medium'
      });
      checklist.push({
        check: 'Content Length',
        status: 'warning',
        description: `${wordCount} words (recommended: 300+)`
      });
    } else {
      checklist.push({
        check: 'Content Length',
        status: 'pass',
        description: `${wordCount} words`
      });
    }

    // Recipe-specific content checks
    if (data.ingredients && data.ingredients.length > 0) {
      checklist.push({
        check: 'Recipe Ingredients',
        status: 'pass',
        description: `${data.ingredients.length} ingredients listed`
      });
    } else {
      checklist.push({
        check: 'Recipe Ingredients',
        status: 'fail',
        description: 'No ingredients listed'
      });
    }

    if (data.instructions && data.instructions.length > 0) {
      checklist.push({
        check: 'Recipe Instructions',
        status: 'pass',
        description: `${data.instructions.length} instruction steps`
      });
    } else {
      checklist.push({
        check: 'Recipe Instructions',
        status: 'fail',
        description: 'No instructions provided'
      });
    }

    // Recipe metadata
    if (data.prepTime && data.cookTime) {
      checklist.push({
        check: 'Recipe Times',
        status: 'pass',
        description: `Prep: ${data.prepTime}min, Cook: ${data.cookTime}min`
      });
    } else {
      checklist.push({
        check: 'Recipe Times',
        status: 'warning',
        description: 'Missing prep or cook time information'
      });
    }
  }

  private static analyzeImagesSEO(
    data: SEOData,
    issues: SEOIssue[],
    suggestions: SEOSuggestion[]
  ): void {
    if (!data.imageUrl) {
      issues.push({
        type: 'error',
        category: 'images',
        message: 'No featured image. Images are crucial for recipe SEO and social sharing.',
        impact: 'high'
      });
    }

    suggestions.push({
      category: 'Image SEO',
      suggestion: 'Ensure your recipe images have descriptive alt text and are optimized for web.',
      priority: 'medium'
    });
  }

  private static analyzeStructureSEO(
    data: SEOData,
    issues: SEOIssue[],
    suggestions: SEOSuggestion[]
  ): void {
    // Recipe structured data suggestions
    suggestions.push({
      category: 'Structured Data',
      suggestion: 'Recipe structured data (JSON-LD) should be implemented for rich snippets in search results.',
      priority: 'high'
    });

    if (!data.category) {
      issues.push({
        type: 'warning',
        category: 'structure',
        message: 'No category assigned. Categories help with site organization and SEO.',
        impact: 'medium'
      });
    }

    // Recipe-specific structured data requirements
    const requiredFields = ['prepTime', 'cookTime', 'servings'];
    const missingFields = requiredFields.filter(field => !data[field as keyof SEOData]);

    if (missingFields.length > 0) {
      issues.push({
        type: 'warning',
        category: 'structure',
        message: `Missing recipe metadata: ${missingFields.join(', ')}. These are important for recipe structured data.`,
        impact: 'medium'
      });
    }
  }

  private static calculateOverallScore(issues: SEOIssue[], checklist: SEOChecklistItem[]): number {
    let score = 100;

    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.impact) {
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    // Calculate checklist score
    const checklistScores = checklist.map(item => {
      switch (item.status) {
        case 'pass': return 100;
        case 'warning': return 70;
        case 'fail': return 50;
        default: return 0;
      }
    });

    if (checklistScores.length > 0) {
      const checklistAverage = Math.round(
        checklistScores.reduce((a: number, b: number) => a + b, 0) / checklistScores.length
      );
      score = Math.round((score + checklistAverage) / 2);
    }

    return Math.max(0, Math.min(100, score));
  }

  // Helper method for blog posts (non-recipe content)
  static analyzeBlogPost(data: {
    title: string;
    description: string;
    content: string;
    tags?: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    category?: string;
    imageUrl?: string;
    nutrition?: Record<string, unknown>;
  }): SEOAnalysis {
    return this.analyzeRecipe(data);
  }
}
