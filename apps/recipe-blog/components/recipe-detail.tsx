"use client";

import { Button } from "@/components/ui/button";
import {
  Clock,
  Users,
  ChefHat,
  Star,
  Printer,
  Share2,
  Heart,
  Utensils,
  ArrowDown,
  Facebook,
  ExternalLink,
  Twitter,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { BasicHero } from "@/components/basic-hero";
import { ChefProfileCard } from "@/components/chef-profile-card";
import { getChefData, getSocialSharingConfig } from "@/lib/site-config";
import { getCategoryLabel, getConfigKeyFromWpSlug } from "@/lib/api";
import siteConfig from "@/config/site-config.json";
import { RecipeData } from "@/lib/recipes-data";

interface RecipeDetailProps {
  recipe: RecipeData | null;
  relatedRecipes?: Array<{
    id: string;
    title: string;
    image: string;
    slug: string;
  }>;
  categorySlug?: string | null;
  categoryName?: string | null;
}

// Memoized related recipe item
const RelatedRecipeItem = memo(({ 
  recipe, 
  isPlaceholder 
}: {
  recipe: {
    id: string;
    title: string;
    image: string;
    slug: string;
  };
  isPlaceholder: boolean;
}) => {
  if (isPlaceholder) {
    return (
      <div className="flex gap-3">
        <div className="w-16 h-16 relative rounded-lg overflow-hidden shrink-0">
          <Image
            src={recipe.image}
            alt=""
            fill
            className="object-cover"
            sizes="64px"
            loading="lazy"
            role="presentation"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500 line-clamp-2">
            {recipe.title}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
      aria-label={`View recipe: ${recipe.title}`}
    >
      <div className="w-16 h-16 relative rounded-lg overflow-hidden shrink-0">
        <Image
          src={recipe.image}
          alt=""
          fill
          className="object-cover"
          sizes="64px"
          loading="lazy"
          role="presentation"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-orange-700 transition-colors">
          {recipe.title}
        </h3>
      </div>
    </Link>
  );
});

RelatedRecipeItem.displayName = 'RelatedRecipeItem';

export function RecipeDetail({ recipe, relatedRecipes, categorySlug, categoryName }: RecipeDetailProps) {
  if (!recipe) return null;
  
  const [showJumpButton, setShowJumpButton] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set()
  );
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [userRating, setUserRating] = useState(0);
  // const [showFullNutrition, setShowFullNutrition] = useState(false); // Commented out - nutrition section disabled
  const [servingSize, setServingSize] = useState(
    parseInt(recipe.metadata.recipeYield) || 4
  );

  // Memoized values to prevent unnecessary recalculations
  const chef = useMemo(() => siteConfig.pages.about.chef, []);
  const chefData = useMemo(() => getChefData(), []);
  const socialSharingConfig = useMemo(() => getSocialSharingConfig(), []);
  
  const originalServings = useMemo(() => parseInt(recipe.metadata.recipeYield) || 4, [recipe.metadata.recipeYield]);

  // Default related recipes - memoized to prevent recreation
  const defaultRelatedRecipes = useMemo(() => [
    {
      id: "1",
      title: "More Delicious Recipes",
      image: "/api/placeholder/200/150",
      slug: "#",
    },
    {
      id: "2",
      title: "Coming Soon",
      image: "/api/placeholder/200/150",
      slug: "#",
    },
    {
      id: "3",
      title: "Stay Tuned",
      image: "/api/placeholder/200/150",
      slug: "#",
    },
    {
      id: "4",
      title: "More Recipes",
      image: "/api/placeholder/200/150",
      slug: "#",
    },
  ], []);

  const displayedRelatedRecipes = relatedRecipes || defaultRelatedRecipes;

  // Optimized useEffect with proper dependencies
  useEffect(() => {
    const handleScroll = () => {
      setShowJumpButton(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Memoized callback functions to prevent unnecessary re-renders
  const toggleIngredient = useCallback((index: number) => {
    setCheckedIngredients(prev => {
      const newChecked = new Set(prev);
      if (newChecked.has(index)) {
        newChecked.delete(index);
      } else {
        newChecked.add(index);
      }
      return newChecked;
    });
  }, []);

  const toggleStep = useCallback((index: number) => {
    setCompletedSteps(prev => {
      const newCompleted = new Set(prev);
      if (newCompleted.has(index)) {
        newCompleted.delete(index);
      } else {
        newCompleted.add(index);
      }
      return newCompleted;
    });
  }, []);

  const jumpToRecipe = useCallback(() => {
    document
      .getElementById("recipe-instructions")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleShare = useCallback(async (platform?: string) => {
    const shareData = {
      title: `${recipe.metadata.name} - Cozy Bites Kitchen`,
      text: `Check out this delicious ${recipe.metadata.name} recipe! ${recipe.metadata.description}`,
      url: window.location.href,
    };

    if (platform) {
      let shareUrl = "";
      switch (platform) {
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            window.location.href
          )}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareData.text
          )}&url=${encodeURIComponent(shareData.url)}`;
          break;
        case "pinterest":
          shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
            shareData.url
          )}&media=${encodeURIComponent(
            recipe.metadata.images[0] || '/placeholder.svg'
          )}&description=${encodeURIComponent(shareData.text)}`;
          break;
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${encodeURIComponent(
            `${shareData.text} ${shareData.url}`
          )}`;
          break;
      }
      window.open(shareUrl, "_blank", "width=600,height=400");
    } else if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, [recipe.metadata.name, recipe.metadata.description, recipe.metadata.images]);

  const handleRating = useCallback((rating: number) => {
    setUserRating(rating);
  }, []);

  const adjustServingSize = useCallback((newSize: number) => {
    setServingSize(Math.max(1, newSize));
  }, []);

  const getAdjustedIngredient = useCallback((
    ingredient: string,
    originalServings: number,
    newServings: number
  ) => {
    if (!ingredient || originalServings === newServings) return ingredient || '';

    // Simple ingredient adjustment - you might want to make this more sophisticated
    const multiplier = newServings / originalServings;
    return ingredient.replace(/(\d+(?:\.\d+)?)/g, (match) => {
      const num = parseFloat(match);
      return (num * multiplier).toFixed(num % 1 === 0 ? 0 : 1);
    });
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handlePinterestPin = useCallback(() => {
    const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
      window.location.href
    )}&media=${encodeURIComponent(
      recipe.metadata.images[0] || '/placeholder.svg'
    )}&description=${encodeURIComponent(
      `${recipe.metadata.name} - ${recipe.metadata.description} | Get the full recipe at cozybiteskitchen.com`
    )}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  }, [recipe.metadata.name, recipe.metadata.description, recipe.metadata.images]);

  // Helper function to get icon component
  const getIconComponent = useCallback((iconName: string) => {
    const iconMap = {
      'share2': Share2,
      'facebook': Facebook,
      'external-link': ExternalLink,
      'twitter': Twitter,
      'message-circle': MessageCircle,
      'printer': Printer,
      'arrow-down': ArrowDown,
    };
    return iconMap[iconName as keyof typeof iconMap] || Share2;
  }, []);

  // Helper function to handle social sharing
  const handleSocialShare = useCallback((platformId: string, platformType?: string) => {
    // If it's a profile link, open the profile URL
    if (platformType === 'profile') {
      const profileUrl = socialSharingConfig.profileLinks?.[platformId as keyof typeof socialSharingConfig.profileLinks];
      if (profileUrl) {
        window.open(profileUrl, "_blank", "noopener,noreferrer");
        return;
      }
    }

    // Handle sharing and other actions
    switch (platformId) {
      case 'share':
        return handleShare();
      case 'facebook':
        return handleShare('facebook');
      case 'pinterest':
        return handlePinterestPin();
      case 'twitter':
        return handleShare('twitter');
      case 'whatsapp':
        return handleShare('whatsapp');
      case 'print':
        return handlePrint();
      case 'jumpToRecipe':
        return jumpToRecipe();
      default:
        return handleShare();
    }
  }, [handleShare, handlePinterestPin, handlePrint, jumpToRecipe, socialSharingConfig.profileLinks]);

  return (
      <article className="min-h-screen">
        {/* Sticky Jump to Recipe Button */}
        {showJumpButton && (
          <Button
            onClick={jumpToRecipe}
            className="fixed bottom-6 right-6 z-50 bg-orange-700 hover:bg-orange-800 text-white shadow-lg rounded-full px-6 py-3"
            size="lg"
            aria-label="Jump to recipe instructions"
          >
            <ArrowDown className="h-4 w-4 mr-2" aria-hidden="true" />
            Jump to Recipe
          </Button>
        )}

        {/* Hero Section */}
        <BasicHero
          title={recipe.metadata.name}
          description={""}
          breadcrumbs={
            categorySlug && categoryName
              ? [
                  { label: "Home", href: "/" },
                  { label: "Recipes", href: "/recipes" },
                  { 
                    label: getCategoryLabel(categorySlug), 
                    href: `/recipes/${getConfigKeyFromWpSlug(categorySlug)}` 
                  },
                  { label: recipe.metadata.name },
                ]
              : [
                  { label: "Home", href: "/" },
                  { label: "Recipes", href: "/recipes" },
                  { label: recipe.metadata.name },
                ]
          }
          size="medium"
        />
  
        {/* Hero Image Section with Chef Card */}
        <section className="container mx-auto max-w-7xl px-4 py-8">
          <div className="template-main-sidebar grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ContentMain */}
            <div className="order-2 lg:order-1 lg:col-span-3">
              {/* Article */}
              <article className="article">
                {/* MainFigure */}
                <figure className="text-sm mb-8">
                  <div className="aspect-video relative mb-2">
                    <Image
                      src={recipe.metadata.images[0] || "/api/placeholder/800/450"}
                      alt={recipe.metadata.name}
                      fill
                      className="object-cover rounded-lg"
                      priority
                      sizes="(max-width: 1024px) 100vw, 75vw"
                    />
                    <a
                      className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePinterestPin();
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handlePinterestPin();
                        }
                      }}
                      aria-label={`Pin ${recipe.metadata.name} recipe to Pinterest`}
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      <span>Pin it</span>
                    </a>
                  </div>
                  <figcaption className="text-gray-700 text-center">
                    {recipe.metadata.name}
                  </figcaption>
                </figure>
                {/* Author Info and Action Buttons */}
                <div className="bg-white border-b border-gray-100 py-6">
                  <div className="max-w-3xl mx-auto px-6">
                    {/* Author and Date */}
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-700 mb-4">
                      <span>
                        By{" "}
                        <span className="font-medium text-gray-900">
                          {chef.name}
                        </span>
                      </span>
                      <span>•</span>
                      <time dateTime={recipe.metadata.datePublished}>
                        {new Date(recipe.metadata.datePublished).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </time>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {/* Always show main share button */}
                      {socialSharingConfig.platforms
                        .filter(platform => platform.enabled && !platform.mobileOnly)
                        .map((platform) => {
                          const IconComponent = getIconComponent(platform.icon);
                          return (
                            <Button
                              key={platform.id}
                              onClick={() => handleSocialShare(platform.id, platform.type)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                              aria-label={`${platform.description}: ${recipe.metadata.name} recipe`}
                            >
                              <IconComponent className="h-4 w-4" aria-hidden="true" />
                              {platform.name}
                            </Button>
                          );
                        })}

                      {/* Mobile-only social buttons */}
                      <div className="hidden sm:flex items-center gap-2">
                        {socialSharingConfig.platforms
                          .filter(platform => platform.enabled && platform.mobileOnly)
                          .map((platform) => {
                            const IconComponent = getIconComponent(platform.icon);
                            const buttonClasses = [
                              "flex items-center gap-2",
                              platform.color || "",
                              platform.borderColor || "",
                              platform.hoverColor || ""
                            ].filter(Boolean).join(" ");

                            return (
                              <Button
                                key={platform.id}
                                onClick={() => handleSocialShare(platform.id, platform.type)}
                                variant="outline"
                                size="sm"
                                className={buttonClasses}
                                aria-label={`${platform.description}: ${recipe.metadata.name} recipe`}
                              >
                                <IconComponent className="h-4 w-4" aria-hidden="true" />
                                {platform.name}
                              </Button>
                            );
                          })}
                      </div>

                      {/* Default buttons (Print, Jump to Recipe) */}
                      {socialSharingConfig.defaultButtons
                        .filter(button => button.enabled)
                        .map((button) => {
                          const IconComponent = getIconComponent(button.icon);
                          const isPrimary = button.variant === 'primary';
                          
                          return (
                            <Button
                              key={button.id}
                              onClick={() => handleSocialShare(button.id)}
                              variant={isPrimary ? "default" : "outline"}
                              size="sm"
                              className={isPrimary ? button.color : "flex items-center gap-2"}
                              aria-label={`${button.description}: ${recipe.metadata.name} recipe`}
                            >
                              <IconComponent className="h-4 w-4 mr-2" aria-hidden="true" />
                              {button.name}
                            </Button>
                          );
                        })}
                    </div>
                  </div>
                </div>
                {/* ArticleWrapper */}
                <div className="article__wrapper space-y-8">
                  {/* Introduction
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {recipe.metadata.description} {recipe.introduction}
                  </p> */}

                  {/* Main Blog Content - SEO & AdSense optimized */}
                  {recipe.contentHtml && (
                    <article 
                      className="blog-content text-gray-800 leading-relaxed 
                        [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:leading-tight
                        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:leading-snug
                        [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mb-3 [&_h3]:mt-5
                        [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-gray-800 [&_h4]:mb-2 [&_h4]:mt-4
                        [&_p]:text-base [&_p]:text-gray-700 [&_p]:mb-4 [&_p]:leading-relaxed
                        [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-4 [&_ul]:space-y-2 [&_ul]:text-gray-700
                        [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-4 [&_ol]:space-y-2 [&_ol]:text-gray-700
                        [&_li]:text-base [&_li]:leading-relaxed [&_li]:ml-4
                        [&_ul_ul]:ml-6 [&_ul_ul]:mt-2 [&_ul_ul]:mb-2
                        [&_ol_ol]:ml-6 [&_ol_ol]:mt-2 [&_ol_ol]:mb-2
                        [&_a]:text-orange-600 [&_a]:hover:text-orange-700 [&_a]:underline [&_a]:font-medium [&_a]:transition-colors
                        [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:bg-orange-50
                        [&_strong]:font-bold [&_strong]:text-gray-900
                        [&_b]:font-bold [&_b]:text-gray-900
                        [&_em]:italic
                        [&_i]:italic
                        [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-gray-800
                        [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
                        [&_pre_code]:bg-transparent [&_pre_code]:p-0
                        [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto
                        [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
                        [&_th]:bg-gray-100 [&_th]:border [&_th]:border-gray-300 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold
                        [&_td]:border [&_td]:border-gray-300 [&_td]:px-4 [&_td]:py-2
                        [&_hr]:border-gray-300 [&_hr]:my-6"
                      dangerouslySetInnerHTML={{ __html: recipe.contentHtml }}
                    />
                  )}

                  {/* Why You'll Love This Recipe */}
                  <aside className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                    <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-4">
                      <Heart className="h-6 w-6 text-blue-600" aria-hidden="true" />
                      <span>Why You'll Love This Recipe</span>
                    </h2>
                    <ul className="space-y-2">
                      {recipe.whyYouLlLove.length > 0 ? (
                        recipe.whyYouLlLove.map((reason, index) => (
                          <li key={index} className="text-gray-700">{reason}</li>
                        ))
                      ) : (
                        <>
                          <li className="text-gray-700">
                            Ready in just {parseInt(recipe.metadata.totalTime) || 30} minutes - perfect
                            for {recipe.metadata.difficulty.toLowerCase()} weeknight cooking
                          </li>
                          <li className="text-gray-700">
                            Serves {recipe.metadata.recipeYield} - great for{" "}
                            {parseInt(recipe.metadata.recipeYield) > 4
                              ? "family dinners and gatherings"
                              : "intimate meals"}
                          </li>
                          <li className="text-gray-700">
                            {recipe.metadata.recipeCuisine} flavors with a homemade touch
                          </li>
                          <li className="text-gray-700">
                            Perfect way to use up extra ingredients in your fridge
                          </li>
                        </>
                      )}
                    </ul>
                  </aside>

                  {/* You Must Know Section */}
                  {recipe.youMustKnow && recipe.youMustKnow.length > 0 && (
                    <aside className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                      <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-4">
                        <ExternalLink className="h-6 w-6 text-red-600" aria-hidden="true" />
                        <span>You Must Know</span>
                      </h2>
                      <ul className="space-y-2">
                        {recipe.youMustKnow.map((tip, index) => (
                          <li key={index} className="text-gray-700">
                            <strong>Important:</strong> {tip}
                          </li>
                        ))}
                      </ul>
                    </aside>
                  )}

                  {/* Personal Note */}
                  {recipe.personalNote && (
                    <blockquote className="border-l-4 border-orange-500 pl-6 py-4 bg-orange-50 italic text-lg text-gray-700">
                      <p className="mb-2">"{recipe.personalNote}"</p>
                      <cite className="text-sm font-medium text-orange-700">— {chef.name}</cite>
                    </blockquote>
                  )}

                  {/* Storage Instructions */}
                  {recipe.storage && recipe.storage.content && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                        {recipe.storage.title || "Storage Instructions"}
                      </h3>
                      <p className="text-gray-700">{recipe.storage.content}</p>
                    </div>
                  )}

                  {/* Substitutions */}
                  {recipe.substitutions && recipe.substitutions.content && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-5 h-5 bg-yellow-600 rounded-full"></div>
                        {recipe.substitutions.title || "Ingredient Substitutions"}
                      </h3>
                      <p className="text-gray-700">{recipe.substitutions.content}</p>
                    </div>
                  )}

                  {/* Serving Suggestions */}
                  {recipe.servingSuggestions && recipe.servingSuggestions.content && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-green-600" aria-hidden="true" />
                        {recipe.servingSuggestions.title || "Serving Suggestions"}
                      </h3>
                      <p className="text-gray-700">{recipe.servingSuggestions.content}</p>
                    </div>
                  )}

                  {/* Enhanced Ingredients Section */}                    <div className="bg-linear-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center justify-center w-10 h-10 bg-orange-600 rounded-lg">
                        <Utensils className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Ingredients
                      </h2>
                      <div className="flex-1 h-px bg-linear-to-r from-orange-200 to-transparent"></div>
                    </div>

                    <div className="grid gap-4">
                      {recipe.ingredients?.map((ingredient, index) => (
                        <div 
                          key={index} 
                          className="group bg-white/70 backdrop-blur-sm border border-orange-100 rounded-lg p-4 hover:bg-white hover:shadow-md hover:border-orange-200 transition-all duration-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-700 rounded-full text-sm font-bold shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-200">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 mb-1 text-lg leading-tight">
                                {ingredient?.item || ''}
                              </div>
                              {ingredient?.description && (
                                <p className="text-gray-600 text-sm italic leading-relaxed">
                                  {ingredient.description}
                                </p>
                              )}
                            </div>
                            <div className="w-3 h-3 rounded-full bg-orange-200 group-hover:bg-orange-400 transition-colors duration-200 shrink-0 mt-2"></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-white/50 border border-orange-100 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full shrink-0 mt-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Shopping Tip</h3>
                          <p className="text-sm text-gray-600">
                            For best results, gather all ingredients before you start cooking. Fresh ingredients will give you the most flavorful results.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients Image (Image 2) */}
                  {recipe.metadata.images[1] && (
                    <figure className="text-sm my-8">
                      <div className="aspect-video relative mb-2">
                        <Image
                          src={recipe.metadata.images[1]}
                          alt={`${recipe.metadata.name} - Ingredients`}
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 100vw, 800px"
                          loading="lazy"
                        />
                        <a
                          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePinterestPin();
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handlePinterestPin();
                            }
                          }}
                          aria-label={`Pin ${recipe.metadata.name} ingredients to Pinterest`}
                        >
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          <span>Pin it</span>
                        </a>
                      </div>
                      <figcaption className="text-gray-700 text-center">
                        All the ingredients you'll need for {recipe.metadata.name}
                      </figcaption>
                    </figure>
                  )}

                  {/* Instructions Section */}
                  <h2 className="text-3xl font-bold text-gray-900">
                    Instructions
                  </h2>

                  <div className="space-y-6">
                    {recipe.instructions.map((instruction, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-orange-600 pl-4"
                      >
                        <div className="text-lg font-semibold text-gray-900 mb-2">
                          Step {String(instruction.stepNumber).padStart(2, "0")}
                          {instruction.name && (
                            <span className="text-base font-medium text-gray-600 ml-2">
                              - {instruction.name}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {instruction.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Recipe Notes */}
                  {recipe.notes && recipe.notes.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
                        Recipe Notes
                      </h3>
                      <ul className="space-y-2">
                        {recipe.notes.map((note, index) => (
                          <li key={index} className="text-gray-700 flex items-start gap-2">
                            <span className="text-gray-400 mt-2">•</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Process Image (Image 3) - Show cooking in progress */}
                  {recipe.metadata.images[2] && (
                    <figure className="text-sm my-8">
                      <div className="aspect-video relative mb-2">
                        <Image
                          src={recipe.metadata.images[2]}
                          alt={`${recipe.metadata.name} - Cooking Process`}
                          fill
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 100vw, 800px"
                          loading="lazy"
                        />
                        <a
                          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePinterestPin();
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handlePinterestPin();
                            }
                          }}
                          aria-label={`Pin ${recipe.metadata.name} cooking process to Pinterest`}
                        >
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          <span>Pin it</span>
                        </a>
                      </div>
                      <figcaption className="text-gray-700 text-center">
                        {recipe.metadata.name} in progress - cooking step by step
                      </figcaption>
                    </figure>
                  )}

                  {/* Tools Section */}
                  {recipe.tools && recipe.tools.length > 0 && (
                    <aside className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                      <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-4">
                        <Utensils className="h-6 w-6 text-blue-600" aria-hidden="true" />
                        <span>Tools You'll Need</span>
                      </h2>
                      <ul className="space-y-2">
                        {recipe.tools.map((tool, index) => (
                          <li key={index} className="text-gray-700 flex items-start gap-2">
                            <span className="text-blue-600 mt-1">✓</span>
                            <span>{tool}</span>
                          </li>
                        ))}
                      </ul>
                    </aside>
                  )}

                  <p className="text-lg text-gray-700 leading-relaxed">
                    {recipe.closingThought || "Serve this recipe straight from the kitchen for the best taste and texture. It's sure to become a favorite that you'll make again and again."}
                  </p>

                  {/* FAQ Section */}
                  {recipe.faqs && recipe.faqs.length > 0 ? (
                    <>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Frequently Asked Questions
                      </h2>
                      <div className="space-y-4">
                        {recipe.faqs.map((faq, index) => (
                          <div key={index}>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              → {faq.question}
                            </h3>
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Frequently Asked Questions
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            → What type of ingredients work best for this dish?
                          </h3>
                          <p className="text-gray-700">
                            Use the freshest ingredients available for the best
                            flavor and texture results.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            → Can I make substitutions?
                          </h3>
                          <p className="text-gray-700">
                            Yes, feel free to swap ingredients based on your
                            preferences or dietary needs.
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            → How do I store leftovers?
                          </h3>
                          <p className="text-gray-700">
                            Store in the refrigerator and reheat gently to maintain
                            the best texture.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {/* end ArticleWrapper */}
              </article>
              {/* end Article */}

              {/* Recipe Card */}
              <section className="recipe bg-white border border-gray-200 rounded-lg p-6 mt-8">
                <div className="recipe__wrapper">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {recipe.metadata.name}
                  </h2>
                  <p className="text-gray-600 mb-6">{recipe.metadata.description}</p>

                  {/* RecipeTimes */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-orange-700" aria-hidden="true" />
                        <strong>Prep Time</strong>
                      </div>
                      <span className="text-orange-700 font-semibold">
                        {recipe.metadata.prepTime}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <ChefHat className="h-5 w-5 text-orange-700" aria-hidden="true" />
                        <strong>Cook Time</strong>
                      </div>
                      <span className="text-orange-700 font-semibold">
                        {recipe.metadata.cookTime}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-orange-700" aria-hidden="true" />
                        <strong>Total Time</strong>
                      </div>
                      <span className="text-orange-700 font-semibold">
                        {recipe.metadata.totalTime}
                      </span>
                    </div>
                  </div>

                  {/* Recipe Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ChefHat className="h-4 w-4" aria-hidden="true" />
                        <strong>By:</strong> <span>{chef.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4" aria-hidden="true" />
                        <strong>Category:</strong>{" "}
                        <span>{recipe.metadata.recipeCategory}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" aria-hidden="true" />
                        <strong>Difficulty:</strong>{" "}
                        <span className="text-orange-700">
                          {recipe.metadata.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" aria-hidden="true" />
                        <strong>Yield:</strong>{" "}
                        <span className="text-orange-700">
                          {recipe.metadata.recipeYield}
                        </span>
                      </div>
                      {recipe.metadata.recipeCuisine && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-orange-700 rounded-sm"></div>
                          <strong>Cuisine:</strong>{" "}
                          <span>{recipe.metadata.recipeCuisine}</span>
                        </div>
                      )}
                      {recipe.metadata.dietary && recipe.metadata.dietary.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Heart className="h-4 w-4 mt-0.5" aria-hidden="true" />
                          <div>
                            <strong>Dietary:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {recipe.metadata.dietary.map((diet, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                >
                                  {diet}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interactive Ingredients with Serving Size Adjustment */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Ingredients
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Servings:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => adjustServingSize(servingSize - 1)}
                          className="w-8 h-8 rounded-full bg-orange-700 text-white hover:bg-orange-800 flex items-center justify-center font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={servingSize <= 1}
                          aria-label="Decrease serving size"
                        >
                          -
                        </button>
                        <span 
                          className="w-8 text-center font-bold"
                          aria-label={`Current serving size: ${servingSize}`}
                        >
                          {servingSize}
                        </span>
                        <button
                          onClick={() => adjustServingSize(servingSize + 1)}
                          className="w-8 h-8 rounded-full bg-orange-700 text-white hover:bg-orange-800 flex items-center justify-center font-bold"
                          aria-label="Increase serving size"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-8">
                    {recipe.ingredients?.map((ingredient, index) => {
                      const adjustedIngredient = getAdjustedIngredient(
                        ingredient?.item || '',
                        originalServings,
                        servingSize
                      );
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <button
                            onClick={() => toggleIngredient(index)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors shrink-0 ${
                              checkedIngredients.has(index)
                                ? "bg-orange-600 text-white border-orange-600"
                                : "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                            }`}
                            aria-label={`${checkedIngredients.has(index) ? 'Uncheck' : 'Check'} ingredient ${index + 1}: ${adjustedIngredient}`}
                            aria-pressed={checkedIngredients.has(index)}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </button>
                          <div className="flex-1">
                            <span
                              className={`leading-relaxed block ${
                                checkedIngredients.has(index)
                                  ? "line-through text-gray-500"
                                  : "text-gray-900"
                              }`}
                            >
                              {adjustedIngredient}
                            </span>
                            {ingredient?.description && (
                              <span className="text-sm text-gray-600 italic block mt-1">
                                {ingredient.description}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Interactive Instructions */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4" id="recipe-instructions">
                    Instructions
                  </h3>
                  <div className="space-y-6 mb-8">
                    {recipe.instructions.map((instruction, index) => (
                      <div key={index} className="space-y-2">
                        <button
                          onClick={() => toggleStep(index)}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                            completedSteps.has(index)
                              ? "bg-orange-600 text-white border-orange-600"
                              : "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                          }`}
                          aria-label={`${completedSteps.has(index) ? 'Mark as incomplete' : 'Mark as complete'} step ${index + 1}: ${instruction.text}`}
                          aria-pressed={completedSteps.has(index)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold">
                              Step {String(instruction.stepNumber).padStart(2, "0")}
                            </span>
                            {instruction.name && (
                              <span className="font-medium opacity-90">
                                - {instruction.name}
                              </span>
                            )}
                          </div>
                        </button>
                        <p
                          className={`text-gray-700 leading-relaxed px-2 ${
                            completedSteps.has(index)
                              ? "line-through text-gray-500"
                              : ""
                          }`}
                        >
                          {instruction.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Rating Section */}
                  <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Rate This Recipe
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(star)}
                            className={`w-8 h-8 transition-colors ${
                              star <= userRating
                                ? "text-yellow-500 hover:text-yellow-600"
                                : "text-gray-300 hover:text-yellow-400"
                            }`}
                            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''} out of 5`}
                            aria-pressed={star <= userRating}
                          >
                            <Star
                              className={`w-full h-full ${
                                star <= userRating ? "fill-current" : ""
                              }`}
                              aria-hidden="true"
                            />
                          </button>
                        ))}
                      </div>
                      {userRating > 0 && (
                        <span className="text-gray-600">
                          You rated this {userRating} star
                          {userRating !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" aria-hidden="true" />
                        <span className="font-medium">
                          4.5/5
                        </span>
                        <span>
                          (0 reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Equipment */}
                  {recipe.tools && recipe.tools.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Tools You'll Need
                      </h3>
                      <ul className="space-y-2">
                        {recipe.tools.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-700" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Nutrition - Commented out for now */}
                  {/* 
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Nutrition Facts (Per Serving)
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setShowFullNutrition(!showFullNutrition)}
                        className="w-full p-4 text-left font-medium hover:bg-gray-50 transition-colors flex items-center justify-between"
                        aria-expanded={showFullNutrition}
                        aria-controls="nutrition-details"
                        aria-label={`${showFullNutrition ? 'Hide' : 'Show'} detailed nutritional information`}
                      >
                        <span>View nutritional information</span>
                        <ArrowDown
                          className={`h-4 w-4 transform transition-transform ${
                            showFullNutrition ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {showFullNutrition && (
                        <div className="p-4 border-t bg-gray-50" id="nutrition-details">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <strong>Calories:</strong>
                                <span className="text-orange-700 font-semibold">
                                  0
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <strong>Protein:</strong>
                                <span className="text-orange-700 font-semibold">
                                  0g
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <strong>Carbohydrates:</strong>
                                <span className="text-orange-700 font-semibold">
                                  0g
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <strong>Fat:</strong>
                                <span className="text-orange-700 font-semibold">
                                  0g
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <strong>Fiber:</strong>
                                <span className="text-orange-700 font-semibold">
                                  0g
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <strong>Sodium:</strong>
                                <span className="text-orange-700 font-semibold">
                                  0mg
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-3">
                            * Nutritional values are approximate and may vary
                            based on ingredients and portion sizes.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  */}

                  {/* Recipe Keywords */}
                  {recipe.metadata.keywords && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        Recipe Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {recipe.metadata.keywords.split(',').map((keyword, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                          >
                            {keyword.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cooking Progress Indicator */}
                  {completedSteps.size > 0 && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-800">
                          Cooking Progress
                        </span>
                        <span className="text-sm text-green-600">
                          {completedSteps.size} of{" "}
                          {recipe.instructions.length} steps completed
                        </span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (completedSteps.size /
                                recipe.instructions.length) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      {completedSteps.size ===
                        recipe.instructions.length && (
                        <p className="text-sm text-green-600 mt-2 font-medium">
                          🎉 Congratulations! Your recipe is complete!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </section>
              {/* end Recipe */}

              {/* Mobile Chef Card - Only visible on mobile */}
              <section className="lg:hidden mt-8">
                <ChefProfileCard chefData={chefData} variant="contact" />
              </section>
            </div>
            {/* end ContentMain */}

            {/* ContentSideBar - Only visible on desktop */}
            <aside className="hidden lg:block order-3 lg:order-2 lg:col-span-1">
              <div className="sticky top-16 m-2 space-y-6">
                {/* Author Card */}
                <ChefProfileCard chefData={chefData} variant="contact" />

                {/* Related Recipes */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Recommended
                  </h2>
                  <div className="space-y-4">
                    {displayedRelatedRecipes
                      .slice(0, 6)
                      .map((relatedRecipe) => (
                        <RelatedRecipeItem
                          key={relatedRecipe.id}
                          recipe={relatedRecipe}
                          isPlaceholder={relatedRecipe.slug === "#"}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </aside>
            {/* end ContentSideBar */}

            {/* Mobile Related Recipes Section */}
            <section className="lg:hidden order-4 col-span-full">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Recommended
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {displayedRelatedRecipes.slice(0, 4).map((relatedRecipe) => {
                    const isPlaceholder = relatedRecipe.slug === "#";

                    if (isPlaceholder) {
                      return (
                        <div key={relatedRecipe.id} className="space-y-2">
                          <div className="aspect-video relative rounded-lg overflow-hidden">
                            <Image
                              src={relatedRecipe.image}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 50vw, 200px"
                              loading="lazy"
                              role="presentation"
                            />
                          </div>
                          <h3 className="text-sm font-medium text-gray-500 line-clamp-2">
                            {relatedRecipe.title}
                          </h3>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={relatedRecipe.id}
                        href={`/recipes/${relatedRecipe.slug}`}
                        className="space-y-2 hover:bg-gray-50 p-2 rounded-lg transition-colors -m-2"
                        aria-label={`View recipe: ${relatedRecipe.title}`}
                      >
                        <div className="aspect-video relative rounded-lg overflow-hidden">
                          <Image
                            src={relatedRecipe.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, 200px"
                            loading="lazy"
                            role="presentation"
                          />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-orange-700 transition-colors">
                          {relatedRecipe.title}
                        </h3>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </section>
      </article>
  );
}
