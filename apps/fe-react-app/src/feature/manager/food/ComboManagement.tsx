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
import { Card, CardContent } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Filter, type FilterCriteria } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchBar, type SearchOption } from "@/components/shared/SearchBar";
import type { Combo, ComboSnack } from "@/interfaces/combo.interface";
import {
  comboStatusOptions,
  createFallbackSnack,
  transformComboResponse,
  transformComboSnackToRequest,
  transformComboSnacksResponse,
  transformComboToRequest,
  useAddSnacksToCombo,
  useComboSnacksByComboId,
  useCombos,
  useCreateCombo,
  useDeleteCombo,
  useDeleteComboSnackByComboAndSnack,
  useUpdateCombo,
  useUpdateComboSnack,
} from "@/services/comboService";
import type { CustomAPIResponse } from "@/type-from-be";
import { useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import ComboDetail from "./ComboDetail";
import ComboForm from "./ComboForm";
import ComboTable from "./ComboTable";

// Hàm filter toàn cục với kiểm tra null/undefined
const filterByGlobalSearch = (combo: Combo, searchTerm: string): boolean => {
  if (!combo) return false;
  if (!searchTerm) return true; // Nếu không có từ khóa tìm kiếm, hiển thị tất cả combo

  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  return (
    (combo.id?.toString().includes(searchTerm) ?? false) ||
    (combo.name?.toLowerCase().includes(lowerSearchTerm) ?? false) ||
    (combo.description?.toLowerCase().includes(lowerSearchTerm) ?? false)
  );
};

// Hàm filter theo trạng thái
const filterByStatus = (combo: Combo, status: string): boolean => {
  return combo.status === status;
};

// Custom hook để xử lý mutation
const useComboMutationHandler = <TData, TError extends CustomAPIResponse, TVariables>(
  mutation: UseMutationResult<TData, TError, TVariables>,
  successMessage: string,
  errorMessage: string,
  onSuccess: () => void,
) => {
  const queryClient = useQueryClient();
  const combosQuery = useCombos();

  useEffect(() => {
    if (mutation.isSuccess) {
      toast.success(successMessage, { id: successMessage });
      combosQuery.refetch();
      onSuccess();
      setTimeout(() => mutation.reset(), 100);
    } else if (mutation.isError) {
      toast.error(mutation.error?.message || errorMessage, { id: `${successMessage}-error` });
    }
  }, [mutation, successMessage, errorMessage, onSuccess, queryClient, combosQuery]);
};

const ComboManagement: React.FC = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<Combo | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [comboToDelete, setComboToDelete] = useState<Combo | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsCombo, setDetailsCombo] = useState<Combo | null>(null);
  const [selectedComboIdForDetails, setSelectedComboIdForDetails] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const tableRef = useRef<{ resetPagination: () => void }>(null);

  // React Query hooks
  const combosQuery = useCombos();
  const createComboMutation = useCreateCombo();
  const updateComboMutation = useUpdateCombo();
  const deleteComboMutation = useDeleteCombo();
  const updateComboSnackMutation = useUpdateComboSnack();
  const addSnacksToComboMutation = useAddSnacksToCombo();
  const deleteComboSnackByComboAndSnackMutation = useDeleteComboSnackByComboAndSnack();
  const comboSnacksQuery = useComboSnacksByComboId(selectedComboIdForDetails ?? 0);

  // Sử dụng custom hook để xử lý mutation
  useComboMutationHandler(createComboMutation, "Tạo combo mới thành công", "Lỗi khi tạo combo", () => {
    setIsModalOpen(false);
    setSelectedCombo(undefined);
  });

  useComboMutationHandler(updateComboMutation, "Cập nhật combo thành công", "Lỗi khi cập nhật combo", () => {
    setIsModalOpen(false);
    setSelectedCombo(undefined);
  });

  useComboMutationHandler(deleteComboMutation, "Xóa combo thành công", "Lỗi khi xóa combo", () => {
    setDeleteDialogOpen(false);
    setComboToDelete(null);
  });

  useComboMutationHandler(addSnacksToComboMutation, "Đã thêm thực phẩm vào combo", "Lỗi khi thêm thực phẩm vào combo", () =>
    queryClient.invalidateQueries({ queryKey: ["get", "/combo-snacks/combo/{comboId}"] }),
  );

  useComboMutationHandler(updateComboSnackMutation, "Đã cập nhật thực phẩm trong combo", "Lỗi khi cập nhật thực phẩm trong combo", () =>
    queryClient.invalidateQueries({ queryKey: ["get", "/combo-snacks/combo/{comboId}"] }),
  );

  useComboMutationHandler(deleteComboSnackByComboAndSnackMutation, "Đã xóa thực phẩm khỏi combo", "Lỗi khi xóa thực phẩm khỏi combo", () =>
    queryClient.invalidateQueries({ queryKey: ["get", "/combo-snacks/combo/{comboId}"] }),
  );

  // Xử lý dữ liệu combos từ API
  useEffect(() => {
    if (combosQuery.data?.result) {
      const transformedCombos = Array.isArray(combosQuery.data.result)
        ? combosQuery.data.result.map(transformComboResponse)
        : [transformComboResponse(combosQuery.data.result)];
      setCombos(transformedCombos);
    }
  }, [combosQuery.data]);

  // Xử lý cập nhật chi tiết combo
  useEffect(() => {
    if (!selectedComboIdForDetails || !comboSnacksQuery.data?.result || !detailsCombo) return;

    const comboSnacksData = Array.isArray(comboSnacksQuery.data.result) ? comboSnacksQuery.data.result : [comboSnacksQuery.data.result];
    const comboSnacks = transformComboSnacksResponse(comboSnacksData);

    const updatedSnacks = detailsCombo.snacks.map((snack) => {
      const updatedSnack = comboSnacks.find((cs) => cs.snack?.id === snack.snack?.id);
      return updatedSnack
        ? {
            ...snack,
            id: updatedSnack.id,
            quantity: updatedSnack.quantity,
            snackSizeId: updatedSnack.snackSizeId,
            discountPercentage: updatedSnack.discountPercentage,
          }
        : snack;
    });

    if (JSON.stringify(detailsCombo.snacks) !== JSON.stringify(updatedSnacks)) {
      setDetailsCombo({ ...detailsCombo, snacks: updatedSnacks });
    }
  }, [comboSnacksQuery.data, selectedComboIdForDetails, detailsCombo]);

  // Cập nhật UI khi dữ liệu comboSnacks thay đổi hoặc combo được refetch
  useEffect(() => {
    if (!detailsCombo || !selectedComboIdForDetails) return;

    const combo = combos.find((c) => c.id === selectedComboIdForDetails);
    if (!combo) return;

    if (
      JSON.stringify(combo.id) === JSON.stringify(detailsCombo.id) &&
      JSON.stringify(combo.name) === JSON.stringify(detailsCombo.name) &&
      JSON.stringify(combo.description) === JSON.stringify(detailsCombo.description) &&
      JSON.stringify(combo.status) === JSON.stringify(detailsCombo.status)
    ) {
      return;
    }

    const comboWithValidSnacks = {
      ...combo,
      snacks:
        combo.snacks?.map((comboSnack) => ({
          ...comboSnack,
          snack: comboSnack.snack && typeof comboSnack.snack === "object" ? comboSnack.snack : createFallbackSnack(),
        })) || [],
    };
    setDetailsCombo(comboWithValidSnacks);
  }, [combos, selectedComboIdForDetails, detailsCombo]);

  // Memoized filtered combos
  const filteredCombos = useMemo(
    () =>
      combos.filter((combo) => {
        if (!filterByGlobalSearch(combo, searchTerm)) return false;
        return filterCriteria.every((filter) => (filter.field === "status" ? filterByStatus(combo, filter.value as string) : true));
      }),
    [combos, searchTerm, filterCriteria],
  );

  // Memoized search and filter options
  const searchOptions: SearchOption[] = useMemo(
    () => [
      { value: "id", label: "ID" },
      { value: "name", label: "Tên" },
      { value: "description", label: "Mô tả" },
    ],
    [],
  );

  const filterOptions = useMemo(
    () => [
      {
        label: "Trạng thái",
        value: "status",
        type: "select" as const,
        selectOptions: comboStatusOptions,
      },
    ],
    [],
  );

  const handleAdd = useCallback(() => {
    setSelectedCombo(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((combo: Combo) => {
    setSelectedCombo(combo);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id: number) => {
      const combo = combos.find((c) => c.id === id);
      if (combo) {
        setComboToDelete(combo);
        setDeleteDialogOpen(true);
      }
    },
    [combos],
  );

  const handleViewDetails = useCallback(
    (combo: Combo) => {
      if (selectedComboIdForDetails === combo.id && detailsOpen) return;

      const comboWithValidSnacks = {
        ...combo,
        snacks:
          combo.snacks?.map((comboSnack) => ({
            ...comboSnack,
            snack: comboSnack.snack && typeof comboSnack.snack === "object" ? comboSnack.snack : createFallbackSnack(),
          })) || [],
      };

      setDetailsCombo(comboWithValidSnacks);
      setSelectedComboIdForDetails(combo.id);
      setDetailsOpen(true);
    },
    [selectedComboIdForDetails, detailsOpen],
  );

  const confirmDelete = useCallback(() => {
    if (!comboToDelete) return;
    deleteComboMutation.mutate({
      params: { path: { id: comboToDelete.id } },
    });
  }, [comboToDelete, deleteComboMutation]);

  const handleFormSubmit = useCallback(
    (data: Omit<Combo, "id">) => {
      if (selectedCombo) {
        updateComboMutation.mutate({
          params: { path: { id: selectedCombo.id } },
          body: transformComboToRequest({ ...selectedCombo, ...data }),
        });
      } else {
        createComboMutation.mutate({
          body: transformComboToRequest(data),
        });
      }
    },
    [selectedCombo, updateComboMutation, createComboMutation],
  );

  const handleDeleteSnack = useCallback(
    (comboSnackId: number) => {
      if (!detailsCombo) return;
      const comboSnackToDelete = detailsCombo.snacks.find((s) => s.id === comboSnackId);
      if (!comboSnackToDelete?.snack?.id) {
        toast.error("Không thể tìm thấy thông tin combo-snack");
        return;
      }

      setDetailsCombo((prev) => (prev ? { ...prev, snacks: prev.snacks.filter((s) => s.id !== comboSnackId) } : null));
      deleteComboSnackByComboAndSnackMutation.mutate({
        params: { path: { comboId: detailsCombo.id, snackId: comboSnackToDelete.snack.id } },
      });
    },
    [detailsCombo, deleteComboSnackByComboAndSnackMutation],
  );

  const handleUpdateSnack = useCallback(
    (comboSnack: ComboSnack) => {
      if (!detailsCombo) return;

      setDetailsCombo((prev) =>
        prev
          ? {
              ...prev,
              snacks: prev.snacks.map((s) => (s.id === comboSnack.id ? { ...comboSnack } : s)),
            }
          : null,
      );

      const requestBody = transformComboSnackToRequest(comboSnack);
      updateComboSnackMutation.mutate({
        params: { path: { id: comboSnack.id } },
        body: requestBody,
      });
    },
    [detailsCombo, updateComboSnackMutation],
  );

  const handleAddSnack = useCallback(
    (newComboSnack: Partial<ComboSnack>) => {
      if (!detailsCombo || !newComboSnack.snack?.id) return;

      const tempId = -Date.now();
      const tempComboSnack: ComboSnack = {
        id: tempId,
        combo: detailsCombo,
        snack: newComboSnack.snack,
        quantity: newComboSnack.quantity ?? 1,
        snackSizeId: newComboSnack.snackSizeId ?? null,
        discountPercentage: newComboSnack.discountPercentage ?? 0,
      };

      setDetailsCombo((prev) => (prev ? { ...prev, snacks: [...prev.snacks, tempComboSnack] } : prev));
      addSnacksToComboMutation.mutate({
        params: { path: { comboId: detailsCombo.id } },
        body: [{ snackId: newComboSnack.snack.id, quantity: newComboSnack.quantity ?? 1 }],
      });
    },
    [detailsCombo, addSnacksToComboMutation],
  );

  // Reset pagination khi filter thay đổi
  useEffect(() => {
    tableRef.current?.resetPagination();
  }, [filterCriteria]);

  return (
    <div className="container mx-auto p-4">
      <Card className="p-4 sm:p-6 md:p-8">
        <CardContent className="p-0">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold">Quản lý Combo</h1>
              <p className="mt-1 text-gray-500">Thêm, sửa, xóa và tìm kiếm các combo món ăn.</p>
            </div>
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus size={18} />
              Thêm Combo
            </Button>
          </div>

          <div className="mb-6 flex flex-col gap-4 lg:flex-row">
            <div className="w-full lg:w-2/3">
              <SearchBar
                searchOptions={searchOptions}
                onSearchChange={setSearchTerm}
                placeholder="Tìm kiếm theo ID, tên, mô tả..."
                className="w-full flex-1 sm:w-auto"
                resetPagination={() => tableRef.current?.resetPagination()}
              />
            </div>
            <div className="w-full lg:w-1/3">
              <Filter
                filterOptions={filterOptions}
                onFilterChange={(criteria) => {
                  setFilterCriteria(criteria);
                  tableRef.current?.resetPagination();
                }}
              />
            </div>
          </div>

          {combosQuery.isLoading ? (
            <LoadingSpinner name="combos" heightFullScreen={false} />
          ) : (
            <ComboTable ref={tableRef} combos={filteredCombos} onEdit={handleEdit} onDelete={handleDelete} onViewDetails={handleViewDetails} />
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedCombo ? "Chỉnh sửa Combo" : "Tạo Combo mới"}</DialogTitle>
          </DialogHeader>
          <ComboForm combo={selectedCombo} onSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {detailsCombo && (
        <ComboDetail
          combo={detailsCombo}
          open={detailsOpen}
          onClose={() => {
            setDetailsOpen(false);
            setTimeout(() => {
              setSelectedComboIdForDetails(null);
              setDetailsCombo(null);
            }, 300);
          }}
          onEdit={handleEdit}
          onAddSnack={handleAddSnack}
          onUpdateSnack={handleUpdateSnack}
          onDeleteSnack={handleDeleteSnack}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa combo "{comboToDelete?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90 text-white">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ComboManagement;
