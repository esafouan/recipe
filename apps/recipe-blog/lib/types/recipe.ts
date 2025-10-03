// Recipe types matching the admin interface
export interface FirebaseRecipe {
  id: string;
  title: string;
  description: string;
  featuredImage: string;
  category: string;
  tags: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  totalTime: number; // in minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number; // in grams
    carbs: number; // in grams
    fat: number; // in grams
    fiber: number; // in grams
  };
  faqs: {
    question: string;
    answer: string;
  }[];
  datePublished: string;
  author: {
    name: string;
    image: string;
  };
  rating: {
    value: number;
    count: number;
  };
  // Additional fields for SEO
  slug?: string;
  keywords?: string[];
  isPublished?: boolean;
  publishedAt?: Date;
  updatedAt?: Date;
}

// Type for our recipe archive display (converting from Firebase format)
export interface BlogRecipe {
  id: string;
  slug: string;
  title: string;
  name: string; // For schema.org
  description: string;
  image: string;
  category: string;
  cuisine: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  rating: number;
  reviewCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  dietary: string[];
  keywords: string[];
  author: {
    "@type": "Person";
    name: string;
  };
  datePublished: string;
  recipeIngredient: string[];
  recipeInstructions: Array<{
    "@type": "HowToStep";
    text: string;
  }>;
  nutrition: {
    "@type": "NutritionInformation";
    calories: string;
    proteinContent: string;
    carbohydrateContent: string;
    fatContent: string;
    fiberContent: string;
    sodiumContent: string;
  };
  aggregateRating: {
    "@type": "AggregateRating";
    ratingValue: string;
    reviewCount: string;
  };
  equipment: string[];
  tips: string[];
  // Enhanced fields for better content utilization
  content?: string; // Blog content for better engagement
  notes?: string; // Recipe notes
  faqs?: Array<{
    question: string;
    answer: string;
  }>; // FAQ section for better SEO and user engagement
  // ISO format fields for schema
  prepTimeISO: string;
  cookTimeISO: string;
  totalTimeISO: string;
  recipeYield: string;
  recipeCategory: string;
  recipeCuisine: string;
}

export type RecipeCategory = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'healthy' ;
