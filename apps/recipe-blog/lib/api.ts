// lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string;

// Category mapping: WordPress slug -> Display info
export const CATEGORY_MAP = {
  'beef': {
    label: 'Main Dishes',
    configKey: 'main-dishes',
    description: 'Hearty beef recipes for main courses'
  },
  'soup': {
    label: 'Soups & Stews',
    configKey: 'soups-stews',
    description: 'Comforting soups and hearty stews'
  },
  'bread': {
    label: 'Breads',
    configKey: 'breads',
    description: 'Freshly baked breads and pastries'
  },
  'salads': {
    label: 'Salads',
    configKey: 'salads',
    description: 'Fresh and vibrant salad recipes'
  },
  'desserts': {
    label: 'Desserts & Cakes',
    configKey: 'desserts',
    description: 'Sweet treats and delicious cakes'
  }
} as const;

// Helper function to get category info
export function getCategoryInfo(wpSlug: string) {
  return CATEGORY_MAP[wpSlug as keyof typeof CATEGORY_MAP] || {
    label: wpSlug,
    configKey: wpSlug,
    description: ''
  };
}

// Helper function to get WordPress slug from config key
export function getWpSlugFromConfigKey(configKey: string) {
  const entry = Object.entries(CATEGORY_MAP).find(([_, info]) => info.configKey === configKey);
  return entry ? entry[0] : configKey;
}

// Helper function to get display label from WordPress slug
export function getCategoryLabel(wpSlug: string): string {
  const info = CATEGORY_MAP[wpSlug as keyof typeof CATEGORY_MAP];
  return info?.label || wpSlug;
}

// Helper function to get config key from WordPress slug
export function getConfigKeyFromWpSlug(wpSlug: string): string {
  const info = CATEGORY_MAP[wpSlug as keyof typeof CATEGORY_MAP];
  return info?.configKey || wpSlug;
}

export async function getRecipesByCategory(categorySlug: string) {
  const query = `
    query GetRecipesByCategory($categorySlug: ID!) {
      recipeCategory(id: $categorySlug, idType: SLUG) {
        name
        description
        slug
        recipes(first: 100) {
          nodes {
            title
            slug
            date
            content
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            recipeCategories {
              nodes {
                name
                slug
              }
            }
            recipeSchema {
              prepTime
              cookTime
              difficulty
              dietary
              rawIngredients
              rawInstructions
              recipeImages {
                img1 {
                  node {
                    sourceUrl
                    altText
                  }
                }
                img2 {
                  node {
                    sourceUrl
                    altText
                  }
                }
                img3 {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { categorySlug } }),
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error('Failed to fetch recipes by category');
    }

    const category = json.data?.recipeCategory;
    const recipes = category?.recipes?.nodes || [];

    console.log(`📂 Fetched ${recipes.length} recipes from category: ${category?.name || categorySlug}`);

    return {
      categoryName: category?.name || categorySlug,
      categoryDescription: category?.description || '',
      recipes: recipes.map((recipe: any) => parseRecipeData(recipe))
    };
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    throw error;
  }
}

export async function getRecipe(slug: string) {
  const query = `
    query GetRecipe($slug: ID!) {
      recipe(id: $slug, idType: SLUG) {
        databaseId
        title
        slug
        date
        modified
        content
        seo {
          title
          description
          focusKeywords
          openGraph {
            title
            description
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        recipeCategories {
          nodes {
            name
            slug
          }
        }
        recipeSchema {
          prepTime
          cookTime
          difficulty
          dietary
          rawIngredients
          rawInstructions
          whyLove
          tools
          recipeImages {
            img1 {
              node {
                sourceUrl
                altText
              }
            }
            img2 {
              node {
                sourceUrl
                altText
              }
            }
            img2 {
              node {
                sourceUrl
                altText
              }
            }
            img3 {
              node {
                sourceUrl
                altText
              }
            }
          }
          storageSection {
            title
            content
          }
          subsSection {
            title
            content
          }
        }
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug } }),
    next: { revalidate: 60 },
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }

  return parseRecipeData(json.data.recipe);
}

