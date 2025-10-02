// AI Recipe Generator using OpenRouter API exclusively
import { CATEGORY_NAMES, type CategoryName } from '../../constants/categories';

export interface RecipeGenerationRequest {
  recipeName: string;
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  category?: CategoryName;
  dietaryRestrictions?: string[];
  cookingTime?: number;
  cuisine?: string;
  focusKeyword?: string;
  additionalRequirements?: string;
  // New: Smart auto-generation mode
  autoGenerate?: boolean;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  notes: string;
  author: string;
  datePublished: string;
  // SEO fields required by Firebase
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  nutrition: {
    calories: string;
    fatContent: string;
    carbohydrateContent: string;
    proteinContent: string;
    fiberContent: string;
  };
  aggregateRating: {
    ratingValue: string;
    reviewCount: string;
  };
  faq: Array<{
    name: string;
    acceptedAnswer: {
      text: string;
    };
  }>;
}

export class AIRecipeGenerator {
  private apiKey: string;
  private modelId: string;

  constructor(apiKey: string, modelId: string = 'anthropic/claude-3.5-sonnet') {
    this.apiKey = apiKey;
    this.modelId = modelId;
  }

  // Generate complete recipe using AI
  async generateRecipe(request: RecipeGenerationRequest): Promise<GeneratedRecipe> {
    const prompt = this.buildPrompt(request);
    
    try {
      const response = await this.callOpenRouter(prompt);
      return this.parseRecipeResponse(response);
    } catch (error) {
      console.error('Recipe generation failed:', error);
      throw new Error('Failed to generate recipe. Please try again.');
    }
  }

  private buildPrompt(request: RecipeGenerationRequest): string {
    const {
      recipeName,
      servings = 2,
      difficulty = 'Easy',
      category = 'Dinner',
      dietaryRestrictions = [],
      cookingTime = 30,
      cuisine = 'American',
      focusKeyword = '',
      additionalRequirements = ''
    } = request;

    return `Create a complete recipe for "${recipeName}" with the following requirements:

Recipe Details:
- Servings: ${servings}
- Difficulty: ${difficulty}
- Category: ${category}
- Cooking Time: ${cookingTime} minutes
- Cuisine: ${cuisine}
${dietaryRestrictions.length > 0 ? `- Dietary Restrictions: ${dietaryRestrictions.join(', ')}` : ''}
${focusKeyword ? `- Focus Keyword: ${focusKeyword}` : ''}
${additionalRequirements ? `- Additional Requirements: ${additionalRequirements}` : ''}

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Recipe title here",
  "description": "Brief description (1-2 sentences)",
  "content": "Detailed blog post content about the recipe (2-3 paragraphs)",
  "category": "${category}",
  "tags": ["tag1", "tag2", "tag3"],
  "prepTime": 15,
  "cookTime": ${cookingTime},
  "servings": ${servings},
  "difficulty": "${difficulty}",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "notes": "Additional tips and notes",
  "author": "Mini Recipe Chef",
  "datePublished": "${new Date().toISOString().split('T')[0]}",
  "seoTitle": "SEO-optimized title (50-60 characters)",
  "seoDescription": "SEO meta description (150-160 characters)",
  "seoKeywords": ["keyword1", "keyword2", "keyword3"],
  "nutrition": {
    "calories": "300",
    "fatContent": "15g",
    "carbohydrateContent": "25g",
    "proteinContent": "20g",
    "fiberContent": "5g"
  },
  "aggregateRating": {
    "ratingValue": "4.5",
    "reviewCount": "12"
  },
  "faq": [
    {
      "name": "Can I make this ahead of time?",
      "acceptedAnswer": {
        "text": "Answer here"
      }
    }
  ]
}

IMPORTANT: The category must be one of these exact values: ${CATEGORY_NAMES.join(', ')}

Requirements:
- Make this a small-batch recipe perfect for 1-2 people
- Focus on minimal waste and perfect portions
- Include practical cooking tips
- Ensure all measurements are appropriate for the serving size
- Create engaging, helpful content
- Include fiber content in nutrition
- Generate 2-3 practical FAQs`;
  }

  private async callOpenRouter(prompt: string): Promise<string> {
    const model = this.modelId || 'anthropic/claude-3.5-sonnet';
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Recipe Blog AI Generator'
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional recipe developer. Respond with ONLY valid JSON - no explanations, no markdown, no extra text. Start with { and end with }.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || 'Unknown error';
      
      if (errorMessage.includes('credits') || errorMessage.includes('max_tokens')) {
        throw new Error('Not enough credits for this request. Please add credits at https://openrouter.ai/settings/credits');
      }
      
      throw new Error(`OpenRouter API error: ${response.statusText} - ${errorMessage}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);
    console.log('Response length:', aiResponse?.length);
    
    return aiResponse;
  }

  private parseRecipeResponse(response: string): GeneratedRecipe {
    try {
      console.log('Raw AI Response:', response);
      
      // Clean the response
      const cleanedResponse = response.trim();
      
      // Find JSON content
      let jsonStr = '';
      if (cleanedResponse.startsWith('{')) {
        jsonStr = cleanedResponse;
      } else {
        const firstBrace = cleanedResponse.indexOf('{');
        const lastBrace = cleanedResponse.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonStr = cleanedResponse.substring(firstBrace, lastBrace + 1);
        }
      }
      
      if (!jsonStr) {
        throw new Error('No JSON found in response');
      }

      const recipe = JSON.parse(jsonStr);
      
      // Validate required fields for recipe structure
      const requiredFields = [
        'title', 'description', 'content', 'category', 'tags',
        'prepTime', 'cookTime', 'servings', 'difficulty',
        'ingredients', 'instructions', 'notes', 'author', 'datePublished',
        'seoTitle', 'seoDescription', 'seoKeywords',
        'nutrition', 'aggregateRating', 'faq'
      ];

      for (const field of requiredFields) {
        if (!(field in recipe)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate nested objects
      if (!recipe.nutrition || typeof recipe.nutrition !== 'object') {
        throw new Error('Missing or invalid nutrition object');
      }

      // Check for required nutrition fields including fiber
      const requiredNutrition = ['calories', 'fatContent', 'carbohydrateContent', 'proteinContent', 'fiberContent'];
      for (const nutrient of requiredNutrition) {
        if (!(nutrient in recipe.nutrition)) {
          throw new Error(`Missing nutrition field: ${nutrient}`);
        }
      }

      if (!recipe.aggregateRating || typeof recipe.aggregateRating !== 'object') {
        throw new Error('Missing or invalid aggregateRating object');
      }

      if (!Array.isArray(recipe.faq)) {
        throw new Error('FAQ must be an array');
      }

      if (!Array.isArray(recipe.seoKeywords)) {
        throw new Error('SEO keywords must be an array');
      }

      return recipe as GeneratedRecipe;
    } catch (error) {
      console.error('Failed to parse recipe response:', error);
      throw error;
    }
  }
}

// Utility function to create generator instance
export function createRecipeGenerator(
  apiKey: string, 
  modelId: string = 'anthropic/claude-3.5-sonnet'
): AIRecipeGenerator {
  return new AIRecipeGenerator(apiKey, modelId);
}

export default AIRecipeGenerator;
