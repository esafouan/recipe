/**
 * List all recipes from WordPress
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local from the project root
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

async function listRecipes() {
  console.log('\n📋 Listing WordPress Recipes\n');
  console.log('📍 WordPress URL:', WORDPRESS_API_URL);
  console.log('\n' + '='.repeat(60) + '\n');

  const query = `
    query GetRecipes {
      recipes(first: 10) {
        nodes {
          id
          databaseId
          slug
          title
          date
        }
      }
    }
  `;

  try {
    const response = await fetch(WORDPRESS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('❌ GraphQL Errors:', JSON.stringify(result.errors, null, 2));
      return;
    }

    const recipes = result.data?.recipes?.nodes || [];

    if (recipes.length === 0) {
      console.log('❌ No recipes found');
      return;
    }

    console.log(`✅ Found ${recipes.length} recipes:\n`);
    recipes.forEach((recipe: any, index: number) => {
      console.log(`${index + 1}. ${recipe.title}`);
      console.log(`   - Slug: ${recipe.slug}`);
      console.log(`   - ID: ${recipe.id}`);
      console.log(`   - Database ID: ${recipe.databaseId}`);
      console.log(`   - Date: ${recipe.date}`);
      console.log('');
    });

    console.log('\n💡 To inspect a recipe, run:');
    console.log('   npx tsx scripts/inspect-wordpress-recipe.ts <slug>');

  } catch (error) {
    console.error('\n❌ Error fetching recipes:', error);
  }
}

listRecipes();
