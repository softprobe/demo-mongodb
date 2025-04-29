
import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GroceryItem, GroceryStats } from "@/types/groceryTypes";
import {
  fetchAllGroceries,
  createGrocery,
  updateQuantity,
  deleteGrocery,
  getGroceryCount,
} from "@/services/groceryApiService";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import StatsPanel from "@/components/StatsPanel";
import GroceryItemCard from "@/components/GroceryItemCard";
import AddEditItemModal from "@/components/AddEditItemModal";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import EmptyState from "@/components/EmptyState";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<GroceryItem | undefined>(
    undefined
  );
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Queries
  const {
    data: groceryItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["groceryItems"],
    queryFn: fetchAllGroceries,
  });

  // Calculate unique categories from items
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(groceryItems.map((item) => item.category)));
  }, [groceryItems]);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return groceryItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === null || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [groceryItems, searchQuery, selectedCategory]);

  // Calculate stats
  const stats: GroceryStats = useMemo(() => {
    const categoryBreakdown: Record<string, number> = {};
    groceryItems.forEach((item) => {
      if (categoryBreakdown[item.category]) {
        categoryBreakdown[item.category]++;
      } else {
        categoryBreakdown[item.category] = 1;
      }
    });
    return {
      totalItems: groceryItems.length,
      categoryBreakdown,
    };
  }, [groceryItems]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newItem: Omit<GroceryItem, "id">) => createGrocery(newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groceryItems"] });
      toast({
        title: "Item added successfully",
        description: "Your grocery item has been added to the inventory.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      name,
      newQuantity,
    }: {
      name: string;
      newQuantity: number;
    }) => updateQuantity(name, newQuantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groceryItems"] });
      toast({
        title: "Item updated successfully",
        description: "Your grocery item has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGrocery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groceryItems"] });
      toast({
        title: "Item deleted",
        description: "Your grocery item has been removed from the inventory.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleAddEditItem = (
    data: Omit<GroceryItem, "id"> & { id?: string }
  ) => {
    if (data.id) {
      // This is an update operation
      updateMutation.mutate({
        name: data.name,
        newQuantity: data.quantity,
      });
    } else {
      // This is a create operation
      createMutation.mutate(data);
    }
    setIsAddEditModalOpen(false);
    setCurrentItem(undefined);
  };

  const handleEditItem = (item: GroceryItem) => {
    setCurrentItem(item);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    const item = groceryItems.find((item) => item.id === id);
    if (item) {
      setItemToDelete({ id, name: item.name });
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Grocery Items
          </h2>
          <p className="text-gray-600">
            There was a problem fetching your grocery data. Please try again
            later.
          </p>
          <Button
            className="mt-4 bg-grocery-green-600 hover:bg-grocery-green-700"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["groceryItems"] })
            }
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onOpenAddItemModal={() => {
          setCurrentItem(undefined);
          setIsAddEditModalOpen(true);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={uniqueCategories}
      />

      <Separator />

      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {!isMobile && (
            <div className="hidden md:block">
              <StatsPanel stats={stats} />
            </div>
          )}

          <div className="md:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg h-40 shadow-md"
                  />
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <GroceryItemCard
                    key={item.id}
                    item={item}
                    onEditItem={handleEditItem}
                    onDeleteItem={handleDeleteItem}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                message={
                  searchQuery || selectedCategory
                    ? "No matching items found"
                    : "Your grocery inventory is empty"
                }
                actionLabel={
                  searchQuery || selectedCategory ? undefined : "Add First Item"
                }
                onAction={
                  searchQuery || selectedCategory
                    ? undefined
                    : () => setIsAddEditModalOpen(true)
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Stats Panel */}
      {isMobile && (
        <div className="container mx-auto py-6 px-4">
          <StatsPanel stats={stats} />
        </div>
      )}

      {/* Modals */}
      <AddEditItemModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setCurrentItem(undefined);
        }}
        onSubmit={handleAddEditItem}
        initialData={currentItem}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteItem}
        itemName={itemToDelete?.name || ""}
      />
    </div>
  );
};

export default Dashboard;
