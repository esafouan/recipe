#!/usr/bin/env tsx
/**
 * Regenerate Recipe Content for AdSense Approval
 * 
 * This script:
 * 1. Fetches existing recipe from WordPress
 * 2. Uses AI to regenerate content (AdSense-optimized with author voice)
 * 3. Assigns appropriate author based on recipe category
 * 4. Updates WordPress via GraphQL mutation
 * 
 * Content improvements for AdSense:
 * - Adds personal author introduction
 * - Includes cooking story/experience
 * - Adds expert tips and advice
 * - Enhances E-E-A-T signals (Expertise, Experience, Authoritativeness, Trust)
 * - Maintains raw HTML format
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME;
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Author profiles for assignment
const AUTHORS = {
  'sarah-mitchell': {
    name: 'Sarah Mitchell',
    specialty: ['main-dishes', 'comfort-food', 'american'],
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
    specialty: ['soups', 'stews', 'slow-cooking', 'comfort'],
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
    prepTime?: string;
    cookTime?: string;
    difficulty?: string[];
    dietary?: string[];
    rawIngredients?: string;
    rawInstructions?: string;
    assignedauthor?: string;
  };
}

/**
 * Fetch recipe from WordPress
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
          prepTime
          cookTime
          difficulty
          dietary
          rawIngredients
          rawInstructions
          assignedauthor
        }
      }
    }
  `;

  const response = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug } })
  });

  const result = await response.json();

  if (result.errors) {
    console.error('GraphQL Errors:', result.errors);
    return null;
  }

  return result.data?.recipe || null;
}

/**
 * Assign best author based on recipe category and content
 */
function assignAuthor(recipe: Recipe): string {
  const categories = recipe.recipeCategories.nodes.map(c => c.slug);
  const title = recipe.title.toLowerCase();
  
  // Check each author's specialty
  for (const [authorId, author] of Object.entries(AUTHORS)) {
    for (const specialty of author.specialty) {
      if (categories.includes(specialty) || title.includes(specialty)) {
        return authorId;
      }
    }
  }
  
  // Default to Sarah (main dishes)
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

  try {
    // Try OpenRouter first
    if (OPENROUTER_API_KEY) {
      console.log('   Using OpenRouter API...');
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
    
    // Fallback to Anthropic direct
    if (ANTHROPIC_API_KEY) {
      console.log('   Using Anthropic API...');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      });

      const data = await response.json();
      return data.content[0].text;
    }

    throw new Error('No API key found for OpenRouter or Anthropic');
  } catch (error) {
    console.error('   ❌ AI generation failed:', error);
    throw error;
  }
}

/**
 * Update recipe in WordPress via GraphQL mutation
 * 
 * Note: We update content via generic updatePost mutation since Recipe custom post type
 * might not have updateRecipe mutation available. Then we update ACF fields separately.
 */
