"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  isSearching: boolean;
  size: number;
  setSize: (v: number) => void;
}

export default function CertificatesHeader({
  searchQuery,
  setSearchQuery,
  isSearching,
  size,
  setSize,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
      <div className="relative flex-1 w-full sm:w-[300px] md:w-[400px] lg:w-[500px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by course name or certificate code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 w-full"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
      <Select
        value={`${size}`}
        onValueChange={(value) => setSize(parseInt(value))}
      >
        <SelectTrigger className="w-full sm:w-[120px] md:w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 per page</SelectItem>
          <SelectItem value="10">10 per page</SelectItem>
          <SelectItem value="20">20 per page</SelectItem>
          <SelectItem value="50">50 per page</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
