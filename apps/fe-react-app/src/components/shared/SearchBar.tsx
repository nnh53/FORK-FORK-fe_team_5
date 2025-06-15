"use client"

import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface SearchOption {
  value: string
  label: string
}

interface SearchBarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  searchType: string
  setSearchType: (type: string) => void
  searchOptions: SearchOption[]
  placeholder?: string
  className?: string
}

function SearchBar({
  searchTerm,
  setSearchTerm,
  searchType,
  setSearchType,
  searchOptions,
  placeholder = "Tìm kiếm...",
  className,
}: SearchBarProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={searchType} onValueChange={setSearchType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Chọn loại tìm kiếm" />
        </SelectTrigger>
        <SelectContent>
          {searchOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { SearchBar, type SearchBarProps, type SearchOption }

