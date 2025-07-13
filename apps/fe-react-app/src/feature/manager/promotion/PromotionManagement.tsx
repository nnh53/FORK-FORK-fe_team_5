import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/Shadcn/ui/alert-dialog";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { type TableColumns } from "@/components/shared/CustomTable";
import { Filter, type FilterCriteria, type FilterGroup } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchBar, type SearchOption } from "@/components/shared/SearchBar";
import type { Promotion } from "@/interfaces/promotion.interface";
import {
  promotionStatusOptions,
  promotionTypeOptions,
  transformPromotionsResponse,
  useCreatePromotion,
  useDeletePromotion,
  usePromotions,
  useUpdatePromotion,
} from "@/services/promotionService";
import type { CustomAPIResponse } from "@/type-from-be";
import { Icon } from "@iconify/react";
import { type FormikHelpers } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PromotionDetail } from "./PromotionDetail";
import { PromotionForm } from "./PromotionForm";
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
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | undefined>();
  const [viewPromotion, setViewPromotion] = useState<Promotion | undefined>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [promotionToDelete, setPromotionToDelete] = useState<Promotion | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const tableRef = useRef<{ resetPagination: () => void }>(null);

  // Use the promotionService hooks
  const { data: promotionsData, isLoading, refetch } = usePromotions();
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const deletePromotion = useDeletePromotion();
  const promotions = promotionsData?.result ? transformPromotionsResponse(promotionsData.result) : [];

  // Kiểm tra trạng thái và hiển thị lỗi nếu có
  useEffect(() => {
    console.log("Promotions data:", promotionsData);
    console.log("Promotions status:", isLoading);
  }, [promotionsData, isLoading]);

  useEffect(() => {
    console.log("Create promotion status:", createPromotion.status);
    console.log("Create promotion error:", createPromotion.error);
  }, [createPromotion.status, createPromotion.error]);

  useEffect(() => {
    console.log("Update promotion status:", updatePromotion.status);
    console.log("Update promotion error:", updatePromotion.error);
  }, [updatePromotion.status, updatePromotion.error]);

  useEffect(() => {
    console.log("Delete promotion status:", deletePromotion.status);
    console.log("Delete promotion error:", deletePromotion.error);
  }, [deletePromotion.status, deletePromotion.error]);

  // Xử lý kết quả của createPromotion mutation trong useEffect
  useEffect(() => {
    if (createPromotion.isSuccess) {
      toast.success("Khuyến mãi đã được tạo thành công");
      refetch(); // Refetch promotions to update the list
      setDialogOpen(false);
      setSelectedPromotion(undefined);
    }
  }, [createPromotion.isSuccess, refetch]);

  // Xử lý lỗi khi tạo khuyến mãi
  useEffect(() => {
    if (createPromotion.isError) {
      toast.error((createPromotion.error as CustomAPIResponse)?.message ?? "Tạo khuyến mãi thất bại");
    }
  }, [createPromotion.isError, createPromotion.error]);

  // Xử lý kết quả của updatePromotion mutation trong useEffect
  useEffect(() => {
    if (updatePromotion.isSuccess) {
      toast.success("Khuyến mãi đã được cập nhật thành công");
      refetch(); // Refetch promotions to update the list
      setDialogOpen(false);
      setSelectedPromotion(undefined);
    }
  }, [updatePromotion.isSuccess, refetch]);

  // Xử lý lỗi khi cập nhật khuyến mãi
  useEffect(() => {
    if (updatePromotion.isError) {
      toast.error((updatePromotion.error as CustomAPIResponse)?.message ?? "Cập nhật khuyến mãi thất bại");
    }
  }, [updatePromotion.isError, updatePromotion.error]);

  // Xử lý kết quả của deletePromotion mutation trong useEffect
  useEffect(() => {
    if (deletePromotion.isSuccess) {
      toast.success("Khuyến mãi đã được xóa thành công");
      refetch(); // Refetch promotions to update the list
      setDeleteDialogOpen(false);
      setPromotionToDelete(undefined);
    }
  }, [deletePromotion.isSuccess, refetch]);

  // Xử lý lỗi khi xóa khuyến mãi
  useEffect(() => {
    if (deletePromotion.isError) {
      toast.error((deletePromotion.error as CustomAPIResponse)?.message ?? "Xóa khuyến mãi thất bại");
    }
  }, [deletePromotion.isError, deletePromotion.error]);

  // Reset pagination khi filter thay đổi
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.resetPagination();
    }
  }, [filterCriteria]);

  // Define filter options for the Filter component as groups
  const filterGroups: FilterGroup[] = [
    {
      name: "basic",
      label: "Thông tin cơ bản",
      options: [
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
      ],
    },
    {
      name: "advanced",
      label: "Thông tin chi tiết",
      options: [
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
      ],
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
      header: "ID",
      accessorKey: "id",
      width: "w-[4%]",
    },
    {
      header: "Tên",
      accessorKey: "title",
      width: "w-[12%]",
    },
    {
      header: "Loại",
      accessorKey: "type",
      width: "w-[12%]",
    },
    {
      header: "Giảm giá",
      accessorKey: "discountValue",
      width: "w-[10%]",
    },
    {
      header: "Đơn tối thiểu",
      accessorKey: "minPurchase",
      width: "w-[10%]",
    },
    {
      header: "Mô tả",
      accessorKey: "description",
      width: "w-[14%]",
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      width: "w-[12%]",
    },
    {
      header: "Bắt đầu",
      accessorKey: "startTime",
      width: "w-[10%]",
    },
    {
      header: "Kết thúc",
      accessorKey: "endTime",
      width: "w-[10%]",
    },
  ];

  // Handle opening dialog with selected promotion for editing
  const handleOpenEditDialog = (id?: number) => {
    if (id !== undefined) {
      const promotion: Promotion | undefined = promotions.find((pro) => pro.id === id);
      if (promotion !== undefined) {
        setSelectedPromotion(promotion);
        setDialogOpen(true);
      }
    } else {
      setSelectedPromotion(undefined);
      setDialogOpen(true);
    }
  };

  // Handle opening detail view for a promotion
  const handleViewDetail = (id?: number) => {
    if (id !== undefined) {
      const promotion: Promotion | undefined = promotions.find((pro) => pro.id === id);
      if (promotion !== undefined) {
        setViewPromotion(promotion);
        setDetailOpen(true);
      }
    }
  };

  // Separate handler for delete action
  const handleOpenDeleteDialog = (id: number) => {
    const promotion: Promotion | undefined = promotions.find((pro) => pro.id === id);
    if (promotion !== undefined) {
      setPromotionToDelete(promotion);
      setDeleteDialogOpen(true);
    }
  };

  // Handle delete confirmation
  const handleDeletePromotion = () => {
    if (!promotionToDelete) return;

    deletePromotion.mutate({
      params: { path: { id: promotionToDelete.id } },
    });
  };

  // Handle form submission
  const handleSubmitPromotion = (values: Omit<Promotion, "id">, helpers: FormikHelpers<Omit<Promotion, "id">>) => {
    if (selectedPromotion) {
      // Update existing promotion
      updatePromotion.mutate({
        params: { path: { id: selectedPromotion.id } },
        body: values,
      });
    } else {
      // Create new promotion
      createPromotion.mutate({
        body: values,
      });
    }

    helpers.setSubmitting(false);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full shadow-sm transition-shadow duration-300 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between rounded-t-lg bg-gray-50">
            <div className="flex items-center gap-4">
              <CardTitle className="text-2xl font-bold">Quản lý khuyến mãi</CardTitle>
            </div>
            <Button onClick={() => handleOpenEditDialog()}>
              <Icon icon="tabler:plus" className="mr-2 h-4 w-4" />
              Thêm khuyến mãi
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              {/* Search Bar */}
              <SearchBar
                searchOptions={searchOptions}
                onSearchChange={handleSearchChange}
                className="w-full sm:w-1/2"
                placeholder="Tìm kiếm khuyến mãi theo id, tên, mô tả..."
                resetPagination={() => tableRef.current?.resetPagination()}
              />

              {/* Filter */}
              <div className="shrink-0">
                <Filter filterOptions={filterGroups} onFilterChange={handleFilterChange} showActiveFilters={true} groupMode={true} />
              </div>
            </div>
            <div>
              {isLoading ? (
                <LoadingSpinner name="khuyến mãi" />
              ) : (
                <PromotionTable
                  promotions={filteredPromotions}
                  columns={promotionColumn}
                  onView={handleViewDetail}
                  onEdit={handleOpenEditDialog}
                  onDelete={handleOpenDeleteDialog}
                  ref={tableRef}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for adding/editing promotions */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-h-[90vh] min-w-[50%] overflow-y-auto sm:max-w-3xl"
          onCloseAutoFocus={() => {
            setSelectedPromotion(undefined);
          }}
        >
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Icon icon={selectedPromotion ? "tabler:edit" : "tabler:plus"} className="h-5 w-5" />
              {selectedPromotion ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
            </DialogTitle>
            <DialogDescription>
              {selectedPromotion ? `Chỉnh sửa thông tin cho khuyến mãi "${selectedPromotion.title}"` : "Nhập thông tin cho khuyến mãi mới"}
            </DialogDescription>
          </DialogHeader>
          <PromotionForm
            selectedPromotion={selectedPromotion}
            onSubmit={handleSubmitPromotion}
            onCancel={() => {
              setDialogOpen(false);
              setSelectedPromotion(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog for viewing promotion details */}
      <PromotionDetail open={detailOpen} setOpen={setDetailOpen} promotion={viewPromotion} />

      {/* Dialog for confirming deletion */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Icon icon="tabler:trash" className="h-5 w-5" />
              Xác nhận xóa khuyến mãi
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khuyến mãi "{promotionToDelete?.title}" không? Thao tác này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300">
              <Icon icon="tabler:x" className="mr-2 h-4 w-4" />
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePromotion}
              disabled={deletePromotion.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deletePromotion.isPending ? (
                <>
                  <Icon icon="tabler:loader-2" className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Icon icon="tabler:trash" className="mr-2 h-4 w-4" />
                  Xác nhận xóa
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
