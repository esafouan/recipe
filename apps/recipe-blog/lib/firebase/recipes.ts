import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  DocumentSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './config';
import { FirebaseRecipe, BlogRecipe, RecipeCategory } from '../types/recipe';

const RECIPES_COLLECTION = 'recipes';

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Helper function to convert minutes to ISO 8601 duration
function minutesToISO(minutes: number): string {
  return `PT${minutes}M`;
}

// Helper function to determine cuisine from category/tags
function determineCuisine(category: string, tags: string[]): string {
  // Simple mapping - you can make this more sophisticated
  const cuisineMap: Record<string, string> = {
    'italian': 'Italian',
    'american': 'American', 
    'mediterranean': 'Mediterranean',
    'asian': 'Asian',
    'mexican': 'Mexican',
    'french': 'French'
  };

  // Check tags first
  for (const tag of tags) {
    const cuisine = cuisineMap[tag.toLowerCase()];
    if (cuisine) return cuisine;
  }

  // Default based on category
  if (category.includes('dessert') || category.includes('cake')) return 'American';
  if (category.includes('pasta')) return 'Italian';
  
  return 'American'; // Default
}

// Helper function to map dietary restrictions from tags
function mapDietaryRestrictions(tags: string[]): string[] {
  const dietaryMap: Record<string, string> = {
    'vegetarian': 'Vegetarian',
    'vegan': 'Vegan',
    'gluten-free': 'Gluten-Free',
    'dairy-free': 'Dairy-Free',
    'keto': 'Keto',
    'paleo': 'Paleo',
    'low-carb': 'Low-Carb',
    'healthy': 'Healthy',
    'high-protein': 'High Protein'
  };

  return tags
    .map(tag => dietaryMap[tag.toLowerCase()])
    .filter(Boolean);
}

// Convert Firebase recipe to Blog recipe format
function convertToBlogRecipe(firebaseRecipe: FirebaseRecipe): BlogRecipe {
  const slug = firebaseRecipe.slug || generateSlug(firebaseRecipe.title);
  const cuisine = determineCuisine(firebaseRecipe.category, firebaseRecipe.tags);
  const dietary = mapDietaryRestrictions(firebaseRecipe.tags);

  return {
    id: firebaseRecipe.id,
    slug,
    title: firebaseRecipe.title,
    name: firebaseRecipe.title,
    description: firebaseRecipe.description,
    image: firebaseRecipe.featuredImage,
    category: mapCategoryToBlogCategory(firebaseRecipe.category),
    cuisine,
    prepTime: firebaseRecipe.prepTime,
    cookTime: firebaseRecipe.cookTime,
    totalTime: firebaseRecipe.totalTime,
    servings: firebaseRecipe.servings,
    rating: firebaseRecipe.rating.value,
    reviewCount: firebaseRecipe.rating.count,
    difficulty: firebaseRecipe.difficulty,
    dietary,
    keywords: firebaseRecipe.tags,
    author: {
      "@type": "Person",
      name: firebaseRecipe.author.name
    },
    datePublished: firebaseRecipe.datePublished,
    recipeIngredient: firebaseRecipe.ingredients,
    recipeInstructions: firebaseRecipe.instructions.map(instruction => ({
      "@type": "HowToStep",
      text: instruction
    })),
    nutrition: {
      "@type": "NutritionInformation",
      calories: firebaseRecipe.nutrition.calories.toString(),
      proteinContent: `${firebaseRecipe.nutrition.protein}g`,
      carbohydrateContent: `${firebaseRecipe.nutrition.carbs}g`,
      fatContent: `${firebaseRecipe.nutrition.fat}g`,
      fiberContent: `${firebaseRecipe.nutrition.fiber}g`,
      sodiumContent: "0mg" // Not in original schema, using default
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: firebaseRecipe.rating.value.toString(),
      reviewCount: firebaseRecipe.rating.count.toString()
    },
    equipment: [], // Not in original schema, will need to be added later
    tips: [], // Initialize as empty array - can be populated from content or admin
    // Enhanced fields for better content utilization
    content: (firebaseRecipe as any).content || '', // Blog content for better engagement
    notes: (firebaseRecipe as any).notes || '', // Recipe notes
    faqs: firebaseRecipe.faqs || [], // Keep FAQs separate from tips
    prepTimeISO: minutesToISO(firebaseRecipe.prepTime),
    cookTimeISO: minutesToISO(firebaseRecipe.cookTime),
    totalTimeISO: minutesToISO(firebaseRecipe.totalTime),
    recipeYield: `${firebaseRecipe.servings} serving${firebaseRecipe.servings > 1 ? 's' : ''}`,
    recipeCategory: mapCategoryToBlogCategory(firebaseRecipe.category),
    recipeCuisine: cuisine
  };
}

