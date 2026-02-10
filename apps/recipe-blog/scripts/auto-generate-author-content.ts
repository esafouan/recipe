#!/usr/bin/env tsx
/**
 * Auto-Generate Author Content from Existing Blog Text
 * 
 * This script:
 * 1. Fetches all recipes from WordPress
 * 2. Extracts the existing blog content (HTML)
 * 3. Assigns each recipe to an author based on category
 * 4. Converts the generic blog text into author-specific voice
 * 5. Generates: authorIntro, cookingStory, chefTips
 * 6. Updates WordPress via GraphQL mutations
 * 
 * Supports: OpenRouter (recommended) or Anthropic direct
 */

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env.local' });

// Types
interface Author {
  id: string;
  name: string;
  role: string;
  specialty: string;
  voice: string;
  categories: string[];
}

interface Recipe {
  databaseId: number;
  title: string;
  slug: string;
  content: string; // HTML blog content
  categories: string[];
}

// Author profiles for voice generation
const AUTHORS: Author[] = [
  {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    role: 'Founder & Recipe Developer',
    specialty: 'Comfort food, family-friendly meals',
    voice: 'Warm, nurturing, mom voice. Shares family stories and kids\' reactions. Focuses on making recipes work for busy families.',
    categories: ['beef']
  },
  {
    id: 'emily-chen',
    name: 'Emily Chen',
    role: 'Quick Meals Specialist',
    voice: 'Fast-paced, efficient, no-nonsense. Tech-savvy professional who values time-saving tips. Energetic and practical.',
    specialty: 'Quick weeknight dinners, meal prep',
    categories: ['soup']
  },
  {
    id: 'marco-rodriguez',
    name: 'Marco Rodriguez',
    role: 'International Cuisine Expert',
    voice: 'Passionate, authentic, educational. Shares cultural context and traditional techniques. Enthusiastic about bold flavors.',
    specialty: 'International flavors, authentic techniques',
    categories: ['desserts']
  },
  {
    id: 'olivia-greene',
    name: 'Olivia Greene',
    role: 'Wellness & Nutrition Coach',
    voice: 'Health-conscious, balanced, encouraging. Focuses on nutrition benefits and wholesome ingredients. Mindful and positive.',
    specialty: 'Healthy cooking, plant-based options',
    categories: ['salads']
  },
  {
    id: 'david-thompson',
    name: 'David Thompson',
    role: 'Classic Comfort Food Chef',
    voice: 'Traditional, nostalgic, grandfather-like. Shares old-school techniques and why they matter. Patient and detailed.',
    specialty: 'Classic recipes, time-tested techniques',
    categories: ['bread']
  }
];

// WordPress GraphQL endpoint
const GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

// API Configuration - supports OpenRouter or Anthropic
const USE_OPENROUTER = process.env.OPENROUTER_API_KEY ? true : false;
const API_KEY = process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY;
const API_BASE_URL = USE_OPENROUTER 
  ? 'https://openrouter.ai/api/v1/chat/completions'
  : 'https://api.anthropic.com/v1/messages';

// Model selection
const MODEL = USE_OPENROUTER
  ? 'anthropic/claude-3.5-sonnet' // OpenRouter model ID
  : 'claude-3-5-sonnet-20241022';  // Direct Anthropic model ID

console.log(`🤖 Using: ${USE_OPENROUTER ? 'OpenRouter' : 'Anthropic Direct'}`);
console.log(`📦 Model: ${MODEL}\n`);

// Assign author based on category
function assignAuthor(categories: string[]): Author {
  // Find author by category match
  for (const category of categories) {
    const author = AUTHORS.find(a => a.categories.includes(category));
    if (author) return author;
  }
  
  // Default to Sarah if no match
  return AUTHORS[0];
}

