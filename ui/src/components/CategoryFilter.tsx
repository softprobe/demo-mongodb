
import { PREDEFINED_CATEGORIES } from "@/utils/categoryUtils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  categories: string[];
}

const CategoryFilter = ({ selectedCategory, onSelectCategory, categories }: CategoryFilterProps) => {
  const uniqueCategories = Array.from(
    new Set([...PREDEFINED_CATEGORIES, ...categories.filter((c) => !PREDEFINED_CATEGORIES.includes(c))])
  );
  const isMobile = useIsMobile();

  return (
    <div className="w-full py-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-2 px-6">Categories</h2>
      <ScrollArea className="w-full" orientation="horizontal">
        <div className={cn("flex gap-2 pb-2", isMobile ? "px-4 flex-nowrap overflow-x-auto" : "px-4 flex-wrap")}>
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            className={cn(
              "rounded-full text-sm",
              selectedCategory === null ? "bg-grocery-green-600 hover:bg-grocery-green-700" : ""
            )}
            onClick={() => onSelectCategory(null)}
          >
            All Items
          </Button>
          {uniqueCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={cn(
                "rounded-full text-sm whitespace-nowrap",
                selectedCategory === category ? "bg-grocery-green-600 hover:bg-grocery-green-700" : ""
              )}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
