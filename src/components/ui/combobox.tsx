import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
  subtitle?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyText = "No options found",
  disabled = false,
  className,
  isLoading = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options;

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue);
    setOpen(false);
    setSearchQuery("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchQuery("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-11 px-3",
            !selectedOption && "text-muted-foreground",
            className
          )}
          disabled={disabled || isLoading}
        >
          <div className="flex flex-col items-start overflow-hidden min-w-0 flex-1 gap-0.5">
            {selectedOption ? (
              <>
                <span className="truncate text-sm w-full text-left">{selectedOption.label}</span>
                {selectedOption.subtitle && (
                  <span className="text-xs text-muted-foreground truncate leading-tight w-full text-left">
                    {selectedOption.subtitle}
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-left">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0 overflow-hidden"
        align="start"
        sideOffset={4}
      >
        <div className="flex items-center border-b px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 px-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="max-h-[240px] overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="py-4 px-3 text-left text-sm text-muted-foreground">{emptyText}</div>
          ) : (
            <div className="p-1">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    value === option.value && "bg-accent text-accent-foreground"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col items-start overflow-hidden min-w-0 flex-1">
                    <span className="truncate text-sm w-full text-left">{option.label}</span>
                    {option.subtitle && (
                      <span className="text-xs text-muted-foreground truncate leading-tight w-full text-left">
                        {option.subtitle}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
