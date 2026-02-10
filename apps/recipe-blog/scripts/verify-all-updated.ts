#!/usr/bin/env tsx
/**
 * Verify All Recipes Have Authors
 * 
 * Quick check to ensure all 100 recipes have been assigned authors
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

async function verifyAllRecipes() {
  console.log('🔍 Verifying all recipes have assigned authors...\n');
  
  const query = `
    query GetAllRecipes {
      recipes(first: 100) {
        nodes {
          slug
          title
          recipeSchema {
            assignedauthor
          }
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
    const recipes = result.data.recipes.nodes;
    
    const withAuthor = recipes.filter((r: any) => r.recipeSchema.assignedauthor);
    const withoutAuthor = recipes.filter((r: any) => !r.recipeSchema.assignedauthor);
    
    console.log(`📊 Total Recipes: ${recipes.length}`);
    console.log(`✅ With Author: ${withAuthor.length}`);
    console.log(`❌ Without Author: ${withoutAuthor.length}\n`);
    
    if (withoutAuthor.length > 0) {
      console.log('Recipes missing authors:');
      withoutAuthor.forEach((r: any) => {
        console.log(`  - ${r.slug}: ${r.title}`);
      });
    } else {
      console.log('🎉 SUCCESS! All recipes have assigned authors!');
    }
    
    // Show author distribution
    const authorCounts: Record<string, number> = {};
    withAuthor.forEach((r: any) => {
      const author = r.recipeSchema.assignedauthor;
      authorCounts[author] = (authorCounts[author] || 0) + 1;
    });
    
    console.log('\n📈 Author Distribution:');
    Object.entries(authorCounts)
      .sort(([, a], [, b]) => b - a)
      .forEach(([author, count]) => {
        console.log(`  ${author}: ${count} recipes`);
      });
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verifyAllRecipes();
