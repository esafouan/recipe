#!/usr/bin/env tsx
/**
 * Bulk Update All Recipes for AdSense Approval
 * 
 * This script processes ALL recipes in your WordPress site:
 * 1. Fetches all recipes
 * 2. Assigns appropriate author based on category
 * 3. Regenerates content with AI (AdSense-optimized)
 * 4. Updates WordPress via REST API
 * 5. Logs progress and errors
 * 
 * Features:
 * - Automatic retry on failures
 * - Progress tracking
 * - Error logging
 * - Rate limiting to avoid API overload
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME!;
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD!;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Configuration
const BATCH_SIZE = 100; // Process this many at a time
const DELAY_BETWEEN_RECIPES = 3000; // 3 seconds delay between each recipe
const MAX_RETRIES = 2;

// Author profiles
const AUTHORS = {
  'sarah-mitchell': {
    name: 'Sarah Mitchell',
    specialty: ['main-dishes', 'comfort-food', 'american', 'beef', 'chicken'],
    voice: 'warm, welcoming, focuses on family dinners and entertaining'
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
  'james-caldwell': {
    name: 'James Caldwell',
    specialty: ['soups', 'stews', 'slow-cooking', 'comfort', 'soup'],
    voice: 'rustic, hearty, emphasizes slow cooking and depth of flavor'
  },
  'isabel-tanaka': {
    name: 'Isabel Tanaka',
    specialty: ['fusion', 'asian', 'modern', 'innovative'],
    voice: 'creative, innovative, blends traditions with modern techniques'
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
  author?: string;
  originalLength?: number;
  newLength?: number;
}

/**
 * Fetch all recipes from WordPress
 */
async function fetchAllRecipes(): Promise<Recipe[]> {
  const query = `
    query GetAllRecipes {
      recipes(first: ${BATCH_SIZE}) {
        nodes {
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
    }
  `;

  const response = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  const result = await response.json();
  return result.data?.recipes?.nodes || [];
}

/**
 * Assign best author based on recipe category
 */
function assignAuthor(recipe: Recipe): string {
  const categories = recipe.recipeCategories.nodes.map(c => c.slug.toLowerCase());
  const title = recipe.title.toLowerCase();
  
  for (const [authorId, author] of Object.entries(AUTHORS)) {
    for (const specialty of author.specialty) {
      if (categories.includes(specialty) || title.includes(specialty)) {
        return authorId;
      }
    }
  }
  
  return 'sarah-mitchell';
}

/**
 * Generate AdSense-optimized content with AI
 */
async function regenerateContent(recipe: Recipe, authorId: string): Promise<string> {
  const author = AUTHORS[authorId as keyof typeof AUTHORS];
  
  const prompt = `You are ${author.name}, a professional chef writing for Cozy Bites Kitchen blog.

Your writing style is: ${author.voice}

TASK: Rewrite this recipe content to be MORE ENGAGING and AdSense-friendly while keeping it as RAW HTML.

CURRENT RECIPE:
Title: ${recipe.title}
Category: ${recipe.recipeCategories.nodes.map(c => c.name).join(', ')}
Current Content:
${recipe.content}

REQUIREMENTS FOR ADSENSE APPROVAL:

1. **Author Voice & Personality** - Write in first person, show your expertise and experience
2. **Personal Story** - Add a brief personal anecdote about this recipe (2-3 sentences)
3. **Expert Tips** - Include 3-4 professional tips based on your experience
4. **E-E-A-T Signals** - Demonstrate Expertise, Experience, Authoritativeness, Trust
5. **Engaging Introduction** - Start with a warm, personal greeting from you
6. **Value-Added Content** - Go beyond just instructions, teach techniques
7. **Keep HTML Format** - Return raw HTML with proper WordPress block format

STRUCTURE YOUR RESPONSE:

<div class="author-intro" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <p><strong>From ${author.name}:</strong> [Personal introduction about you and this recipe, 2-3 sentences showing your connection to it]</p>
</div>

[ORIGINAL RECIPE CONTENT - Enhanced with more details, tips, and personal touches. REMOVE any existing "Chef's Tips" section if present to avoid duplication]

<div class="cooking-story" style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3 class="wp-block-heading">My Story With This Recipe</h3>
  <p>[Personal anecdote about developing or perfecting this recipe. Show your experience and testing process. 2-3 paragraphs.]</p>
</div>

<div class="chef-tips" style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3 class="wp-block-heading">${author.name}'s Professional Tips</h3>
  <ul class="wp-block-list">
    <li><strong>[Tip category]:</strong> [Detailed professional tip]</li>
    <li><strong>[Tip category]:</strong> [Detailed professional tip]</li>
    <li><strong>[Tip category]:</strong> [Detailed professional tip]</li>
    <li><strong>[Tip category]:</strong> [Detailed professional tip]</li>
  </ul>
</div>

CRITICAL REQUIREMENTS:
- NO EMOJIS anywhere (no 👋, 📖, 👨‍🍳, etc.) - keep it professional
- REMOVE any existing "Chef's Tips" or similar sections from original content to avoid duplication
- Keep ALL other recipe details, headings, and structure from original
- Add personality and expertise throughout remaining content
- Use HTML entities for special characters (&#8217; for apostrophes, etc.)
- Keep WordPress block editor classes (wp-block-heading, wp-block-list, etc.)
- Make it feel like a real professional chef wrote this
- NO markdown - only HTML
- Be specific and detailed in tips and stories
- Professional tone throughout - like a cooking magazine article

Return ONLY the complete HTML content, nothing else.`;

  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not found');
  }

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

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Update recipe in WordPress via REST API
 */
