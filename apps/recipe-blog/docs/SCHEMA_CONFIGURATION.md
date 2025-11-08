# Schema Configuration

This setup allows you to easily create different websites by simply changing the configuration file.

## Files Created:

1. **`/config/site-config.json`** - Main configuration file with schema section
2. **`/lib/schema-utils.ts`** - Utility functions for schema management
3. **Updated `RecipeSchema` component** - Now uses the configuration

## How to Create a Different Website:

### Option 1: Environment-based Configuration
Create different config files for different environments:

```bash
# Development
config/schema-config.dev.json

# Production
config/schema-config.prod.json

# Different Brand
config/schema-config.mybrand.json
```

### Option 2: Multiple Config Files
Create brand-specific configurations:

**`config/schema-config.italian-recipes.json`:**
```json
{
  "site": {
    "name": "Nonna's Kitchen",
    "url": "https://nonnas-kitchen.com",
    "description": "Authentic Italian recipes passed down through generations"
  },
  "author": {
    "name": "Chef Giuseppe",
    "type": "Person",
    "url": "/author/chef-giuseppe"
  }
}
```

**`config/schema-config.vegan-recipes.json`:**
```json
{
  "site": {
    "name": "Plant Based Paradise",
    "url": "https://plantbasedparadise.com",
    "description": "Delicious vegan recipes for a healthier planet"
  },
  "author": {
    "name": "Chef Verde",
    "type": "Person",
    "url": "/author/chef-verde"
  }
}
```

### Option 3: Dynamic Configuration
Update `schema-utils.ts` to dynamically load different configs:

```typescript
export function getSchemaConfig(brand?: string): SchemaConfig {
  if (brand === 'italian') {
    return require('@/config/schema-config.italian-recipes.json');
  }
  if (brand === 'vegan') {
    return require('@/config/schema-config.vegan-recipes.json');
  }
  return require('@/config/site-config.json').schema;
}
```

## Benefits:

✅ **Easy Rebranding** - Just change the config file  
✅ **Multiple Sites** - Use the same codebase for different brands  
✅ **Environment Specific** - Different configs for dev/staging/prod  
✅ **Type Safety** - Full TypeScript support  
✅ **SEO Optimized** - All structured data properly configured  
✅ **Maintainable** - Central configuration management  

## Usage Examples:

```typescript
// Get current site config
const config = getSchemaConfig();

// Get specific brand config
const italianConfig = getSchemaConfig('italian');

// Generate URLs
const baseUrl = getBaseUrl();
const imageUrl = getImageUrl('/my-image.jpg');
const slug = generateSlug('Delicious Pasta Recipe');
```

This setup makes it incredibly easy to create multiple recipe websites or rebrand existing ones!
