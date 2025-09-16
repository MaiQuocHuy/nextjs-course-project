import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterBarProps {
  typeFilter: "ALL" | "REFERRAL" | "GENERAL";
  dateRange: {
    from: string | null;
    to: string | null;
  };
  onTypeFilterChange: (type: "ALL" | "REFERRAL" | "GENERAL") => void;
  onDateRangeChange: (range: {
    from: string | null;
    to: string | null;
  }) => void;
  onClearFilters: () => void;
}

export const FilterBar = ({
  typeFilter,
  dateRange,
  onTypeFilterChange,
  onDateRangeChange,
  onClearFilters,
}: FilterBarProps) => {
  // Determine if any filters are active
  const hasActiveFilters =
    typeFilter !== "ALL" || dateRange.from || dateRange.to;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 ">
      <div className="flex gap-3">
        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-[140px] transition-all duration-200 hover:bg-muted/50">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="REFERRAL">Referral</SelectItem>
            <SelectItem value="GENERAL">General</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left font-normal transition-all duration-200 hover:bg-muted/50"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange.from && dateRange.to ? (
                <>
                  {new Date(dateRange.from).toLocaleDateString()} -{" "}
                  {new Date(dateRange.to).toLocaleDateString()}
                </>
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-from">From</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={dateRange.from || ""}
                  onChange={(e) =>
                    onDateRangeChange({
                      from: e.target.value || null,
                      to: dateRange.to,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to">To</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={dateRange.to || ""}
                  onChange={(e) =>
                    onDateRangeChange({
                      from: dateRange.from,
                      to: e.target.value || null,
                    })
                  }
                />
              </div>
              <Button
                variant="outline"
                onClick={() => onDateRangeChange({ from: null, to: null })}
                className="w-full"
              >
                Clear dates
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
};
