interface Recipe {
  id: string
  name: string
  title?: string // Add title for compatibility
  description: string
  image: string
  prepTime: string
  cookTime: string
  totalTime: string
  recipeYield: string
  recipeCategory: string
  recipeCuisine: string
  keywords: string[]
  author: {
    "@type": string
    name: string
  }
  datePublished: string
  recipeIngredient: string[]
  recipeInstructions: Array<{
    "@type": string
    text: string
  }>
  nutrition: {
    "@type": string
    calories: string
    proteinContent: string
    carbohydrateContent: string
    fatContent: string
    fiberContent: string
    sodiumContent: string
  }
  aggregateRating: {
    "@type": string
    ratingValue: string
    reviewCount: string
  }
  tips: string[]
}

interface RecipeSchemaProps {
  recipe: Recipe
}

export function RecipeSchema({ recipe }: RecipeSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://minirecipe.com'
  const imageUrl = recipe.image.startsWith('http') ? recipe.image : `${baseUrl}${recipe.image}`

  // Enhanced Recipe Schema with all SEO-critical fields
  const recipeSchema = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "@id": `${baseUrl}/recipes/${recipe.id}`,
    name: recipe.name,
    headline: recipe.name,
    description: recipe.description,
    image: [
      {
        "@type": "ImageObject",
        url: imageUrl,
        width: 1200,
        height: 630,
        caption: `${recipe.name} - ${recipe.description}`
      }
    ],
    author: {
      "@type": "Person",
      name: recipe.author.name,
      url: `${baseUrl}/author/${recipe.author.name.toLowerCase().replace(/\s+/g, '-')}`
    },
    publisher: {
      "@type": "Organization",
      name: "Mini Recipe",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
        width: 60,
        height: 60
      }
    },
    datePublished: recipe.datePublished,
    dateModified: recipe.datePublished, // Add updatedAt field later
    url: `${baseUrl}/recipes/${recipe.id}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/recipes/${recipe.id}`
    },
    keywords: recipe.keywords.join(", "),
    recipeCategory: recipe.recipeCategory,
    recipeCuisine: recipe.recipeCuisine,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    totalTime: recipe.totalTime,
    recipeYield: recipe.recipeYield,
    recipeIngredient: recipe.recipeIngredient,
    recipeInstructions: recipe.recipeInstructions.map((instruction, index) => ({
      "@type": "HowToStep",
      name: `Step ${index + 1}`,
      text: instruction.text,
      position: index + 1,
      image: index === 0 ? imageUrl : undefined // Add step images later if available
    })),
    nutrition: {
      "@type": "NutritionInformation",
      calories: recipe.nutrition.calories,
      proteinContent: recipe.nutrition.proteinContent,
      carbohydrateContent: recipe.nutrition.carbohydrateContent,
      fatContent: recipe.nutrition.fatContent,
      fiberContent: recipe.nutrition.fiberContent,
      sodiumContent: recipe.nutrition.sodiumContent,
      servingSize: recipe.recipeYield
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: recipe.aggregateRating.ratingValue,
      reviewCount: recipe.aggregateRating.reviewCount,
      bestRating: "5",
      worstRating: "1"
    },
    video: undefined, // Add video schema later if videos are available
    suitableForDiet: recipe.keywords.filter(keyword => 
      ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'low-carb', 'healthy'].includes(keyword.toLowerCase())
    ).map(diet => `https://schema.org/${diet.charAt(0).toUpperCase() + diet.slice(1)}Diet`),
    isPartOf: {
      "@type": "WebSite",
      name: "Mini Recipe",
      url: baseUrl
    }
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Recipes",
        item: `${baseUrl}/recipes`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: recipe.recipeCategory,
        item: `${baseUrl}/recipes/${recipe.recipeCategory.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: recipe.name,
        item: `${baseUrl}/recipes/${recipe.id}`
      }
    ]
  }

  // FAQ Schema from tips
  const faqSchema = recipe.tips.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: recipe.tips.map((tip, index) => ({
      "@type": "Question",
      name: `Tip ${index + 1} for ${recipe.name}`,
      acceptedAnswer: {
        "@type": "Answer",
        text: tip
      }
    }))
  } : null

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mini Recipe",
    url: baseUrl,
    description: "Small batch recipes perfect for 1-2 people. No more leftovers, just the right amount.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
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
