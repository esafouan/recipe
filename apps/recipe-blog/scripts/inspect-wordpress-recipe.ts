/**
 * Inspect WordPress Recipe Data Structure
 * 
 * This script fetches a single recipe from WordPress to see:
 * - Exact field names and structure
 * - How ACF fields are returned
 * - Current data format
 * - What fields we can update
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local from the project root
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://savoredbites.com/graphql';

async function inspectRecipe(slug: string) {
  console.log('\n🔍 Inspecting WordPress Recipe Data Structure\n');
  console.log('📍 WordPress URL:', WORDPRESS_API_URL);
  console.log('📄 Recipe Slug:', slug);
  console.log('\n' + '='.repeat(60) + '\n');

  const query = `
    query GetRecipe($slug: ID!) {
      recipe(id: $slug, idType: SLUG) {
        id
        databaseId
        slug
        title
        content
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        recipeSchema {
          prepTime
          cookTime
          difficulty
          dietary
          rawIngredients
          rawInstructions
          authorintro
          cookingstory
          cheftips
          assignedauthor
          recipeImages {
            img1 {
              node {
                sourceUrl
                altText
              }
            }
            img2 {
              node {
                sourceUrl
                altText
              }
            }
            img3 {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
        recipeCategories {
          nodes {
            name
            slug
          }
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
      body: JSON.stringify({
        query,
        variables: { slug }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('❌ GraphQL Errors:', JSON.stringify(result.errors, null, 2));
      return;
    }

    if (!result.data?.recipe) {
      console.error('❌ Recipe not found');
      return;
    }

    const recipe = result.data.recipe;

    console.log('✅ Recipe Found!\n');
    console.log('📊 Basic Info:');
    console.log('  - ID:', recipe.id);
    console.log('  - Database ID:', recipe.databaseId);
    console.log('  - Slug:', recipe.slug);
    console.log('  - Title:', recipe.title);
    console.log('  - Published:', recipe.date);
    console.log('  - Modified:', recipe.modified);
    
    console.log('\n🖼️  Featured Image:');
    if (recipe.featuredImage?.node) {
      console.log('  - URL:', recipe.featuredImage.node.sourceUrl);
      console.log('  - Alt Text:', recipe.featuredImage.node.altText || '(none)');
    } else {
      console.log('  - No featured image');
    }

    console.log('\n📂 Categories:');
    if (recipe.recipeCategories?.nodes?.length > 0) {
      recipe.recipeCategories.nodes.forEach((cat: any) => {
        console.log(`  - ${cat.name} (${cat.slug})`);
      });
    } else {
      console.log('  - No categories');
    }

    console.log('\n📝 Content (first 200 chars):');
    const contentPreview = recipe.content?.replace(/<[^>]*>/g, '').substring(0, 200) || '(none)';
    console.log('  ' + contentPreview + '...');

    console.log('\n🍳 Recipe Schema Fields:');
    if (recipe.recipeSchema) {
      console.log('  - prepTime:', recipe.recipeSchema.prepTime || '(not set)');
      console.log('  - cookTime:', recipe.recipeSchema.cookTime || '(not set)');
      console.log('  - difficulty:', recipe.recipeSchema.difficulty || '(not set)');
      console.log('  - dietary:', recipe.recipeSchema.dietary || '(not set)');
      console.log('  - rawIngredients:', recipe.recipeSchema.rawIngredients ? `${recipe.recipeSchema.rawIngredients.length} chars` : '(not set)');
      console.log('  - rawInstructions:', recipe.recipeSchema.rawInstructions ? `${recipe.recipeSchema.rawInstructions.length} chars` : '(not set)');
      
      console.log('\n👤 Author Fields (NEW):');
      console.log('  - assignedauthor:', recipe.recipeSchema.assignedauthor || '(not set)');
      console.log('  - authorintro:', recipe.recipeSchema.authorintro ? `${recipe.recipeSchema.authorintro.length} chars` : '(not set)');
      console.log('  - cookingstory:', recipe.recipeSchema.cookingstory ? `${recipe.recipeSchema.cookingstory.length} chars` : '(not set)');
      console.log('  - cheftips:', recipe.recipeSchema.cheftips ? `${recipe.recipeSchema.cheftips.length} chars` : '(not set)');
      
      console.log('\n🖼️  Recipe Images:');
      if (recipe.recipeSchema.recipeImages) {
        const images = recipe.recipeSchema.recipeImages;
        console.log('  - img1:', images.img1?.node?.sourceUrl || '(not set)');
        console.log('  - img2:', images.img2?.node?.sourceUrl || '(not set)');
        console.log('  - img3:', images.img3?.node?.sourceUrl || '(not set)');
      }
    } else {
      console.log('  ❌ No recipeSchema fields found!');
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n📋 Full JSON Response:\n');
    console.log(JSON.stringify(recipe, null, 2));
    console.log('\n' + '='.repeat(60));

    // Show what fields we CAN update
    console.log('\n✏️  Fields We Can Update via GraphQL Mutation:\n');
    console.log('Required for mutation:');
    console.log('  - id: ' + recipe.id + ' (use this exact format)');
    console.log('\nACF fields to update:');
    console.log('  - assignedauthor');
    console.log('  - authorintro');
    console.log('  - cookingstory');
    console.log('  - cheftips');
    
    console.log('\n💡 Next Steps:');
    console.log('  1. Verify the ACF field names are correct in WordPress');
    console.log('  2. Check if these fields exist in ACF field group');
    console.log('  3. Use this ID format for mutations: ' + recipe.id);
    console.log('  4. Create mutation script with proper authentication');

  } catch (error) {
    console.error('\n❌ Error fetching recipe:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}

// Get recipe slug from command line or use default
const recipeSlug = process.argv[2] || 'mortons-steakhouse-chicken-christopher-recipe';

inspectRecipe(recipeSlug);
