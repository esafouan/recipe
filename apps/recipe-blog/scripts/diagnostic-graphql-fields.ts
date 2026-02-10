#!/usr/bin/env tsx
/**
 * Diagnostic: Check if assignedauthor field is accessible via GraphQL
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

async function checkGraphQLFields() {
  console.log('🔍 Checking GraphQL ACF Field Access\n');
  
  const query = `
    query CheckAuthorField {
      recipe(id: "mortons-chicken-christopher", idType: SLUG) {
        title
        slug
        databaseId
        recipeSchema {
          assignedauthor
          authorintro
          cookingstory
          cheftips
        }
      }
    }
  `;

  try {
    const response = await fetch(WORDPRESS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const result = await response.json();
    
    console.log('📊 GraphQL Response:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.data?.recipe) {
      const recipe = result.data.recipe;
      console.log('\n✅ Recipe Found:');
      console.log(`   Title: ${recipe.title}`);
      console.log(`   Database ID: ${recipe.databaseId}`);
      console.log(`   assignedauthor: ${recipe.recipeSchema?.assignedauthor || '❌ NULL'}`);
      console.log(`   authorintro: ${recipe.recipeSchema?.authorintro ? '✅ HAS CONTENT' : '❌ NULL'}`);
      console.log(`   cookingstory: ${recipe.recipeSchema?.cookingstory ? '✅ HAS CONTENT' : '❌ NULL'}`);
      console.log(`   cheftips: ${recipe.recipeSchema?.cheftips ? '✅ HAS CONTENT' : '❌ NULL'}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkGraphQLFields();
