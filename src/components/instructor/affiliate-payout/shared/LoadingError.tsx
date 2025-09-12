import { DollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function TableLoadingError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <CardContent>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
              <DollarSign className="h-6 w-6 text-destructive" />
            </div>
            <div className="text-center space-y-2 max-w-md">
              <h3 className="text-lg font-semibold text-foreground">
                Failed to load payouts
              </h3>
              <p className="text-sm text-muted-foreground">
                Unable to load affiliate payouts. Please try again.
              </p>
            </div>
            {onRetry && (
              <Button variant="outline" onClick={onRetry} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload
              </Button>
            )}
          </div>
        </CardContent>
      </CardContent>
    </Card>
  );
}
