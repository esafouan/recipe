#!/usr/bin/env tsx
/**
 * Test WordPress Data Structure
 * 
 * This script fetches one recipe from WordPress to see:
 * 1. How data is structured
 * 2. What the ACF field names are exactly
 * 3. How to properly update via GraphQL
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

async function testWordPressStructure() {
  console.log('🔍 Testing WordPress Data Structure\n');
  console.log(`API URL: ${GRAPHQL_URL}\n`);

  // Test 1: Fetch one recipe with ALL fields
  const query = `
    query TestRecipeStructure {
      recipes(first: 1) {
        nodes {
          id
          databaseId
          title
          slug
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
            
            # Author fields (lowercase from ACF)
            authorintro
            cookingstory
            cheftips
            assignedauthor
            
            # Other fields
            whyLove
            tools
            recipeImages {
              img1 {
                node {
                  sourceUrl
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
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const json = await response.json();

    if (json.errors) {
      console.error('❌ GraphQL Errors:');
      console.error(JSON.stringify(json.errors, null, 2));
      return;
    }

    const recipe = json.data.recipes.nodes[0];
    
    console.log('✅ Successfully fetched recipe!\n');
    console.log('='.repeat(60));
    console.log('RECIPE DATA STRUCTURE');
    console.log('='.repeat(60));
    console.log('\n📋 Basic Info:');
    console.log(`  ID (Global): ${recipe.id}`);
    console.log(`  Database ID: ${recipe.databaseId}`);
    console.log(`  Title: ${recipe.title}`);
    console.log(`  Slug: ${recipe.slug}`);
    
    console.log('\n📂 Categories:');
    recipe.recipeCategories.nodes.forEach((cat: any) => {
      console.log(`  - ${cat.name} (${cat.slug})`);
    });
    
    console.log('\n📝 Content Field (first 200 chars):');
    console.log(`  ${recipe.content.substring(0, 200)}...`);
    
    console.log('\n🔧 Recipe Schema Fields:');
    const schema = recipe.recipeSchema;
    console.log(`  prepTime: ${schema.prepTime || 'null'}`);
    console.log(`  cookTime: ${schema.cookTime || 'null'}`);
    console.log(`  difficulty: ${schema.difficulty || 'null'}`);
    
    console.log('\n👤 Author Fields (Current Status):');
    console.log(`  authorintro: ${schema.authorintro ? '✅ Has data (' + schema.authorintro.length + ' chars)' : '❌ Empty/null'}`);
    console.log(`  cookingstory: ${schema.cookingstory ? '✅ Has data (' + schema.cookingstory.length + ' chars)' : '❌ Empty/null'}`);
    console.log(`  cheftips: ${schema.cheftips ? '✅ Has data (' + schema.cheftips.length + ' chars)' : '❌ Empty/null'}`);
    console.log(`  assignedauthor: ${schema.assignedauthor ? '✅ Has data: ' + schema.assignedauthor : '❌ Empty/null'}`);
    
    console.log('\n' + '='.repeat(60));
    console.log('FULL JSON STRUCTURE (for reference)');
    console.log('='.repeat(60));
    console.log(JSON.stringify(recipe, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('UPDATE MUTATION TEST');
    console.log('='.repeat(60));
    
    // Test 2: Show what an update mutation would look like
    console.log('\n📝 Example update mutation for this recipe:\n');
    
    const updateMutation = `
mutation UpdateRecipeAuthorFields {
  updateRecipe(
    input: {
      id: "${recipe.id}"
      recipeSchema: {
        authorintro: "Your generated author intro here..."
        cookingstory: "Your generated cooking story here..."
        cheftips: "Tip 1\\nTip 2\\nTip 3"
        assignedauthor: "sarah-mitchell"
      }
    }
  ) {
    recipe {
      id
      databaseId
      title
      recipeSchema {
        authorintro
        cookingstory
        cheftips
        assignedauthor
      }
    }
  }
}`;
    
    console.log(updateMutation);
    
    console.log('\n' + '='.repeat(60));
    console.log('KEY FINDINGS FOR UPDATE SCRIPT');
    console.log('='.repeat(60));
    console.log('\n✅ To update this recipe, you need:');
    console.log(`  1. Global ID: ${recipe.id}`);
    console.log(`  2. Database ID: ${recipe.databaseId} (alternative identifier)`);
    console.log('  3. Field names: authorintro, cookingstory, cheftips, assignedauthor (lowercase!)');
    console.log('  4. Mutation format: updateRecipe with recipeSchema input');
    
    console.log('\n📋 Recipe Details for Testing:');
    console.log(`  Title: ${recipe.title}`);
    console.log(`  Slug: ${recipe.slug}`);
    console.log(`  URL: https://cozybiteskitchen.com/recipes/${recipe.slug}`);
    
    console.log('\n✨ Next Steps:');
    console.log('  1. Use this Global ID format for updates');
    console.log('  2. Test mutation with WordPress Application Password');
    console.log('  3. Verify mutation support in WPGraphQL settings');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run test
testWordPressStructure().catch(console.error);