// Map Firebase categories to blog categories
function mapCategoryToBlogCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'mini-desserts': 'Dessert',
    'mini-mains': 'Dinner',
    'mini-sides': 'Lunch',
    'breakfast': 'Breakfast',
    'lunch': 'Lunch',
    'dinner': 'Dinner',
    'dessert': 'Dessert',
    'healthy': 'Healthy'
  };

  return categoryMap[category.toLowerCase()] || 'Dinner';
}

export class RecipeService {
  // Get all recipes (simplified - no filtering)
  static async getAllRecipes(): Promise<BlogRecipe[]> {
    try {
      const recipesRef = collection(db, RECIPES_COLLECTION);
      const q = query(
        recipesRef,
        orderBy('datePublished', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const recipes: BlogRecipe[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirebaseRecipe;
        recipes.push(convertToBlogRecipe({ ...data, id: doc.id }));
      });

      console.log(`Found ${recipes.length} recipes in database`);
      return recipes;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return [];
    }
  }

  // Get recipes by category (simplified - no status filtering)
  static async getRecipesByCategory(category: RecipeCategory): Promise<BlogRecipe[]> {
    try {
      const recipesRef = collection(db, RECIPES_COLLECTION);
      const q = query(
        recipesRef,
        where('category', '==', category),
        orderBy('datePublished', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const recipes: BlogRecipe[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirebaseRecipe;
        recipes.push(convertToBlogRecipe({ ...data, id: doc.id }));
      });

      console.log(`Found ${recipes.length} recipes in category: ${category}`);
      return recipes;
    } catch (error) {
      console.error('Error fetching recipes by category:', error);
      return [];
    }
  }

  // Get recipe by ID
  static async getRecipeById(id: string): Promise<BlogRecipe | null> {
    try {
      const docRef = doc(db, RECIPES_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as FirebaseRecipe;
        return convertToBlogRecipe({ ...data, id: docSnap.id });
      }

      return null;
    } catch (error) {
      console.error('Error fetching recipe by ID:', error);
      return null;
    }
  }

  // Get recipe by slug (simplified - no status filtering)
  static async getRecipeBySlug(slug: string): Promise<BlogRecipe | null> {
    try {
      const recipesRef = collection(db, RECIPES_COLLECTION);
      const q = query(
        recipesRef,
        where('slug', '==', slug),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data() as FirebaseRecipe;
        return convertToBlogRecipe({ ...data, id: doc.id });
      }

      return null;
    } catch (error) {
      console.error('Error fetching recipe by slug:', error);
      return null;
    }
  }

  // Search recipes
  static async searchRecipes(searchTerm: string): Promise<BlogRecipe[]> {
    try {
      const recipesRef = collection(db, RECIPES_COLLECTION);
      const q = query(
        recipesRef,
        orderBy('datePublished', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const recipes: BlogRecipe[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirebaseRecipe;
        const recipe = convertToBlogRecipe({ ...data, id: doc.id });
        
        // Client-side filtering for search
        const searchTermLower = searchTerm.toLowerCase();
        const titleMatch = recipe.title.toLowerCase().includes(searchTermLower);
        const descriptionMatch = recipe.description.toLowerCase().includes(searchTermLower);
        const keywordMatch = recipe.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchTermLower)
        );
        const ingredientMatch = recipe.recipeIngredient.some(ingredient => 
          ingredient.toLowerCase().includes(searchTermLower)
        );

        if (titleMatch || descriptionMatch || keywordMatch || ingredientMatch) {
          recipes.push(recipe);
        }
      });

      return recipes;
    } catch (error) {
      console.error('Error searching recipes:', error);
      return [];
    }
  }

  // Get featured recipes (recipes with high ratings)
  static async getFeaturedRecipes(limitCount: number = 6): Promise<BlogRecipe[]> {
    try {
      const recipesRef = collection(db, RECIPES_COLLECTION);
      const q = query(
        recipesRef,
        orderBy('datePublished', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const recipes: BlogRecipe[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirebaseRecipe;
        recipes.push(convertToBlogRecipe({ ...data, id: doc.id }));
      });

      return recipes;
    } catch (error) {
      console.error('Error fetching featured recipes:', error);
      return [];
    }
  }

  // Get recent recipes (simplified - just get latest)
  static async getRecentRecipes(limitCount: number = 10): Promise<BlogRecipe[]> {
    try {
      const recipesRef = collection(db, RECIPES_COLLECTION);
      const q = query(
        recipesRef,
        orderBy('datePublished', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const recipes: BlogRecipe[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirebaseRecipe;
        recipes.push(convertToBlogRecipe({ ...data, id: doc.id }));
      });

      return recipes;
    } catch (error) {
      console.error('Error fetching recent recipes:', error);
      return [];
    }
  }

  // Get all available categories
  static async getAvailableCategories(): Promise<string[]> {
    try {
      const recipes = await this.getAllRecipes();
      const categories = new Set(recipes.map(recipe => recipe.category));
      return Array.from(categories).sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
}
