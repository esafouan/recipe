#!/usr/bin/env tsx
/**
 * Test GraphQL Mutation Structure
 * 
 * This script tests what mutations are available for updating recipes
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME!;
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD!;

async function testMutation() {
  console.log('\n🔍 Testing WordPress Mutation Structure\n');

  // Test 1: Update just the content field
  const mutation1 = `
    mutation TestContentUpdate {
      updateRecipe(
        input: {
          id: "cG9zdDo0ODk="
          content: "Test content update"
        }
      ) {
        recipe {
          id
          title
          content
        }
      }
    }
  `;

  console.log('Test 1: Updating content field only...');
  const result1 = await executeMutation(mutation1);
  
  if (result1.errors) {
    console.log('❌ Content update failed:', JSON.stringify(result1.errors, null, 2));
  } else {
    console.log('✅ Content update works!');
  }

  // Test 2: Try introspection to see available fields
  const introspectionQuery = `
    query IntrospectUpdateRecipe {
      __type(name: "UpdateRecipeInput") {
        name
        inputFields {
          name
          type {
            name
            kind
          }
        }
      }
    }
  `;

  console.log('\nTest 2: Checking available input fields...');
  const result2 = await executeMutation(introspectionQuery);
  
  if (result2.data?.__type) {
    console.log('✅ Available fields in UpdateRecipeInput:');
    result2.data.__type.inputFields.forEach((field: any) => {
      console.log(`  - ${field.name}: ${field.type.name || field.type.kind}`);
    });
  }
}

async function executeMutation(query: string) {
  const auth = Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_APP_PASSWORD}`).toString('base64');

  const response = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    },
    body: JSON.stringify({ query })
  });

  return await response.json();
}

testMutation();
