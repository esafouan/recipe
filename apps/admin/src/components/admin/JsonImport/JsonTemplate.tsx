'use client';

import { Download } from 'lucide-react';

export default function JsonTemplate() {
  const templateData = {
    title: "Delicious Chocolate Chip Cookies",
    description: "Perfectly chewy chocolate chip cookies with crispy edges",
    content: "These cookies are the perfect balance of chewy and crispy. The secret is using brown butter and chilling the dough for at least 2 hours.",
    category: "healthy",
    tags: ["cookies", "chocolate", "baking", "dessert"],
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: "Easy",
    ingredients: [
      "2¼ cups all-purpose flour",
      "1 cup butter, softened",
      "¾ cup granulated sugar",
      "¾ cup packed brown sugar",
      "2 large eggs",
      "2 teaspoons vanilla extract",
      "1 teaspoon baking soda",
      "1 teaspoon salt",
      "2 cups chocolate chips"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "In a large bowl, cream together softened butter and both sugars until light and fluffy.",
      "Beat in eggs one at a time, then vanilla extract.",
      "In a separate bowl, whisk together flour, baking soda, and salt.",
      "Gradually mix the flour mixture into the butter mixture until just combined.",
      "Stir in chocolate chips until evenly distributed.",
      "Drop rounded tablespoons of dough onto ungreased baking sheets.",
      "Bake for 9-11 minutes until edges are golden brown.",
      "Cool on baking sheet for 5 minutes before transferring to wire rack."
    ],
    notes: "For extra chewy cookies, slightly underbake them. Store in airtight container for up to one week.",
    seoTitle: "Best Chocolate Chip Cookies Recipe - Easy & Delicious",
    seoDescription: "Learn how to make the perfect chocolate chip cookies with this easy recipe. Crispy edges, chewy centers, loaded with chocolate chips!",
    seoKeywords: ["chocolate chip cookies", "cookie recipe", "baking", "dessert", "homemade cookies"]
  };

  const downloadTemplate = () => {
    const dataStr = JSON.stringify(templateData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recipe-template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={downloadTemplate}
      className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
    >
      <Download className="h-4 w-4 mr-2" />
      Download JSON Template
    </button>
  );
}
