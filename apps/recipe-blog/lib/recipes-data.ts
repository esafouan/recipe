// Recipe data helpers with API-based data fetching
import { db } from './firebase/config';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';


export interface RecipeMetadata {
  name: string;
  description: string;
  datePublished: string;
  dateModified: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  recipeYield: string;
  recipeCategory: string;
  recipeCuisine: string;
  difficulty: string;
  dietary: string[];
  keywords: string;
  images: string[];
}

export interface RecipeIngredient {
  item: string;
  description?: string;
}

export interface RecipeInstruction {
  stepNumber: number;
  name: string;
  text: string;
}

export interface RecipeFAQ {
  question: string;
  answer: string;
}

export interface RecipeSection {
  title: string;
  content: string;
}

export interface RecipeData {
  // Metadata
  metadata: RecipeMetadata;
  
  // Introduction & Story
  introduction: string;
  whyYouLlLove: string[];
  authorStory: string;
  
  // Ingredients
  ingredients: RecipeIngredient[];
  
  // Instructions
  instructions: RecipeInstruction[];
  
  // Additional Content Sections
  youMustKnow: string[];
  personalNote: string;
  storage: RecipeSection;
  substitutions: RecipeSection;
  servingSuggestions: RecipeSection;
  proTips: string[];
  closingThought: string;
  
  // FAQs
  faqs: RecipeFAQ[];
  
  // Tools & Notes
  tools: string[];
  notes: string[];
}


type RecipeCategory = string;

// Helper function to convert Firestore document to RecipeData

function convertFirestoreToRecipe(doc: any): RecipeData {
  const data = doc.data();
  
  return {
    // Metadata
    metadata: {
      name: data.name || data.title || '',
      description: data.description || '',
      datePublished: data.datePublished?.toDate?.()?.toISOString() || data.datePublished || new Date().toISOString(),
      dateModified: data.dateModified?.toDate?.()?.toISOString() || data.dateModified || new Date().toISOString(),
      prepTime: data.prepTime?.toString() || '0',
      cookTime: data.cookTime?.toString() || '0',
      totalTime: data.totalTime?.toString() || '0',
      recipeYield: data.recipeYield || `${data.servings || 1} servings`,
      recipeCategory: data.recipeCategory || data.category || '',
      recipeCuisine: data.recipeCuisine || data.cuisine || '',
      difficulty: data.difficulty || 'Easy',
      dietary: data.dietary || [],
      keywords: Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords || '',
      images: data.images || [data.featuredImage || data.image || '/placeholder.svg']
    },
    
    // Introduction & Story
    introduction: data.introduction || '',
    whyYouLlLove: data.whyYouLlLove || [],
    authorStory: data.authorStory || '',
    
    // Ingredients
    ingredients: data.ingredients || data.recipeIngredient?.map((ingredient: any) => ({
      item: typeof ingredient === 'string' ? ingredient : ingredient.item || '',
      description: typeof ingredient === 'object' ? ingredient.description : undefined
    })) || [],
    
    // Instructions
    instructions: data.instructions || data.recipeInstructions?.map((instruction: any, index: number) => ({
      stepNumber: index + 1,
      name: instruction.name || `Step ${index + 1}`,
      text: typeof instruction === 'string' ? instruction : instruction.text || ''
    })) || [],
    
    // Additional Content Sections
    youMustKnow: data.youMustKnow || [],
    personalNote: data.personalNote || '',
    storage: data.storage || { title: 'Storage', content: '' },
    substitutions: data.substitutions || { title: 'Substitutions', content: '' },
    servingSuggestions: data.servingSuggestions || { title: 'Serving Suggestions', content: '' },
    proTips: data.proTips || data.tips || [],
    closingThought: data.closingThought || '',
    
    // FAQs
    faqs: data.faqs || [],
    
    // Tools & Notes
    tools: data.tools || data.equipment || [],
    notes: data.notes || []
  };
}


