
const CATEGORY_CLASSES: Record<string, string> = {
  fruits: "category-badge-fruits",
  vegetables: "category-badge-vegetables",
  dairy: "category-badge-dairy",
  bakery: "category-badge-bakery",
  meat: "category-badge-meat",
  frozen: "category-badge-frozen",
  pantry: "category-badge-pantry",
  beverages: "category-badge-beverages",
  snacks: "category-badge-snacks",
  munchies: "category-badge-munchies",
};

export const getCategoryClass = (category: string): string => {
  const normalizedCategory = category.toLowerCase();
  return CATEGORY_CLASSES[normalizedCategory] || "category-badge-default";
};

export const PREDEFINED_CATEGORIES = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Bakery",
  "Meat",
  "Frozen",
  "Pantry",
  "Beverages",
  "Snacks",
  "Munchies",
];
