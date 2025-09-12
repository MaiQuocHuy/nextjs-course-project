import { Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  type: "no-data" | "no-results";
  clearFilters?: () => void;
}

export const EmptyState = ({ type, clearFilters }: EmptyStateProps) => {
  if (type === "no-data") {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No payouts found</h3>
          <p className="text-muted-foreground mb-4 max-w-sm">
            There are no affiliate payouts available at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Search className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          No payouts match your current search criteria. Try adjusting your
          filters.
        </p>
        <Button
          variant="outline"
          onClick={clearFilters}
          className="transition-colors hover:bg-muted"
        >
          Clear filters
        </Button>
      </CardContent>
    </Card>
  );
};