// Cache for recipes to avoid repeated Firebase calls
let recipesCache: RecipeData[] | null = null;
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
export async function getAllRecipes(): Promise<RecipeData[]> {
  // Return cached data if valid
  if (isCacheValid() && recipesCache) {
    return recipesCache;
  }

  try {
    console.log('Using test recipe data instead of Firebase...');
    
    // Firebase call commented out for testing
    // const recipesRef = collection(db, 'recipes');
    // const q = query(recipesRef, orderBy('datePublished', 'desc'));
    // const querySnapshot = await getDocs(q);
    // const recipes = querySnapshot.docs.map(convertFirestoreToRecipe);
    
    // Return test recipe for UI testing
    const recipes = [TestRecipe];
    
    if (recipes.length > 0) {
      // Update cache
      recipesCache = recipes;
      cacheTimestamp = Date.now();
      console.log(`Successfully loaded ${recipes.length} test recipes`);
      return recipes;
    } else {
      console.log('No test recipes available');
      return [];
    }
  } catch (error) {
    console.error('Error loading test recipes:', error);
    console.log('Returning empty array due to error');
    return [];
  }
}


export async function getRecipesByCategory(category: RecipeCategory): Promise<RecipeData[]> {
  try {
    console.log(`Loading test recipe for category: ${category}`);
    
    // Firebase call commented out for testing
    // const recipesRef = collection(db, 'recipes');
    // const q = query(recipesRef, where('category', '==', category), orderBy('datePublished', 'desc'));
    // const querySnapshot = await getDocs(q);
    // const recipes = querySnapshot.docs.map(convertFirestoreToRecipe);
    
    // Return test recipe if category matches, otherwise empty
    const recipes = TestRecipe.metadata.recipeCategory.toLowerCase() === category.toLowerCase() 
      ? [TestRecipe] 
      : [];
    
    if (recipes.length > 0) {
      console.log(`Successfully loaded ${recipes.length} test recipes for category: ${category}`);
      return recipes;
    } else {
      console.log(`No test recipes found for category ${category}`);
      return [];
    }
  } catch (error) {
    console.error(`Error loading test recipes for category ${category}:`, error);
    return [];
  }
}

