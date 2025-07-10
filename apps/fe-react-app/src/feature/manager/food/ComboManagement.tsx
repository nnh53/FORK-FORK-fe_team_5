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
  transformComboToRequest,
  useAddSnacksToCombo,
  useCombos,
  useCreateCombo,
  useDeleteCombo,
  useDeleteComboSnackByComboAndSnack,
  useUpdateCombo,
  useUpdateComboSnack,
} from "@/services/comboService";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ComboDetail from "./ComboDetail";
import ComboForm from "./ComboForm";
import ComboTable from "./ComboTable";

const filterByGlobalSearch = (combo: Combo, searchTerm: string): boolean => {
  if (!searchTerm) return true;
  if (!combo) return false;

  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  return (
    (combo.id?.toString() || "").includes(searchTerm) ||
    (combo.name?.toLowerCase() || "").includes(lowerSearchTerm) ||
    (combo.description?.toLowerCase() || "").includes(lowerSearchTerm)
  );
};

const filterByStatus = (combo: Combo, status: string): boolean => {
  if (!combo) return false;
  return combo.status === status;
};

const ComboManagement: React.FC = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<Combo | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [comboToDelete, setComboToDelete] = useState<Combo | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsCombo, setDetailsCombo] = useState<Combo | null>(null);

  const tableRef = useRef<{ resetPagination: () => void }>(null);

  // React Query hooks
  const combosQuery = useCombos();
  const createComboMutation = useCreateCombo();
  const updateComboMutation = useUpdateCombo();
  const deleteComboMutation = useDeleteCombo();
  const updateComboSnackMutation = useUpdateComboSnack();
  const addSnacksToComboMutation = useAddSnacksToCombo();

  useEffect(() => {
    if (combosQuery.data) {
      console.log("Raw API data:", JSON.stringify(combosQuery.data, null, 2));
      let transformedCombos: Combo[] = [];
      if (combosQuery.data.result) {
        if (Array.isArray(combosQuery.data.result)) {
          transformedCombos = combosQuery.data.result.map(transformComboResponse);
        } else {
          transformedCombos = [transformComboResponse(combosQuery.data.result)];
        }
      }
      console.log("Transformed combos:", transformedCombos);
      setCombos(transformedCombos);
    }
  }, [combosQuery.data]);

  // Định nghĩa các trường tìm kiếm
  const searchOptions: SearchOption[] = [
    { value: "id", label: "ID" },
    { value: "name", label: "Tên" },
    { value: "description", label: "Mô tả" },
  ];

  // Filter options
  const filterOptions = [
    {
      label: "Trạng thái",
      value: "status",
      type: "select" as const,
      selectOptions: comboStatusOptions, // Sửa từ `options` thành `selectOptions`
    },
  ];

  // Filter combos based on criteria
  const filteredCombos = combos.filter((combo) => {
    // Apply global search
    if (!filterByGlobalSearch(combo, searchTerm)) return false;

    // Apply filters
    for (const filter of filterCriteria) {
      if (filter.field === "status" && !filterByStatus(combo, filter.value as string)) {
        return false;
      }
    }

    return true;
  });

  const handleAdd = () => {
    setSelectedCombo(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (combo: Combo) => {
    setSelectedCombo(combo);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const combo = combos.find((c) => c.id === id);
    if (combo) {
      setComboToDelete(combo);
      setDeleteDialogOpen(true);
    }
  };

  const handleViewDetails = (combo: Combo) => {
    console.log("View details for combo:", combo);
    // Đảm bảo snack data đầy đủ và chính xác
    const comboWithValidSnacks = {
      ...combo,
      snacks:
        combo.snacks?.map((comboSnack) => {
          // Đảm bảo có dữ liệu snack hợp lệ
          if (comboSnack.snack && typeof comboSnack.snack === "object") {
            return comboSnack;
          }
          // Sử dụng fallback nếu cần
          return {
            ...comboSnack,
            snack: createFallbackSnack(),
          };
        }) || [],
    };
    setDetailsCombo(comboWithValidSnacks);
    setDetailsOpen(true);
  };

  const confirmDelete = async () => {
    if (comboToDelete) {
      try {
        await deleteComboMutation.mutateAsync({ params: { path: { id: comboToDelete.id } } });
        toast.success(`Đã xóa combo: ${comboToDelete.name}`);
        combosQuery.refetch(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete combo:", error);
        toast.error("Lỗi khi xóa combo");
      } finally {
        setDeleteDialogOpen(false);
        setComboToDelete(null);
      }
    }
  };

  const handleFormSubmit = async (data: Omit<Combo, "id">) => {
    try {
      if (selectedCombo) {
        // Edit existing combo
        await updateComboMutation.mutateAsync({
          params: { path: { id: selectedCombo.id } },
          body: transformComboToRequest({ ...selectedCombo, ...data }),
        });
        toast.success(`Cập nhật combo thành công: ${data.name}`);
      } else {
        // Create new combo
        await createComboMutation.mutateAsync({
          body: transformComboToRequest(data),
        });
        toast.success(`Tạo combo mới thành công: ${data.name}`);
      }
      setIsModalOpen(false);
      combosQuery.refetch(); // Refresh data
    } catch (error) {
      console.error("Error saving combo:", error);
      toast.error(`Lỗi khi ${selectedCombo ? "cập nhật" : "tạo"} combo`);
    }
  };

  // Add a new hook for deleting by combo and snack IDs
  const deleteComboSnackByComboAndSnackMutation = useDeleteComboSnackByComboAndSnack();

  const handleDeleteSnack = async (comboSnackId: number) => {
    try {
      // Get the combo and snack IDs for the combo-snack being deleted
      const comboSnackToDelete = detailsCombo?.snacks.find((s) => s.id === comboSnackId);

      if (!comboSnackToDelete || !detailsCombo) {
        toast.error("Không thể tìm thấy thông tin combo-snack");
        return;
      }

      const comboId = detailsCombo.id;
      const snackId = comboSnackToDelete.snack?.id;

      if (!snackId) {
        toast.error("Không thể tìm thấy ID của snack");
        return;
      }

      // ALWAYS use the combo/snack endpoint which is reliable and works correctly
      await deleteComboSnackByComboAndSnackMutation.mutateAsync({
        params: { path: { comboId, snackId } },
      });

      toast.success("Đã xóa thực phẩm khỏi combo");

      // Cập nhật UI ngay lập tức
      setDetailsCombo((prev) =>
        prev
          ? {
              ...prev,
              snacks: prev.snacks.filter((s) => s.id !== comboSnackId),
            }
          : null,
      );

      // Refresh data from server
      combosQuery.refetch();
    } catch (error) {
      console.error("Error removing snack from combo:", error);
      toast.error("Lỗi khi xóa thực phẩm khỏi combo");
    }
  };

  const handleUpdateSnack = async (comboSnack: ComboSnack) => {
    try {
      // Cập nhật state UI ngay lập tức
      setDetailsCombo((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          snacks: prev.snacks.map((s) => (s.id === comboSnack.id ? comboSnack : s)),
        };
      });

      // Gọi API
      await updateComboSnackMutation.mutateAsync({
        params: { path: { id: comboSnack.id } },
        body: comboSnack,
      });

      toast.success("Đã cập nhật thực phẩm trong combo");

      // Refresh dữ liệu từ server một cách yên lặng
      combosQuery.refetch();
    } catch (error) {
      console.error("Error updating combo snack:", error);
      toast.error("Lỗi khi cập nhật thực phẩm trong combo");

      // Nếu lỗi, khôi phục lại dữ liệu từ server
      combosQuery.refetch();
    }
  };

  const handleAddSnack = async (newComboSnack: Partial<ComboSnack>) => {
    if (!detailsCombo) return;
    try {
      // Thêm snack tạm thời vào state trước khi gọi API để người dùng thấy phản hồi ngay lập tức
      const tempComboSnack: ComboSnack = {
        id: -Date.now(), // ID tạm thời
        combo: detailsCombo,
        snack: newComboSnack.snack!,
        quantity: newComboSnack.quantity || 1,
        snackSizeId: newComboSnack.snackSizeId || null,
        discountPercentage: newComboSnack.discountPercentage || 0,
      };

      // Cập nhật state để hiển thị ngay
      setDetailsCombo((prev) =>
        prev
          ? {
              ...prev,
              snacks: [...prev.snacks, tempComboSnack],
            }
          : prev,
      );

      // Gọi API để thêm snack vào combo
      await addSnacksToComboMutation.mutateAsync({
        params: { path: { comboId: detailsCombo.id } },
        body: [
          {
            snackId: newComboSnack.snack?.id,
            quantity: newComboSnack.quantity,
          },
        ],
      });

      toast.success("Đã thêm thực phẩm vào combo");

      // Refresh dữ liệu từ server một cách yên lặng (không ảnh hưởng đến UI)
      combosQuery.refetch().then((result) => {
        if (result.data?.result && Array.isArray(result.data.result)) {
          const foundCombo = result.data.result.find((c) => c.id === detailsCombo.id);
          if (foundCombo) {
            // Cập nhật state mà không gây ra hiện tượng biến mất UI
            setDetailsCombo((prev) => {
              if (!prev) return prev;
              const transformedCombo = transformComboResponse(foundCombo);
              return {
                ...transformedCombo,
                // Đảm bảo giữ nguyên snacks mà người dùng có thể đang thêm/sửa
                snacks: transformedCombo.snacks,
              };
            });
          }
        }
      });
    } catch (error) {
      console.error("Lỗi khi thêm thực phẩm vào combo:", error);
      toast.error("Lỗi khi thêm thực phẩm vào combo");

      // Nếu lỗi, xóa snack tạm thời khỏi UI
      setDetailsCombo((prev) =>
        prev
          ? {
              ...prev,
              snacks: prev.snacks.filter((s) => s.id > 0), // Loại bỏ các ID tạm thời (âm)
            }
          : prev,
      );
    }
  };

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
                  if (tableRef.current) {
                    tableRef.current.resetPagination();
                  }
                }}
              />{" "}
            </div>
          </div>

          {combosQuery.isLoading || loading ? (
            <LoadingSpinner name="combos" heightFullScreen={false} />
          ) : (
            <ComboTable ref={tableRef} combos={filteredCombos} onEdit={handleEdit} onDelete={handleDelete} onViewDetails={handleViewDetails} />
          )}
        </CardContent>
      </Card>

      {/* Edit/Add Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedCombo ? "Chỉnh sửa Combo" : "Tạo Combo mới"}</DialogTitle>
          </DialogHeader>
          <ComboForm combo={selectedCombo} onSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      {detailsCombo && (
        <ComboDetail
          combo={detailsCombo}
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          onEdit={handleEdit}
          onAddSnack={handleAddSnack}
          onUpdateSnack={handleUpdateSnack}
          onDeleteSnack={handleDeleteSnack}
        />
      )}

      {/* Delete Confirmation */}
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
