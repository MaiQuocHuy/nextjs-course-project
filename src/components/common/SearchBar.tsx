"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useGetCoursesQuery } from "@/services/coursesApi";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  className,
  placeholder = "Search courses...",
}: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();

  // Debounce search query để tránh spam API
  const [debouncedQuery] = useDebounce(query, 300);

  // Fetch courses từ API cho autocomplete
  const { data: coursesData, isLoading } = useGetCoursesQuery(
    {
      page: 0,
      size: 10, // Chỉ lấy 10 courses cho autocomplete
      search: debouncedQuery.trim() || undefined,
    },
    {
      skip: !debouncedQuery.trim(), // Skip khi không có search query
    }
  );

  const courses = coursesData?.content || [];
  const courseTitles = courses.map((course) => course.title);

  const handleSearch = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);

    if (value.trim()) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let searchTerm = query.trim();

    // Nếu có item được select, dùng nó thay vì typed query
    if (selectedIndex >= 0 && selectedIndex < courseTitles.length) {
      searchTerm = courseTitles[selectedIndex];
    }

    if (searchTerm) {
      // Navigate to courses page với search query
      router.push(`/courses?search=${encodeURIComponent(searchTerm)}`);
      setOpen(false);
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || courseTitles.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < courseTitles.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : courseTitles.length - 1
        );
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          e.preventDefault();
          selectCourse(courseTitles[selectedIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectCourse = (courseTitle: string) => {
    setQuery("");
    setOpen(false);
    setSelectedIndex(-1);
    // Navigate to courses page với selected course
    router.push(`/courses?search=${encodeURIComponent(courseTitle)}`);
  };

  const clearSearch = () => {
    setQuery("");
    setSelectedIndex(-1);
    setOpen(false);
  };

  // Đóng dropdown khi click outside
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setOpen(false);
      setSelectedIndex(-1);
    }, 200);
  }, []);

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim()) setOpen(true);
            }}
            onBlur={handleBlur}
            className="pl-10 pr-10 bg-muted/50 border-0 focus:bg-background transition-colors"
          />
          {query && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {open && (
        <div className="absolute top-full mt-1 w-full bg-popover border rounded-md shadow-lg z-[9999] max-h-[300px] overflow-auto">
          <div className="p-2">
            {isLoading ? (
              <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                Searching...
              </div>
            ) : courseTitles.length > 0 ? (
              <>
                <div className="text-xs font-medium text-muted-foreground px-2 py-1 border-b mb-1">
                  Courses ({courseTitles.length})
                </div>
                {courseTitles.map((courseTitle, index) => (
                  <div
                    key={`${courses[index].id}-${courseTitle}`}
                    onClick={() => selectCourse(courseTitle)}
                    className={`flex items-center gap-2 px-2 py-2 text-sm rounded cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent"
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onMouseLeave={() => setSelectedIndex(-1)}
                  >
                    <Search className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{courseTitle}</span>
                  </div>
                ))}
                {courseTitles.length === 10 && (
                  <div className="px-2 py-1 text-xs text-muted-foreground border-t mt-1">
                    Press Enter to see all results
                  </div>
                )}
              </>
            ) : query.trim() && !isLoading ? (
              <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                No courses found for "{query}"
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
