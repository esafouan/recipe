import { RecipeData } from "@/lib/recipes-data"
import { getSchemaConfig, getBaseUrl, generateSlug, getImageUrl } from "@/lib/schema-utils"

interface RecipeSchemaProps {
  recipe: RecipeData | null
}

export function RecipeSchema({ recipe }: RecipeSchemaProps) {
  if (!recipe) return null;
  
  const config = getSchemaConfig();
  const baseUrl = getBaseUrl();
  const imageUrl = getImageUrl(recipe.metadata.images[0], baseUrl);
  const slug = generateSlug(recipe.metadata.name);

  // Enhanced Recipe Schema with all SEO-critical fields
  const recipeSchema = {
    "@context": config.context,
    "@type": config.types.recipe,
    "@id": `${baseUrl}/recipes/${slug}`,
    name: recipe.metadata.name,
    headline: recipe.metadata.name,
    description: recipe.metadata.description,
    image: [
      {
        "@type": config.types.imageObject,
        url: imageUrl,
        width: config.defaults.image.width,
        height: config.defaults.image.height,
        caption: `${recipe.metadata.name} - ${recipe.metadata.description}`
      }
    ],
    author: {
      "@type": config.types.person,
      name: config.author.name,
      url: `${baseUrl}${config.author.url}`
    },
    publisher: {
      "@type": config.types.organization,
      name: config.organization.name,
      url: baseUrl,
      logo: {
        "@type": config.types.imageObject,
        url: `${baseUrl}${config.site.logo}`,
        width: 60,
        height: 60
      }
    },
    datePublished: recipe.metadata.datePublished,
    dateModified: recipe.metadata.dateModified,
    url: `${baseUrl}/recipes/${slug}`,
    mainEntityOfPage: {
      "@type": config.types.webPage,
      "@id": `${baseUrl}/recipes/${slug}`
    },
    keywords: recipe.metadata.keywords,
    recipeCategory: recipe.metadata.recipeCategory,
    recipeCuisine: recipe.metadata.recipeCuisine,
    prepTime: `PT${recipe.metadata.prepTime}M`,
    cookTime: `PT${recipe.metadata.cookTime}M`,
    totalTime: `PT${recipe.metadata.totalTime}M`,
    recipeYield: recipe.metadata.recipeYield,
    recipeIngredient: recipe.ingredients.map(ing => ing.item),
    recipeInstructions: recipe.instructions.map((instruction, index) => ({
      "@type": config.types.howToStep,
      name: instruction.name,
      text: instruction.text,
      position: instruction.stepNumber,
      image: index === 0 ? imageUrl : undefined // Add step images later if available
    })),
    nutrition: {
      "@type": config.types.nutritionInformation,
      calories: config.defaults.nutrition.calories,
      proteinContent: config.defaults.nutrition.proteinContent,
      carbohydrateContent: config.defaults.nutrition.carbohydrateContent,
      fatContent: config.defaults.nutrition.fatContent,
      fiberContent: config.defaults.nutrition.fiberContent,
      sodiumContent: config.defaults.nutrition.sodiumContent,
      servingSize: recipe.metadata.recipeYield
    },
    aggregateRating: {
      "@type": config.types.aggregateRating,
      ratingValue: config.defaults.rating.value,
      reviewCount: config.defaults.rating.count,
      bestRating: config.defaults.rating.best,
      worstRating: config.defaults.rating.worst
    },
    video: undefined, // Add video schema later if videos are available
    suitableForDiet: recipe.metadata.dietary.map(diet => 
      `${config.context}/${diet.charAt(0).toUpperCase() + diet.slice(1)}Diet`
    ),
    isPartOf: {
      "@type": config.types.webSite,
      name: config.site.name,
      url: baseUrl
    }
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": config.context,
    "@type": config.types.breadcrumbList,
    itemListElement: [
      {
        "@type": config.types.listItem,
        position: config.breadcrumbs.home.position,
        name: config.breadcrumbs.home.name,
        item: baseUrl
      },
      {
        "@type": config.types.listItem,
        position: config.breadcrumbs.recipes.position,
        name: config.breadcrumbs.recipes.name,
        item: `${baseUrl}${config.breadcrumbs.recipes.path}`
      },
      {
        "@type": config.types.listItem,
        position: 3,
        name: recipe.metadata.recipeCategory,
        item: `${baseUrl}/recipes/${recipe.metadata.recipeCategory.toLowerCase()}`
      },
      {
        "@type": config.types.listItem,
        position: 4,
        name: recipe.metadata.name,
        item: `${baseUrl}/recipes/${slug}`
      }
    ]
  }

  // FAQ Schema from proTips and FAQs
  const faqItems = [
    ...recipe.proTips.map((tip, index) => ({
      "@type": config.types.question,
      name: `Tip ${index + 1} for ${recipe.metadata.name}`,
      acceptedAnswer: {
        "@type": config.types.answer,
        text: tip
      }
    })),
    ...recipe.faqs.map((faq) => ({
      "@type": config.types.question,
      name: faq.question,
      acceptedAnswer: {
        "@type": config.types.answer,
        text: faq.answer
      }
    }))
  ];

  const faqSchema = faqItems.length > 0 ? {
    "@context": config.context,
    "@type": config.types.faqPage,
    mainEntity: faqItems
  } : null

  // Website Schema
  const websiteSchema = {
    "@context": config.context,
    "@type": config.types.webSite,
    name: config.site.name,
    url: baseUrl,
    description: config.site.description,
    potentialAction: {
      "@type": config.types.searchAction,
      target: `${baseUrl}${config.search.target}`,
      "query-input": config.search.queryInput
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </>
  )
}
