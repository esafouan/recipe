// Recipe data helpers that fetch from Firebase with static fallback
import { RecipeService } from './firebase/recipes';
import { type BlogRecipe, type RecipeCategory } from './types/recipe';
import { debugDatabase } from './firebase/debug';

// Static fallback data for development/offline mode
const fallbackRecipes: BlogRecipe[] = [
  {
    id: "1",
    slug: "mini-chocolate-chip-pancakes",
    title: "Mini Chocolate Chip Pancakes",
    name: "Mini Chocolate Chip Pancakes",
    description: "Fluffy mini pancakes with chocolate chips, perfect for 1-2 servings. Quick breakfast that won't leave you with leftovers.",
    image: "/chocolate-chip-cookies-golden-brown.jpg",
    category: "Breakfast",
    cuisine: "American",
    prepTime: 5,
    cookTime: 10,
    totalTime: 15,
    servings: 2,
    rating: 4.8,
    reviewCount: 24,
    difficulty: "Easy",
    dietary: ["Vegetarian"],
    keywords: ["pancakes", "breakfast", "chocolate", "mini", "quick"],
    author: {
      "@type": "Person",
      name: "Mini Recipe Chef"
    },
    datePublished: "2024-01-15",
    recipeIngredient: [
      "1/2 cup all-purpose flour",
      "1 tablespoon sugar",
      "1/2 teaspoon baking powder",
      "1/4 teaspoon salt",
      "1/3 cup milk",
      "1 egg",
      "1 tablespoon melted butter",
      "2 tablespoons mini chocolate chips"
    ],
    recipeInstructions: [
      {
        "@type": "HowToStep",
        text: "Mix dry ingredients in a bowl"
      },
      {
        "@type": "HowToStep",
        text: "Whisk wet ingredients separately"
      },
      {
        "@type": "HowToStep",
        text: "Combine wet and dry ingredients, fold in chocolate chips"
      },
      {
        "@type": "HowToStep",
        text: "Cook small pancakes on griddle for 2-3 minutes per side"
      }
    ],
    nutrition: {
      "@type": "NutritionInformation",
      calories: "285",
      proteinContent: "8g",
      carbohydrateContent: "42g",
      fatContent: "9g",
      fiberContent: "2g",
      sodiumContent: "320mg"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "24"
    },
    equipment: ["Non-stick pan", "Mixing bowls", "Whisk"],
    tips: ["Don't overmix the batter", "Use a small ladle for even-sized pancakes"],
    prepTimeISO: "PT5M",
    cookTimeISO: "PT10M",
    totalTimeISO: "PT15M",
    recipeYield: "2 servings",
    recipeCategory: "Breakfast",
    recipeCuisine: "American"
  },
  {
    id: "2",
    slug: "single-serving-pasta-primavera",
    title: "Single Serving Pasta Primavera",
    name: "Single Serving Pasta Primavera",
    description: "Fresh vegetable pasta for one person. Light, healthy, and perfectly portioned with seasonal vegetables.",
    image: "/creamy-pasta-dish-with-herbs.jpg",
    category: "Lunch",
    cuisine: "Italian",
    prepTime: 10,
    cookTime: 15,
    totalTime: 25,
    servings: 1,
    rating: 4.6,
    reviewCount: 18,
    difficulty: "Easy",
    dietary: ["Vegetarian", "Healthy"],
    keywords: ["pasta", "vegetables", "healthy", "single serving", "lunch"],
    author: {
      "@type": "Person",
      name: "Mini Recipe Chef"
    },
    datePublished: "2024-01-20",
    recipeIngredient: [
      "2 oz pasta (about 1/2 cup dry)",
      "1/4 cup cherry tomatoes, halved",
      "1/4 cup zucchini, diced",
      "2 tablespoons bell pepper, diced",
      "1 clove garlic, minced",
      "1 tablespoon olive oil",
      "2 tablespoons grated Parmesan",
      "Salt and pepper to taste",
      "Fresh basil leaves"
    ],
    recipeInstructions: [
      {
        "@type": "HowToStep",
        text: "Cook pasta according to package directions"
      },
      {
        "@type": "HowToStep",
        text: "Heat olive oil in pan, sauté vegetables until tender"
      },
      {
        "@type": "HowToStep",
        text: "Add cooked pasta to vegetables"
      },
      {
        "@type": "HowToStep",
        text: "Toss with Parmesan and fresh basil"
      }
    ],
    nutrition: {
      "@type": "NutritionInformation",
      calories: "320",
      proteinContent: "12g",
      carbohydrateContent: "45g",
      fatContent: "11g",
      fiberContent: "4g",
      sodiumContent: "180mg"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.6",
      reviewCount: "18"
    },
    equipment: ["Medium saucepan", "Skillet", "Colander"],
    tips: ["Use seasonal vegetables for best flavor", "Save pasta water to adjust consistency"],
    prepTimeISO: "PT10M",
    cookTimeISO: "PT15M",
    totalTimeISO: "PT25M",
    recipeYield: "1 serving",
    recipeCategory: "Lunch",
    recipeCuisine: "Italian"
  }
];

