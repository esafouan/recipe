import { getRecentRecipes } from '@/lib/api';

export default async function TestWPPage() {
  let recipes = [];
  let error = null;

  try {
    recipes = await getRecentRecipes(8);
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">WordPress API Test</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'NOT SET'}</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {recipes.length > 0 ? (
        <div>
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
            ✅ Successfully fetched {recipes.length} recipes from WordPress!
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Recipes:</h2>
          <div className="grid gap-4">
            {recipes.map((recipe: any, index: number) => (
              <div key={index} className="border p-4 rounded">
                <h3 className="text-xl font-semibold">{recipe.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{recipe.content?.substring(0, 150)}...</p>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                  <p><strong>Prep Time:</strong> {recipe.meta?.prepTime || 'N/A'}</p>
                  <p><strong>Cook Time:</strong> {recipe.meta?.cookTime || 'N/A'}</p>
                  <p><strong>Difficulty:</strong> {recipe.meta?.difficulty || 'N/A'}</p>
                  <p><strong>Ingredients:</strong> {recipe.ingredients?.length || 0}</p>
                  <p><strong>Instructions:</strong> {recipe.instructions?.length || 0} steps</p>
                  <p><strong>Images:</strong> {recipe.images?.length || 0}</p>
                </div>

                {recipe.images && recipe.images.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {recipe.images.slice(0, 3).map((img: string, i: number) => (
                      <img 
                        key={i}
                        src={img} 
                        alt={`${recipe.title} - Image ${i + 1}`}
                        className="w-32 h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
          ⚠️ No recipes found
        </div>
      )}
    </div>
  );
}
