#!/usr/bin/env tsx
/**
 * Check WordPress User Permissions
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME!;
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD!;

async function checkPermissions() {
  console.log('\n🔐 Checking WordPress User Permissions\n');
  console.log('='.repeat(70));
  console.log('User:', WORDPRESS_USERNAME);
  console.log('='.repeat(70));

  const auth = Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_APP_PASSWORD}`).toString('base64');
  const baseUrl = WORDPRESS_API_URL.replace('/graphql', '');

  try {
    // Check current user
    console.log('\n📋 Fetching user info...');
    const userResponse = await fetch(`${baseUrl}/wp-json/wp/v2/users/me`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });

    if (!userResponse.ok) {
      console.error('❌ Cannot fetch user info:', userResponse.status);
      console.error('   Make sure Application Password is correct');
      return;
    }

    const user = await userResponse.json();
    
    console.log('\n✅ User Info:');
    console.log('  - ID:', user.id);
    console.log('  - Name:', user.name);
    console.log('  - Username:', user.slug);
    console.log('  - Email:', user.email || '(hidden)');
    console.log('  - Roles:', user.roles?.join(', ') || 'Unknown');
    console.log('  - Capabilities:', user.capabilities ? Object.keys(user.capabilities).length + ' capabilities' : 'Unknown');

    // Try to fetch recipes
    console.log('\n📖 Testing Recipe Access...');
    const recipesResponse = await fetch(`${baseUrl}/wp-json/wp/v2/recipe?per_page=1`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });

    if (recipesResponse.ok) {
      console.log('✅ Can read recipes');
    } else {
      console.log('❌ Cannot read recipes:', recipesResponse.status);
    }

    // Try to update a recipe (dry run)
    console.log('\n✍️  Testing Recipe Edit Permission...');
    const testUpdateResponse = await fetch(`${baseUrl}/wp-json/wp/v2/recipe/489`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Just try to set a meta field to test permission
        meta: { _test: 'permission_check' }
      })
    });

    if (testUpdateResponse.ok) {
      console.log('✅ Can edit recipes! Permission granted.');
    } else {
      const error = await testUpdateResponse.json();
      console.log('❌ Cannot edit recipes:', testUpdateResponse.status);
      console.log('   Error:', error.message);
      console.log('\n📝 Solution:');
      console.log('   1. Login to WordPress admin');
      console.log('   2. Go to Users → All Users');
      console.log('   3. Edit user: ' + WORDPRESS_USERNAME);
      console.log('   4. Change Role to: Administrator');
      console.log('   5. Save and try again');
    }

    // Check post types available
    console.log('\n📚 Available Post Types...');
    const typesResponse = await fetch(`${baseUrl}/wp-json/wp/v2/types`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });

    if (typesResponse.ok) {
      const types = await typesResponse.json();
      console.log('✅ Accessible post types:');
      Object.keys(types).forEach(type => {
        console.log(`  - ${type}: ${types[type].name}`);
      });
    }

  } catch (error) {
    console.error('\n❌ Error:', error);
  }

  console.log('\n' + '='.repeat(70) + '\n');
}

checkPermissions();