const fallbackCategories = ["Breakfast", "Lunch", "Dinner", "Dessert", "Healthy"];

// Cache for recipes to avoid repeated Firebase calls
let recipesCache: BlogRecipe[] | null = null;
let categoriesCache: string[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function isCacheValid(): boolean {
  return recipesCache !== null && (Date.now() - cacheTimestamp) < CACHE_DURATION;
}

function clearCache(): void {
  recipesCache = null;
  categoriesCache = null;
  cacheTimestamp = 0;
}

// Main functions to get recipes from Firebase with fallback
export async function getAllRecipes(): Promise<BlogRecipe[]> {
  // Return cached data if valid
  if (isCacheValid() && recipesCache) {
    return recipesCache;
  }

  try {
    console.log('Fetching recipes from Firebase...');
    
    // Debug: Check what's in the database
    await debugDatabase();
    
    const recipes = await RecipeService.getAllRecipes();
    
    if (recipes.length > 0) {
      // Update cache
      recipesCache = recipes;
      cacheTimestamp = Date.now();
      console.log(`Successfully fetched ${recipes.length} recipes from Firebase`);
      return recipes;
    } else {
      console.log('No recipes found in Firebase database');
      return []; // Return empty array instead of fallback
    }
  } catch (error) {
    console.error('Error fetching recipes from Firebase:', error);
    console.log('Returning empty array due to error');
    return []; // Return empty array instead of fallback
  }
}

export async function getAllCategories(): Promise<string[]> {
  // Return cached data if valid
  if (isCacheValid() && categoriesCache) {
    return categoriesCache;
  }

  try {
    console.log('Fetching categories from Firebase...');
    const categories = await RecipeService.getAvailableCategories();
    
    if (categories.length > 0) {
      // Update cache
      categoriesCache = categories;
      cacheTimestamp = Date.now();
      console.log(`Successfully fetched ${categories.length} categories from Firebase`);
      return categories;
    } else {
      console.log('No categories found in Firebase database, using fallback data');
      return fallbackCategories;
    }
  } catch (error) {
    console.error('Error fetching categories from Firebase:', error);
    console.log('Using fallback category data due to error');
    return fallbackCategories;
  }
}

export async function getRecipesByCategory(category: RecipeCategory): Promise<BlogRecipe[]> {
  try {
    console.log(`Fetching recipes for category: ${category}`);
    const recipes = await RecipeService.getRecipesByCategory(category);
    
    if (recipes.length > 0) {
      console.log(`Successfully fetched ${recipes.length} recipes for category: ${category}`);
      return recipes;
    } else {
      // Fallback: filter static recipes by category
      console.log(`No recipes found for category ${category} in Firebase, using fallback data`);
      return fallbackRecipes.filter(recipe => 
        recipe.category.toLowerCase() === category.toLowerCase()
      );
    }
  } catch (error) {
    console.error(`Error fetching recipes for category ${category}:`, error);
    // Fallback: filter static recipes by category
    return fallbackRecipes.filter(recipe => 
      recipe.category.toLowerCase() === category.toLowerCase()
    );
  }
}

export async function getRecipeBySlug(slug: string): Promise<BlogRecipe | null> {
  try {
    console.log(`Fetching recipe by slug: ${slug}`);
    const recipe = await RecipeService.getRecipeBySlug(slug);
    
    if (recipe) {
      console.log(`Successfully fetched recipe: ${recipe.title}`);
      return recipe;
    } else {
      // Fallback: search static recipes
      console.log(`No recipe found for slug ${slug} in Firebase, searching fallback data`);
      return fallbackRecipes.find(recipe => recipe.slug === slug) || null;
    }
  } catch (error) {
    console.error(`Error fetching recipe by slug ${slug}:`, error);
    // Fallback: search static recipes
    return fallbackRecipes.find(recipe => recipe.slug === slug) || null;
  }
}

export async function getRecipeById(id: string): Promise<BlogRecipe | null> {
  try {
    console.log(`Fetching recipe by ID: ${id}`);
    const recipe = await RecipeService.getRecipeById(id);
    
    if (recipe) {
      console.log(`Successfully fetched recipe: ${recipe.title}`);
      return recipe;
    } else {
      // Fallback: search static recipes
      console.log(`No recipe found for ID ${id} in Firebase, searching fallback data`);
      return fallbackRecipes.find(recipe => recipe.id === id) || null;
    }
  } catch (error) {
    console.error(`Error fetching recipe by ID ${id}:`, error);
    // Fallback: search static recipes
    return fallbackRecipes.find(recipe => recipe.id === id) || null;
  }
}

export async function searchRecipes(searchTerm: string): Promise<BlogRecipe[]> {
  try {
    console.log(`Searching recipes for: ${searchTerm}`);
    const recipes = await RecipeService.searchRecipes(searchTerm);
    
    if (recipes.length > 0) {
      console.log(`Found ${recipes.length} recipes matching: ${searchTerm}`);
      return recipes;
    } else {
      // Fallback: search static recipes
      console.log(`No search results found in Firebase for: ${searchTerm}, searching fallback data`);
      const searchTermLower = searchTerm.toLowerCase();
      return fallbackRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTermLower) ||
        recipe.description.toLowerCase().includes(searchTermLower) ||
        recipe.keywords.some(keyword => keyword.toLowerCase().includes(searchTermLower))
      );
    }
  } catch (error) {
    console.error(`Error searching recipes for ${searchTerm}:`, error);
    // Fallback: search static recipes
    const searchTermLower = searchTerm.toLowerCase();
    return fallbackRecipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTermLower) ||
      recipe.description.toLowerCase().includes(searchTermLower) ||
      recipe.keywords.some(keyword => keyword.toLowerCase().includes(searchTermLower))
    );
  }
}

