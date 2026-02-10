#!/usr/bin/env tsx
/**
 * Regenerate Recipe Content - Cookie Auth Version
 * 
 * This version uses WordPress cookie authentication instead of Application Passwords
 * since Application Passwords are not enabled on this WordPress installation.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME!;
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD!;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

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
    prepTime?: string;
    cookTime?: string;
    difficulty?: string[];
    dietary?: string[];
    rawIngredients?: string;
    rawInstructions?: string;
    assignedauthor?: string;
  };
}

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
  return result.data?.recipe || null;
}

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

  throw new Error('No API key found for OpenRouter');
}

async function saveToFile(recipe: Recipe, newContent: string, authorId: string, dryRun: boolean) {
  const outputDir = path.join(__dirname, '..', 'generated-content');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `${recipe.slug}-updated.json`;
  const filepath = path.join(outputDir, filename);

  const data = {
    slug: recipe.slug,
    id: recipe.id,
    databaseId: recipe.databaseId,
    title: recipe.title,
    assignedAuthor: authorId,
    originalContentLength: recipe.content.length,
    newContentLength: newContent.length,
    content: newContent,
    timestamp: new Date().toISOString(),
    dryRun
  };

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`\n💾 Content saved to: ${filepath}`);
  
  return filepath;
}

async function regenerateAndSave(slug: string, dryRun: boolean = true) {
  console.log('\n🚀 Regenerating Recipe Content for AdSense Approval\n');
  console.log('='.repeat(70));
  console.log(`Recipe: ${slug}`);
  console.log(`Mode: ${dryRun ? '🔍 DRY RUN (save to file)' : '✍️  LIVE UPDATE'}`);
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

  // Step 3: Generate new content
  console.log('\n🤖 Step 3: Generating AdSense-optimized content with AI...');
  console.log('   This may take 30-60 seconds...');
  
  try {
    const newContent = await regenerateContent(recipe, authorId);
    console.log(`✅ Generated ${newContent.length} chars of new content`);
    console.log(`   Increase: +${newContent.length - recipe.content.length} chars (${Math.round((newContent.length / recipe.content.length) * 100)}% of original)`);
    
    // Step 4: Save to file
    const filepath = await saveToFile(recipe, newContent, authorId, dryRun);
    
    console.log('\n✅ Success!');
    console.log('\n📋 Next Steps:');
    console.log(`   1. Review the content in: ${filepath}`);
    console.log(`   2. Manually update in WordPress admin, or`);
    console.log(`   3. Use WordPress admin to copy/paste the content`);
    console.log('\n🌐 WordPress Edit URL:');
    console.log(`   ${WORDPRESS_API_URL.replace('/graphql', '')}/wp-admin/post.php?post=${recipe.databaseId}&action=edit`);

  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
  }

  console.log('\n' + '='.repeat(70));
  console.log('✨ Done!');
  console.log('='.repeat(70) + '\n');
}

// CLI
const args = process.argv.slice(2);
const slug = args[0];

if (!slug) {
  console.error(`
❌ Usage: npx tsx scripts/regenerate-and-save-recipe.ts <slug>

Example:
  npx tsx scripts/regenerate-and-save-recipe.ts mortons-chicken-christopher

This will:
  1. Fetch the recipe from WordPress
  2. Generate AdSense-optimized content with AI
  3. Save to generated-content/ folder
  4. Give you the WordPress edit link

Then you can manually copy/paste into WordPress admin.
`);
  process.exit(1);
}

regenerateAndSave(slug, true);
