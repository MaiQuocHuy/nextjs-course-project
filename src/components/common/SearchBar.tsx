"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getPublishedCourses } from "@/app/data/courses";

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
  const [allCourses, setAllCourses] = useState<string[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();

  // Load course titles on mount
  useEffect(() => {
    const courses = getPublishedCourses();
    const courseTitles = courses.map((course) => course.title);
    setAllCourses(courseTitles);
    setFilteredCourses(courseTitles);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1); // Reset selection when search changes
    if (value) {
      const filtered = allCourses.filter((course) =>
        course.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCourses(filtered);
      setOpen(true);
    } else {
      setFilteredCourses(allCourses);
      setOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let searchTerm = query.trim();

    // If there's a selected item, use it instead of typed query
    if (selectedIndex >= 0 && selectedIndex < filteredCourses.length) {
      searchTerm = filteredCourses[selectedIndex];
    }

    if (searchTerm) {
      // Navigate to courses page with search query
      router.push(`/courses?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || filteredCourses.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCourses.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCourses.length - 1
        );
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          e.preventDefault();
          selectCourse(filteredCourses[selectedIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectCourse = (course: string) => {
    setQuery(course);
    setOpen(false);
    setSelectedIndex(-1);
    // Navigate to courses page with selected course
    router.push(`/courses?search=${encodeURIComponent(course)}`);
  };

  const clearSearch = () => {
    setQuery("");
    setFilteredCourses(allCourses);
    setSelectedIndex(-1);
    setOpen(false);
  };

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
              if (query) setOpen(true);
            }}
            onBlur={() =>
              setTimeout(() => {
                setOpen(false);
                setSelectedIndex(-1);
              }, 200)
            }
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
      {open && filteredCourses.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-popover border rounded-md shadow-lg z-[9999] max-h-[200px] overflow-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground px-2 py-1">
              Courses
            </div>
            {filteredCourses.map((course, index) => (
              <div
                key={course}
                onClick={() => selectCourse(course)}
                className={`flex items-center gap-2 px-2 py-2 text-sm rounded cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent"
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
                onMouseLeave={() => setSelectedIndex(-1)}
              >
                <Search className="h-4 w-4" />
                {course}
              </div>
            ))}
          </div>
        </div>
      )}

      {open && filteredCourses.length === 0 && query && (
        <div className="absolute top-full mt-1 w-full bg-popover border rounded-md shadow-lg z-[9999]">
          <div className="p-4 text-sm text-muted-foreground text-center">
            No courses found.
          </div>
        </div>
      )}
    </div>
  );
}
