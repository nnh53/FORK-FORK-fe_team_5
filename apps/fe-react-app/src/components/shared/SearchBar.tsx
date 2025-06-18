"use client";

import { Calendar as CalendarIcon, Check, ChevronDown, SearchIcon, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SearchOption {
  value: string;
  label: string;
  type: "text" | "date" | "select";
  selectOptions?: { value: string; label: string }[];
}

interface SearchCriteria {
  field: string;
  value: string | Date;
  label: string;
  type: "text" | "date" | "select";
}

interface SearchBarProps {
  searchOptions: SearchOption[];
  onSearchChange: (criteria: SearchCriteria[]) => void;
  className?: string;
  maxSelections?: number;
}

function SearchBar({ searchOptions, onSearchChange, className, maxSelections = 5 }: SearchBarProps) {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleSearchField = (fieldValue: string) => {
    const option = searchOptions.find((opt) => opt.value === fieldValue);
    if (!option) return;

    const existingIndex = searchCriteria.findIndex((criteria) => criteria.field === fieldValue);

    if (existingIndex >= 0) {
      // Nếu đã tồn tại thì xóa
      const newCriteria = searchCriteria.filter((_, i) => i !== existingIndex);
      setSearchCriteria(newCriteria);
      onSearchChange(newCriteria);
    } else {
      // Nếu chưa tồn tại và chưa đạt giới hạn thì thêm
      if (searchCriteria.length < maxSelections) {
        const newCriteria = [
          ...searchCriteria,
          {
            field: fieldValue,
            value: "",
            label: option.label,
            type: option.type,
          },
        ];
        setSearchCriteria(newCriteria);
        onSearchChange(newCriteria);
      }
    }
  };

  const handleRemoveSearchField = (index: number) => {
    const newCriteria = searchCriteria.filter((_, i) => i !== index);
    setSearchCriteria(newCriteria);
    onSearchChange(newCriteria);
  };

  const handleValueChange = (index: number, value: string | Date) => {
    const newCriteria = [...searchCriteria];
    newCriteria[index].value = value;
    setSearchCriteria(newCriteria);
    onSearchChange(newCriteria);
  };

  const handleClearAll = () => {
    setSearchCriteria([]);
    onSearchChange([]);
  };

  const isFieldSelected = (fieldValue: string) => {
    return searchCriteria.some((criteria) => criteria.field === fieldValue);
  };

  const renderSearchInput = (criteria: SearchCriteria, index: number) => {
    const option = searchOptions.find((opt) => opt.value === criteria.field);

    switch (criteria.type) {
      case "date":
        return (
          <div className="relative flex-1">
            <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <DatePicker
              date={criteria.value instanceof Date ? criteria.value : undefined}
              setDate={(date) => handleValueChange(index, date || "")}
              placeholder={`Chọn ${criteria.label.toLowerCase()}`}
            />
          </div>
        );

      case "select":
        return (
          <div className="relative flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between pl-10">
                  {criteria.value
                    ? option?.selectOptions?.find((opt) => opt.value === criteria.value)?.label
                    : `Chọn ${criteria.label.toLowerCase()}`}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <div className="max-h-60 overflow-auto">
                  {option?.selectOptions?.map((selectOption) => (
                    <button
                      key={selectOption.value}
                      onClick={() => handleValueChange(index, selectOption.value)}
                      className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
                    >
                      <span>{selectOption.label}</span>
                      {criteria.value === selectOption.value && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );

      default:
        return (
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`Tìm kiếm theo ${criteria.label.toLowerCase()}`}
              value={criteria.value as string}
              onChange={(e) => handleValueChange(index, e.target.value)}
              className="pl-10"
            />
          </div>
        );
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main search controls */}
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={isOpen} className="w-[200px] justify-between">
              Tìm kiếm
              <ChevronDown className={cn("ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200", isOpen && "rotate-180")} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <div className="max-h-60 overflow-auto">
              {searchOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleToggleSearchField(option.value);
                    // Không đóng popover để có thể chọn nhiều option
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  {isFieldSelected(option.value) && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {searchCriteria.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAll} className="text-xs">
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Search inputs */}
      {searchCriteria.length > 0 && (
        <div className="space-y-2">
          {searchCriteria.map((criteria, index) => (
            <div key={`${criteria.field}-${index}`} className="flex items-center gap-2">
              <Badge variant="outline" className="shrink-0 min-w-fit">
                {criteria.label}
              </Badge>

              {renderSearchInput(criteria, index)}

              <Button variant="ghost" size="sm" onClick={() => handleRemoveSearchField(index)} className="h-8 w-8 p-0 shrink-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { SearchBar, type SearchBarProps, type SearchCriteria, type SearchOption };
