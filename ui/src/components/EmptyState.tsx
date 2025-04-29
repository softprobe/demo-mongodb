
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ message, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-6xl mb-4">🛒</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">
        No grocery items found. Start adding items to your inventory.
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-grocery-green-600 hover:bg-grocery-green-700">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
