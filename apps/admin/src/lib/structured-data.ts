import { Recipe, BlogPost } from '@/types';
import { siteConfig } from '@/config/site';

export function generateRecipeStructuredData(recipe: Recipe) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: [`${siteConfig.siteUrl}${recipe.featuredImage}`],
    author: {
      '@type': 'Person',
      name: recipe.author.name,
      image: `${siteConfig.siteUrl}${recipe.author.image}`
    },
    datePublished: recipe.datePublished,
    prepTime: `PT${recipe.prepTime}M`,
    cookTime: `PT${recipe.cookTime}M`,
    totalTime: `PT${recipe.totalTime}M`,
    recipeYield: recipe.servings,
    recipeCategory: recipe.category,
    recipeCuisine: 'International',
    keywords: recipe.tags.join(', '),
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((instruction, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: instruction
    })),
    nutrition: {
      '@type': 'NutritionInformation',
      calories: `${recipe.nutrition.calories} calories`,
      proteinContent: `${recipe.nutrition.protein}g`,
      carbohydrateContent: `${recipe.nutrition.carbs}g`,
      fatContent: `${recipe.nutrition.fat}g`,
      fiberContent: `${recipe.nutrition.fiber}g`
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: recipe.rating.value,
      ratingCount: recipe.rating.count,
      bestRating: 5,
      worstRating: 1
    }
  };
}

export function generateBlogStructuredData(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: [`${siteConfig.siteUrl}${post.featuredImage}`],
    author: {
      '@type': 'Person',
      name: post.author.name,
      image: `${siteConfig.siteUrl}${post.author.image}`
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.siteUrl}/images/logo.png`
      }
    },
    datePublished: post.datePublished,
    dateModified: post.datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.siteUrl}/blog/${post.id}`
    }
  };
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.siteName,
    description: siteConfig.siteDescription,
    url: siteConfig.siteUrl,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      email: siteConfig.author.email
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.twitter,
      siteConfig.social.instagram
    ].filter(Boolean)
  };
}
