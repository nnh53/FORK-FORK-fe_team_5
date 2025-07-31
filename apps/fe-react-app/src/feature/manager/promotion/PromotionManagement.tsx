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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { type TableColumns } from "@/components/shared/CustomTable";
import { Filter, type FilterCriteria, type FilterGroup } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchBar, type SearchOption } from "@/components/shared/SearchBar";
import { useMutationHandler } from "@/hooks/useMutationHandler";
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
import { Icon } from "@iconify/react";
import { type FormikHelpers } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { PromotionDetail } from "./PromotionDetail";
import { PromotionForm } from "./PromotionForm";
import { PromotionTable } from "./PromotionTable";

// Định nghĩa type cho FilterCriteria
type FilterValue = string | { from: number | undefined; to: number | undefined } | { from: Date | undefined; to: Date | undefined };
interface StrictFilterCriteria extends FilterCriteria {
  field: string;
  value: FilterValue;
}

// Type guard để kiểm tra Promotion hợp lệ
const isValidPromotion = (promotion: Promotion | undefined | null): promotion is Promotion => {
  return !!promotion && typeof promotion.id === "number" && !!promotion.title;
};

// Hàm lọc theo từ khóa tìm kiếm
const filterBySearchTerm = (promotion: Promotion, searchTerm: string): boolean => {
  if (!searchTerm || !isValidPromotion(promotion)) return true;

  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  return (
    promotion.id.toString().includes(searchTerm) ||
    promotion.title.toLowerCase().includes(lowerSearchTerm) ||
    (promotion.description?.toLowerCase() || "").includes(lowerSearchTerm)
  );
};

// Hàm lọc theo loại select
const filterBySelectType = (promotion: Promotion, field: string, value: string): boolean => {
  if (value === "all") return true;
  if (field === "status") return promotion.status === value;
  if (field === "type") return promotion.type === value;
  return true;
};

// Hàm lọc theo khoảng thời gian
const filterByDateRange = (promotion: Promotion, field: string, range: { from: Date | undefined; to: Date | undefined }): boolean => {
  if (!range.from && !range.to) return true;

  const dateValue = new Date(field === "startTime" ? promotion.startTime : promotion.endTime);
  return (!range.from || dateValue >= range.from) && (!range.to || dateValue <= range.to);
};

// Hàm lọc theo khoảng số
const filterByNumberRange = (promotion: Promotion, field: string, range: { from: number | undefined; to: number | undefined }): boolean => {
  if (!range.from && !range.to) return true;

  const numValue = field === "minPurchase" ? promotion.minPurchase : promotion.discountValue;
  return (!range.from || numValue >= range.from) && (!range.to || numValue <= range.to);
};

// Hàm applyFilters để xử lý tất cả các tiêu chí lọc và tìm kiếm
const applyFilters = (promotions: Promotion[], criteria: StrictFilterCriteria[], searchTerm: string): Promotion[] => {
  // Lọc theo tất cả các tiêu chí
  return promotions.filter((promotion) => {
    if (!isValidPromotion(promotion)) return false;
    if (!filterBySearchTerm(promotion, searchTerm)) return false;

    // Áp dụng các bộ lọc từ criteria
    return criteria.every((criterion) => {
      const { field, value, type } = criterion;

      if (type === "select") {
        return filterBySelectType(promotion, field, value as string);
      } else if (type === "dateRange") {
        return filterByDateRange(promotion, field, value as { from: Date | undefined; to: Date | undefined });
      } else if (type === "numberRange") {
        return filterByNumberRange(promotion, field, value as { from: number | undefined; to: number | undefined });
      }

      return true;
    });
  });
};