export async function getFeaturedRecipes(limit: number = 6): Promise<BlogRecipe[]> {
  try {
    console.log(`Fetching ${limit} featured recipes`);
    const recipes = await RecipeService.getFeaturedRecipes(limit);
    
    if (recipes.length > 0) {
      console.log(`Successfully fetched ${recipes.length} featured recipes`);
      return recipes;
    } else {
      // No featured recipes found
      console.log('No featured recipes found in Firebase');
      return [];
    }
  } catch (error) {
    console.error('Error fetching featured recipes:', error);
    // Return empty array on error
    return [];
  }
}

export async function getRecentRecipes(limit: number = 10): Promise<BlogRecipe[]> {
  try {
    console.log(`Fetching ${limit} recent recipes`);
    const recipes = await RecipeService.getRecentRecipes(limit);
    
    if (recipes.length > 0) {
      console.log(`Successfully fetched ${recipes.length} recent recipes`);
      return recipes;
    } else {
      // No recent recipes found
      console.log('No recent recipes found in Firebase');
      return [];
    }
  } catch (error) {
    console.error('Error fetching recent recipes:', error);
    // Return empty array on error
    return [];
  }
}

// Utility function to manually refresh cache
export function refreshRecipeCache(): void {
  console.log('Manually clearing recipe cache');
  clearCache();
}
