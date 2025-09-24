'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RecipeService, FirebaseRecipe } from '@/lib/firebase/recipes';
import { AuthService } from '@/lib/firebase/auth';
import { User } from 'firebase/auth';
import { 
  Save, 
  Eye, 
  X, 
  Clock,
  Utensils,
  Bot
} from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from './ImageUpload';
import AIRecipeGeneratorPanel from './AIRecipeGeneratorPanel';
import JsonImport from './JsonImport/JsonImport';
import JsonTemplate from './JsonImport/JsonTemplate';
import { Timestamp } from 'firebase/firestore';
import { GeneratedRecipe } from '@/lib/ai/recipe-generator';
import { CATEGORY_NAMES } from '@/constants/categories';
import { ButtonLoading } from '@/components/Loading';

const recipeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(60, 'Title must be under 60 characters'),
  description: z.string().min(1, 'Description is required').max(160, 'Description must be under 160 characters'),
  content: z.string().min(300, 'Content must be at least 300 words'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  prepTime: z.number().min(1, 'Prep time must be at least 1 minute'),
  cookTime: z.number().min(0, 'Cook time must be positive'),
  totalTime: z.number().min(1, 'Total time must be at least 1 minute'),
  servings: z.number().min(1, 'Servings must be at least 1'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  instructions: z.array(z.string()).min(1, 'At least one instruction is required'),
  notes: z.string().optional(),
  // Updated author field to match blog structure
  author: z.object({
    name: z.string().min(1, 'Author name is required'),
    image: z.string().optional()
  }).optional(),
  datePublished: z.string().optional(),
  // Updated nutrition to match blog numeric structure
  nutrition: z.object({
    calories: z.number().min(0).optional(),
    protein: z.number().min(0).optional(), // grams
    carbs: z.number().min(0).optional(), // grams  
    fat: z.number().min(0).optional(), // grams
    fiber: z.number().min(0).optional() // grams
  }).optional(),
  // Updated rating structure to match blog
  rating: z.object({
    value: z.number().min(0).max(5).optional(),
    count: z.number().min(0).optional()
  }).optional(),
  // Updated FAQs structure to match blog
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional(),
  // SEO and publishing fields
  slug: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  // Legacy SEO fields (optional for backward compatibility)
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface JsonImportData {
  title?: unknown;
  description?: unknown;
  category?: unknown;
  tags?: unknown;
  prepTime?: unknown;
  cookTime?: unknown;
  totalTime?: unknown;
  servings?: unknown;
  difficulty?: unknown;
  ingredients?: unknown;
  instructions?: unknown;
  notes?: unknown;
  author?: {
    name?: unknown;
    image?: unknown;
  };
  nutrition?: {
    calories?: unknown;
    protein?: unknown;
    carbs?: unknown;
    fat?: unknown;
    fiber?: unknown;
  };
  rating?: {
    value?: unknown;
    count?: unknown;
  };
  faqs?: Array<{
    question?: unknown;
    answer?: unknown;
  }>;
  seoTitle?: unknown;
  seoDescription?: unknown;
  seoKeywords?: unknown;
}

interface PostEditorProps {
  postId?: string; // For editing existing posts
}

export default function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      tags: [],
      ingredients: [''],
      instructions: [''],
      seoKeywords: [],
    }
  });

  const watchedValues = watch();

  const loadPost = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const recipe = await RecipeService.getRecipeById(id);
      
      if (recipe) {
        // Reset form with existing data
        reset({
          title: recipe.title,
          description: recipe.description,
          content: recipe.content || '',
          category: recipe.category,
          tags: recipe.tags || [],
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          totalTime: recipe.totalTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          notes: recipe.notes || '',
          author: recipe.author || { name: '', image: '' },
          nutrition: recipe.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
          rating: recipe.rating || { value: 0, count: 0 },
          faqs: recipe.faqs || [],
          seoTitle: recipe.seoTitle || '',
          seoDescription: recipe.seoDescription || '',
          seoKeywords: recipe.seoKeywords || [],
        });

        // Set images
        setMainImage(recipe.featuredImage || null);
        setAdditionalImages(recipe.images || []);
      } else {
        toast.error('Recipe not found');
        router.push('/admin/posts');
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
      toast.error('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  }, [reset, router]);

  useEffect(() => {
    // Get current user
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);

    // Load existing post if editing
    if (postId) {
      loadPost(postId);
    }
  }, [postId, loadPost]);

  const onSubmit = async (data: RecipeFormData, status: 'draft' | 'published' = 'draft') => {
    try {
      setSaving(true);

      if (!currentUser) {
        toast.error('You must be logged in to save posts');
        return;
      }

      // Additional validation
      if (!data.title || data.title.trim() === '') {
        toast.error('Title is required');
        return;
      }

      if (!data.description || data.description.trim() === '') {
        toast.error('Description is required');
        return;
      }

      if (!data.ingredients || data.ingredients.length === 0) {
        toast.error('At least one ingredient is required');
        return;
      }

      if (!data.instructions || data.instructions.length === 0) {
        toast.error('At least one instruction is required');
        return;
      }

      console.log('Validation passed, attempting to save post...');
      console.log('User:', { uid: currentUser.uid, email: currentUser.email });
      console.log('Data:', data);

      if (!mainImage) {
        toast.error('Please upload a main image');
        return;
      }

      // Generate slug
      const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

      // Create recipe object
      const recipeData: Omit<FirebaseRecipe, 'id'> = {
        title: data.title,
        description: data.description,
        content: data.content || '',
        featuredImage: mainImage,
        category: data.category,
        tags: data.tags,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        totalTime: data.totalTime,
        servings: data.servings,
        difficulty: data.difficulty,
        ingredients: data.ingredients,
        instructions: data.instructions,
        nutrition: {
          calories: data.nutrition?.calories ?? 0,
          protein: data.nutrition?.protein ?? 0,
          carbs: data.nutrition?.carbs ?? 0,
          fat: data.nutrition?.fat ?? 0,
          fiber: data.nutrition?.fiber ?? 0,
        },
        faqs: data.faqs || [],
        datePublished: data.datePublished ? Timestamp.fromDate(new Date(data.datePublished)) : Timestamp.now(),
        publishedAt: data.datePublished ? Timestamp.fromDate(new Date(data.datePublished)) : Timestamp.now(), // Add for blog compatibility
        author: {
          name: data.author?.name || currentUser.displayName || 'Anonymous',
          image: data.author?.image || currentUser.photoURL || '',
        },
        rating: {
          value: data.rating?.value ?? 0,
          count: data.rating?.count ?? 0,
        },
        // Firebase-specific fields
        images: additionalImages,
        slug,
        status,
        dateModified: Timestamp.now(),
        authorId: currentUser.uid,
        readingTime: Math.ceil((data.ingredients.length + data.instructions.length) / 10),
        notes: data.notes || '',
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
      };

      let recipeId: string;

      if (postId) {
        await RecipeService.updateRecipe(postId, recipeData);
        recipeId = postId;
        toast.success('Post updated successfully!');
      } else {
        recipeId = await RecipeService.createRecipe(recipeData);
        toast.success('Post created successfully!');
      }

      if (status === 'published') {
        router.push('/admin/posts');
      } else {
        router.push(`/admin/posts/${recipeId}/edit`);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      
      // More specific error handling
      let errorMessage = 'Failed to save post';
      
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          errorMessage = 'Permission denied. Please check your authentication and try again.';
        } else if (error.message.includes('not-found')) {
          errorMessage = 'Document not found. Please refresh and try again.';
        } else if (error.message.includes('unavailable')) {
          errorMessage = 'Firebase service is temporarily unavailable. Please try again later.';
        } else if (error.message.includes('invalid-argument')) {
          errorMessage = 'Invalid data provided. Please check all required fields.';
        } else if (error.message.includes('unauthenticated')) {
          errorMessage = 'Not authenticated. Please sign in and try again.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleAIRecipeGenerated = (recipe: GeneratedRecipe) => {
    // Fill form with AI-generated data
    reset({
      title: recipe.title,
      description: recipe.description,
      content: recipe.content,
      category: recipe.category,
      tags: recipe.tags,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: recipe.prepTime + recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      notes: recipe.notes,
      author: typeof recipe.author === 'string' 
        ? { name: recipe.author, image: '' }
        : recipe.author || { name: 'Chef AI', image: '' },
      datePublished: recipe.datePublished,
      // Add SEO fields from AI-generated recipe
      seoTitle: recipe.seoTitle || '',
      seoDescription: recipe.seoDescription || '',
      seoKeywords: recipe.seoKeywords || [],
      nutrition: recipe.nutrition ? {
        calories: Number(recipe.nutrition.calories) || 0,
        protein: Number(recipe.nutrition.proteinContent?.replace('g', '')) || 0,
        carbs: Number(recipe.nutrition.carbohydrateContent?.replace('g', '')) || 0,
        fat: Number(recipe.nutrition.fatContent?.replace('g', '')) || 0,
        fiber: Number(recipe.nutrition.fiberContent?.replace('g', '')) || 0,
      } : undefined,
      rating: recipe.aggregateRating ? {
        value: Number(recipe.aggregateRating.ratingValue) || 0,
        count: Number(recipe.aggregateRating.reviewCount) || 0,
      } : undefined,
      faqs: recipe.faq ? recipe.faq.map((faq: { name?: string; acceptedAnswer?: { text?: string } }) => ({
        question: faq.name || '',
        answer: faq.acceptedAnswer?.text || '',
      })) : [],
    });
    
    // Auto-select the category based on AI-generated recipe
    // The category from AI should match one of our predefined categories
    const categoryNames = CATEGORY_NAMES as readonly string[];
    if (recipe.category && categoryNames.includes(recipe.category)) {
      setValue('category', recipe.category);
      toast.success(`AI-generated recipe loaded! Category auto-selected: ${recipe.category}`);
    } else {
      toast.success('AI-generated recipe loaded! Please select a category.');
    }
  };

  const handleImageUploaded = (url: string, isMain: boolean = false) => {
    if (isMain) {
      setMainImage(url);
    } else {
      setAdditionalImages((prev: string[]) => [...prev, url]);
    }
  };

  const handleImageRemove = (url: string, isMain: boolean = false) => {
    if (isMain) {
      setMainImage(null);
    } else {
      setAdditionalImages((prev: string[]) => prev.filter((img: string) => img !== url));
    }
  };

  const addIngredient = () => {
    const currentIngredients = watchedValues.ingredients || [];
    setValue('ingredients', [...currentIngredients, '']);
  };

  const removeIngredient = (index: number) => {
    const currentIngredients = watchedValues.ingredients || [];
    setValue('ingredients', currentIngredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    const currentInstructions = watchedValues.instructions || [];
    setValue('instructions', [...currentInstructions, '']);
  };

  const removeInstruction = (index: number) => {
    const currentInstructions = watchedValues.instructions || [];
    setValue('instructions', currentInstructions.filter((_, i) => i !== index));
  };

  // JSON Import handler
  const handleJsonImport = (jsonData: JsonImportData) => {
    try {
      // Fill form with JSON data with proper type casting
      reset({
        title: String(jsonData.title || ''),
        description: String(jsonData.description || ''),
        content: '',
        category: String(jsonData.category || ''),
        tags: Array.isArray(jsonData.tags) ? jsonData.tags.map(String) : [],
        prepTime: Number(jsonData.prepTime) || 0,
        cookTime: Number(jsonData.cookTime) || 0,
        totalTime: Number(jsonData.totalTime) || (Number(jsonData.prepTime || 0) + Number(jsonData.cookTime || 0)),
        servings: Number(jsonData.servings) || 1,
        difficulty: (jsonData.difficulty === 'Easy' || jsonData.difficulty === 'Medium' || jsonData.difficulty === 'Hard') 
          ? jsonData.difficulty 
          : 'Easy',
        ingredients: Array.isArray(jsonData.ingredients) ? jsonData.ingredients.map(String) : [],
        instructions: Array.isArray(jsonData.instructions) ? jsonData.instructions.map(String) : [],
        notes: String(jsonData.notes || ''),
        author: jsonData.author ? {
          name: String(jsonData.author.name || ''),
          image: String(jsonData.author.image || '')
        } : { name: '', image: '' },
        nutrition: jsonData.nutrition ? {
          calories: Number(jsonData.nutrition.calories) || 0,
          protein: Number(jsonData.nutrition.protein) || 0,
          carbs: Number(jsonData.nutrition.carbs) || 0,
          fat: Number(jsonData.nutrition.fat) || 0,
          fiber: Number(jsonData.nutrition.fiber) || 0,
        } : undefined,
        rating: jsonData.rating ? {
          value: Number(jsonData.rating.value) || 0,
          count: Number(jsonData.rating.count) || 0,
        } : undefined,
        faqs: Array.isArray(jsonData.faqs) ? jsonData.faqs.map((faq: { question?: unknown; answer?: unknown }) => ({
          question: String(faq.question || ''),
          answer: String(faq.answer || ''),
        })) : [],
        seoTitle: String(jsonData.seoTitle || ''),
        seoDescription: String(jsonData.seoDescription || ''),
        seoKeywords: Array.isArray(jsonData.seoKeywords) ? jsonData.seoKeywords.map(String) : [],
      });
      
      toast.success('Recipe data imported successfully!');
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import recipe data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {postId ? 'Edit Post' : 'Create New Post'}
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAIGenerator(true)}
            className="inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100"
          >
            <Bot className="h-4 w-4 mr-2" />
            AI Generate
          </button>
          <ButtonLoading
            loading={saving}
            onClick={() => onSubmit(watchedValues, 'draft')}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </ButtonLoading>
          <ButtonLoading
            loading={saving}
            onClick={() => onSubmit(watchedValues, 'published')}
            disabled={saving}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            Publish
          </ButtonLoading>
        </div>
      </div>

      {/* JSON Import Section */}
      {!postId && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Import</h2>
            <JsonTemplate />
          </div>
          <JsonImport 
            onImport={handleJsonImport}
            className="w-full"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit((data) => onSubmit(data, 'published'))}>
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    {...register('title')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter recipe title..."
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Brief description of the recipe..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    {...register('content')}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Detailed recipe content with cooking tips, background story, and helpful advice (minimum 300 words)..."
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      {...register('author.name')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Chef AI"
                    />
                    {errors.author?.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.author.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      {...register('author.image')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                    {errors.author?.image && (
                      <p className="text-red-500 text-sm mt-1">{errors.author.image.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Published
                    </label>
                    <input
                      type="date"
                      {...register('datePublished')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {errors.datePublished && (
                      <p className="text-red-500 text-sm mt-1">{errors.datePublished.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      {...register('category')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {CATEGORY_NAMES.map((categoryName: string) => (
                        <option key={categoryName} value={categoryName}>
                          {categoryName}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty *
                    </label>
                    <select
                      {...register('difficulty')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Prep Time (min) *
                    </label>
                    <input
                      type="number"
                      {...register('prepTime', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
                    />
                    {errors.prepTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.prepTime.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Cook Time (min)
                    </label>
                    <input
                      type="number"
                      {...register('cookTime', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Total Time (min) *
                    </label>
                    <input
                      type="number"
                      {...register('totalTime', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Utensils className="inline h-4 w-4 mr-1" />
                      Servings *
                    </label>
                    <input
                      type="number"
                      {...register('servings', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
              <ImageUpload
                mainImage={mainImage}
                additionalImages={additionalImages}
                onImageUploaded={handleImageUploaded}
                onImageRemove={handleImageRemove}
              />
            </div>

            {/* Ingredients */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  <Utensils className="inline h-5 w-5 mr-2" />
                  Ingredients
                </h2>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  + Add Ingredient
                </button>
              </div>
              
              <div className="space-y-2">
                {watchedValues.ingredients?.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      {...register(`ingredients.${index}`)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 1 cup flour"
                    />
                    {watchedValues.ingredients && watchedValues.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Instructions</h2>
                <button
                  type="button"
                  onClick={addInstruction}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  + Add Step
                </button>
              </div>
              
              <div className="space-y-2">
                {watchedValues.instructions?.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <textarea
                      {...register(`instructions.${index}`)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={`Step ${index + 1}...`}
                      rows={2}
                    />
                    {watchedValues.instructions && watchedValues.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <textarea
                {...register('notes')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Additional notes, tips, or variations..."
              />
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SEO panel has been removed */}
        </div>
      </div>

      {/* AI Recipe Generator Panel */}
      {showAIGenerator && (
        <AIRecipeGeneratorPanel
          onRecipeGenerated={handleAIRecipeGenerated}
          onClose={() => setShowAIGenerator(false)}
        />
      )}
    </div>
  );
}
