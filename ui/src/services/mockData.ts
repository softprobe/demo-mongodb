
import { GroceryItem } from "../types/groceryTypes";

// Sample grocery items for demonstration
export const sampleGroceryItems: GroceryItem[] = [
  {
    id: "1",
    name: "Organic Apples",
    quantity: 5,
    category: "Fruits"
  },
  {
    id: "2",
    name: "Whole Milk",
    quantity: 2,
    category: "Dairy"
  },
  {
    id: "3",
    name: "Whole Wheat Bread",
    quantity: 1,
    category: "Bakery"
  },
  {
    id: "4",
    name: "Chicken Breast",
    quantity: 3,
    category: "Meat"
  },
  {
    id: "5",
    name: "Spinach",
    quantity: 1,
    category: "Vegetables"
  },
  {
    id: "6",
    name: "Greek Yogurt",
    quantity: 4,
    category: "Dairy"
  },
  {
    id: "7",
    name: "Coffee Beans",
    quantity: 1,
    category: "Beverages"
  },
  {
    id: "8",
    name: "Potato Chips",
    quantity: 2,
    category: "Snacks"
  },
  {
    id: "9",
    name: "Frozen Pizza",
    quantity: 2,
    category: "Frozen"
  },
  {
    id: "10",
    name: "Brown Rice",
    quantity: 1,
    category: "Pantry"
  },
  {
    id: "11",
    name: "Chocolate Cookies",
    quantity: 3,
    category: "Munchies"
  },
  {
    id: "12",
    name: "Orange Juice",
    quantity: 1,
    category: "Beverages"
  }
];

// For demo purposes, we'll override the real API service with this mock
// This allows the UI to work without a real backend
let groceryItems = [...sampleGroceryItems];
let idCounter = groceryItems.length + 1;

export const mockFetchAllGroceries = async (): Promise<GroceryItem[]> => {
  await simulateNetworkDelay();
  return [...groceryItems];
};

export const mockFetchGroceryByName = async (name: string): Promise<GroceryItem> => {
  await simulateNetworkDelay();
  const item = groceryItems.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (!item) {
    throw new Error(`Grocery item with name: ${name} not found`);
  }
  return item;
};

export const mockFetchGroceriesByCategory = async (category: string): Promise<GroceryItem[]> => {
  await simulateNetworkDelay();
  return groceryItems.filter(item => item.category.toLowerCase() === category.toLowerCase());
};

export const mockCreateGrocery = async (item: Omit<GroceryItem, "id">): Promise<GroceryItem> => {
  await simulateNetworkDelay();
  const newItem = {
    ...item,
    id: String(idCounter++)
  };
  groceryItems.push(newItem);
  return newItem;
};

export const mockUpdateCategory = async (currentCategory: string, newCategory: string): Promise<string> => {
  await simulateNetworkDelay();
  const itemsToUpdate = groceryItems.filter(item => item.category.toLowerCase() === currentCategory.toLowerCase());
  itemsToUpdate.forEach(item => item.category = newCategory);
  return `Successfully updated ${itemsToUpdate.length} items.`;
};

export const mockUpdateQuantity = async (name: string, newQuantity: number): Promise<string> => {
  await simulateNetworkDelay();
  const item = groceryItems.find(item => item.name.toLowerCase() === name.toLowerCase());
  if (!item) {
    throw new Error(`Grocery item with name: ${name} not found`);
  }
  item.quantity = newQuantity;
  return `Quantity updated for item: ${name}`;
};

export const mockDeleteGrocery = async (id: string): Promise<string> => {
  await simulateNetworkDelay();
  const initialLength = groceryItems.length;
  groceryItems = groceryItems.filter(item => item.id !== id);
  if (groceryItems.length === initialLength) {
    throw new Error(`Grocery item with id: ${id} not found`);
  }
  return `Deleted grocery item with id: ${id}`;
};

export const mockGetGroceryCount = async (): Promise<number> => {
  await simulateNetworkDelay();
  return groceryItems.length;
};

function simulateNetworkDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 300));
}
