
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GroceryStats } from "@/types/groceryTypes";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface StatsPanelProps {
  stats: GroceryStats;
}

const StatsPanel = ({ stats }: StatsPanelProps) => {
  const { totalItems, categoryBreakdown } = stats;

  // Sort categories by count (descending)
  const sortedCategories = Object.entries(categoryBreakdown).sort(([, countA], [, countB]) => countB - countA);

  // Calculate percentages for each category
  const categoryPercentages = sortedCategories.map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / totalItems) * 100),
  }));

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-gray-800">Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">{Object.keys(categoryBreakdown).length}</p>
            </div>
          </div>

          <div className="space-y-4">
            {categoryPercentages.slice(0, 5).map(({ category, count, percentage }) => (
              <div key={category} className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{category}</p>
                  <p className="text-sm text-muted-foreground">
                    {count} item{count !== 1 ? "s" : ""} ({percentage}%)
                  </p>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPanel;
