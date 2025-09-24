// Category names for recipe categorization
export const CATEGORY_NAMES = [
  'Breakfast',
  'Lunch', 
  'Dinner',
  'Dessert',
  'Healthy',
] as const;

export type CategoryName = typeof CATEGORY_NAMES[number];
