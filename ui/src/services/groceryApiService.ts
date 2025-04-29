
import { GroceryItem } from "../types/groceryTypes";
import {
  mockFetchAllGroceries,
  mockFetchGroceryByName,
  mockFetchGroceriesByCategory,
  mockCreateGrocery,
  mockUpdateCategory,
  mockUpdateQuantity,
  mockDeleteGrocery,
  mockGetGroceryCount
} from "./mockData";

// Using mock implementations for demo
// export const fetchAllGroceries = mockFetchAllGroceries;
// export const fetchGroceryByName = mockFetchGroceryByName;
// export const fetchGroceriesByCategory = mockFetchGroceriesByCategory;
// export const createGrocery = mockCreateGrocery;
// export const updateCategory = mockUpdateCategory;
// export const updateQuantity = mockUpdateQuantity;
// export const deleteGrocery = mockDeleteGrocery;
// export const getGroceryCount = mockGetGroceryCount;

// Uncomment and use the below code when connecting to the real API
const API_URL = "http://localhost:8080/api/groceries";

export async function fetchAllGroceries(): Promise<GroceryItem[]> {
  const response = await fetch(`${API_URL}`);
  if (!response.ok) {
    throw new Error("Failed to fetch grocery items");
  }
  return response.json();
}

export async function fetchGroceryByName(name: string): Promise<GroceryItem> {
  const response = await fetch(`${API_URL}/name/${encodeURIComponent(name)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch grocery item with name: ${name}`);
  }
  return response.json();
}

export async function fetchGroceriesByCategory(category: string): Promise<GroceryItem[]> {
  const response = await fetch(`${API_URL}/category/${encodeURIComponent(category)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch grocery items in category: ${category}`);
  }
  return response.json();
}

export async function createGrocery(item: Omit<GroceryItem, "id">): Promise<GroceryItem> {
  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to create grocery item");
  }
  return response.json();
}

export async function updateCategory(currentCategory: string, newCategory: string): Promise<string> {
  const response = await fetch(
    `${API_URL}/updateCategory?currentCategory=${encodeURIComponent(currentCategory)}&newCategory=${encodeURIComponent(newCategory)}`,
    {
      method: "PUT",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update category");
  }
  return response.text();
}

export async function updateQuantity(name: string, newQuantity: number): Promise<string> {
  const response = await fetch(
    `${API_URL}/updateQuantity?name=${encodeURIComponent(name)}&newQuantity=${newQuantity}`,
    {
      method: "PUT",
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to update quantity for item: ${name}`);
  }
  return response.text();
}

export async function deleteGrocery(id: string): Promise<string> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete grocery item with id: ${id}`);
  }
  return response.text();
}

export async function getGroceryCount(): Promise<number> {
  const response = await fetch(`${API_URL}/count`);
  if (!response.ok) {
    throw new Error("Failed to fetch grocery count");
  }
  return response.json();
}