async function updateRecipe(recipe: Recipe, newContent: string, authorId: string): Promise<boolean> {
  if (!WORDPRESS_USERNAME || !WORDPRESS_APP_PASSWORD) {
    throw new Error('WordPress credentials not found in .env.local');
  }

  const auth = Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_APP_PASSWORD}`).toString('base64');

  // Strategy: Update content field using REST API (more reliable for custom post types)
  const restUrl = WORDPRESS_API_URL.replace('/graphql', '/wp-json/wp/v2/recipe/' + recipe.databaseId);
  
  console.log('   Updating via REST API...');
  console.log('   URL:', restUrl);
  
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

  if (!restResponse.ok) {
    const errorText = await restResponse.text();
    console.error('   ❌ REST API error:', restResponse.status, errorText);
    return false;
  }

  const result = await restResponse.json();
  console.log('   ✅ Updated successfully via REST API');
  
  return true;
}

/**
 * Main function
 */
async function regenerateAndUpdateRecipe(slug: string, dryRun: boolean = false) {
  console.log('\n🚀 Regenerating Recipe Content for AdSense Approval\n');
  console.log('='.repeat(70));
  console.log(`Recipe: ${slug}`);
  console.log(`Mode: ${dryRun ? '🔍 DRY RUN (no updates)' : '✍️  LIVE UPDATE'}`);
  console.log('='.repeat(70));

  // Step 1: Fetch recipe
  console.log('\n📥 Step 1: Fetching recipe from WordPress...');
  const recipe = await fetchRecipe(slug);
  
  if (!recipe) {
    console.error('❌ Recipe not found');
    return;
  }

  console.log(`✅ Found: ${recipe.title}`);
  console.log(`   ID: ${recipe.id}`);
  console.log(`   Categories: ${recipe.recipeCategories.nodes.map(c => c.name).join(', ')}`);
  console.log(`   Current Author: ${recipe.recipeSchema.assignedauthor || '(none)'}`);
  console.log(`   Content Length: ${recipe.content.length} chars`);

  // Step 2: Assign author
  console.log('\n👤 Step 2: Assigning best author...');
  const authorId = assignAuthor(recipe);
  const author = AUTHORS[authorId as keyof typeof AUTHORS];
  console.log(`✅ Assigned: ${author.name} (${authorId})`);
  console.log(`   Specialty: ${author.specialty.join(', ')}`);
  console.log(`   Voice: ${author.voice}`);

  // Step 3: Generate new content
  console.log('\n🤖 Step 3: Generating AdSense-optimized content with AI...');
  console.log('   This may take 30-60 seconds...');
  
  try {
    const newContent = await regenerateContent(recipe, authorId);
    console.log(`✅ Generated ${newContent.length} chars of new content`);
    
    // Show preview
    console.log('\n📄 Content Preview (first 500 chars):');
    console.log('─'.repeat(70));
    console.log(newContent.substring(0, 500).replace(/\n/g, '\n   '));
    console.log('─'.repeat(70));

    // Step 4: Update WordPress (if not dry run)
    if (dryRun) {
      console.log('\n🔍 DRY RUN - Skipping WordPress update');
      console.log('\n💾 To save this content, run again without --dry-run flag');
      return;
    }

    console.log('\n✍️  Step 4: Updating WordPress...');
    const success = await updateRecipe(recipe, newContent, authorId);
    
    if (success) {
      console.log('✅ Successfully updated!');
      console.log(`\n🌐 View at: https://cozybiteskitchen.com/recipes/${recipe.slug}`);
      console.log(`🔧 Edit in WordPress: ${WORDPRESS_API_URL.replace('/graphql', '')}/wp-admin/post.php?post=${recipe.databaseId}&action=edit`);
    } else {
      console.error('❌ Update failed - check errors above');
    }

  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
  }

  console.log('\n' + '='.repeat(70));
  console.log('✨ Done!');
  console.log('='.repeat(70) + '\n');
}

// CLI Interface
const args = process.argv.slice(2);
const slug = args[0];
const dryRun = args.includes('--dry-run');

if (!slug) {
  console.error(`
❌ Usage: npx tsx scripts/regenerate-and-update-recipe.ts <slug> [--dry-run]

Examples:
  npx tsx scripts/regenerate-and-update-recipe.ts mortons-chicken-christopher --dry-run
  npx tsx scripts/regenerate-and-update-recipe.ts cabbage-edamame-salad

Options:
  --dry-run    Generate content but don't update WordPress (for testing)

Environment Variables Required:
  NEXT_PUBLIC_WORDPRESS_API_URL  - WordPress GraphQL endpoint
  WORDPRESS_USERNAME             - WordPress username
  WORDPRESS_APP_PASSWORD         - WordPress application password
  OPENROUTER_API_KEY            - OpenRouter API key (or ANTHROPIC_API_KEY)
`);
  process.exit(1);
}

regenerateAndUpdateRecipe(slug, dryRun);
