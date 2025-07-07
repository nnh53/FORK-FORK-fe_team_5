import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Filter, type FilterCriteria } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchBar, type SearchOption } from "@/components/shared/SearchBar";
import type { Snack } from "@/interfaces/snacks.interface";
import {
  snackCategoryOptions,
  transformSnacksResponse,
  transformSnackToRequest,
  useCreateSnack,
  useDeleteSnack,
  useSnacks,
  useUpdateSnack,
} from "@/services/snackService";
import type { CustomAPIResponse } from "@/type-from-be";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import SnackForm from "./SnackForm";
import SnackTable from "./SnackTable";

// Hàm filter toàn cục với kiểm tra null/undefined
const filterByGlobalSearch = (snack: Snack, searchTerm: string): boolean => {
  if (!searchTerm) return true;
  if (!snack) return false;

  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  return (
    (snack.id?.toString() || "").includes(searchTerm) ||
    (snack.name?.toLowerCase() || "").includes(lowerSearchTerm) ||
    (snack.flavor?.toLowerCase() || "").includes(lowerSearchTerm) ||
    (snack.description?.toLowerCase() || "").includes(lowerSearchTerm)
  );
};

// Hàm filter số trong khoảng
const filterByNumberRange = (snack: Snack, field: string, range: { from: number | undefined; to: number | undefined }): boolean => {
  if (!range.from && !range.to) return true;
  if (!snack) return false;

  let value: number;
  if (field === "price_range") {
    value = snack.price || 0;
  } else {
    return true;
  }

  return !(range.from && value < range.from) && !(range.to && value > range.to);
};

// Hàm filter theo các enum
const filterByCategory = (snack: Snack, category: string): boolean => {
  if (!snack) return false;
  return snack.category === category;
};

const filterBySize = (snack: Snack, size: string): boolean => {
  if (!snack) return false;
  return snack.size === size;
};

const filterByStatus = (snack: Snack, status: string): boolean => {
  if (!snack) return false;
  return snack.status === status;
};

const SnackManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState<Snack | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackToDelete, setSnackToDelete] = useState<Snack | null>(null);
  const tableRef = useRef<{ resetPagination: () => void }>(null);
  const queryClient = useQueryClient();

  // React Query hooks
  const snacksQuery = useSnacks();
  const createSnackMutation = useCreateSnack();
  const updateSnackMutation = useUpdateSnack();
  const deleteSnackMutation = useDeleteSnack();

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
  //kiểm tra trang thai cua query
  useEffect(() => {
    console.log("Snacks data:", snacksQuery.data);
    console.log("Snacks status:", snacksQuery.status);
    console.log("Snacks error:", snacksQuery.error);
  }, [snacksQuery.data, snacksQuery.status, snacksQuery.error]);

  useEffect(() => {
    console.log("Create mutation status:", createSnackMutation.status);
    console.log("Create mutation error:", createSnackMutation.error);
  }, [createSnackMutation.status, createSnackMutation.error]);

  useEffect(() => {
    console.log("Update mutation status:", updateSnackMutation.status);
    console.log("Update mutation error:", updateSnackMutation.error);
  }, [updateSnackMutation.status, updateSnackMutation.error]);

  useEffect(() => {
    console.log("Delete mutation status:", deleteSnackMutation.status);
    console.log("Delete mutation error:", deleteSnackMutation.error);
  }, [deleteSnackMutation.status, deleteSnackMutation.error]);

  // Xử lý kết quả của mutations trong useEffect
  useEffect(() => {
    if (createSnackMutation.isSuccess) {
      toast.success("Thêm thực phẩm thành công");
      snacksQuery.refetch(); // Refetch snacks to update the list
      setIsModalOpen(false);
      setSelectedSnack(undefined);
    } else if (createSnackMutation.isError) {
      toast.error((createSnackMutation.error as CustomAPIResponse)?.message || "Lỗi khi thêm thực phẩm");
    }
  }, [createSnackMutation.isSuccess, createSnackMutation.isError, createSnackMutation.error, queryClient]);

  useEffect(() => {
    if (updateSnackMutation.isSuccess) {
      toast.success("Cập nhật thực phẩm thành công");
      snacksQuery.refetch(); // Refetch snacks to update the list
      setIsModalOpen(false);
      setSelectedSnack(undefined);
    } else if (updateSnackMutation.isError) {
      toast.error((updateSnackMutation.error as CustomAPIResponse)?.message || "Lỗi khi cập nhật thực phẩm");
    }
  }, [updateSnackMutation.isSuccess, updateSnackMutation.isError, updateSnackMutation.error, queryClient]);

  useEffect(() => {
    if (deleteSnackMutation.isSuccess) {
      toast.success("Xóa thực phẩm thành công");
      snacksQuery.refetch(); // Refetch snacks to update the list
      setDeleteDialogOpen(false);
      setSnackToDelete(null);
    } else if (deleteSnackMutation.isError) {
      toast.error((deleteSnackMutation.error as CustomAPIResponse)?.message || "Lỗi khi xóa thực phẩm");
    }
  }, [deleteSnackMutation.isSuccess, deleteSnackMutation.isError, deleteSnackMutation.error, queryClient]);

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
    setSelectedSnack(snack);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedSnack(undefined);
  };

  const handleSubmit = (data: Omit<Snack, "id">) => {
    if (selectedSnack) {
      updateSnackMutation.mutate({
        params: { path: { id: selectedSnack.id } },
        body: transformSnackToRequest({ ...selectedSnack, ...data }),
      });
    } else {
      createSnackMutation.mutate({
        body: transformSnackToRequest(data),
      });
    }
  };

  const handleDeleteClick = (id: number) => {
    const snack = snacksQuery.data?.result?.find((f) => f.id === id);
    if (snack && typeof snack.id === "number") {
      setSnackToDelete(snack as Snack); // Ép kiểu để đảm bảo id là number
      setDeleteDialogOpen(true);
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
    let result = snacks;

    // Tìm kiếm toàn cục
    if (searchTerm) {
      result = result.filter((snack) => filterByGlobalSearch(snack, searchTerm));
    }

    // Áp dụng các bộ lọc
    if (filterCriteria.length > 0) {
      result = result.filter((snack) => {
        return filterCriteria.every((criteria) => {
          switch (criteria.field) {
            case "price_range":
            case "quantity_range": {
              const range = criteria.value as { from: number | undefined; to: number | undefined };
              return filterByNumberRange(snack, criteria.field, range);
            }
            case "category": {
              return filterByCategory(snack, criteria.value as string);
            }
            case "size": {
              return filterBySize(snack, criteria.value as string);
            }
            case "status": {
              return filterByStatus(snack, criteria.value as string);
            }
            default:
              return true;
          }
        });
      });
    }

    return result;
  }, [snacksQuery.data, searchTerm, filterCriteria]);

  if (snacksQuery.isLoading) {
    return <LoadingSpinner name="thực phẩm" />;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="space-y-4">
            {/* Tiêu đề và nút thêm */}
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

            {/* Thanh tìm kiếm và bộ руководитель */}
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
                    setFilterCriteria(criteria);
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

      {/* Form Dialog */}
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

      {/* Delete Confirmation Dialog */}
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
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteSnackMutation.isPending}>
              {deleteSnackMutation.isPending ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SnackManagement;
