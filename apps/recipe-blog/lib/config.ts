import siteConfig from '../config/site-config.json';

export interface SiteConfig {
  site: {
    name: string;
    title: string;
    description: string;
    url: string;
    logo: string;
    logoAlt: string;
    author: string;
    keywords: string[];
  };
  seo: {
    openGraph: {
      title: string;
      description: string;
      type: string;
      images: Array<{
        url: string;
        width: number;
        height: number;
        alt: string;
      }>;
    };
    twitter: {
      card: string;
      title: string;
      description: string;
      image: string;
      creator: string;
      site: string;
    };
    verification: {
      google: string;
      bing: string;
      pinterest: string;
      facebook: string;
    };
    structuredData: {
      organization: {
        "@type": string;
        name: string;
        url: string;
        logo: string;
        description: string;
        sameAs: string[];
      };
      website: {
        "@type": string;
        name: string;
        url: string;
        description: string;
        inLanguage: string;
        potentialAction: {
          "@type": string;
          target: string;
          "query-input": string;
        };
      };
    };
  };
  robots: {
    rules: Array<{
      userAgent: string;
      allow?: string[];
      disallow?: string[];
      crawlDelay?: number;
    }>;
    sitemap: string;
    host: string;
  };
  sitemap: {
    baseUrl: string;
    changeFrequency: {
      home: string;
      recipes: string;
      categories: string;
      static: string;
    };
    priority: {
      home: number;
      recipes: number;
      categories: number;
      recipeDetail: number;
      static: number;
    };
    staticPages: Array<{
      url: string;
      lastModified: string;
      changeFrequency: string;
      priority: number;
    }>;
    excludeRoutes: string[];
  };
  navigation: {
    main: Array<{
      label: string;
      href: string;
    }>;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaTarget: string;
  };
  categories: {
    title: string;
    subtitle: string;
    main: Array<{
      id: string;
      title: string;
      image: string;
      bgColor: string;
    }>;
    additional: Array<{
      id: string;
      title: string;
      href: string;
    }>;
  };
  recentRecipes: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaHref: string;
  };
  footer: {
    description: string;
    sections: Array<{
      title: string;
      links: Array<{
        label: string;
        href: string;
      }>;
    }>;
    social: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
    copyright: string;
  };
  search: {
    placeholder: string;
    noResultsTitle: string;
    noResultsMessage: string;
    loadingMessage: string;
  };
  pages: {
    about: {
      title: string;
      subtitle: string;
      content: string;
    };
    contact: {
      title: string;
      subtitle: string;
      content: string;
    };
    privacy: {
      title: string;
      lastUpdated: string;
    };
    terms: {
      title: string;
      lastUpdated: string;
    };
  };
}

export const config: SiteConfig = siteConfig as SiteConfig;

// Helper functions to get specific config sections
export const getSiteConfig = () => config.site;
export const getSeoConfig = () => config.seo;
export const getRobotsConfig = () => config.robots;
export const getSitemapConfig = () => config.sitemap;
export const getNavigationConfig = () => config.navigation;
export const getHeroConfig = () => config.hero;
export const getCategoriesConfig = () => config.categories;
export const getRecentRecipesConfig = () => config.recentRecipes;
export const getFooterConfig = () => config.footer;
export const getSearchConfig = () => config.search;
export const getPageConfig = (page: keyof SiteConfig['pages']) => config.pages[page];

export default config;
