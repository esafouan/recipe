#!/usr/bin/env tsx
/**
 * Retry Failed Recipes with Enhanced Error Handling
 * 
 * This script retries recipes that failed in the bulk update:
 * - Better error logging
 * - Connection testing
 * - Slower rate limiting
 * - Detailed diagnostics
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME!;
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD!;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Slower rate limiting for retries
const DELAY_BETWEEN_RECIPES = 5000; // 5 seconds

// Failed recipes that need retry (soup recipes reassigned to Sarah)
const FAILED_SLUGS = [
  'crock-pot-pizza-soup',
  'dumpling-ramen-bake',
  'keto-cabbage-soup-smoked-sausage',
  'tomato-soup-cheddar-bay-dumplings',
  'creamy-vegetable-soup',
  'roasted-red-pepper-smoked-gouda-soup',
  'creamy-bean-soup-with-sausage'
];

// Author profiles (ONLY authors that exist in WordPress ACF field!)
const AUTHORS = {
  'sarah-mitchell': {
    name: 'Sarah Mitchell',
    specialty: ['main-dishes', 'comfort-food', 'american', 'beef', 'chicken', 'soups', 'soup', 'stews', 'slow-cooking'],
    voice: 'warm, welcoming, focuses on family dinners and comfort food'
  },
  'marco-rodriguez': {
    name: 'Marco Rodriguez',
    specialty: ['bread', 'pastries', 'baking', 'desserts'],
    voice: 'passionate, technical, emphasizes precision and technique'
  },
  'olivia-greene': {
    name: 'Olivia Greene',
    specialty: ['salads', 'vegetarian', 'healthy', 'fresh'],
    voice: 'health-conscious, vibrant, focuses on fresh ingredients'
  },
  'emily-chen': {
    name: 'Emily Chen',
    specialty: ['fusion', 'asian', 'modern', 'innovative'],
    voice: 'creative, innovative, blends traditions with modern techniques'
  },
  'david-thompson': {
    name: 'David Thompson',
    specialty: ['grilling', 'bbq', 'smoking', 'outdoor'],
    voice: 'bold, adventurous, focuses on bold flavors and outdoor cooking'
  }
};

interface Recipe {
  id: string;
  databaseId: number;
  slug: string;
  title: string;
  content: string;
  recipeCategories: {
    nodes: Array<{ name: string; slug: string }>;
  };
  recipeSchema: {
    assignedauthor?: string;
  };
}

interface ProcessResult {
  slug: string;
  title: string;
  success: boolean;
  error?: string;
  errorDetails?: string;
  author?: string;
  originalLength?: number;
  newLength?: number;
}

/**
 * Test WordPress connection
 */
async function testConnection(): Promise<boolean> {
  try {
    console.log('🔍 Testing WordPress connection...');
    const response = await fetch(WORDPRESS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: '{ __typename }'
      })
    });
    
    if (!response.ok) {
      console.error(`❌ WordPress connection failed: ${response.status} ${response.statusText}`);
      return false;
    }
    
    console.log('✅ WordPress connection OK');
    return true;
  } catch (error) {
    console.error('❌ WordPress connection error:', error);
    return false;
  }
}

/**
 * Test OpenRouter API
 */
async function testOpenRouter(): Promise<boolean> {
  try {
    console.log('🔍 Testing OpenRouter API...');
    if (!OPENROUTER_API_KEY) {
      console.error('❌ OPENROUTER_API_KEY not set');
      return false;
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      }
    });
    
    if (!response.ok) {
      console.error(`❌ OpenRouter API failed: ${response.status} ${response.statusText}`);
      return false;
    }
    
    console.log('✅ OpenRouter API OK');
    return true;
  } catch (error) {
    console.error('❌ OpenRouter API error:', error);
    return false;
  }
}

/**
 * Fetch a single recipe by slug
 */
