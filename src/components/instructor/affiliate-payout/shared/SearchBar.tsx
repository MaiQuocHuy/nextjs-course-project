import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  placeholder?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchBar = ({
  placeholder = "Search...",
  searchQuery,
  onSearchChange,
}: SearchBarProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [debouncedSearchQuery, resetDebounce] = useDebounce(
    localSearchQuery,
    300
  );

  // Keep a ref to the latest onSearchChange so parent inline handlers
  // don't trigger the effect unexpectedly (they may change identity each render).
  const onSearchChangeRef = useRef(onSearchChange);
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  // Update parent when debounced value changes
  useEffect(() => {
    onSearchChangeRef.current(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  // Sync local state with external updates
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleClear = () => {
    setLocalSearchQuery("");
    resetDebounce("");
    onSearchChange("");
  };

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={localSearchQuery}
        onChange={(e) => setLocalSearchQuery(e.target.value)}
        className="pl-10 pr-10 transition-all duration-200 focus:shadow-md focus:ring-2 focus:ring-primary/20"
      />
      {localSearchQuery && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-muted rounded-full transition-colors"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
      {localSearchQuery !== debouncedSearchQuery && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};
