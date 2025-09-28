"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showInfo?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
  itemName?: string;
}

export function CustomPaginationNotifications({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showInfo = true,
  totalItems = 0,
  itemsPerPage = 10,
  itemName = "items",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const delta = 1; // Number of pages to show around current page (only 1 on each side)

    // Always show first page
    pages.push(1);

    // Add ellipsis after first page if there's a gap
    if (currentPage - delta > 2) {
      pages.push(-1); // ellipsis
    }

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      if (i !== 1 && i !== totalPages) {
        // Don't duplicate first and last pages
        pages.push(i);
      }
    }

    // Add ellipsis before last page if there's a gap
    if (currentPage + delta < totalPages - 1) {
      pages.push(-1); // ellipsis
    }

    // Always show last page (if it's not the same as first page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Info Display */}
      {showInfo && totalItems > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {startIndex}-{endIndex} of {totalItems} {itemName}
          </span>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => {
            if (page === -1) {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Hook for pagination logic
export function usePagination<T>(items: T[], itemsPerPage: number, initialPage = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    handlePageChange,
    totalItems: items.length,
  };
}