async function fetchRecipe(slug: string): Promise<Recipe | null> {
  const query = `
    query GetRecipe($slug: ID!) {
      recipe(id: $slug, idType: SLUG) {
        id
        databaseId
        slug
        title
        content
        recipeCategories {
          nodes {
            name
            slug
          }
        }
        recipeSchema {
          assignedauthor
        }
      }
    }
  `;

  try {
    const response = await fetch(WORDPRESS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { slug } })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(JSON.stringify(result.errors));
    }
    
    if (!result.data?.recipe) {
      throw new Error('Recipe not found');
    }

    return result.data.recipe;
  } catch (error) {
    throw new Error(`Fetch failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Assign author based on recipe categories
 */
function assignAuthor(recipe: Recipe): string {
  const categories = recipe.recipeCategories.nodes.map(cat => cat.slug.toLowerCase());
  
  // Check each author's specialty
  for (const [authorId, author] of Object.entries(AUTHORS)) {
    for (const specialty of author.specialty) {
      if (categories.some(cat => cat.includes(specialty))) {
        return authorId;
      }
    }
  }
  
  // Default fallback
  return 'sarah-mitchell';
}

/**
 * Regenerate content with AI
 */
async function regenerateContent(recipe: Recipe, authorId: string): Promise<string> {
  const author = AUTHORS[authorId as keyof typeof AUTHORS];
  const categories = recipe.recipeCategories.nodes.map(c => c.name).join(', ');
  
  const prompt = `You are ${author.name}, a professional chef writing for Cozy Bites Kitchen. Your writing voice is: ${author.voice}.

I need you to rewrite this recipe article to make it more personal and valuable for AdSense approval. The article must demonstrate E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).

CURRENT CONTENT:
${recipe.content}

REQUIREMENTS:
1. Add a personal introduction (2-3 paragraphs) where you:
   - Share YOUR specific experience with this dish
   - Explain why YOU love making it
   - Add a personal anecdote or memory
   - Write as ${author.name} in first person

2. Keep ALL existing recipe content exactly as-is:
   - Keep ALL WordPress blocks
   - Keep ALL structured data
   - Keep ALL recipe card information
   - Keep ALL ingredient lists
   - Keep ALL instructions
   - Keep ALL nutritional info

3. Add an "Expert Tips" section (3-4 detailed tips) that shows YOUR expertise

4. Add a personal conclusion (1-2 paragraphs) about:
   - How this recipe fits into YOUR cooking style
   - YOUR favorite way to serve it
   - YOUR recommendations

STYLE GUIDELINES:
- Professional magazine-quality writing (like Bon Appétit or Food & Wine)
- NO emojis, NO excessive exclamation marks
- Use sophisticated, descriptive language
- Write in first person as ${author.name}
- Keep WordPress block editor classes (wp-block-heading, wp-block-list, etc.)
- Make it feel like a real professional chef wrote this
- NO markdown - only HTML
- Be specific and detailed in tips and stories
- Professional tone throughout - like a cooking magazine article

Return ONLY the complete HTML content, nothing else.`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://cozybiteskitchen.com',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid API response format');
  }
  
  return data.choices[0].message.content;
}

/**
 * Update recipe in WordPress via REST API
 */
async function updateRecipe(recipe: Recipe, newContent: string, authorId: string): Promise<void> {
  const auth = Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_APP_PASSWORD}`).toString('base64');
  const restUrl = WORDPRESS_API_URL.replace('/graphql', '/wp-json/wp/v2/recipe/' + recipe.databaseId);
  
  const response = await fetch(restUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    },
    body: JSON.stringify({
      content: newContent,
      acf: {
        assignedauthor: authorId
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WordPress update failed: ${response.status} ${response.statusText}\n${errorText}`);
  }
}

/**
 * Process a single recipe with detailed error handling
 */
async function processRecipe(slug: string, index: number, total: number): Promise<ProcessResult> {
  const result: ProcessResult = {
    slug,
    title: '',
    success: false
  };

  try {
    console.log(`\n[${ index + 1}/${total}] Processing: ${slug}`);
    
    // Step 1: Fetch recipe
    console.log(`   📥 Fetching recipe...`);
    const recipe = await fetchRecipe(slug);
    
    if (!recipe) {
      result.error = 'Recipe not found';
      result.errorDetails = 'Recipe does not exist in WordPress';
      console.log(`   ❌ Recipe not found`);
      return result;
    }
    
    result.title = recipe.title;
    console.log(`   ✅ Found: ${recipe.title}`);
    
    // Check if already updated
    if (recipe.recipeSchema.assignedauthor) {
      console.log(`   ⏭️  Already has author: ${recipe.recipeSchema.assignedauthor}`);
      result.success = true;
      result.author = recipe.recipeSchema.assignedauthor;
      return result;
    }
    
    // Step 2: Assign author
    const authorId = assignAuthor(recipe);
    const author = AUTHORS[authorId as keyof typeof AUTHORS];
    console.log(`   👤 Author: ${author.name}`);
    
    // Step 3: Generate content
    console.log(`   🤖 Generating content with AI...`);
    const newContent = await regenerateContent(recipe, authorId);
    console.log(`   ✅ Generated: ${recipe.content.length} → ${newContent.length} chars`);
    
    // Step 4: Update WordPress
    console.log(`   ✍️  Updating WordPress...`);
    await updateRecipe(recipe, newContent, authorId);
    console.log(`   ✅ SUCCESS!`);
    
    result.success = true;
    result.author = authorId;
    result.originalLength = recipe.content.length;
    result.newLength = newContent.length;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`   ❌ ERROR: ${errorMessage}`);
    result.error = errorMessage.split('\n')[0]; // First line only
    result.errorDetails = errorMessage;
  }

  return result;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔄 RETRY FAILED RECIPES\n');
  console.log(`Found ${FAILED_SLUGS.length} failed recipes to retry\n`);
  
  // Test connections first
  console.log('=== Pre-flight Checks ===\n');
  const wpOk = await testConnection();
  const aiOk = await testOpenRouter();
  
  if (!wpOk || !aiOk) {
    console.error('\n❌ Pre-flight checks failed. Please fix configuration and try again.');
    process.exit(1);
  }
  
  console.log('\n=== Processing Recipes ===\n');
  
  const results: ProcessResult[] = [];
  
  for (let i = 0; i < FAILED_SLUGS.length; i++) {
    const slug = FAILED_SLUGS[i];
    const result = await processRecipe(slug, i, FAILED_SLUGS.length);
    results.push(result);
    
    // Delay between recipes
    if (i < FAILED_SLUGS.length - 1) {
      console.log(`   ⏳ Waiting ${DELAY_BETWEEN_RECIPES / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_RECIPES));
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\nFailed recipes:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.slug}: ${r.error}`);
    });
  }
  
  // Save detailed log
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const logPath = path.join(__dirname, '..', 'logs', `retry-${timestamp}.json`);
  
  const logData = {
    timestamp: new Date().toISOString(),
    total: FAILED_SLUGS.length,
    successful,
    failed,
    results
  };
  
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.writeFileSync(logPath, JSON.stringify(logData, null, 2));
  
  console.log(`\n📄 Detailed log saved: ${logPath}`);
  
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
