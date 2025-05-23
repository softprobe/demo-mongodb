import request from "@/utils/request";
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

export async function fetchAllGroceries(): Promise<GroceryItem[]> {
  const response = await request.get(`/api/groceries/getAll`);
  if (!response.data) {
    throw new Error("Failed to fetch grocery items");
  }
  return response.data;
}

export async function fetchGroceryByName(name: string): Promise<GroceryItem> {
  const response = await request.get(`/api/groceries/name/${encodeURIComponent(name)}`);
  if (!response.data) {
    throw new Error(`Failed to fetch grocery item with name: ${name}`);
  }
  return response.data;
}

export async function fetchGroceriesByCategory(category: string): Promise<GroceryItem[]> {
  const response = await request.get(`/api/groceries/category/${encodeURIComponent(category)}`);
  if (!response.data) {
    throw new Error(`Failed to fetch grocery items in category: ${category}`);
  }
  return response.data;
}

export async function createGrocery(item: Omit<GroceryItem, "id">): Promise<GroceryItem> {
  const response = await request.post(`/api/groceries/create`, item);
  if (!response.data) {
    throw new Error("Failed to create grocery item");
  }
  return response.data;
}

export async function updateCategory(currentCategory: string, newCategory: string): Promise<string> {
  const response = await request.put(`/api/groceries/updateCategory`, null, {
    params: {
      currentCategory,
      newCategory
    }
  });
  if (!response.data) {
    throw new Error("Failed to update category");
  }
  return response.data;
}

export async function updateQuantity(name: string, newQuantity: number): Promise<string> {
  const response = await request.put(`/api/groceries/updateQuantity`, null, {
    params: {
      name,
      newQuantity
    }
  });
  if (!response.data) {
    throw new Error(`Failed to update quantity for item: ${name}`);
  }
  return response.data;
}

export async function deleteGrocery(id: string): Promise<string> {
  const response = await request.delete(`/api/groceries/${id}`);
  if (!response.data) {
    throw new Error(`Failed to delete grocery item with id: ${id}`);
  }
  return response.data;
}

export async function getGroceryCount(): Promise<number> {
  const response = await request.get(`/api/groceries/count`);
  if (!response.data) {
    throw new Error("Failed to fetch grocery count");
  }
  return response.data;
}
