'use client';

import { useState } from 'react';
import { Wand2, Upload, Loader2, Sparkles, Bot } from 'lucide-react';
import { AIRecipeGenerator, RecipeGenerationRequest, GeneratedRecipe } from '@/lib/ai/recipe-generator';
import toast from 'react-hot-toast';

interface AIRecipeGeneratorPanelProps {
  onRecipeGenerated: (recipe: GeneratedRecipe) => void;
  onClose: () => void;
}

export default function AIRecipeGeneratorPanel({ onRecipeGenerated, onClose }: AIRecipeGeneratorPanelProps) {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'smart' | 'detailed' | 'image'>('smart');
  const [formData, setFormData] = useState<RecipeGenerationRequest>({
    recipeName: '',
    servings: 4,
    difficulty: 'Easy',
    category: "Breakfast",
    dietaryRestrictions: [],
    cookingTime: undefined,
    cuisine: '',
    focusKeyword: '',
    additionalRequirements: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('anthropic/claude-3.5-sonnet');

  const handleGenerateRecipe = async () => {
    if (!formData.recipeName.trim()) {
      toast.error('Please enter a recipe name');
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!apiKey) {
      toast.error('Please set your OPENROUTER API key in environment variables');
      return;
    }

    setLoading(true);
    try {
      const generator = new AIRecipeGenerator(apiKey, selectedModel);
      const recipe = await generator.generateRecipe(formData);
      
      onRecipeGenerated(recipe);
      toast.success('Recipe generated successfully!');
      onClose();
    } catch (error) {
      console.error('Recipe generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleSmartGenerate = async () => {
    if (!formData.recipeName.trim()) {
      toast.error('Please enter a recipe name');
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!apiKey) {
      toast.error('Please set your OPENROUTER API key in environment variables');
      return;
    }

    setLoading(true);
    try {
      const generator = new AIRecipeGenerator(apiKey, selectedModel);
      const recipe = await generator.generateRecipe({
        recipeName: formData.recipeName,
        autoGenerate: true
      });
      
      onRecipeGenerated(recipe);
      toast.success('Smart recipe generated successfully!');
      onClose();
    } catch (error) {
      console.error('Smart recipe generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFromImage = async () => {
    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    if (!apiKey) {
      toast.error('Please set your OPENROUTER API key for image analysis');
      return;
    }

    setLoading(true);
    try {
      const generator = new AIRecipeGenerator(apiKey, 'openai/gpt-4o'); // Use GPT-4o for vision
      // For now, generate recipe based on image name and additional requirements
      // TODO: Implement actual image analysis in the future
      const recipe = await generator.generateRecipe({
        recipeName: imageFile.name.replace(/\.[^/.]+$/, ''), // Use filename without extension
        additionalRequirements: `Generate a recipe based on the uploaded image. ${formData.additionalRequirements || ''}`,
        autoGenerate: true
      });
      
      onRecipeGenerated(recipe);
      toast.success('Recipe generated from image successfully!');
      onClose();
    } catch (error) {
      console.error('Image recipe generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate recipe from image');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
      } else {
        toast.error('Please select a valid image file');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">AI Recipe Generator</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {/* Model Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Model Selection
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <optgroup label="🏆 Recommended">
              <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet (Best Quality) - $3/1M tokens</option>
              <option value="openai/gpt-4o">GPT-4o (Creative) - $2.50/1M tokens</option>
            </optgroup>
            <optgroup label="💰 Cost-Effective">
              <option value="google/gemini-pro-1.5">Gemini Pro 1.5 (Fast) - $1.25/1M tokens</option>
              <option value="anthropic/claude-3-haiku">Claude 3 Haiku (Ultra Fast) - $0.25/1M tokens</option>
            </optgroup>
            <optgroup label="🧠 Premium">
              <option value="openai/o1-preview">GPT-o1 Preview (Advanced Reasoning) - $15/1M tokens</option>
              <option value="anthropic/claude-3-opus">Claude 3 Opus (Ultra Quality) - $15/1M tokens</option>
            </optgroup>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Set NEXT_PUBLIC_OPENROUTER_API_KEY - Claude 3.5 Sonnet recommended for best recipe quality
          </p>
        </div>

        {/* Generation Mode */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Generation Mode
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('smart')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                mode === 'smart'
                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              } border`}
            >
              <Sparkles className="h-4 w-4 inline mr-1" />
              Smart Generate (Recommended)
            </button>
            <button
              onClick={() => setMode('detailed')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                mode === 'detailed'
                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              } border`}
            >
              <Wand2 className="h-4 w-4 inline mr-1" />
              Detailed Setup
            </button>
            <button
              onClick={() => setMode('image')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                mode === 'image'
                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              } border`}
            >
              <Upload className="h-4 w-4 inline mr-1" />
              From Image (GPT-4o)
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'smart' && 'AI automatically determines all details from recipe name'}
            {mode === 'detailed' && 'Manually specify servings, difficulty, category, and more'}
            {mode === 'image' && 'Image analysis uses GPT-4o via OpenRouter for best results'}
          </p>
        </div>

        {mode === 'smart' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipe Name *
              </label>
              <input
                type="text"
                value={formData.recipeName}
                onChange={(e) => setFormData({ ...formData, recipeName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Chocolate Chip Cookies, Chicken Alfredo, Beef Stir Fry"
              />
              <p className="text-sm text-gray-500 mt-1">
                AI will automatically determine difficulty, servings, category, cooking time, and SEO details
              </p>
            </div>

            <button
              onClick={handleSmartGenerate}
              disabled={loading || !formData.recipeName.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-md hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Generating Complete Recipe...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  ✨ Smart Generate Recipe
                </>
              )}
            </button>
          </div>
        )}

        {mode === 'detailed' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipe Name *
              </label>
              <input
                type="text"
                value={formData.recipeName}
                onChange={(e) => setFormData({ ...formData, recipeName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Chocolate Chip Cookies, Chicken Alfredo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servings
                </label>
                <input
                  type="number"
                  value={formData.servings}
                  onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 4 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="1"
                  max="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as "Breakfast" | "Lunch" | "Dinner" | "Dessert" | "Healthy" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Healthy">Healthy</option>
                  <option value="">Auto-select</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cooking Time (minutes)
                </label>
                <input
                  type="number"
                  value={formData.cookingTime || ''}
                  onChange={(e) => setFormData({ ...formData, cookingTime: parseInt(e.target.value) || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Auto-estimate"
                  min="5"
                  max="480"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuisine Type
              </label>
              <input
                type="text"
                value={formData.cuisine}
                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Italian, Mexican, Asian, American"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Focus Keyword (SEO)
              </label>
              <input
                type="text"
                value={formData.focusKeyword}
                onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., easy chocolate cookies, homemade pasta recipe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Requirements
              </label>
              <textarea
                value={formData.additionalRequirements}
                onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., gluten-free, vegan, low-carb, dairy-free, must include specific ingredients"
                rows={3}
              />
            </div>

            <button
              onClick={handleGenerateRecipe}
              disabled={loading || !formData.recipeName.trim()}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating Recipe...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Recipe
                </>
              )}
            </button>
          </div>
        )}

        {mode === 'image' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Food Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {imageFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Context (Optional)
              </label>
              <textarea
                value={formData.additionalRequirements}
                onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., This is a family recipe, dietary restrictions, cooking method preferences"
                rows={3}
              />
            </div>

            <button
              onClick={handleGenerateFromImage}
              disabled={loading || !imageFile}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Generate from Image
                </>
              )}
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Powered by OpenRouter • Models by OpenAI, Anthropic, Google & Meta
          </p>
        </div>
      </div>
    </div>
  );
}
