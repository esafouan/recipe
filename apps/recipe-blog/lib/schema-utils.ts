import siteConfig from "@/config/site-config.json"

export interface SchemaConfig {
  site: {
    name: string;
    url: string;
    description: string;
    logo: string;
  };
  context: string;
  types: {
    recipe: string;
    person: string;
    organization: string;
    imageObject: string;
    webPage: string;
    webSite: string;
    breadcrumbList: string;
    listItem: string;
    faqPage: string;
    question: string;
    answer: string;
    howToStep: string;
    nutritionInformation: string;
    aggregateRating: string;
    searchAction: string;
  };
  author: {
    name: string;
    type: string;
    url: string;
  };
  organization: {
    name: string;
    type: string;
  };
  defaults: {
    rating: {
      value: string;
      count: string;
      best: string;
      worst: string;
    };
    nutrition: {
      calories: string;
      proteinContent: string;
      carbohydrateContent: string;
      fatContent: string;
      fiberContent: string;
      sodiumContent: string;
    };
    image: {
      placeholder: string;
      width: number;
      height: number;
    };
  };
  breadcrumbs: {
    home: {
      name: string;
      position: number;
    };
    recipes: {
      name: string;
      position: number;
      path: string;
    };
  };
  search: {
    target: string;
    queryInput: string;
  };
}

/**
 * Get the schema configuration for the current site
 * This allows for easy customization when creating other websites
 */
export function getSchemaConfig(): SchemaConfig {
  return {
    site: siteConfig.site,
    context: siteConfig.schema.context,
    types: siteConfig.schema.types,
    author: siteConfig.schema.author,
    organization: siteConfig.schema.organization,
    defaults: siteConfig.schema.defaults,
    breadcrumbs: siteConfig.schema.breadcrumbs,
    search: siteConfig.schema.search
  };
}

/**
 * Get the base URL for the current environment
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || siteConfig.site.url;
}

/**
 * Generate a slug from a recipe name
 */
export function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Get image URL with fallback
 */
export function getImageUrl(imageUrl?: string, baseUrl?: string): string {
  const base = baseUrl || getBaseUrl();
  const config = getSchemaConfig();
  
  if (!imageUrl) {
    return `${base}${config.defaults.image.placeholder}`;
  }
  
  return imageUrl.startsWith('http') ? imageUrl : `${base}${imageUrl}`;
}
