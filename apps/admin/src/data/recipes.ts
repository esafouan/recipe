import { Recipe } from '@/types';

export const recipes: Recipe[] = [
  {
    id: 'single-serve-chocolate-lava-mug-cake',
    title: 'Single-Serve Chocolate Lava Mug Cake',
    description: 'Rich, decadent chocolate lava cake made in a mug for one. This small-batch dessert takes just 2 minutes in the microwave and features a molten center that flows like liquid gold. Perfect for those late-night chocolate cravings without the temptation of a whole cake.',
    featuredImage: '/images/recipes/chocolate-lava-mug-cake.jpg',
    category: 'mini-desserts',
    tags: ['mug-cake', 'single-serving', 'chocolate', 'microwave', '2-minute', 'no-leftovers'],
    prepTime: 3,
    cookTime: 2,
    totalTime: 5,
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '3 tbsp all-purpose flour',
      '3 tbsp granulated sugar',
      '2 tbsp unsweetened cocoa powder',
      '1/4 tsp baking powder',
      'Pinch of salt',
      '3 tbsp milk of choice',
      '2 tbsp melted butter',
      '1/4 tsp vanilla extract',
      '1 small piece dark chocolate (for molten center)',
      'Vanilla ice cream for serving (optional)'
    ],
    instructions: [
      'In a microwave-safe mug, whisk together flour, sugar, cocoa powder, baking powder, and salt.',
      'Add milk, melted butter, and vanilla. Mix until smooth with no lumps.',
      'Push the piece of dark chocolate into the center of the batter.',
      'Microwave for 80-90 seconds. The top should be set but still soft.',
      'Let cool for 1 minute before eating. Serve with vanilla ice cream if desired.',
      'Pro tip: The chocolate center will be molten hot, so wait a moment before digging in!'
    ],
    nutrition: {
      calories: 285,
      protein: 5,
      carbs: 42,
      fat: 12,
      fiber: 4
    },
    faqs: [
      {
        question: 'Can I make this without a microwave?',
        answer: 'Yes! You can bake it in a 350°F oven for 10-12 minutes in a ramekin. The texture will be slightly different but equally delicious.'
      },
      {
        question: 'What if I don\'t have cocoa powder?',
        answer: 'You can substitute with 1 tbsp melted chocolate and reduce the flour by 1 tbsp. The result will be slightly denser but still great.'
      },
      {
        question: 'Can I double this recipe?',
        answer: 'Absolutely! Use a larger mug and increase cooking time to 2-2.5 minutes. This defeats the single-serve purpose but sometimes you need to share!'
      }
    ],
    datePublished: '2024-01-15',
    author: {
      name: 'Sarah Chen',
      image: '/images/author.jpg'
    },
    rating: {
      value: 4.9,
      count: 1247
    }
  },
  {
    id: 'crispy-smashed-potato-for-two',
    title: 'Crispy Smashed Potatoes for Two',
    description: 'Ultra-crispy on the outside, fluffy on the inside - these small-batch smashed potatoes are the perfect side dish for couples. Seasoned with garlic, rosemary, and sea salt, they deliver restaurant-quality results without leftovers cluttering your fridge.',
    featuredImage: '/images/recipes/smashed-potatoes.jpg',
    category: 'small-batch-meals',
    tags: ['potatoes', 'side-dish', 'crispy', 'garlic', 'rosemary', 'couples', 'small-batch'],
    prepTime: 15,
    cookTime: 35,
    totalTime: 50,
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '1 lb small baby potatoes (about 8-10 potatoes)',
      '2 tbsp extra virgin olive oil',
      '3 cloves garlic, minced',
      '1 tbsp fresh rosemary, chopped (or 1 tsp dried)',
      '1 tsp coarse sea salt',
      '1/2 tsp black pepper',
      '1/4 tsp paprika',
      '2 tbsp fresh chives, chopped for garnish',
      'Flaky sea salt for finishing'
    ],
    instructions: [
      'Preheat oven to 450°F (230°C). Place potatoes in a pot and cover with salted water.',
      'Bring to a boil and cook for 15-20 minutes until fork-tender but not falling apart.',
      'Drain potatoes and let cool for 5 minutes until safe to handle.',
      'Place potatoes on a baking sheet. Using a potato masher or fork, gently smash each potato until flattened but still in one piece.',
      'Drizzle with olive oil and sprinkle with minced garlic, rosemary, salt, pepper, and paprika.',
      'Roast for 20-25 minutes until edges are golden brown and crispy.',
      'Garnish with fresh chives and flaky sea salt. Serve immediately while crispy.',
      'Storage tip: These are best eaten fresh, but leftovers can be reheated in a hot skillet to restore crispiness.'
    ],
    nutrition: {
      calories: 195,
      protein: 4,
      carbs: 32,
      fat: 7,
      fiber: 3
    },
    faqs: [
      {
        question: 'Can I use larger potatoes?',
        answer: 'Yes, but cut them into smaller pieces after boiling. The key is having pieces that are about 2-3 inches across for even cooking.'
      },
      {
        question: 'What if I don\'t have fresh rosemary?',
        answer: 'Dried rosemary works fine - use about 1/3 the amount. You can also substitute with thyme, oregano, or even everything bagel seasoning.'
      },
      {
        question: 'How do I store leftovers?',
        answer: 'Store in the fridge for up to 2 days. Reheat in a hot skillet with a bit of oil to restore the crispiness - the oven won\'t crisp them up as well.'
      }
    ],
    datePublished: '2024-01-20',
    author: {
      name: 'Sarah Chen',
      image: '/images/author.jpg'
    },
    rating: {
      value: 4.8,
      count: 892
    }
  },
  {
    id: 'mason-jar-overnight-oats-single',
    title: 'Mason Jar Overnight Oats (Single Serving)',
    description: 'The ultimate grab-and-go breakfast for busy mornings. This single-serving overnight oats recipe is customizable, nutritious, and eliminates morning decision fatigue. Make it Sunday night, eat it Monday morning - no cooking, no cleanup, no waste.',
    featuredImage: '/images/recipes/overnight-oats.jpg',
    category: 'quick-mini-recipes',
    tags: ['overnight-oats', 'breakfast', 'meal-prep', 'no-cook', 'healthy', 'customizable'],
    prepTime: 5,
    cookTime: 0,
    totalTime: 5,
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1/2 cup old-fashioned oats',
      '1/2 cup milk of choice (almond, oat, dairy)',
      '1 tbsp chia seeds',
      '1 tbsp maple syrup or honey',
      '1/4 tsp vanilla extract',
      'Pinch of salt',
      '2 tbsp Greek yogurt (optional, for protein)',
      'Toppings: 1/4 cup berries, 1 tbsp nuts, 1 tsp coconut flakes'
    ],
    instructions: [
      'In a mason jar or container with a tight lid, combine oats, milk, chia seeds, sweetener, vanilla, and salt.',
      'If using yogurt, add it now and stir well to combine.',
      'Secure the lid and shake vigorously for 30 seconds to ensure everything is well mixed.',
      'Refrigerate overnight (or at least 4 hours) for the oats to absorb the liquid.',
      'In the morning, give it a stir and add your chosen toppings.',
      'Eat cold or warm it up in the microwave for 30-60 seconds if you prefer it warm.',
      'Keeps in the refrigerator for up to 3 days, making it perfect for meal prep.'
    ],
    nutrition: {
      calories: 285,
      protein: 12,
      carbs: 45,
      fat: 8,
      fiber: 9
    },
    faqs: [
      {
        question: 'Can I make multiple servings at once?',
        answer: 'Absolutely! This recipe scales perfectly. Make 3-5 jars at once for weekday meal prep. Just multiply all ingredients by the number of servings you want.'
      },
      {
        question: 'What are some flavor variations?',
        answer: 'Try chocolate (add 1 tbsp cocoa powder), apple cinnamon (add diced apple and cinnamon), or tropical (add coconut and pineapple). The possibilities are endless!'
      },
      {
        question: 'Do I have to use chia seeds?',
        answer: 'No, but they add nutrition and help thicken the mixture. You can substitute with ground flaxseed or just omit them entirely.'
      }
    ],
    datePublished: '2024-01-18',
    author: {
      name: 'Sarah Chen',
      image: '/images/author.jpg'
    },
    rating: {
      value: 4.9,
      count: 2156
    }
  },
  {
    id: 'dorm-room-ramen-upgrade',
    title: 'Dorm Room Ramen Upgrade (One Bowl Wonder)',
    description: 'Transform basic instant ramen into a nutritious, satisfying meal with just a few simple additions. This recipe is perfect for college students, young professionals, or anyone with minimal kitchen space who still wants to eat well.',
    featuredImage: '/images/recipes/upgraded-ramen.jpg',
    category: 'beginner-mini-cooking',
    tags: ['ramen', 'dorm-food', 'budget-friendly', 'student-meals', 'quick', 'one-bowl'],
    prepTime: 5,
    cookTime: 8,
    totalTime: 13,
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 package instant ramen (discard seasoning packet)',
      '1 1/2 cups low-sodium chicken or vegetable broth',
      '1 soft-boiled egg (or fried egg)',
      '1/4 cup frozen mixed vegetables',
      '2 green onions, sliced',
      '1 clove garlic, minced (or 1/4 tsp garlic powder)',
      '1 tsp sesame oil',
      '1 tsp soy sauce',
      '1/2 tsp sriracha or hot sauce (optional)',
      '1 tbsp sesame seeds or crushed peanuts for garnish'
    ],
    instructions: [
      'If making soft-boiled egg from scratch: boil water, add egg, cook for 6-7 minutes, then transfer to ice water.',
      'In a small pot, bring broth to a boil. Add minced garlic and frozen vegetables.',
      'Add the ramen noodles (without seasoning packet) and cook for 2-3 minutes until tender.',
      'Remove from heat and stir in sesame oil, soy sauce, and sriracha if using.',
      'Transfer to a bowl and top with sliced green onions, soft-boiled egg, and sesame seeds.',
      'Pro tip: Keep soft-boiled eggs prepped in your fridge for quick upgrades all week!',
      'Budget variation: Skip the egg and add extra vegetables or a handful of spinach for nutrients.'
    ],
    nutrition: {
      calories: 320,
      protein: 16,
      carbs: 38,
      fat: 12,
      fiber: 4
    },
    faqs: [
      {
        question: 'Can I use the seasoning packet?',
        answer: 'You can use half of it for flavor, but it\'s very high in sodium. The broth and other seasonings provide better flavor and nutrition.'
      },
      {
        question: 'What if I don\'t have a stove?',
        answer: 'This works in a microwave too! Cook noodles in broth for 2-3 minutes, stir in seasonings, and add toppings. A hot water kettle also works for this recipe.'
      },
      {
        question: 'How can I meal prep this?',
        answer: 'Prep all toppings and keep them in containers. Cook the noodles fresh each time - they don\'t reheat well. The toppings will keep this interesting all week.'
      }
    ],
    datePublished: '2024-01-25',
    author: {
      name: 'Sarah Chen',
      image: '/images/author.jpg'
    },
    rating: {
      value: 4.7,
      count: 1845
    }
  },
  {
    id: 'mini-no-knead-bread-loaf',
    title: 'Mini No-Knead Bread Loaf (Perfect for Two)',
    description: 'Fresh homemade bread without the commitment of a full loaf! This small-batch no-knead bread produces a perfectly sized loaf for two people, with a crispy crust and soft, airy interior. Minimal effort, maximum satisfaction.',
    featuredImage: '/images/recipes/mini-bread-loaf.jpg',
    category: 'mini-baking',
    tags: ['bread', 'no-knead', 'small-batch', 'artisan', 'couples', 'weekend-baking'],
    prepTime: 15,
    cookTime: 30,
    totalTime: 18 * 60 + 45, // 18 hours rise time + 45 minutes active
    servings: 2,
    difficulty: 'Medium',
    ingredients: [
      '1 1/2 cups all-purpose flour',
      '1/4 tsp active dry yeast',
      '3/4 tsp salt',
      '3/4 cup warm water',
      '1 tbsp olive oil (optional, for richer flavor)',
      '1 tsp honey (optional, for subtle sweetness)',
      'Extra flour for dusting',
      'Coarse cornmeal or semolina for baking surface'
    ],
    instructions: [
      'In a medium bowl, whisk together flour, yeast, and salt.',
      'Add warm water, olive oil, and honey if using. Stir with a wooden spoon until a shaggy dough forms.',
      'Cover bowl tightly with plastic wrap and let sit at room temperature for 12-18 hours. Dough will be bubbly and smell slightly sour.',
      'Turn dough out onto a heavily floured surface. Fold dough over itself 3-4 times with floured hands.',
      'Shape into a rough ball and place seam-side down on parchment paper. Cover with a damp towel and rise for 2 hours.',
      'Place a small Dutch oven or heavy pot with lid in oven and preheat to 450°F (230°C).',
      'Carefully remove hot pot. Lift dough using parchment paper and place in pot.',
      'Cover and bake for 20 minutes. Remove lid and bake 8-10 minutes more until golden brown.',
      'Cool on wire rack for at least 1 hour before slicing. The bread will continue cooking as it cools.'
    ],
    nutrition: {
      calories: 185,
      protein: 6,
      carbs: 37,
      fat: 1,
      fiber: 2
    },
    faqs: [
      {
        question: 'Can I speed up the rising process?',
        answer: 'The long rise is what develops flavor, but you can reduce to 8-12 hours in a warmer environment. Faster rises will result in less complex flavor.'
      },
      {
        question: 'What if I don\'t have a Dutch oven?',
        answer: 'You can use any heavy pot with a lid, or bake on a baking stone with a pan of water on the bottom rack for steam. A loaf pan also works but won\'t give you the same crust.'
      },
      {
        question: 'How long does this bread keep?',
        answer: 'Best eaten within 2-3 days. Store wrapped in a kitchen towel, not plastic. You can slice and freeze portions for toasting later.'
      }
    ],
    datePublished: '2024-01-12',
    author: {
      name: 'Sarah Chen',
      image: '/images/author.jpg'
    },
    rating: {
      value: 4.8,
      count: 743
    }
  },
  {
    id: 'single-serving-shakshuka',
    title: 'Single-Serving Shakshuka in a Cast Iron Skillet',
    description: 'This North African-inspired breakfast features eggs poached in a rich, spiced tomato sauce. Made in a 6-inch cast iron skillet, it\'s perfectly portioned for one and makes an impressive presentation for weekend brunches or dinner-for-breakfast nights.',
    featuredImage: '/images/recipes/single-shakshuka.jpg',
    category: 'small-batch-meals',
    tags: ['shakshuka', 'eggs', 'breakfast', 'brunch', 'middle-eastern', 'cast-iron', 'single-serving'],
    prepTime: 10,
    cookTime: 20,
    totalTime: 30,
    servings: 1,
    difficulty: 'Medium',
    ingredients: [
      '1 tbsp olive oil',
      '1/4 small onion, diced (about 2 tbsp)',
      '1 clove garlic, minced',
      '1/4 tsp ground cumin',
      '1/4 tsp paprika',
      'Pinch of cayenne pepper',
      '1/2 can (7 oz) diced tomatoes',
      '1/4 tsp salt',
      '1-2 large eggs',
      '2 tbsp crumbled feta cheese',
      '1 tbsp fresh parsley, chopped',
      '1 small pita bread or crusty bread for serving'
    ],
    instructions: [
      'Heat olive oil in a 6-inch cast iron skillet over medium heat.',
      'Add diced onion and cook for 3-4 minutes until softened.',
      'Add garlic, cumin, paprika, and cayenne. Cook for 30 seconds until fragrant.',
      'Pour in diced tomatoes with their juice and add salt. Simmer for 8-10 minutes until sauce thickens.',
      'Using a spoon, make 1-2 small wells in the sauce. Crack eggs into the wells.',
      'Cover skillet and cook for 5-8 minutes until egg whites are set but yolks are still slightly runny.',
      'Remove from heat and sprinkle with feta cheese and fresh parsley.',
      'Serve immediately in the skillet with warm pita bread for dipping.',
      'Customization tip: Add olives, roasted red peppers, or fresh herbs to make it your own!'
    ],
    nutrition: {
      calories: 285,
      protein: 16,
      carbs: 14,
      fat: 19,
      fiber: 4
    },
    faqs: [
      {
        question: 'Can I use fresh tomatoes instead of canned?',
        answer: 'Yes! Use 2-3 medium tomatoes, diced. Cook them a bit longer to break down and concentrate the flavors. Add a pinch of tomato paste for richness.'
      },
      {
        question: 'What if I don\'t have a cast iron skillet?',
        answer: 'Any small oven-safe skillet works. You can even use a small saucepan - just cover with a lid instead of putting it in the oven.'
      },
      {
        question: 'How do I know when the eggs are done?',
        answer: 'The whites should be completely set and opaque, while the yolks should still jiggle slightly when you shake the pan. Everyone likes their eggs different, so adjust cooking time to your preference.'
      }
    ],
    datePublished: '2024-01-28',
    author: {
      name: 'Sarah Chen',
      image: '/images/author.jpg'
    },
    rating: {
      value: 4.9,
      count: 1054
    }
  }
];
