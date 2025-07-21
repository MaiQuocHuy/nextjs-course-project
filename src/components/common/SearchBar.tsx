"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mockCourses = [
  "React Fundamentals",
  "TypeScript Mastery",
  "UI/UX Design Principles",
  "JavaScript Advanced Concepts",
  "Node.js Backend Development",
  "Database Design & SQL",
];

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
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value) {
      const filtered = mockCourses.filter((course) =>
        course.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCourses(filtered);
      setOpen(true);
    } else {
      setFilteredCourses(mockCourses);
      setOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setFilteredCourses(mockCourses);
    setOpen(false);
  };

  const selectCourse = (course: string) => {
    setQuery(course);
    setOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          className="pl-10 pr-10 bg-muted/50 border-0 focus:bg-background transition-colors"
        />
        {query && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Button
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

      {/* Search Results Dropdown */}
      {open && filteredCourses.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-popover border rounded-md shadow-lg z-50 max-h-[200px] overflow-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground px-2 py-1">
              Courses
            </div>
            {filteredCourses.map((course) => (
              <div
                key={course}
                onClick={() => selectCourse(course)}
                className="flex items-center gap-2 px-2 py-2 text-sm rounded hover:bg-accent cursor-pointer"
              >
                <Search className="h-4 w-4" />
                {course}
              </div>
            ))}
          </div>
        </div>
      )}

      {open && filteredCourses.length === 0 && query && (
        <div className="absolute top-full mt-1 w-full bg-popover border rounded-md shadow-lg z-50">
          <div className="p-4 text-sm text-muted-foreground text-center">
            No courses found.
          </div>
        </div>
      )}
    </div>
  );
}
