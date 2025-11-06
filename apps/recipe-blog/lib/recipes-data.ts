// Recipe data helpers with API-based data fetching
import { db } from './firebase/config';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';

// Type definitions
interface BlogRecipe {
  id: string;
  slug: string;
  title: string;
  name: string;
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
  difficulty: string;
  dietary: string[];
  keywords: string[];
  author: {
    "@type": string;
    name: string;
  };
  datePublished: string;
  recipeIngredient: string[];
  recipeInstructions: Array<{
    "@type": string;
    text: string;
  }>;
  nutrition: {
    "@type": string;
    calories: string;
    proteinContent: string;
    carbohydrateContent: string;  
    fatContent: string;
    fiberContent: string;
    sodiumContent: string;
  };
  aggregateRating: {
    "@type": string;
    ratingValue: string;
    reviewCount: string;
  };
  equipment: string[];
  tips: string[];
  prepTimeISO: string;
  cookTimeISO: string;
  totalTimeISO: string;
  recipeYield: string;
  recipeCategory: string;
  recipeCuisine: string;
}

type RecipeCategory = string;

// Helper function to convert Firestore document to BlogRecipe
function convertFirestoreToRecipe(doc: any): BlogRecipe {
  const data = doc.data();
  return {
    id: doc.id,
    slug: data.slug || '',
    title: data.title || '',
    name: data.name || data.title || '',
    description: data.description || '',
    image: data.featuredImage || data.image || '/placeholder.svg',
    category: data.category || '',
    cuisine: data.recipeCuisine || data.cuisine || '',
    prepTime: data.prepTime || 0,
    cookTime: data.cookTime || 0,
    totalTime: data.totalTime || 0,
    servings: data.servings || data.recipeYield || 1,
    rating: data.rating || 4.5,
    reviewCount: data.reviewCount || 0,
    difficulty: data.difficulty || 'Easy',
    dietary: data.dietary || [],
    keywords: data.keywords || [],
    author: data.author || { "@type": "Person", name: "Mini Recipe Chef" },
    datePublished: data.datePublished?.toDate?.()?.toISOString() || data.datePublished || new Date().toISOString(),
    recipeIngredient: data.recipeIngredient || [],
    recipeInstructions: data.recipeInstructions || [],
    nutrition: data.nutrition || {
      "@type": "NutritionInformation",
      calories: "0",
      proteinContent: "0g",
      carbohydrateContent: "0g",
      fatContent: "0g",
      fiberContent: "0g",
      sodiumContent: "0mg"
    },
    aggregateRating: data.aggregateRating || {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "0"
    },
    equipment: data.equipment || [],
    tips: data.tips || [],
    prepTimeISO: data.prepTimeISO || `PT${data.prepTime || 0}M`,
    cookTimeISO: data.cookTimeISO || `PT${data.cookTime || 0}M`,
    totalTimeISO: data.totalTimeISO || `PT${data.totalTime || 0}M`,
    recipeYield: data.recipeYield || `${data.servings || 1} servings`,
    recipeCategory: data.recipeCategory || data.category || '',
    recipeCuisine: data.recipeCuisine || data.cuisine || ''
  } as BlogRecipe;
}

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
    
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, orderBy('datePublished', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const recipes = querySnapshot.docs.map(convertFirestoreToRecipe);
    
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
    const recipesRef = collection(db, 'recipes');
    const querySnapshot = await getDocs(recipesRef);
    
    const categories = new Set<string>();
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.category) {
        categories.add(data.category);
      }
    });
    
    const categoryArray = Array.from(categories);
    
    if (categoryArray.length > 0) {
      // Update cache
      categoriesCache = categoryArray;
      cacheTimestamp = Date.now();
      console.log(`Successfully fetched ${categoryArray.length} categories from Firebase`);
      return categoryArray;
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
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, where('category', '==', category), orderBy('datePublished', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const recipes = querySnapshot.docs.map(convertFirestoreToRecipe);
    
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
    // Validate slug parameter
    if (!slug || slug.trim() === '') {
      return null;
    }
    
    console.log(`Fetching recipe by slug: ${slug}`);
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const recipe = convertFirestoreToRecipe(querySnapshot.docs[0]);
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
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, where('__name__', '==', id));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const recipe = convertFirestoreToRecipe(querySnapshot.docs[0]);
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
    // Simple search - get all recipes and filter client-side
    // For better performance, consider using Algolia or similar
    const allRecipes = await getAllRecipes();
    const searchTermLower = searchTerm.toLowerCase();
    
    const filteredRecipes = allRecipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTermLower) ||
      recipe.description.toLowerCase().includes(searchTermLower) ||
      recipe.keywords.some(keyword => keyword.toLowerCase().includes(searchTermLower))
    );
    
    if (filteredRecipes.length > 0) {
      console.log(`Found ${filteredRecipes.length} recipes matching: ${searchTerm}`);
      return filteredRecipes;
    } else {
      // Fallback: search static recipes
      console.log(`No search results found for: ${searchTerm}, searching fallback data`);
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

export async function getFeaturedRecipes(maxResults: number = 6): Promise<BlogRecipe[]> {
  try {
    console.log(`Fetching ${maxResults} featured recipes`);
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, where('featured', '==', true), orderBy('datePublished', 'desc'), limit(maxResults));
    const querySnapshot = await getDocs(q);
    
    const recipes = querySnapshot.docs.map(convertFirestoreToRecipe);
    
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

export async function getRecentRecipes(maxResults: number = 10): Promise<BlogRecipe[]> {
  try {
    console.log(`Fetching ${maxResults} recent recipes`);
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, orderBy('datePublished', 'desc'), limit(maxResults));
    const querySnapshot = await getDocs(q);
    
    const recipes = querySnapshot.docs.map(convertFirestoreToRecipe);
    
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