export async function getRecipeBySlug(slug: string): Promise<RecipeData | null> {
  try {
    // Validate slug parameter
    if (!slug || slug.trim() === '') {
      return null;
    }
    
    console.log(`Looking for test recipe by slug: ${slug}`);
    
    // Firebase call commented out - using test recipe
    // const allRecipes = await getAllRecipes();
    // const recipe = allRecipes.find(r => {
    //   const generatedSlug = r.metadata.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    //   return generatedSlug === slug;
    // });
    
    // Check if the test recipe slug matches
    const generatedSlug = TestRecipe.metadata.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    if (generatedSlug === slug) {
      console.log(`Found test recipe: ${TestRecipe.metadata.name}`);
      return TestRecipe;
    } else {
      console.log(`No test recipe found for slug ${slug} (available: ${generatedSlug})`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching recipe by slug ${slug}:`, error);
    return null;
  }
}

export async function getRecipeById(id: string): Promise<RecipeData | null> {
  try {
    console.log(`Looking for test recipe by ID: ${id}`);
    
    // Firebase call commented out for testing
    // const recipesRef = collection(db, 'recipes');
    // const q = query(recipesRef, where('__name__', '==', id));
    // const querySnapshot = await getDocs(q);
    
    // For testing, use a simple ID check (could be slug or test-recipe)
    if (id === 'test-recipe' || id === 'hawaiian-mai-tai-drink') {
      console.log(`Found test recipe: ${TestRecipe.metadata.name}`);
      return TestRecipe;
    } else {
      console.log(`No test recipe found for ID ${id}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching recipe by ID ${id}:`, error);
    return null;
  }
}

export async function searchRecipes(searchTerm: string): Promise<RecipeData[]> {
  try {
    console.log(`Searching test recipes for: ${searchTerm}`);
    
    // Firebase call commented out for testing
    // const allRecipes = await getAllRecipes();
    // const searchTermLower = searchTerm.toLowerCase();
    // const filteredRecipes = allRecipes.filter(recipe =>
    //   recipe.metadata.name.toLowerCase().includes(searchTermLower) ||
    //   recipe.metadata.description.toLowerCase().includes(searchTermLower) ||
    //   recipe.metadata.keywords.toLowerCase().includes(searchTermLower)
    // );
    
    // Search in test recipe
    const searchTermLower = searchTerm.toLowerCase();
    const testRecipeMatches = 
      TestRecipe.metadata.name.toLowerCase().includes(searchTermLower) ||
      TestRecipe.metadata.description.toLowerCase().includes(searchTermLower) ||
      TestRecipe.metadata.keywords.toLowerCase().includes(searchTermLower);
    
    const filteredRecipes = testRecipeMatches ? [TestRecipe] : [];
    
    if (filteredRecipes.length > 0) {
      console.log(`Found ${filteredRecipes.length} test recipes matching: ${searchTerm}`);
      return filteredRecipes;
    } else {
      console.log(`No test search results found for: ${searchTerm}`);
      return [];
    }
  } catch (error) {
    console.error(`Error searching test recipes for ${searchTerm}:`, error);
    return [];    
  }
}

export async function getFeaturedRecipes(maxResults: number = 6): Promise<RecipeData[]> {
  try {
    console.log(`Loading test featured recipe (max: ${maxResults})`);
    
    // Firebase call commented out for testing
    // const recipesRef = collection(db, 'recipes');
    // const q = query(recipesRef, where('featured', '==', true), orderBy('datePublished', 'desc'), limit(maxResults));
    // const querySnapshot = await getDocs(q);
    // const recipes = querySnapshot.docs.map(convertFirestoreToRecipe);
    
    // Return test recipe as featured for testing
    const recipes = [TestRecipe];
    
    if (recipes.length > 0) {
      console.log(`Successfully loaded ${recipes.length} test featured recipes`);
      return recipes;
    } else {
      console.log('No test featured recipes found');
      return [];
    }
  } catch (error) {
    console.error('Error loading test featured recipes:', error);
    return [];
  }
}

export async function getRecentRecipes(maxResults: number = 10): Promise<RecipeData[]> {
  try {
    console.log(`Loading test recipe for recent recipes (max: ${maxResults})`);
    
    // Firebase call commented out for testing
    // const recipesRef = collection(db, 'recipes');
    // const q = query(recipesRef, orderBy('datePublished', 'desc'), limit(maxResults));
    // const querySnapshot = await getDocs(q);
    // const recipes = querySnapshot.docs.map(convertFirestoreToRecipe);
    
    // Return test recipe for testing
    const recipes = [TestRecipe];
    
    if (recipes.length > 0) {
      console.log(`Successfully loaded ${recipes.length} test recent recipes`);
      return recipes;
    } else {
      console.log('No test recent recipes found');
      return [];
    }
  } catch (error) {
    console.error('Error loading test recent recipes:', error);
    return [];
  }
}

// Utility function to manually refresh cache
export function refreshRecipeCache(): void {
  console.log('Manually clearing recipe cache');
  clearCache();
}


export const TestRecipe: RecipeData = {
  // Metadata
  metadata: {
    name: "Hawaiian Mai Tai Drink",
    description: "Bright, tropical Hawaiian Mai Tai with rum, lime, and orgeat. Perfectly shaken for a refreshing cocktail experience. Experience the classic flavors featuring a balanced blend of white and dark rum, fresh lime juice, and fragrant orgeat.",
    datePublished: "2025-07-27T21:12:58Z",
    dateModified: "2025-07-27T21:12:58Z",
    prepTime: "PT5M",
    cookTime: "PT0M",
    totalTime: "PT5M",
    recipeYield: "1 cocktail",
    recipeCategory: "Beverages",
    recipeCuisine: "Hawaiian",
    difficulty: "Easy",
    dietary: ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free"],
    keywords: "Hawaiian Mai Tai, tropical cocktail, rum cocktail, tiki drink, orgeat cocktail, summer drinks, party cocktails",
    images: [
      "/Yay-Recipes-84-1.webp"
    ]
  },

  // Introduction & Story
  introduction: "If you are dreaming of a perfect tropical cocktail that feels both refreshing and a little indulgent, this Hawaiian Mai Tai is exactly what you need. The balance of tart lime, deeply fragrant rum, and sweet almond orgeat makes every sip a mini vacation. This is the drink I mix for friends any time I want conversation to flow and the mood to feel festive, whether at a backyard cookout or a quiet evening at home.",

  whyYouLlLove: [
    "Uses everyday ingredients from a basic liquor shelf and pantry",
    "Bursting with aromatic citrus and delicate almond notes",
    "Beautifully layered flavor and a dramatic look with dual rums",
    "Impresses guests yet comes together in five minutes flat"
  ],

  authorStory: "After discovering the magic of orgeat one summer, I started bringing this Mai Tai to every gathering and it always disappears first. This recipe became my signature drink for outdoor parties.",

  // Ingredients with descriptions
  ingredients: [
    {
      item: "Ice cubes",
      description: "Sets a crisp base and helps chill the drink to frosty perfection"
    },
    {
      item: "1 medium lime (30 ml juice)",
      description: "Seek out a fresh juicy lime for the brightest flavor and squeeze just before using for best results"
    },
    {
      item: "30 ml white rum",
      description: "Choose a clean light-bodied Caribbean style rum for that smooth kick"
    },
    {
      item: "30 ml dark rum",
      description: "Look for a rich aged option with deep caramel notes for dramatic color and taste"
    },
    {
      item: "22 ml orgeat syrup",
      description: "A creamy almond syrup essential for the nutty floral sweetness opt for a quality brand if possible"
    },
    {
      item: "15 ml Grand Marnier",
      description: "Brings subtle elegance with hints of citrus Cognac for a mellow finish use fresh if you can"
    },
    {
      item: "Lime wheel for garnish",
      description: "Like a lime wheel mint sprig or cherry add fragrance and visual pop fresh mint in particular wakes up the nose with every sip"
    },
    {
      item: "Fresh mint sprig for garnish",
      description: "Like a lime wheel mint sprig or cherry add fragrance and visual pop fresh mint in particular wakes up the nose with every sip"
    },
    {
      item: "Maraschino cherry for garnish",
      description: "Like a lime wheel mint sprig or cherry add fragrance and visual pop fresh mint in particular wakes up the nose with every sip"
    }
  ],

  // Instructions
  instructions: [
    {
      stepNumber: 1,
      name: "Prepare the Glass",
      text: "Fill your rocks glass all the way with clean ice cubes. This not only chills the glass but makes the cocktail last longer on a hot day."
    },
    {
      stepNumber: 2,
      name: "Squeeze Fresh Lime Juice",
      text: "Roll a lime on the counter then cut and juice until you measure out one ounce of fresh juice. Do not use bottled juice as it changes the whole profile."
    },
    {
      stepNumber: 3,
      name: "Measure and Combine Spirits",
      text: "Pour one ounce white rum, three quarters ounce orgeat and half an ounce of Grand Marnier directly into a cocktail shaker. Pause here and consider your rums. Opt for that slightly aged dark rum for final layering."
    },
    {
      stepNumber: 4,
      name: "Shake Until Frosty",
      text: "Fill the shaker with plenty of ice. Securely seal and shake briskly for about twenty seconds or until the outside of the shaker feels icy cold. This step chills and slightly dilutes the drink giving it perfect texture."
    },
    {
      stepNumber: 5,
      name: "Strain Over Fresh Ice",
      text: "Using a fine mesh strainer pour the cocktail right into your prepared glass taking care to catch any shards of ice for the smoothest sip."
    },
    {
      stepNumber: 6,
      name: "Add the Dark Rum Float",
      text: "Pour your reserved dark rum gently over the back of a spoon held just above the drink so it floats in a dramatic layer on top."
    },
    {
      stepNumber: 7,
      name: "Garnish for Aroma and Color",
      text: "Finish with a lime wheel, a fresh mint sprig or even a maraschino cherry. Arrange so the first scents are vibrant citrus and mint."
    }
  ],

  // You Must Know
  youMustKnow: [
    "Full of vibrant tropical flavor that feels both sophisticated and fun",
    "High in vitamin C from the fresh lime juice",
    "Layers beautifully for a show stopping presentation"
  ],

  personalNote: "My favorite part of every Mai Tai is the moment the dark rum floats slowly over the top forming a distinct layer. My dad first made me a nonalcoholic version as a kid so now it always reminds me of warm summer nights and a little bit of family magic.",

  // Storage
  storage: {
    title: "Smart Storage for Your Mai Tai",
    content: "It is best to mix Mai Tais fresh and serve them right away. Chilling the rum and orgeat in advance makes the process seamless. If you must make ahead dodge garnishes and ice until just before serving to keep things crisp and bright."
  },

  // Substitutions
  substitutions: {
    title: "Easy Ingredient Swaps",
    content: "No Grand Marnier on hand? Reach for any orange liqueur like Cointreau or orange curaçao. If you want a more affordable or sweeter cocktail standard triple sec can fill in. In a pinch you can use a splash of simple syrup if orgeat is unavailable but you will lose the signature nuttiness."
  },

  // Serving Suggestions
  servingSuggestions: {
    title: "Perfect Serving Suggestions",
    content: "Serve your Mai Tai with a paper umbrella or in a tiki mug for full Polynesian flair. I like to line up garnishes in little bowls so guests can pick their favorite. Each glass deserves a fragrant sprig of mint for a true vacation vibe."
  },

  // Pro Tips
  proTips: [
    "Always use fresh lime juice. Never ever bottled for an authentic burst of flavor",
    "Gently float the dark rum for presentation it shows off your skills and adds drama",
    "If your orgeat separates give the bottle a shake so you get all the creamy almond goodness in every sip"
  ],

  closingThought: "Let the Mai Tai transport you to warm shores and sand between your toes. Every time I make this cocktail people gather a little closer and the worries of the day fade away. For me the best memories start with a perfect drink shared in good company.",

  // FAQs
  faqs: [
    {
      question: "What type of rum works best for a Hawaiian Mai Tai?",
      answer: "A combination of white and dark rum provides depth and complexity, enhancing the classic tropical profile."
    },
    {
      question: "Can I substitute Grand Marnier?",
      answer: "Yes, orange curaçao or Cointreau are suitable alternatives, delivering a similar citrusy sweetness."
    },
    {
      question: "What garnish options are traditional?",
      answer: "Popular choices include a fresh lime wheel, mint sprig, or a maraschino cherry for extra color and aroma."
    },
    {
      question: "How important is orgeat in this cocktail?",
      answer: "Orgeat, an almond syrup, adds a crucial nutty sweetness and silkiness, balancing the tart lime."
    },
    {
      question: "How do I achieve a layered look?",
      answer: "Pour the dark rum on top after straining the drink into the glass for a visually striking float."
    }
  ],

  // Tools & Notes
  tools: [
    "Cocktail shaker",
    "Fine mesh strainer",
    "Rocks glass",
    "Citrus juicer"
  ],

  notes: [
    "Orange curaçao or Cointreau can replace Grand Marnier in equal measure.",
    "For a rum float, omit the dark rum from the shaker. After straining, pour the dark rum over the finished drink before garnishing."
  ]
};
