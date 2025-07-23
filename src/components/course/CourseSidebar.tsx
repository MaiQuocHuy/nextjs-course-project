"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { mockCategories } from "@/app/data/courses";

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  rating: number;
}

interface CourseSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function CourseSidebar({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
  className = "",
}: CourseSidebarProps) {
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId);

    onFiltersChange({
      ...filters,
      categories: updatedCategories,
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      rating: value[0],
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 500],
      rating: 0,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++;
    if (filters.rating > 0) count++;
    return count;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 bg-background border-r
          transform transition-transform duration-300 ease-in-out z-50 lg:z-auto
          lg:transform-none lg:transition-none overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${className}
        `}
        role="complementary"
        aria-label="Course filters"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Filters</h2>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {getActiveFiltersCount() > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs"
                >
                  Clear all
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden"
                aria-label="Close filters"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Categories Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.id, checked as boolean)
                    }
                    aria-describedby={`category-${category.id}-label`}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    id={`category-${category.id}-label`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Price Range Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Price Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="px-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={500}
                  min={0}
                  step={10}
                  className="w-full"
                  aria-label="Price range"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="font-mono">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Rating Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Minimum Rating</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="px-2">
                <Slider
                  value={[filters.rating]}
                  onValueChange={handleRatingChange}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                  aria-label="Minimum rating"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>0 stars</span>
                <span>5 stars</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {filters.rating}+ stars
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Filter Summary */}
          {getActiveFiltersCount() > 0 && (
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4">
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Active Filters:
                  </p>
                  <div className="space-y-1 text-blue-700 dark:text-blue-300">
                    {filters.categories.length > 0 && (
                      <p>• {filters.categories.length} categories selected</p>
                    )}
                    {(filters.priceRange[0] > 0 ||
                      filters.priceRange[1] < 500) && (
                      <p>
                        • Price: ${filters.priceRange[0]} - $
                        {filters.priceRange[1]}
                      </p>
                    )}
                    {filters.rating > 0 && (
                      <p>• Rating: {filters.rating}+ stars</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </aside>
    </>
  );
}
