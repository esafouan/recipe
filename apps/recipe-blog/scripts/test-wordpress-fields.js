// Test script to check what author fields are available in WordPress
const fetch = require('node-fetch');

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

async function testAuthorFields() {
  console.log('🔍 Testing WordPress GraphQL Author Fields\n');
  console.log(`API URL: ${API_URL}\n`);

  // Test 1: Check GraphQL schema introspection for recipeSchema type
  const introspectionQuery = `
    query IntrospectRecipeSchema {
      __type(name: "Recipe_Recipeschema") {
        name
        fields {
          name
          type {
            name
            kind
          }
        }
      }
    }
  `;

  try {
    console.log('📊 Fetching recipeSchema field structure...\n');
    
    const introspectionRes = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: introspectionQuery })
    });

    const introspectionJson = await introspectionRes.json();
    
    if (introspectionJson.errors) {
      console.error('❌ Introspection errors:', JSON.stringify(introspectionJson.errors, null, 2));
    } else if (introspectionJson.data?.__type?.fields) {
      console.log('✅ Available recipeSchema fields:\n');
      const fields = introspectionJson.data.__type.fields;
      
      // Look for author-related fields
      const authorFields = fields.filter(f => 
        f.name.toLowerCase().includes('author') || 
        f.name.toLowerCase().includes('intro') ||
        f.name.toLowerCase().includes('story') ||
        f.name.toLowerCase().includes('tips') ||
        f.name.toLowerCase().includes('assigned')
      );
      
      if (authorFields.length > 0) {
        console.log('🎯 Author-related fields found:');
        authorFields.forEach(f => {
          console.log(`  - ${f.name} (${f.type.name || f.type.kind})`);
        });
      } else {
        console.log('⚠️  No author-related fields found yet.');
      }
      
      console.log('\n📋 All available fields:');
      fields.forEach(f => {
        console.log(`  - ${f.name}`);
      });
    }

    // Test 2: Try to fetch a recipe with potential new fields
    console.log('\n\n🧪 Testing actual recipe query with author fields...\n');
    
    const testQuery = `
      query TestRecipe {
        recipes(first: 1) {
          nodes {
            title
            slug
            recipeSchema {
              prepTime
              cookTime
              
              # Try new author fields with lowercase (ACF default)
              authorintro
              cookingstory
              cheftips
              assignedauthor
            }
          }
        }
      }
    `;

    const testRes = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: testQuery })
    });

    const testJson = await testRes.json();
    
    if (testJson.errors) {
      console.log('⚠️  Some fields not available yet:');
      testJson.errors.forEach(err => {
        console.log(`  - ${err.message}`);
      });
      
      // Try a simpler query without new fields
      console.log('\n🔄 Trying basic query without new fields...\n');
      
      const basicQuery = `
        query BasicTest {
          recipes(first: 1) {
            nodes {
              title
              slug
              recipeSchema {
                prepTime
                cookTime
                authorStory
              }
            }
          }
        }
      `;
      
      const basicRes = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: basicQuery })
      });
      
      const basicJson = await basicRes.json();
      
      if (basicJson.data) {
        console.log('✅ Basic fields working:');
        console.log(JSON.stringify(basicJson.data, null, 2));
      }
    } else if (testJson.data) {
      console.log('✅ Query successful! Data returned:');
      console.log(JSON.stringify(testJson.data, null, 2));
      
      const recipe = testJson.data.recipes.nodes[0];
      if (recipe?.recipeSchema) {
        console.log('\n📝 Author fields status:');
        console.log(`  - authorintro: ${recipe.recipeSchema.authorintro ? '✅ Has data' : '❌ Empty/not set'}`);
        console.log(`  - cookingstory: ${recipe.recipeSchema.cookingstory ? '✅ Has data' : '❌ Empty/not set'}`);
        console.log(`  - cheftips: ${recipe.recipeSchema.cheftips ? '✅ Has data' : '❌ Empty/not set'}`);
        console.log(`  - assignedauthor: ${recipe.recipeSchema.assignedauthor ? '✅ Has data' : '❌ Empty/not set'}`);
        
        if (recipe.recipeSchema.authorintro) {
          console.log(`\n📖 Sample content (first 100 chars):`);
          console.log(`   authorintro: "${recipe.recipeSchema.authorintro.substring(0, 100)}..."`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('TEST COMPLETE');
  console.log('='.repeat(60));
  console.log('\n📖 Next steps:');
  console.log('1. If fields are missing: Add them in WordPress ACF');
  console.log('2. If fields exist but empty: Update recipes with content');
  console.log('3. If fields have data: Update lib/api.ts to fetch them');
}

// Run the test
testAuthorFields().catch(console.error);
