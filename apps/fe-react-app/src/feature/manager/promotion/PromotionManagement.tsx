import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { type TableColumns } from "@/components/shared/CustomTable";
import { Filter, type FilterCriteria, type FilterOption } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchBar, type SearchOption } from "@/components/shared/SearchBar";
import type { Promotion } from "@/interfaces/promotion.interface";
import { promotionStatusOptions, promotionTypeOptions, transformPromotionsResponse, usePromotions } from "@/services/promotionService";
import { Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import { PromotionDialog } from "./PromotionDialog";
import { PromotionTable } from "./PromotionTable";

// Helper function to filter promotions by search term
const filterBySearchTerm = (promotion: Promotion, searchTerm: string): boolean => {
  if (!searchTerm) return true;
  if (!promotion) return false;

  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  return (
    (promotion.id?.toString() || "").includes(searchTerm) ||
    (promotion.title?.toLowerCase() || "").includes(lowerSearchTerm) ||
    (promotion.description?.toLowerCase() || "").includes(lowerSearchTerm)
  );
};

// Helper function to filter promotions by date range
const filterByDateRange = (promotion: Promotion, field: string, range: { from: Date | undefined; to: Date | undefined }): boolean => {
  if (!range.from && !range.to) return true;
  if (!promotion) return false;

  let dateValue: Date;
  if (field === "startTime") {
    dateValue = new Date(promotion.startTime);
  } else if (field === "endTime") {
    dateValue = new Date(promotion.endTime);
  } else {
    return true;
  }

  return (!range.from || dateValue >= range.from) && (!range.to || dateValue <= range.to);
};

// Helper function to filter promotions by status
const filterByStatus = (promotion: Promotion, status: string): boolean => {
  if (!promotion) return false;
  if (status === "all") return true;
  return promotion.status === status;
};

// Helper function to filter promotions by type
const filterByType = (promotion: Promotion, type: string): boolean => {
  if (!promotion) return false;
  if (type === "all") return true;
  return promotion.type === type;
};

// Helper function to filter promotions by min purchase range
const filterByMinPurchase = (promotion: Promotion, range: { from: number | undefined; to: number | undefined }): boolean => {
  if (!range.from && !range.to) return true;
  if (!promotion) return false;

  const value = promotion.minPurchase;
  return (!range.from || value >= range.from) && (!range.to || value <= range.to);
};

// Helper function to filter promotions by discount value range
const filterByDiscountValue = (promotion: Promotion, range: { from: number | undefined; to: number | undefined }): boolean => {
  if (!range.from && !range.to) return true;
  if (!promotion) return false;

  const value = promotion.discountValue;
  return (!range.from || value >= range.from) && (!range.to || value <= range.to);
};

export const PromotionManagement: React.FC = () => {
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion>();
  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const tableRef = useRef<{ resetPagination: () => void }>(null);

  // Use the promotionService hook instead of direct fetch
  const { data: promotionsData, isLoading, refetch } = usePromotions();
  const promotions = promotionsData?.result ? transformPromotionsResponse(promotionsData.result) : [];

  // Define filter options for the Filter component
  const filterOptions: FilterOption[] = [
    {
      value: "status",
      label: "Trạng thái",
      type: "select",
      selectOptions: [{ value: "all", label: "Tất cả" }, ...promotionStatusOptions],
    },
    {
      value: "type",
      label: "Loại khuyến mãi",
      type: "select",
      selectOptions: [{ value: "all", label: "Tất cả" }, ...promotionTypeOptions],
    },
    {
      value: "startTime",
      label: "Thời gian bắt đầu",
      type: "dateRange",
      placeholder: "Chọn thời gian bắt đầu",
    },
    {
      value: "endTime",
      label: "Thời gian kết thúc",
      type: "dateRange",
      placeholder: "Chọn thời gian kết thúc",
    },
    {
      value: "minPurchase",
      label: "Đơn tối thiểu",
      type: "numberRange",
      numberRangeConfig: {
        fromPlaceholder: "Từ",
        toPlaceholder: "Đến",
        min: 0,
        step: 1000,
        suffix: "VND",
      },
    },
    {
      value: "discountValue",
      label: "Giá trị giảm giá",
      type: "numberRange",
      numberRangeConfig: {
        fromPlaceholder: "Từ",
        toPlaceholder: "Đến",
        min: 0,
        step: 1000,
      },
    },
  ];

  // Define search options for the SearchBar component
  const searchOptions: SearchOption[] = [
    { value: "id", label: "ID" },
    { value: "title", label: "Tên khuyến mãi" },
    { value: "description", label: "Mô tả" },
  ];

  // Function to handle filter changes
  const handleFilterChange = (criteria: FilterCriteria[]) => {
    setFilterCriteria(criteria);
    // Reset pagination when filters change
    if (tableRef.current) {
      tableRef.current.resetPagination();
    }
  };

  // Function to handle search changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    // Reset pagination when search changes
    if (tableRef.current) {
      tableRef.current.resetPagination();
    }
  };

  // Apply filters and search to get filtered promotions
  const getFilteredPromotions = (): Promotion[] => {
    let filtered = [...promotions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((promotion) => filterBySearchTerm(promotion, searchTerm));
    }

    // Apply all other filters
    if (filterCriteria.length > 0) {
      filtered = filtered.filter((promotion) => {
        return filterCriteria.every((criteria) => {
          const { field, value, type } = criteria;

          if (type === "select") {
            if (field === "status") {
              return filterByStatus(promotion, value as string);
            } else if (field === "type") {
              return filterByType(promotion, value as string);
            }
          } else if (type === "dateRange") {
            return filterByDateRange(promotion, field, value as { from: Date | undefined; to: Date | undefined });
          } else if (type === "numberRange") {
            if (field === "minPurchase") {
              return filterByMinPurchase(promotion, value as { from: number | undefined; to: number | undefined });
            } else if (field === "discountValue") {
              return filterByDiscountValue(promotion, value as { from: number | undefined; to: number | undefined });
            }
          }
          return true;
        });
      });
    }

    return filtered;
  };

  const filteredPromotions = getFilteredPromotions();

  const promotionColumn: TableColumns[] = [
    {
      header: "#",
      accessorKey: "id",
      width: "w-[5%]",
    },
    {
      header: "Tên",
      accessorKey: "title",
      width: "w-[10%]",
    },
    {
      header: "Nội dung",
      accessorKey: "description",
      width: "w-[20%]",
    },
    // {
    //   header: "Mức giảm giá",
    //   accessorKey: "discountValue",
    //   cell: ({ row }: CellContext<Promotion, unknown>) => {
    //     const promotion = row.original as Promotion;
    //     return promotion.type === "PERCENTAGE" ? `${promotion.discountValue}%` : `${promotion.discountValue.toLocaleString()} VNĐ`;
    //   },
    // },
    // {
    //   header: "Mức áp dụng",
    //   accessorKey: "minPurchase",
    //   width: "w-[10%]",
    //   cell: ({ row }: CellContext<Promotion, unknown>) => {
    //     const promotion = row.original as Promotion;
    //     return `${promotion.minPurchase.toLocaleString()} VNĐ`;
    //   },
    // },
    // {
    //   header: "Trạng thái",
    //   accessorKey: "status",
    //   cell: ({ row }: CellContext<Promotion, unknown>) => {
    //     const promotion = row.original as Promotion;
    //     const status = promotion.status;
    //     return isValidPromotionStatus(status) ? getPromotionStatusLabel(status) : "Trạng thái không hợp lệ";
    //   },
    // },
    // {
    //   header: "Loại",
    //   accessorKey: "type",
    //   cell: ({ row }: CellContext<Promotion, unknown>) => {
    //     const promotion = row.original as Promotion;
    //     const type = promotion.type;
    //     return isValidPromotionType(type) ? getPromotionTypeLabel(type) : "Loại không hợp lệ";
    //   },
    // },
    {
      header: "Bắt đầu",
      accessorKey: "startTime",
    },
    {
      header: "Kết thúc",
      accessorKey: "endTime",
    },
  ];
  // Handle opening dialog with selected promotion
  const handleOpenDialog = (id?: number) => {
    if (id !== undefined) {
      const promotion: Promotion | undefined = promotions.find((pro) => pro.id === id);
      if (promotion !== undefined) {
        setSelectedPromotion(promotion);
        setOpen(true);
      }
    } else {
      setSelectedPromotion(undefined);
      setOpen(true);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>Quản lý khuyến mãi</CardTitle>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm khuyến mãi
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              {/* Search Bar */}
              <SearchBar
                searchOptions={searchOptions}
                onSearchChange={handleSearchChange}
                className="w-full sm:w-1/2"
                placeholder="Tìm kiếm khuyến mãi..."
                resetPagination={() => tableRef.current?.resetPagination()}
              />

              {/* Filter */}
              <div className="shrink-0">
                <Filter filterOptions={filterOptions} onFilterChange={handleFilterChange} showActiveFilters={true} />
              </div>
            </div>

            {isLoading ? (
              <LoadingSpinner name="khuyến mãi" />
            ) : (
              <PromotionTable promotions={filteredPromotions} columns={promotionColumn} onView={handleOpenDialog} ref={tableRef} />
            )}
          </CardContent>
        </Card>
      </div>
      <PromotionDialog
        open={open}
        setOpen={setOpen}
        selectedPromotion={selectedPromotion}
        setSelectedPromotion={setSelectedPromotion}
        onSuccess={refetch}
      />
    </>
  );
};
