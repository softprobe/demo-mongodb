
import { GroceryItem } from "@/types/groceryTypes";
import { getCategoryClass } from "@/utils/categoryUtils";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroceryItemCardProps {
  item: GroceryItem;
  onEditItem: (item: GroceryItem) => void;
  onDeleteItem: (id: string) => void;
}

const GroceryItemCard = ({ item, onEditItem, onDeleteItem }: GroceryItemCardProps) => {
  const getItemImage = (name: string) => {
    const lowercaseName = name.toLowerCase();
    
    // Map of keywords to food icons
    const foodIcons: Record<string, string> = {
      apple: "🍎",
      banana: "🍌",
      milk: "🥛",
      bread: "🍞",
      cheese: "🧀",
      chicken: "🍗",
      beef: "🥩",
      fish: "🐟",
      rice: "🍚",
      pasta: "🍝",
      egg: "🥚",
      cereal: "🥣",
      coffee: "☕",
      tea: "🍵",
      juice: "🧃",
      cookie: "🍪",
      chocolate: "🍫",
      ice: "🧊",
      pizza: "🍕",
      burger: "🍔",
      fries: "🍟",
      soda: "🥤",
      water: "💧",
    };
    
    // Try to find a matching food icon
    for (const [keyword, icon] of Object.entries(foodIcons)) {
      if (lowercaseName.includes(keyword)) {
        return icon;
      }
    }
    
    // Default icons based on category
    const categoryIcons: Record<string, string> = {
      fruits: "🍏",
      vegetables: "🥦",
      dairy: "🥛",
      bakery: "🥖",
      meat: "🥩",
      frozen: "❄️",
      pantry: "🥫",
      beverages: "🥤",
      snacks: "🍿",
      munchies: "🍪",
    };
    
    return categoryIcons[item.category.toLowerCase()] || "🛒";
  };

  return (
    <div className="item-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-gray-100">
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
          <span
            className={cn("category-badge", getCategoryClass(item.category))}
          >
            {item.category}
          </span>
        </div>
        <div className="mt-6 text-center">
          <span className="text-4xl">{getItemImage(item.name)}</span>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Quantity</p>
            <p className="text-lg font-semibold">{item.quantity}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="text-amber-600 border-amber-200 hover:bg-amber-50"
              onClick={() => onEditItem(item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => onDeleteItem(item.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryItemCard;
