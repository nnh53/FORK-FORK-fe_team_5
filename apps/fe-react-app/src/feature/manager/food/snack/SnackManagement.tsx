import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Filter, type FilterCriteria } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchBar, type SearchOption } from "@/components/shared/SearchBar";
import type { Snack } from "@/interfaces/snacks.interface";
import {
  snackCategoryOptions,
  transformSnackResponse,
  transformSnacksResponse,
  transformSnackToRequest,
  useCreateSnack,
  useDeleteSnack,
  useSnacks,
  useUpdateSnack,
} from "@/services/snackService";
import type { CustomAPIResponse } from "@/type-from-be";
import { type UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import SnackForm from "./SnackForm";
import SnackTable from "./SnackTable";

// Định nghĩa type chặt chẽ hơn cho FilterCriteria
type FilterValue = string | { from: number | undefined; to: number | undefined };
interface StrictFilterCriteria extends FilterCriteria {
  field: string;
  value: FilterValue;
}

// Type guard để kiểm tra Snack hợp lệ
const isValidSnack = (snack: Snack | undefined | null): snack is Snack => {
  return !!snack && typeof snack.id === "number" && !!snack.name;
};

// Hàm filter toàn cục với kiểm tra null/undefined
const filterByGlobalSearch = (snack: Snack, searchTerm: string): boolean => {
  if (!searchTerm || !isValidSnack(snack)) return false;

  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  return (
    snack.id.toString().includes(searchTerm) ||
    snack.name.toLowerCase().includes(lowerSearchTerm) ||
    (snack.flavor?.toLowerCase() || "").includes(lowerSearchTerm) ||
    (snack.description?.toLowerCase() || "").includes(lowerSearchTerm)
  );
};

// Hàm filter số trong khoảng
const filterByNumberRange = (snack: Snack, field: string, range: { from: number | undefined; to: number | undefined }): boolean => {
  if (!range.from && !range.to) return true;
  if (!isValidSnack(snack)) return false;

  let value: number;
  if (field === "price_range") {
    value = snack.price ?? 0;
  } else {
    return true;
  }

  return !(range.from && value < range.from) && !(range.to && value > range.to);
};

// Hàm filter theo các enum
const filterByCategory = (snack: Snack, category: FilterValue): boolean => {
  if (typeof category !== "string" || !isValidSnack(snack)) return false;
  return snack.category === category;
};

const filterBySize = (snack: Snack, size: FilterValue): boolean => {
  if (typeof size !== "string" || !isValidSnack(snack)) return false;
  return snack.size === size;
};

const filterByStatus = (snack: Snack, status: FilterValue): boolean => {
  if (typeof status !== "string" || !isValidSnack(snack)) return false;
  return snack.status === status;
};

// Tách logic lọc thành hàm riêng
const applyFilters = (snacks: Snack[], criteria: StrictFilterCriteria[], searchTerm: string): Snack[] => {
  let result = snacks;

  if (searchTerm) {
    result = result.filter((snack) => filterByGlobalSearch(snack, searchTerm));
  }

  return result.filter((snack) =>
    criteria.every((criterion) => {
      switch (criterion.field) {
        case "price_range":
        case "quantity_range":
          return filterByNumberRange(snack, criterion.field, criterion.value as { from: number | undefined; to: number | undefined });
        case "category":
          return filterByCategory(snack, criterion.value);
        case "size":
          return filterBySize(snack, criterion.value);
        case "status":
          return filterByStatus(snack, criterion.value);
        default:
          return true;
      }
    }),
  );
};

// Custom hook để xử lý mutation
const useSnackMutationHandler = <TData, TError extends CustomAPIResponse, TVariables>(
  mutation: UseMutationResult<TData, TError, TVariables>,
  successMessage: string,
  errorMessage: string,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();
  const snacksQuery = useSnacks();

  useEffect(() => {
    if (mutation.isSuccess) {
      toast.success(successMessage, { id: successMessage });
      snacksQuery.refetch();
      onSuccess?.();
      setTimeout(() => mutation.reset(), 100);
    } else if (mutation.isError) {
      toast.error(mutation.error?.message || errorMessage, {
        id: `${successMessage}-error`,
      });
    }
  }, [mutation, queryClient, snacksQuery, successMessage, errorMessage, onSuccess]);
};

const SnackManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState<Snack | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<StrictFilterCriteria[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackToDelete, setSnackToDelete] = useState<Snack | null>(null);
  const tableRef = useRef<{ resetPagination: () => void }>(null);

  // React Query hooks
  const snacksQuery = useSnacks();
  const createSnackMutation = useCreateSnack();
  const updateSnackMutation = useUpdateSnack();
  const deleteSnackMutation = useDeleteSnack();

  // Sử dụng custom hook để xử lý mutation
  useSnackMutationHandler(createSnackMutation, "Thêm thực phẩm thành công", "Lỗi khi thêm thực phẩm", () => {
    setIsModalOpen(false);
    setSelectedSnack(undefined);
  });

  useSnackMutationHandler(updateSnackMutation, "Cập nhật thực phẩm thành công", "Lỗi khi cập nhật thực phẩm", () => {
    setIsModalOpen(false);
    setSelectedSnack(undefined);
  });

  useSnackMutationHandler(deleteSnackMutation, "Xóa thực phẩm thành công", "Lỗi khi xóa thực phẩm", () => {
    setDeleteDialogOpen(false);
    setSnackToDelete(null);
  });

  // Định nghĩa các trường tìm kiếm
  const searchOptions: SearchOption[] = [
    { value: "id", label: "ID" },
    { value: "name", label: "Tên" },
    { value: "flavor", label: "Hương vị" },
    { value: "description", label: "Mô tả" },
  ];

  // Filter options dựa trên enum của interface mới
  const filterOptions = [
    {
      label: "Khoảng giá",
      value: "price_range",
      type: "numberRange" as const,
      numberRangeConfig: {
        fromPlaceholder: "Từ giá",
        toPlaceholder: "Đến giá",
        min: 0,
        step: 1000,
        suffix: "đ",
      },
    },
    {
      label: "Loại sản phẩm",
      value: "category",
      type: "select" as const,
      selectOptions: snackCategoryOptions,
      placeholder: "Chọn loại sản phẩm",
    },
    {
      label: "Kích thước",
      value: "size",
      type: "select" as const,
      selectOptions: [
        { value: "SMALL", label: "Nhỏ" },
        { value: "MEDIUM", label: "Vừa" },
        { value: "LARGE", label: "Lớn" },
      ],
      placeholder: "Chọn kích thước",
    },
    {
      label: "Trạng thái",
      value: "status",
      type: "select" as const,
      selectOptions: [
        { value: "AVAILABLE", label: "Có sẵn" },
        { value: "UNAVAILABLE", label: "Ngừng bán" },
      ],
      placeholder: "Chọn trạng thái",
    },
  ];

  // Reset pagination khi filter thay đổi
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.resetPagination();
    }
  }, [filterCriteria]);

  const handleCreate = () => {
    setSelectedSnack(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (snack: Snack) => {
    if (isValidSnack(snack)) {
      setSelectedSnack(snack);
      setIsModalOpen(true);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedSnack(undefined);
  };

  const handleSubmit = (data: Omit<Snack, "id">) => {
    if (selectedSnack) {
      // Tạo một object mới kết hợp dữ liệu của selectedSnack và data
      const updatedSnack: Snack = {
        ...selectedSnack,
        ...data,
        id: selectedSnack.id, // Đảm bảo id luôn tồn tại và có kiểu number
      };

      updateSnackMutation.mutate({
        params: { path: { id: selectedSnack.id } },
        body: transformSnackToRequest(updatedSnack),
      });
    } else {
      // Đối với trường hợp tạo mới, không cần id (sử dụng SnackForm)
      createSnackMutation.mutate({
        body: transformSnackToRequest(data),
      });
    }
  };

  const handleDeleteClick = (id: number) => {
    const apiSnack = snacksQuery.data?.result?.find((f) => f.id === id);
    if (apiSnack) {
      // Chuyển đổi apiSnack thành Snack với đúng kiểu dữ liệu
      const snack: Snack = transformSnackResponse(apiSnack);
      setSnackToDelete(snack);
      setDeleteDialogOpen(true);
    } else {
      toast.error("Không tìm thấy thực phẩm để xóa", { id: "delete-snack-error" });
    }
  };

  const handleDeleteConfirm = () => {
    if (snackToDelete) {
      deleteSnackMutation.mutate({
        params: { path: { id: snackToDelete.id } },
      });
    }
  };

  // Lọc snacks theo các tiêu chí
  const filteredSnacks = useMemo(() => {
    const snacks = snacksQuery.data?.result ? transformSnacksResponse(snacksQuery.data.result) : [];
    return applyFilters(snacks, filterCriteria, searchTerm);
  }, [snacksQuery.data, searchTerm, filterCriteria]);

  if (snacksQuery.isLoading) {
    return <LoadingSpinner name="thực phẩm" />;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="space-y-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <CardTitle className="text-2xl font-bold">Quản lý thực phẩm</CardTitle>
                <p className="text-muted-foreground mt-1">Quản lý danh sách thực phẩm và đồ uống của bạn</p>
              </div>
              <Button onClick={handleCreate} disabled={createSnackMutation.isPending} className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                {createSnackMutation.isPending ? "Đang thêm..." : "Thêm thực phẩm"}
              </Button>
            </div>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <SearchBar
                searchOptions={searchOptions}
                onSearchChange={setSearchTerm}
                placeholder="Tìm kiếm theo ID, tên, mô tả..."
                className="w-full flex-1 sm:w-auto"
                resetPagination={() => tableRef.current?.resetPagination()}
              />

              <div className="shrink-0">
                <Filter
                  filterOptions={filterOptions}
                  onFilterChange={(criteria) => {
                    setFilterCriteria(criteria as StrictFilterCriteria[]);
                    if (tableRef.current) {
                      tableRef.current.resetPagination();
                    }
                  }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <SnackTable ref={tableRef} snacks={filteredSnacks} onEdit={handleEdit} onDelete={handleDeleteClick} />
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCancel();
        }}
      >
        <DialogContent className="sm:max-w-220">
          <DialogHeader>
            <DialogTitle>{selectedSnack ? "Chỉnh sửa thực phẩm" : "Thêm thực phẩm mới"}</DialogTitle>
          </DialogHeader>
          <SnackForm
            snack={selectedSnack}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createSnackMutation.isPending || updateSnackMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa thực phẩm</DialogTitle>
          </DialogHeader>
          <p>Bạn có chắc chắn muốn xóa thực phẩm "{snackToDelete?.name}" này? Hành động này không thể hoàn tác.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteSnackMutation.isPending || !snackToDelete}>
              {deleteSnackMutation.isPending ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SnackManagement;
