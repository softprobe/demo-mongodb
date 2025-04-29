
export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
}

export interface GroceryStats {
  totalItems: number;
  categoryBreakdown: Record<string, number>;
}
