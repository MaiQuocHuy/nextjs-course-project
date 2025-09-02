import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PageInfo {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  pageInfo: PageInfo | null;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export const Pagination = ({
  currentPage,
  itemsPerPage,
  pageInfo,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) => {
  if (!pageInfo) return null;

  const totalPages = pageInfo.totalPages;
  const totalElements = pageInfo.totalElements;
  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalElements);

  const canGoPrevious = !pageInfo.first;
  const canGoNext = !pageInfo.last;

  const [pageSizes, setPageSizes] = useState<number[]>([]);

  useEffect(() => {
    if (totalElements >= 10) {
      const defaultPageSize = 10;
      const pageSizes = [defaultPageSize];
      for (let size = 20; size <= totalElements; size += 10) {
        if (size > 50) break; // Limit max page size to 50
        if (!pageSizes.includes(size)) {
          pageSizes.push(size);
        }
      }
      setPageSizes(pageSizes);
    }
  }, [totalElements]);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    onItemsPerPageChange(parseInt(value));
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    const displayCurrentPage = currentPage + 1; // Convert to 1-based for display

    for (
      let i = Math.max(2, displayCurrentPage - delta);
      i <= Math.min(totalPages - 1, displayCurrentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (displayCurrentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (displayCurrentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <Card className="py-0">
      <CardContent className="px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-6 bg-card border-border/50">
          {/* Results Summary */}
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-medium text-foreground">
                {startItem}-{endItem}
              </span>{' '}
              of{' '}
              <span className="font-medium text-foreground">
                {totalElements}
              </span>{' '}
              results
            </p>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center space-x-2">
            {/* First Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(0)}
              disabled={!canGoPrevious}
              className="hidden sm:flex h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Go to first page</span>
            </Button>

            {/* Previous Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={!canGoPrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Go to previous page</span>
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span
                      key={`dots-${index}`}
                      className="px-2 py-1 text-sm text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                }

                const pageNumber =
                  typeof page === 'number' ? page : parseInt(page);
                const isActive = pageNumber === currentPage + 1;

                return (
                  <Button
                    key={page}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => goToPage(pageNumber - 1)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                    <span className="sr-only">
                      {isActive ? `Current page ${page}` : `Go to page ${page}`}
                    </span>
                  </Button>
                );
              })}
            </div>

            {/* Next Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={!canGoNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Go to next page</span>
            </Button>

            {/* Last Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(totalPages - 1)}
              disabled={!canGoNext}
              className="hidden sm:flex h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Go to last page</span>
            </Button>
          </div>

          {/* Items per page */}
          {pageSizes.length > 0 && (
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={itemsPerPage} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizes.map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
