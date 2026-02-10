#!/usr/bin/env tsx
/**
 * Test Content Update Strategy
 * 
 * This script demonstrates updating the WordPress content field
 * with author sections embedded directly in the HTML.
 * 
 * Strategy:
 * 1. Keep existing content
 * 2. Add author intro at the beginning
 * 3. Add cooking story after intro
 * 4. Add chef tips at the end
 * 5. Update assignedauthor field
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local from the project root
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

async function testContentUpdate() {
  console.log('\n🔍 Testing Content Update Strategy\n');
  console.log('📍 WordPress URL:', WORDPRESS_API_URL);
  console.log('\n' + '='.repeat(60) + '\n');

  // First, fetch the current recipe
  const fetchQuery = `
    query GetRecipe {
      recipe(id: "mortons-chicken-christopher", idType: SLUG) {
        id
        databaseId
        slug
        title
        content
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
      body: JSON.stringify({ query: fetchQuery })
    });

    const result = await response.json();

    if (result.errors) {
      console.error('❌ GraphQL Errors:', JSON.stringify(result.errors, null, 2));
      return;
    }

    const recipe = result.data.recipe;
    
    console.log('✅ Current Recipe Data:\n');
    console.log('📊 Basic Info:');
    console.log('  - ID:', recipe.id);
    console.log('  - Title:', recipe.title);
    console.log('  - Assigned Author:', recipe.recipeSchema.assignedauthor || '(not set)');
    
    console.log('\n📝 Current Content (first 500 chars):');
    const currentContent = recipe.content || '';
    console.log('  ' + currentContent.substring(0, 500).replace(/\n/g, '\n  '));
    
    console.log('\n\n' + '='.repeat(60));
    console.log('💡 NEW CONTENT STRUCTURE');
    console.log('='.repeat(60) + '\n');

    // Example of enhanced content with author sections
    const authorIntro = `<div class="author-intro" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <p><strong>👋 From Sarah Mitchell:</strong> Hi there! I'm Sarah Mitchell, your culinary guide at Cozy Bites Kitchen. I've been perfecting this Morton's copycat recipe for years, and I'm thrilled to share my restaurant-quality version with you. This dish never fails to impress at dinner parties!</p>
</div>`;

    const cookingStory = `<div class="cooking-story" style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3>📖 My Story With This Recipe</h3>
  <p>I first tried Chicken Christopher at Morton's during a special anniversary dinner. The combination of the crispy seared chicken with that luxurious garlic cream sauce was absolutely unforgettable. I spent weeks in my test kitchen recreating it, adjusting the ratios until I nailed that perfect balance of richness and tang. Now it's one of my signature dishes!</p>
</div>`;

    const chefTips = `<div class="chef-tips" style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3>👨‍🍳 Sarah's Pro Tips</h3>
  <ul>
    <li><strong>Temperature is everything:</strong> Let your chicken come to room temperature before cooking for even searing.</li>
    <li><strong>Don't crowd the pan:</strong> If your skillet isn't big enough, cook the chicken in batches to ensure proper browning.</li>
    <li><strong>Save those fond bits:</strong> Those brown bits stuck to the pan are pure flavor gold. Scrape them up when you deglaze!</li>
    <li><strong>Sauce consistency:</strong> If your sauce is too thin, let it simmer a bit longer. Too thick? Add a splash of broth.</li>
  </ul>
</div>`;

    // Construct new content
    const newContent = `${authorIntro}

${currentContent}

${cookingStory}

${chefTips}`;

    console.log('📄 Enhanced Content Structure:\n');
    console.log('1️⃣ Author Intro Box (styled, with emoji)');
    console.log('2️⃣ Original Recipe Content');
    console.log('3️⃣ Cooking Story Box (styled, personal)');
    console.log('4️⃣ Chef Tips Box (styled, actionable)');
    
    console.log('\n\n' + '='.repeat(60));
    console.log('📋 MUTATION TO UPDATE WORDPRESS');
    console.log('='.repeat(60) + '\n');

    // Show the mutation needed
    const updateMutation = `
mutation UpdateRecipeWithAuthorContent {
  updateRecipe(
    input: {
      id: "${recipe.id}"
      content: """${newContent.replace(/"/g, '\\"')}"""
      recipeSchema: {
        assignedauthor: "sarah-mitchell"
      }
    }
  ) {
    recipe {
      id
      databaseId
      title
      content
      recipeSchema {
        assignedauthor
      }
    }
  }
}`;

    console.log('GraphQL Mutation:');
    console.log(updateMutation.substring(0, 800) + '...\n');
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 BENEFITS OF THIS APPROACH');
    console.log('='.repeat(60) + '\n');
    
    console.log('✅ Advantages:');
    console.log('  1. All content in one place (native WordPress field)');
    console.log('  2. Editors can modify in WordPress visual editor');
    console.log('  3. No dependency on ACF fields');
    console.log('  4. Better for SEO (all content indexed together)');
    console.log('  5. Styled boxes make author content stand out');
    console.log('  6. Only need assignedauthor field for author attribution');
    
    console.log('\n⚠️  Considerations:');
    console.log('  1. Need to preserve existing content when updating');
    console.log('  2. Check if content already has author sections (avoid duplicates)');
    console.log('  3. HTML needs to be properly escaped in mutation');
    
    console.log('\n\n' + '='.repeat(60));
    console.log('🛠️  REQUIRED FOR MUTATION');
    console.log('='.repeat(60) + '\n');
    
    console.log('❌ Missing: WordPress Application Password for authentication');
    console.log('\nAdd to .env.local:');
    console.log('  WORDPRESS_USERNAME=your-username');
    console.log('  WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx');
    
    console.log('\n📚 How to get Application Password:');
    console.log('  1. Login to WordPress admin');
    console.log('  2. Go to Users → Profile');
    console.log('  3. Scroll to "Application Passwords"');
    console.log('  4. Create new application password');
    console.log('  5. Copy the generated password (with spaces)');
    
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 SAMPLE OUTPUT (Content Preview)');
    console.log('='.repeat(60) + '\n');
    
    console.log(newContent.substring(0, 1000) + '...\n');
    
    console.log('\n✨ Ready to create the update script?');
    console.log('   This will update the content field with author sections.');

  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}

testContentUpdate();