export const PromotionManagement: React.FC = () => {
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | undefined>();
  const [viewPromotion, setViewPromotion] = useState<Promotion | undefined>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [promotionToDelete, setPromotionToDelete] = useState<Promotion | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCriteria, setFilterCriteria] = useState<StrictFilterCriteria[]>([]);
  const tableRef = useRef<{ resetPagination: () => void }>(null);

  // Use the promotionService hooks
  const { data: promotionsData, isLoading, refetch } = usePromotions();
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const deletePromotion = useDeletePromotion();

  // Sử dụng useMemo để tránh tạo lại mảng promotions trong mỗi lần render
  const promotions = useMemo(() => {
    return promotionsData?.result ? transformPromotionsResponse(promotionsData.result) : [];
  }, [promotionsData]);

  // Sử dụng hook chung useMutationHandler để xử lý các mutation
  useMutationHandler(
    createPromotion,
    "Khuyến mãi đã được tạo thành công",
    "Tạo khuyến mãi thất bại",
    () => {
      setDialogOpen(false);
      setSelectedPromotion(undefined);
    },
    refetch,
    undefined,
    "create-promotion",
  );

  useMutationHandler(
    updatePromotion,
    "Khuyến mãi đã được cập nhật thành công",
    "Cập nhật khuyến mãi thất bại",
    () => {
      setDialogOpen(false);
      setSelectedPromotion(undefined);
    },
    refetch,
    undefined,
    "update-promotion",
  );

  useMutationHandler(
    deletePromotion,
    "Khuyến mãi đã được xóa thành công",
    "Xóa khuyến mãi thất bại",
    () => {
      setDeleteDialogOpen(false);
      setPromotionToDelete(undefined);
    },
    refetch,
    undefined,
    "delete-promotion",
  );

  // Reset pagination khi filter thay đổi
  useEffect(() => {
    tableRef.current?.resetPagination();
  }, [filterCriteria]);

  // Reset pagination khi filter thay đổi
  useEffect(() => {
    tableRef.current?.resetPagination();
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

  // Tính toán filteredPromotions bằng useMemo
  const filteredPromotions = useMemo(() => {
    return applyFilters(promotions, filterCriteria, searchTerm);
  }, [promotions, filterCriteria, searchTerm]);

  const promotionColumn: TableColumns[] = [
    { header: "ID", accessorKey: "id", width: "w-[4%]" },
    { header: "Tên", accessorKey: "title", width: "w-[12%]" },
    { header: "Loại", accessorKey: "type", width: "w-[12%]" },
    { header: "Giảm giá", accessorKey: "discountValue", width: "w-[10%]" },
    { header: "Đơn tối thiểu", accessorKey: "minPurchase", width: "w-[10%]" },
    { header: "Mô tả", accessorKey: "description", width: "w-[14%]" },
    { header: "Trạng thái", accessorKey: "status", width: "w-[12%]" },
    { header: "Bắt đầu", accessorKey: "startTime", width: "w-[10%]" },
    { header: "Kết thúc", accessorKey: "endTime", width: "w-[10%]" },
  ];

  // Handle opening dialog with selected promotion for editing
  const handleOpenEditDialog = (id?: number) => {
    if (id !== undefined) {
      const promotion = promotions.find((pro) => pro.id === id);
      if (isValidPromotion(promotion)) {
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
      const promotion = promotions.find((pro) => pro.id === id);
      if (isValidPromotion(promotion)) {
        setViewPromotion(promotion);
        setDetailOpen(true);
      }
    }
  };

  // Handle opening delete dialog
  const handleOpenDeleteDialog = (id: number) => {
    const promotion = promotions.find((pro) => pro.id === id);
    if (isValidPromotion(promotion)) {
      setPromotionToDelete(promotion);
      setDeleteDialogOpen(true);
    }
  };

  // Handle delete confirmation
  const handleDeletePromotion = () => {
    if (promotionToDelete) {
      deletePromotion.mutate({
        params: { path: { id: promotionToDelete.id } },
      });
    }
  };

  // Handle form submission
  const handleSubmitPromotion = (values: Omit<Promotion, "id">, helpers: FormikHelpers<Omit<Promotion, "id">>) => {
    if (selectedPromotion) {
      updatePromotion.mutate({
        params: { path: { id: selectedPromotion.id } },
        body: values,
      });
    } else {
      createPromotion.mutate({ body: values });
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
              <SearchBar
                searchOptions={searchOptions}
                onSearchChange={setSearchTerm}
                className="w-full sm:w-1/2"
                placeholder="Tìm kiếm khuyến mãi theo id, tên, mô tả..."
                resetPagination={() => tableRef.current?.resetPagination()}
              />
              <div className="shrink-0">
                <Filter
                  filterOptions={filterGroups}
                  onFilterChange={(criteria) => setFilterCriteria(criteria as StrictFilterCriteria[])}
                  showActiveFilters={true}
                  groupMode={true}
                />
              </div>
            </div>
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
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[95vh] min-w-[50%] overflow-y-auto sm:max-w-5xl" onCloseAutoFocus={() => setSelectedPromotion(undefined)}>
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Icon icon={selectedPromotion ? "tabler:edit" : "tabler:plus"} className="h-5 w-5" />
              {selectedPromotion ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
            </DialogTitle>
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

      <PromotionDetail open={detailOpen} setOpen={setDetailOpen} promotion={viewPromotion} />

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
