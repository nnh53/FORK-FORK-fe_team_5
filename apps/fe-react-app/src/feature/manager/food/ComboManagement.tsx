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
import { useMutationHandler } from "@/hooks/useMutationHandler";
import type { Combo, ComboForm as ComboFormData, ComboSnack } from "@/interfaces/combo.interface";
import {
  calculateComboPrice,
  calculateComboPriceWithQuantity,
  comboStatusOptions,
  createFallbackSnack,
  transformComboResponse,
  transformComboToRequest,
  useAddSnacksToCombo,
  useCombos,
  useCreateCombo,
  useDeleteCombo,
  useRemoveSnacksFromCombo,
  useUpdateCombo,
} from "@/services/comboService";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import ComboDetail from "./ComboDetail";
import ComboForm from "./ComboForm";
import ComboTable from "./ComboTable";

// Hàm filter toàn cục với kiểm tra null/undefined
const filterByGlobalSearch = (combo: Combo, searchTerm: string): boolean => {
  if (!searchTerm) return true;
  if (!combo) return false;
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

// Hàm filter theo khoảng giá
const filterByPriceRange = (combo: Combo, range: { from: number | undefined; to: number | undefined }): boolean => {
  const price = combo.price ?? 0;
  return !((range.from !== undefined && price < range.from) || (range.to !== undefined && price > range.to));
};

// Hàm filter theo khoảng giảm giá (giảm giá trên giá tiền, không phải %)
const filterByDiscountRange = (combo: Combo, range: { from: number | undefined; to: number | undefined }): boolean => {
  const discount = combo.discount ?? 0;
  return !((range.from !== undefined && discount < range.from) || (range.to !== undefined && discount > range.to));
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

  const tableRef = useRef<{ resetPagination: () => void }>(null);

  // React Query hooks
  const combosQuery = useCombos();
  const createComboMutation = useCreateCombo();
  const updateComboMutation = useUpdateCombo();
  const deleteComboMutation = useDeleteCombo();
  const addSnacksToComboMutation = useAddSnacksToCombo();
  const removeSnacksFromComboMutation = useRemoveSnacksFromCombo();

  // Sử dụng useMutationHandler để xử lý mutation
  useMutationHandler(
    createComboMutation,
    "Tạo combo mới thành công",
    "Lỗi khi tạo combo",
    () => {
      setIsModalOpen(false);
      setSelectedCombo(undefined);
    },
    combosQuery.refetch,
  );

  useMutationHandler(
    updateComboMutation,
    "Cập nhật combo thành công",
    "Lỗi khi cập nhật combo",
    () => {
      setIsModalOpen(false);
      setSelectedCombo(undefined);
    },
    combosQuery.refetch,
  );

  useMutationHandler(
    deleteComboMutation,
    "Xóa combo thành công",
    "Lỗi khi xóa combo",
    () => {
      setDeleteDialogOpen(false);
      setComboToDelete(null);
    },
    combosQuery.refetch,
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

  // Xử lý cập nhật chi tiết combo khi combos thay đổi
  useEffect(() => {
    if (!detailsCombo || !selectedComboIdForDetails) return;

    const combo = combos.find((c) => c.id === selectedComboIdForDetails);
    if (!combo) return;

    // Cập nhật chi tiết combo khi dữ liệu gốc thay đổi
    setDetailsCombo(combo);
  }, [combos, selectedComboIdForDetails, detailsCombo]);

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
        // Lọc theo tìm kiếm toàn cục
        if (!filterByGlobalSearch(combo, searchTerm)) return false;

        // Lọc theo từng tiêu chí
        return filterCriteria.every((filter) => {
          switch (filter.field) {
            case "status":
              return filterByStatus(combo, filter.value as string);
            case "price":
              return filterByPriceRange(combo, filter.value as { from: number | undefined; to: number | undefined });
            case "discount":
              return filterByDiscountRange(combo, filter.value as { from: number | undefined; to: number | undefined });
            default:
              return true;
          }
        });
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
      {
        label: "Giá",
        value: "price",
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
        label: "Giảm giá",
        value: "discount",
        type: "numberRange" as const,
        numberRangeConfig: {
          fromPlaceholder: "Từ",
          toPlaceholder: "Đến",
          min: 0,
          step: 1000,
          suffix: "đ",
        },
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
      setSelectedComboIdForDetails(combo.id ?? null);
      setDetailsOpen(true);
    },
    [selectedComboIdForDetails, detailsOpen],
  );

  const confirmDelete = useCallback(() => {
    if (!comboToDelete) return;
    deleteComboMutation.mutate({
      params: { path: { id: comboToDelete.id ?? 0 } },
    });
  }, [comboToDelete, deleteComboMutation]);

  const handleFormSubmit = useCallback(
    (data: ComboFormData) => {
      if (selectedCombo) {
        // Tính toán giá dựa trên snacks
        const updatedCombo: Combo = {
          ...selectedCombo,
          ...data,
          snacks: data.snacks.map((s) => ({
            id: typeof s.id === "number" ? s.id : undefined,
            quantity: s.quantity || 1,
            snack: s.snack,
          })),
        };

        // Tính lại giá tự động từ snacks
        const basePrice = calculateComboPriceWithQuantity(updatedCombo.snacks);
        const discount = updatedCombo.discount || 0;

        // Cập nhật giá trước khi gửi request
        // Lưu giá sau khi trừ giảm giá (tổng giá snack - giảm giá) lên database
        updatedCombo.price = Math.max(0, basePrice - discount);

        // Gửi update combo
        updateComboMutation.mutate({
          params: { path: { id: selectedCombo.id ?? 0 } },
          body: transformComboToRequest(updatedCombo),
        });
      } else {
        // Tạo combo mới
        const newCombo: Combo = {
          ...data,
          snacks: data.snacks.map((s) => ({
            id: typeof s.id === "number" ? s.id : undefined,
            quantity: s.quantity || 1,
            snack: s.snack,
          })),
        };

        // Tính giá tự động từ snacks
        const basePrice = calculateComboPriceWithQuantity(newCombo.snacks);
        const discount = newCombo.discount || 0;

        // Áp dụng giá đã tính toán - lưu giá sau khi trừ giảm giá (tổng giá snack - giảm giá) lên database
        newCombo.price = Math.max(0, basePrice - discount);

        // Tạo combo mới
        createComboMutation.mutate({
          body: transformComboToRequest(newCombo),
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
        toast.error("Không thể tìm thấy thông tin combo-snack", { id: "error-find-combo-snack" });
        return;
      }

      // Optimistically update UI with updated price
      setDetailsCombo((prev) => {
        if (!prev) return null;

        const updatedSnacks = prev.snacks.filter((s) => s.id !== comboSnackId);

        // Tính lại giá combo dựa trên các snacks còn lại
        const basePrice = calculateComboPrice({ ...prev, snacks: updatedSnacks });

        return {
          ...prev,
          snacks: updatedSnacks,
          price: basePrice,
        };
      });

      // Xóa snack khỏi combo
      removeSnacksFromComboMutation.mutate(
        {
          params: { path: { comboId: detailsCombo.id ?? 0 } },
          body: [comboSnackToDelete.snack.id],
        },
        {
          onSuccess: () => {
            // Sau khi xóa, cập nhật lại giá combo
            const updatedSnacks = detailsCombo.snacks.filter((s) => s.id !== comboSnackId);
            const basePrice = calculateComboPriceWithQuantity(updatedSnacks);
            const discount = detailsCombo.discount || 0;

            // Cập nhật giá combo trên server - lưu giá sau khi trừ giảm giá (tổng giá snack - giảm giá)
            updateComboMutation.mutate(
              {
                params: { path: { id: detailsCombo.id ?? 0 } },
                body: {
                  status: detailsCombo.status,
                  price: Math.max(0, basePrice - discount),
                },
              },
              {
                onSuccess: () => {
                  // Sử dụng ID duy nhất cho toast để ngăn hiển thị trùng lặp
                  combosQuery.refetch();
                },
              },
            );
          },
          onError: () => {
            toast.error("Lỗi khi xóa thực phẩm khỏi combo", { id: "delete-combo-snack-error" });
          },
        },
      );
    },
    [detailsCombo, removeSnacksFromComboMutation, updateComboMutation, combosQuery],
  );

  const handleUpdateSnack = useCallback(
    (comboSnack: ComboSnack) => {
      if (!detailsCombo) return;

      // Optimistically update UI
      setDetailsCombo((prev) => {
        if (!prev) return null;

        const updatedSnacks = prev.snacks.map((s) => (s.id === comboSnack.id ? { ...comboSnack } : s));

        // Tính lại giá combo dựa trên tất cả snacks
        const basePrice = calculateComboPriceWithQuantity(updatedSnacks);

        return {
          ...prev,
          snacks: updatedSnacks,
          price: basePrice,
        };
      });

      // Chuẩn bị tất cả snacks hiện tại để PUT lên server
      const allSnacks = detailsCombo.snacks.map((s) => {
        if (s.id === comboSnack.id) {
          // Đây là snack đang được cập nhật
          return {
            snackId: comboSnack.snack?.id ?? 0,
            quantity: comboSnack.quantity ?? 1,
          };
        } else {
          // Các snacks khác giữ nguyên
          return {
            snackId: s.snack?.id ?? 0,
            quantity: s.quantity ?? 1,
          };
        }
      });

      // Tính lại giá dựa trên tất cả snacks
      const updatedCombo = {
        ...detailsCombo,
        snacks: detailsCombo.snacks.map((s) => (s.id === comboSnack.id ? comboSnack : s)),
      };
      const basePrice = calculateComboPriceWithQuantity(updatedCombo.snacks);
      const discount = detailsCombo.discount || 0;

      // Đầu tiên cập nhật combo với danh sách snacks
      updateComboMutation.mutate(
        {
          params: { path: { id: detailsCombo.id ?? 0 } },
          body: {
            ...transformComboToRequest(detailsCombo),
            snacks: allSnacks,
          },
        },
        {
          onSuccess: () => {
            // Sau đó, đảm bảo giá được cập nhật chính xác (lưu giá sau khi trừ giảm giá)
            updateComboMutation.mutate(
              {
                params: { path: { id: detailsCombo.id ?? 0 } },
                body: {
                  status: detailsCombo.status,
                  price: Math.max(0, basePrice - discount),
                },
              },
              {
                onSuccess: () => {
                  console.log(basePrice);
                  combosQuery.refetch();
                },
              },
            );
          },
          onError: () => {
            toast.error("Lỗi khi cập nhật số lượng");
          },
        },
      );
    },
    [detailsCombo, updateComboMutation, combosQuery],
  );

  const handleAddSnack = useCallback(
    (newComboSnack: Partial<ComboSnack>) => {
      if (!detailsCombo || !newComboSnack.snack?.id) return;

      // Create a temporary snack for optimistic UI update
      const tempId = -Date.now();
      const tempComboSnack: ComboSnack = {
        id: tempId,
        combo: detailsCombo,
        snack: newComboSnack.snack,
        quantity: newComboSnack.quantity ?? 1,
      };

      // Update UI optimistically with updated price
      setDetailsCombo((prev) => {
        if (!prev) return null;

        const updatedSnacks = [...prev.snacks, tempComboSnack];

        // Tính lại giá combo dựa trên tất cả snacks
        const basePrice = calculateComboPriceWithQuantity(updatedSnacks);

        return {
          ...prev,
          snacks: updatedSnacks,
          price: basePrice,
        };
      });

      // Thêm snack vào combo bằng API
      addSnacksToComboMutation.mutate(
        {
          params: { path: { comboId: detailsCombo.id ?? 0 } },
          body: [
            {
              snackId: newComboSnack.snack.id,
              quantity: newComboSnack.quantity ?? 1,
            },
          ],
        },
        {
          onSuccess: () => {
            // Tính lại giá dựa trên tất cả snacks
            const updatedCombo = {
              ...detailsCombo,
              snacks: [...detailsCombo.snacks, tempComboSnack],
            };
            const basePrice = calculateComboPriceWithQuantity(updatedCombo.snacks);
            const discount = detailsCombo.discount || 0;

            // Cập nhật giá combo trên server (lưu giá sau khi trừ giảm giá)
            updateComboMutation.mutate(
              {
                params: { path: { id: detailsCombo.id ?? 0 } },
                body: {
                  status: detailsCombo.status,
                  price: Math.max(0, basePrice - discount),
                },
              },
              {
                onSuccess: () => {
                  combosQuery.refetch();
                },
              },
            );
          },
          onError: () => {
            toast.error("Lỗi khi thêm thực phẩm vào combo");
          },
        },
      );
    },
    [detailsCombo, addSnacksToComboMutation, updateComboMutation, combosQuery],
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
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
