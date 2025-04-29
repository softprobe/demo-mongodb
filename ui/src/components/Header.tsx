
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onOpenAddItemModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header = ({ onOpenAddItemModal, searchQuery, setSearchQuery }: HeaderProps) => {
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <div className="bg-grocery-green-500 h-8 w-8 rounded-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-800">Grocery Gourmet</h1>
      </div>

      <div className="flex items-center space-x-4 flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={onOpenAddItemModal} className="bg-grocery-green-600 hover:bg-grocery-green-700">
        Add New Item
      </Button>
    </header>
  );
};

export default Header;
