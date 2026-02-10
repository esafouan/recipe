import authorsData from '@/data/authors.json';

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  longBio: string;
  image: string;
  specialties: string[];
  tone: string;
  writingStyle: string;
  signature: string;
  social: {
    pinterest: string;
    instagram: string;
  };
  favoriteQuote: string;
  recipeApproach: string;
}

export function getAllAuthors(): Author[] {
  return authorsData.authors as Author[];
}

export function getAuthorById(id: string): Author | undefined {
  return authorsData.authors.find((author) => author.id === id) as Author | undefined;
}

export function getAuthorByCategory(category: string): Author {
  const assignments = authorsData.authorAssignments as Record<string, string>;
  const authorId = assignments[category] || 'sarah-mitchell'; // default to Sarah
  return getAuthorById(authorId) || (authorsData.authors[0] as Author);
}

export function getAuthorForRecipe(categories: string[]): Author {
  // Try to find best match based on categories
  if (!categories || categories.length === 0) {
    return authorsData.authors[0] as Author; // default to Sarah
  }
  
  const assignments = authorsData.authorAssignments as Record<string, string>;
  
  // Check each category
  for (const category of categories) {
    const authorId = assignments[category.toLowerCase()];
    if (authorId) {
      const author = getAuthorById(authorId);
      if (author) return author;
    }
  }
  
  // Default to Sarah
  return authorsData.authors[0] as Author;
}

// Helper to generate author byline with date
export function formatAuthorByline(author: Author, date: string): string {
  return `By ${author.name} • ${date}`;
}

// Helper to get author intro for recipe
export function getAuthorIntro(author: Author, recipeName: string): string {
  const intros = {
    'sarah-mitchell': [
      `I've been making this ${recipeName} for years, and it's become a family favorite in our house.`,
      `My kids absolutely love this ${recipeName}, and I think yours will too!`,
      `This ${recipeName} is one of those recipes that brings everyone to the table.`,
    ],
    'emily-chen': [
      `This ${recipeName} is perfect for busy weeknights—it's on the table in no time!`,
      `I created this ${recipeName} for those nights when you need something quick but delicious.`,
      `This quick ${recipeName} has become my go-to when I'm short on time.`,
    ],
    'marco-rodriguez': [
      `This ${recipeName} reminds me of the flavors I grew up with—pure comfort in a bowl.`,
      `I learned to make this ${recipeName} during my travels, and I'm excited to share it with you.`,
      `The authentic flavors in this ${recipeName} will transport you straight to flavor paradise.`,
    ],
    'olivia-greene': [
      `This ${recipeName} is packed with fresh, wholesome ingredients that'll leave you feeling amazing.`,
      `I love how this ${recipeName} celebrates seasonal produce at its best.`,
      `This healthy ${recipeName} proves that nutritious food can be absolutely delicious.`,
    ],
    'david-thompson': [
      `This classic ${recipeName} has been passed down in my family for generations.`,
      `There's something deeply comforting about a homemade ${recipeName} like this.`,
      `I'll walk you through every step of this ${recipeName} so it turns out perfect every time.`,
    ],
  };
  
  const authorIntros = intros[author.id as keyof typeof intros] || intros['sarah-mitchell'];
  return authorIntros[Math.floor(Math.random() * authorIntros.length)];
}

// Helper to get author tips for recipe
export function getAuthorTip(author: Author): string {
  const tips = {
    'sarah-mitchell': [
      "💡 Sarah's Tip: This recipe is kid-approved! If you have picky eaters, try letting them help with prep—they're more likely to try it.",
      "💡 Sarah's Tip: I always make extra to freeze for those crazy weeknights. Future you will thank you!",
      "💡 Sarah's Tip: Don't stress about perfection. Even if it doesn't look picture-perfect, it'll still taste amazing.",
    ],
    'emily-chen': [
      "⚡ Emily's Shortcut: Prep your ingredients the night before for an even faster meal.",
      "⚡ Emily's Shortcut: This is perfect for meal prep—make a double batch on Sunday!",
      "⚡ Emily's Shortcut: Use pre-chopped vegetables to cut your prep time in half.",
    ],
    'marco-rodriguez': [
      "🌶️ Marco's Note: Feel free to adjust the spice level to your taste—cooking is personal!",
      "🌶️ Marco's Note: The key to authentic flavor is patience—let those spices bloom!",
      "🌶️ Marco's Note: Don't skip the garnish—it's not just for looks, it adds essential flavor.",
    ],
    'olivia-greene': [
      "🥬 Olivia's Health Tip: This recipe is naturally rich in vitamins and minerals—eating well never tasted so good!",
      "🥬 Olivia's Health Tip: Choose seasonal, local produce when possible for maximum flavor and nutrition.",
      "🥬 Olivia's Health Tip: Leftovers are perfect for meal prep—they often taste even better the next day!",
    ],
    'david-thompson': [
      "👨‍🍳 David's Technique: Take your time with this step—it makes all the difference in the final result.",
      "👨‍🍳 David's Technique: Don't worry if it doesn't work perfectly the first time. Cooking is a skill that improves with practice!",
      "👨‍🍳 David's Technique: Room temperature ingredients mix better—take them out 30 minutes before you start.",
    ],
  };
  
  const authorTips = tips[author.id as keyof typeof tips] || tips['sarah-mitchell'];
  return authorTips[Math.floor(Math.random() * authorTips.length)];
}