// THE PARSER: Turns WordPress data into your nice Schema
function parseRecipeData(wpNode: any) {
  if (!wpNode) return null;
  
  const acf = wpNode.recipeSchema;

  // Helper for "Item | Description"
  const parseList = (raw: string) => {
    return raw ? raw.split('\n').map(line => {
      const [item, description] = line.split('|').map(s => s.trim());
      return { item, description };
    }) : [];
  };

  // Build images array: prioritize ACF images, fallback to featured image
  const images = [
    acf?.recipeImages?.img1?.node?.sourceUrl,
    acf?.recipeImages?.img2?.node?.sourceUrl,
    acf?.recipeImages?.img3?.node?.sourceUrl
  ].filter(Boolean);
  
  // If no ACF images, use featured image
  if (images.length === 0 && wpNode.featuredImage?.node?.sourceUrl) {
    images.push(wpNode.featuredImage.node.sourceUrl);
    console.log("✅ Using featured image:", wpNode.featuredImage.node.sourceUrl);
  } else if (images.length > 0) {
    console.log("✅ Using ACF images:", images.length, "images found");
  } else {
    console.log("⚠️  No images found for recipe:", wpNode.title);
  }

  return {
    databaseId: wpNode.databaseId,
    title: wpNode.title,
    slug: wpNode.slug,
    date: wpNode.date,
    modified: wpNode.modified,
    content: wpNode.content,
    authorStory: acf?.authorStory || wpNode.content || '', // Main blog content for SEO
    seo: wpNode.seo || null, // Include Rank Math SEO data
    meta: {
      prepTime: acf?.prepTime,
      cookTime: acf?.cookTime,
      difficulty: acf?.difficulty,
      dietary: acf?.dietary,
    },
    ingredients: parseList(acf?.rawIngredients),
    instructions: parseList(acf?.rawInstructions),
    whyLove: parseList(acf?.whyLove),
    tools: parseList(acf?.tools),
    images: images,
    storageSection: acf?.storageSection,
    subsSection: acf?.subsSection,
    featuredImage: wpNode.featuredImage?.node,
    categories: wpNode.recipeCategories?.nodes || []
  };
}

export async function getRecentRecipes(limit: number = 8) {
  const query = `
    query GetRecentRecipes($limit: Int!) {
      recipes(first: $limit, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          title
          content
          slug
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          recipeSchema {
            prepTime
            cookTime
            difficulty
            dietary
            rawIngredients
            rawInstructions
            recipeImages {
              img1 {
                node {
                  sourceUrl
                  altText
                }
              }
              img2 {
                node {
                  sourceUrl
                  altText
                }
              }
              img3 {
                node {
                  sourceUrl
                  altText
                }
              }
            }
            storageSection {
              title
              content
            }
            subsSection {
              title
              content
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { limit } }),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error('Failed to fetch recipes from API');
    }

    const recipes = json.data?.recipes?.nodes || [];
    
    // Parse each recipe using the parseRecipeData function
    return recipes.map((recipe: any) => parseRecipeData(recipe));
  } catch (error) {
    console.error('Error fetching recent recipes:', error);
    throw error;
  }
}

export async function searchRecipes(searchTerm: string, limit: number = 20) {
  const query = `
    query SearchRecipes($search: String!, $limit: Int!) {
      recipes(
        first: $limit
        where: { 
          search: $search
        }
      ) {
        nodes {
          title
          slug
          date
          content
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          recipeCategories {
            nodes {
              name
              slug
            }
          }
          recipeSchema {
            prepTime
            cookTime
            difficulty
            dietary
            rawIngredients
            rawInstructions
            recipeImages {
              img1 {
                node {
                  sourceUrl
                  altText
                }
              }
              img2 {
                node {
                  sourceUrl
                  altText
                }
              }
              img3 {
                node {
                  sourceUrl
                  altText
                }
              }
            }
            storageSection {
              title
              content
            }
            subsSection {
              title
              content
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query, 
        variables: { search: searchTerm, limit } 
      }),
      next: { revalidate: 300 }, // Cache search results for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error('Failed to search recipes');
    }

    const recipes = json.data?.recipes?.nodes || [];
    
    console.log(`🔍 Found ${recipes.length} recipes matching "${searchTerm}"`);
    
    // Parse each recipe using the parseRecipeData function
    return recipes.map((recipe: any) => parseRecipeData(recipe));
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
}

export async function getAllRecipes(limit: number = 1000) {
  const query = `
    query GetAllRecipes($limit: Int!) {
      recipes(first: $limit, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          databaseId
          title
          content
          slug
          date
          modified
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          recipeCategories {
            nodes {
              name
              slug
            }
          }
          recipeSchema {
            prepTime
            cookTime
            difficulty
            dietary
            rawIngredients
            rawInstructions
            recipeImages {
              img1 {
                node {
                  sourceUrl
                  altText
                }
              }
              img2 {
                node {
                  sourceUrl
                  altText
                }
              }
              img3 {
                node {
                  sourceUrl
                  altText
                }
              }
            }
            storageSection {
              title
              content
            }
            subsSection {
              title
              content
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { limit } }),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error('Failed to fetch all recipes');
    }

    const recipes = json.data?.recipes?.nodes || [];
    
    console.log(`🔥 Fetched ${recipes.length} recipes from WordPress`);
    
    // Parse each recipe using the parseRecipeData function
    return recipes.map((recipe: any) => parseRecipeData(recipe));
  } catch (error) {
    console.error('Error fetching all recipes:', error);
    throw error;
  }
}