export interface Recipe {
  id: string;
  title: string;
  description: string;
  content?: string; // Added content field for blog compatibility
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
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  datePublished: string;
  author: {
    name: string;
    image: string;
  };
  readTime: number; // in minutes
}

export interface SiteConfig {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  author: {
    name: string;
    email: string;
    image: string;
    bio: string;
  };
  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    pinterest?: string;
  };
}