// Strip HTML tags to get plain text
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Generate author content using Claude (via OpenRouter or Anthropic)
async function generateAuthorContent(
  recipe: Recipe,
  author: Author,
  blogContent: string
): Promise<{
  authorIntro: string;
  cookingStory: string;
  chefTips: string;
}> {
  const plainContent = stripHtml(blogContent);
  
  const systemPrompt = `You are ${author.name}, a ${author.role}. Your writing voice is: ${author.voice}`;
  
  const userPrompt = `I have a recipe called "${recipe.title}" with this existing blog content:

${plainContent}

Your task: Transform this generic blog content into author-specific sections that feel personal and authentic.

Generate these 3 sections:

1. AUTHOR INTRO (150-200 words):
   - Write in first person as ${author.name}
   - Personal connection to this recipe type
   - Why YOU love this dish
   - Your expertise/testing process
   - Promise to the reader
   - Match this voice: ${author.voice}

2. COOKING STORY (100-150 words):
   - Share a specific moment/memory about creating or discovering this recipe
   - Make it feel real and personal
   - Include sensory details (smells, sounds, reactions)
   - Show your personality

3. CHEF TIPS (exactly 3 tips, one per line):
   - Practical, actionable advice
   - Based on the recipe content
   - Reflect your expertise as a ${author.role}
   - Each tip should be 10-20 words

Format your response EXACTLY like this:

AUTHOR_INTRO:
[Your 150-200 word introduction here]

COOKING_STORY:
[Your 100-150 word story here]

CHEF_TIPS:
[First tip - one line]
[Second tip - one line]
[Third tip - one line]

Remember: You are ${author.name}. Write authentically in YOUR voice. Make it personal and engaging!`;

  try {
    let responseText = '';
    
    if (USE_OPENROUTER) {
      // OpenRouter API call
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://cozybiteskitchen.com',
          'X-Title': 'Recipe Author Content Generator'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      });
      
      const data = await response.json();
      responseText = data.choices[0].message.content;
      
    } else {
      // Direct Anthropic API call
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY!,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1500,
          messages: [{
            role: 'user',
            content: `${systemPrompt}\n\n${userPrompt}`
          }]
        })
      });
      
      const data = await response.json();
      responseText = data.content[0].text;
    }
    
    // Parse the response
    const introMatch = responseText.match(/AUTHOR_INTRO:\s*\n([\s\S]*?)(?=\n\nCOOKING_STORY:)/);
    const storyMatch = responseText.match(/COOKING_STORY:\s*\n([\s\S]*?)(?=\n\nCHEF_TIPS:)/);
    const tipsMatch = responseText.match(/CHEF_TIPS:\s*\n([\s\S]*?)$/);

    return {
      authorIntro: introMatch ? introMatch[1].trim() : '',
      cookingStory: storyMatch ? storyMatch[1].trim() : '',
      chefTips: tipsMatch ? tipsMatch[1].trim() : ''
    };
  } catch (error) {
    console.error(`Error generating content for ${recipe.title}:`, error);
    return {
      authorIntro: '',
      cookingStory: '',
      chefTips: ''
    };
  }
}

// Fetch all recipes from WordPress
async function fetchAllRecipes(): Promise<Recipe[]> {
  const query = `
    query GetAllRecipes {
      recipes(first: 1000) {
        nodes {
          databaseId
          title
          slug
          content
          recipeCategories {
            nodes {
              slug
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  const json = await response.json();
  
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }

  return json.data.recipes.nodes.map((node: any) => ({
    databaseId: node.databaseId,
    title: node.title,
    slug: node.slug,
    content: node.content,
    categories: node.recipeCategories?.nodes?.map((c: any) => c.slug) || []
  }));
}

// Main execution
async function main() {
  console.log('🚀 Auto-Generating Author Content from Existing Blog Text\n');
  
  // Check for API key
  if (!API_KEY) {
    console.error('❌ Error: No API key found in environment variables\n');
    console.log('You need either:');
    console.log('  1. OPENROUTER_API_KEY (recommended)');
    console.log('     Get from: https://openrouter.ai/keys');
    console.log('     Add to .env.local: OPENROUTER_API_KEY=sk-or-xxxxx\n');
    console.log('  OR\n');
    console.log('  2. ANTHROPIC_API_KEY');
    console.log('     Get from: https://console.anthropic.com/');
    console.log('     Add to .env.local: ANTHROPIC_API_KEY=sk-ant-xxxxx\n');
    process.exit(1);
  }

  console.log('📊 Fetching recipes from WordPress...\n');
  const recipes = await fetchAllRecipes();
  console.log(`✅ Found ${recipes.length} recipes\n`);

  // Process first 5 recipes as a test
  const testRecipes = recipes.slice(0, 5);
  
  console.log('🎯 Processing first 5 recipes as test:\n');

  for (const recipe of testRecipes) {
    const author = assignAuthor(recipe.categories);
    
    console.log(`📝 ${recipe.title}`);
    console.log(`   Author: ${author.name} (${author.id})`);
    console.log(`   Categories: ${recipe.categories.join(', ')}`);
    console.log(`   Generating content with Claude...`);
    
    const authorContent = await generateAuthorContent(recipe, author, recipe.content);
    
    console.log(`   ✅ Generated!`);
    console.log(`      - Author Intro: ${authorContent.authorIntro.length} chars`);
    console.log(`      - Cooking Story: ${authorContent.cookingStory.length} chars`);
    console.log(`      - Chef Tips: ${authorContent.chefTips.split('\n').length} tips`);
    console.log('');
    
    // Preview first recipe
    if (testRecipes.indexOf(recipe) === 0) {
      console.log('\n📖 PREVIEW (First Recipe):\n');
      console.log('='.repeat(60));
      console.log(`Recipe: ${recipe.title}`);
      console.log(`Author: ${author.name}`);
      console.log('='.repeat(60));
      console.log('\nAUTHOR INTRO:');
      console.log(authorContent.authorIntro);
      console.log('\n\nCOOKING STORY:');
      console.log(authorContent.cookingStory);
      console.log('\n\nCHEF TIPS:');
      console.log(authorContent.chefTips);
      console.log('\n' + '='.repeat(60) + '\n');
    }
    
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n✅ Test generation complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Review the preview above');
  console.log('2. If content looks good, I can update WordPress');
  console.log('3. Or adjust the prompts and regenerate\n');
}

// Run it
main().catch(console.error);
