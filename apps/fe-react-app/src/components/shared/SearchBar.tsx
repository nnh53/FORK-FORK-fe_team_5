"use client";

import { Check, ChevronDown, SearchIcon, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/Shadcn/ui/dropdown-menu";
import { Input } from "@/components/Shadcn/ui/input";
import { cn } from "@/lib/utils";

interface SearchOption {
  value: string;
  label: string;
}

interface SearchCriteria {
  field: string;
  value: string;
  label: string;
}

interface SearchBarProps {
  searchOptions: SearchOption[];
  onSearchChange: (criteria: SearchCriteria[]) => void;
  className?: string;
  maxSelections?: number;
  placeholder?: string;
  showGlobalSearch?: boolean;
}

function SearchBar({
  searchOptions,
  onSearchChange,
  className,
  maxSelections = 3,
  placeholder = "Tìm kiếm...",
  showGlobalSearch = true,
}: SearchBarProps) {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria[]>([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleGlobalSearchChange = (value: string) => {
    setGlobalSearch(value);

    if (showGlobalSearch && value.trim()) {
      // Không map qua tất cả searchOptions, mà tạo 1 criteria duy nhất với field = "GLOBAL"
      const globalCriteria = [
        {
          field: "GLOBAL",
          value,
          label: "Tìm kiếm tổng quát",
        },
      ];

      // Nếu chưa có specific search thì gửi global
      if (searchCriteria.length === 0 || !searchCriteria.some((c) => c.value.trim())) {
        onSearchChange(globalCriteria);
      } else {
        // Nếu có specific search, chỉ gửi specific search
        const validSpecificCriteria = searchCriteria.filter((c) => c.value.trim() !== "");
        onSearchChange(validSpecificCriteria);
      }
    } else {
      // Không có global search => chỉ gửi specific search
      const validSpecificCriteria = searchCriteria.filter((c) => c.value.trim() !== "");
      onSearchChange(validSpecificCriteria);
    }
  };

  const handleValueChange = (index: number, value: string) => {
    const newCriteria = [...searchCriteria];
    newCriteria[index].value = value;
    setSearchCriteria(newCriteria);

    // Khi có specific search, ưu tiên specific search hơn global search
    const validSpecificCriteria = newCriteria.filter((c) => c.value.trim() !== "");

    if (validSpecificCriteria.length > 0) {
      // Có specific search: chỉ gửi specific search, bỏ qua global search
      onSearchChange(validSpecificCriteria);
    } else if (showGlobalSearch && globalSearch.trim()) {
      // Không có specific search nhưng có global search: gửi global search
      const globalCriteria = searchOptions.map((option) => ({
        field: option.value,
        value: globalSearch,
        label: option.label,
      }));
      onSearchChange(globalCriteria);
    } else {
      // Không có gì: gửi array rỗng
      onSearchChange([]);
    }
  };

  const handleRemoveSearchField = (index: number) => {
    const newCriteria = searchCriteria.filter((_, i) => i !== index);
    setSearchCriteria(newCriteria);

    // Sau khi xóa specific search
    const validSpecificCriteria = newCriteria.filter((c) => c.value.trim() !== "");

    if (validSpecificCriteria.length > 0) {
      // Vẫn còn specific search: gửi specific search
      onSearchChange(validSpecificCriteria);
    } else if (showGlobalSearch && globalSearch.trim()) {
      // Không còn specific search nhưng có global search: gửi global search
      const globalCriteria = searchOptions.map((option) => ({
        field: option.value,
        value: globalSearch,
        label: option.label,
      }));
      onSearchChange(globalCriteria);
    } else {
      // Không có gì: gửi array rỗng
      onSearchChange([]);
    }
  };

  const handleToggleSpecificSearch = (option: SearchOption) => {
    const existingIndex = searchCriteria.findIndex((criteria) => criteria.field === option.value);

    if (existingIndex >= 0) {
      // Remove if exists
      handleRemoveSearchField(existingIndex);
    } else {
      // Add if not exists and under limit
      if (searchCriteria.length < maxSelections) {
        const newCriteria = [
          ...searchCriteria,
          {
            field: option.value,
            value: "",
            label: option.label,
          },
        ];
        setSearchCriteria(newCriteria);

        // Không gửi onChange ngay lập tức vì value còn rỗng
        // Sẽ gửi khi user nhập giá trị trong handleValueChange
      }
    }
  };

  const handleClearAllSpecificSearch = () => {
    setSearchCriteria([]);

    // Sau khi xóa specific search, nếu có global search thì gửi global search
    if (showGlobalSearch && globalSearch.trim()) {
      const globalCriteria = searchOptions.map((option) => ({
        field: option.value,
        value: globalSearch,
        label: option.label,
      }));
      onSearchChange(globalCriteria);
    } else {
      onSearchChange([]);
    }
  };

  const handleClearAll = () => {
    setGlobalSearch("");
    setSearchCriteria([]);
    onSearchChange([]);
  };

  const isOptionSelected = (optionValue: string) => {
    return searchCriteria.some((criteria) => criteria.field === optionValue);
  };

  const hasActiveSearch = globalSearch || searchCriteria.some((c) => c.value.trim() !== "");
  const hasSpecificSearches = searchCriteria.length > 0;
  const hasValidSpecificSearches = searchCriteria.some((c) => c.value.trim() !== "");

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main search row */}
      <div className="flex items-center gap-2">
        {/* Global search */}
        {showGlobalSearch && (
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={placeholder}
              value={globalSearch}
              onChange={(e) => handleGlobalSearchChange(e.target.value)}
              className="pl-10"
              disabled={hasValidSpecificSearches} // Disable khi có specific search active
            />
            {hasValidSpecificSearches && (
              <div className="absolute inset-0 bg-muted/50 rounded-md flex items-center justify-center">
                <span className="text-xs text-muted-foreground font-medium">Tìm kiếm cụ thể đang hoạt động</span>
              </div>
            )}
          </div>
        )}

        {/* Add search field dropdown */}
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Tìm theo...
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {searchOptions.map((option) => {
              const isSelected = isOptionSelected(option.value);
              const isDisabled = !isSelected && searchCriteria.length >= maxSelections;

              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => !isDisabled && handleToggleSpecificSearch(option)}
                  className={cn("cursor-pointer flex items-center justify-between", isDisabled && "opacity-50 cursor-not-allowed")}
                  disabled={isDisabled}
                >
                  <div className="flex items-center">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    {option.label}
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear specific searches button */}
        {hasSpecificSearches && (
          <Button variant="outline" size="sm" onClick={handleClearAllSpecificSearch} className="gap-2">
            <X className="h-4 w-4" />
            Xóa tìm cụ thể
          </Button>
        )}

        {/* Clear all button - chỉ hiện khi có global search và không có specific search */}
        {globalSearch && !hasValidSpecificSearches && (
          <Button variant="outline" size="sm" onClick={handleClearAll} className="gap-2">
            <X className="h-4 w-4" />
            Xóa toàn bộ
          </Button>
        )}
      </div>

      {/* Specific search inputs */}
      {searchCriteria.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">
            Tìm kiếm theo trường cụ thể:
            {hasValidSpecificSearches && <span className="text-orange-600 font-semibold ml-1">(Tìm kiếm tổng quát đã bị tắt)</span>}
          </div>
          {searchCriteria.map((criteria, index) => (
            <div key={`${criteria.field}-${index}`} className="flex items-center gap-2">
              <Badge variant="secondary" className="shrink-0 min-w-fit">
                {criteria.label}
              </Badge>

              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={`Tìm kiếm theo ${criteria.label.toLowerCase()}`}
                  value={criteria.value}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSearchField(index)}
                className="h-8 w-8 p-0 shrink-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Search summary */}
      {hasActiveSearch && (
        <div className="text-xs text-muted-foreground">
          {!hasValidSpecificSearches && globalSearch && showGlobalSearch && (
            <span className="text-blue-600">Tìm kiếm tổng quát: "{globalSearch}"</span>
          )}
          {hasValidSpecificSearches && (
            <span className="text-green-600">
              Tìm kiếm cụ thể: {searchCriteria.filter((c) => c.value.trim() !== "").length} trường đang hoạt động
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export { SearchBar, type SearchBarProps, type SearchCriteria, type SearchOption };