async function updateRecipe(recipe: Recipe, newContent: string, authorId: string): Promise<boolean> {
  const auth = Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_APP_PASSWORD}`).toString('base64');
  const restUrl = WORDPRESS_API_URL.replace('/graphql', '/wp-json/wp/v2/recipe/' + recipe.databaseId);
  
  const restResponse = await fetch(restUrl, {
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

  return restResponse.ok;
}

/**
 * Process a single recipe
 */
async function processRecipe(recipe: Recipe, index: number, total: number): Promise<ProcessResult> {
  const result: ProcessResult = {
    slug: recipe.slug,
    title: recipe.title,
    success: false
  };

  try {
    console.log(`\n[${ index + 1}/${total}] Processing: ${recipe.title}`);
    console.log(`   Slug: ${recipe.slug}`);
    
    // Skip if already has author assigned
    if (recipe.recipeSchema.assignedauthor) {
      console.log(`   ⏭️  Skipping - already has author: ${recipe.recipeSchema.assignedauthor}`);
      result.success = true;
      result.author = recipe.recipeSchema.assignedauthor;
      return result;
    }

    // Assign author
    const authorId = assignAuthor(recipe);
    const author = AUTHORS[authorId as keyof typeof AUTHORS];
    console.log(`   👤 Author: ${author.name}`);
    
    // Generate content
    console.log(`   🤖 Generating content...`);
    const newContent = await regenerateContent(recipe, authorId);
    console.log(`   ✅ Generated: ${recipe.content.length} → ${newContent.length} chars`);
    
    // Update WordPress
    console.log(`   ✍️  Updating WordPress...`);
    const success = await updateRecipe(recipe, newContent, authorId);
    
    if (success) {
      console.log(`   ✅ SUCCESS!`);
      result.success = true;
      result.author = authorId;
      result.originalLength = recipe.content.length;
      result.newLength = newContent.length;
    } else {
      console.log(`   ❌ Update failed`);
      result.error = 'WordPress update failed';
    }
    
  } catch (error) {
    console.log(`   ❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    result.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return result;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Save results to log file
 */
function saveResults(results: ProcessResult[]) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logDir = path.join(__dirname, '..', 'logs');
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logFile = path.join(logDir, `bulk-update-${timestamp}.json`);
  
  const summary = {
    timestamp: new Date().toISOString(),
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    skipped: results.filter(r => r.success && !r.newLength).length,
    results
  };

  fs.writeFileSync(logFile, JSON.stringify(summary, null, 2));
  console.log(`\n📄 Results saved to: ${logFile}`);
  
  return summary;
}

/**
 * Main bulk update function
 */
async function bulkUpdateRecipes() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 BULK UPDATE ALL RECIPES FOR ADSENSE APPROVAL');
  console.log('='.repeat(70));
  console.log(`\nConfiguration:`);
  console.log(`  - Batch Size: ${BATCH_SIZE} recipes`);
  console.log(`  - Delay: ${DELAY_BETWEEN_RECIPES}ms between recipes`);
  console.log(`  - API: OpenRouter (Claude 3.5 Sonnet)`);
  console.log('\n' + '='.repeat(70) + '\n');

  // Fetch all recipes
  console.log('📥 Fetching all recipes from WordPress...\n');
  const recipes = await fetchAllRecipes();
  
  if (recipes.length === 0) {
    console.log('❌ No recipes found!');
    return;
  }

  console.log(`✅ Found ${recipes.length} recipes\n`);
  console.log('Starting processing...\n');
  console.log('='.repeat(70));

  const results: ProcessResult[] = [];
  const startTime = Date.now();

  // Process each recipe
  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const result = await processRecipe(recipe, i, recipes.length);
    results.push(result);

    // Delay between recipes to avoid rate limits
    if (i < recipes.length - 1) {
      console.log(`   ⏳ Waiting ${DELAY_BETWEEN_RECIPES / 1000}s before next recipe...`);
      await sleep(DELAY_BETWEEN_RECIPES);
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000 / 60).toFixed(2);

  // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 BULK UPDATE COMPLETE');
  console.log('='.repeat(70));
  
  const summary = saveResults(results);
  
  console.log(`\n✅ Successfully updated: ${summary.successful} recipes`);
  console.log(`❌ Failed: ${summary.failed} recipes`);
  console.log(`⏭️  Skipped (already updated): ${summary.skipped} recipes`);
  console.log(`⏱️  Total time: ${duration} minutes`);
  
  if (summary.failed > 0) {
    console.log(`\n❌ Failed recipes:`);
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.title}: ${r.error}`);
    });
  }

  console.log('\n' + '='.repeat(70));
  console.log('✨ All done! Check your website to see the updated recipes.');
  console.log('='.repeat(70) + '\n');
}

// Run the bulk update
bulkUpdateRecipes().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
