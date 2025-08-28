import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface FilterBarProps {
  statusFilter: 'ALL' | 'PENDING' | 'COMPLETED' | 'FAILED';
  dateRange: {
    from: string | null;
    to: string | null;
  };
  onStatusFilterChange: (
    status: 'ALL' | 'PENDING' | 'COMPLETED' | 'FAILED'
  ) => void;
  onDateRangeChange: (range: {
    from: string | null;
    to: string | null;
  }) => void;
  onClearFilters: () => void;
  // Optional payment method filter (for payments page)
  paymentMethodFilter?: 'ALL' | 'stripe' | 'paypal';
  onPaymentMethodFilterChange?: (method: 'ALL' | 'stripe' | 'paypal') => void;
}

export const FilterBar = ({
  statusFilter,
  dateRange,
  onStatusFilterChange,
  onDateRangeChange,
  onClearFilters,
}: FilterBarProps) => {
  // Determine if any filters are active
  const hasActiveFilters =
    statusFilter !== 'ALL' ||
    dateRange.from ||
    dateRange.to;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 ">
      <div className="flex gap-3">
        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={onStatusFilterChange}
        >
          <SelectTrigger className="w-[140px] transition-all duration-200 hover:bg-muted/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              All Statuses
            </SelectItem>
            <SelectItem value="PENDING">
              Pending
            </SelectItem>
            <SelectItem value="COMPLETED">
              Completed
            </SelectItem>
            <SelectItem value="FAILED">
              Failed
            </SelectItem>
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
                  {new Date(dateRange.from).toLocaleDateString()} -{' '}
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
                  value={dateRange.from || ''}
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
                  value={dateRange.to || ''}
                  onChange={(e) =>
                    onDateRangeChange({
                      from: dateRange.from,
                      to: e.target.value || null,
                    })
                  }
                />
              </div>
              {(dateRange.from || dateRange.to) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDateRangeChange({ from: null, to: null })}
                  className="w-full"
                >
                  Clear dates
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters and Clear Button */}
      <div className="flex flex-col items-center gap-2">
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 lg:px-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
};
