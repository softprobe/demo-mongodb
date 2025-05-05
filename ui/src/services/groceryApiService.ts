
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

// Uncomment and use the below code when connecting to the real API
const API_URL = "http://localhost:8080/api/groceries";

export async function fetchAllGroceries(): Promise<GroceryItem[]> {
  const response = await request.get(`${API_URL}`);
  if (!response.data) {
    throw new Error("Failed to fetch grocery items");
  }
  return response.data;
}

export async function fetchGroceryByName(name: string): Promise<GroceryItem> {
  const response = await request.get(`${API_URL}/name/${encodeURIComponent(name)}`);
  if (!response.data) {
    throw new Error(`Failed to fetch grocery item with name: ${name}`);
  }
  return response.data;
}

export async function fetchGroceriesByCategory(category: string): Promise<GroceryItem[]> {
  const response = await request.get(`${API_URL}/category/${encodeURIComponent(category)}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.data) {
    throw new Error(`Failed to fetch grocery items in category: ${category}`);
  }
  return response.data;
}

export async function createGrocery(item: Omit<GroceryItem, "id">): Promise<GroceryItem> {
  const response = await request.post(`${API_URL}/create`, {
    headers: {
      "Content-Type": "application/json",
    },
    data: item,
  });
  if (!response.data) {
    throw new Error("Failed to create grocery item");
  }
  return response.data;
}

export async function updateCategory(currentCategory: string, newCategory: string): Promise<string> {
  const response = await request.put(`${API_URL}/updateCategory?currentCategory=${encodeURIComponent(currentCategory)}&newCategory=${encodeURIComponent(newCategory)}`);
  if (!response.data) {
    throw new Error("Failed to update category");
  }
  return response.data;
}

export async function updateQuantity(name: string, newQuantity: number): Promise<string> {
  const response = await request.put(`${API_URL}/updateQuantity?name=${encodeURIComponent(name)}&newQuantity=${newQuantity}`);
  if (!response.data) {
    throw new Error(`Failed to update quantity for item: ${name}`);
  }
  return response.data;
}

export async function deleteGrocery(id: string): Promise<string> {
  const response = await request.delete(`${API_URL}/${id}`);
  if (!response.data) {
    throw new Error(`Failed to delete grocery item with id: ${id}`);
  }
  return response.data;
}

export async function getGroceryCount(): Promise<number> {
  const response = await request.get(`${API_URL}/count`);
  if (!response.data) {
    throw new Error("Failed to fetch grocery count");
  }
  return response.data;
}
