import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";

interface DocumentFiltersProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
}

export function DocumentFilters({
  onSearch,
  onCategoryChange,
  onStatusChange,
  onClearFilters,
}: DocumentFiltersProps) {
  return (
    <div className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              className="pl-10"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
        <Select onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="hr-policies">HR Policies</SelectItem>
            <SelectItem value="procedures">Procedures</SelectItem>
            <SelectItem value="forms">Forms</SelectItem>
            <SelectItem value="templates">Templates</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Filter className="h-4 w-4" />
        <span>Quick Filters:</span>
        <Button variant="ghost" size="sm" onClick={() => onCategoryChange("hr-policies")}>
          HR Policies
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onCategoryChange("procedures")}>
          Procedures
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onStatusChange("active")}>
          Active
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onStatusChange("draft")}>
          Draft
        </Button>
      </div>
    </div>
  );
} 