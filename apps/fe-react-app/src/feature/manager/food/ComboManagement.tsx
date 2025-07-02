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
  transformComboResponse,
  transformComboToRequest,
  useAddSnacksToCombo,
  useCombos,
  useCreateCombo,
  useDeleteCombo,
  useDeleteComboSnack,
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
  const deleteComboSnackMutation = useDeleteComboSnack();
  const addSnacksToComboMutation = useAddSnacksToCombo();

  useEffect(() => {
    if (combosQuery.data) {
      let transformedCombos: Combo[] = [];
      if (combosQuery.data.result) {
        if (Array.isArray(combosQuery.data.result)) {
          transformedCombos = combosQuery.data.result.map(transformComboResponse);
        } else {
          transformedCombos = [transformComboResponse(combosQuery.data.result)];
        }
      }
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
    setDetailsCombo(combo);
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

  const handleDeleteSnack = async (comboSnackId: number) => {
    try {
      await deleteComboSnackMutation.mutateAsync({
        params: { path: { id: comboSnackId } },
      });
      toast.success("Đã xóa thực phẩm khỏi combo");
      combosQuery.refetch();
    } catch (error) {
      console.error("Error removing snack from combo:", error);
      toast.error("Lỗi khi xóa thực phẩm khỏi combo");
    }
  };

  const handleUpdateSnack = async (comboSnack: ComboSnack) => {
    try {
      await updateComboSnackMutation.mutateAsync({
        params: { path: { id: comboSnack.id } },
        body: comboSnack,
      });
      toast.success("Đã cập nhật thực phẩm trong combo");
      combosQuery.refetch();
    } catch (error) {
      console.error("Error updating combo snack:", error);
      toast.error("Lỗi khi cập nhật thực phẩm trong combo");
    }
  };

  const handleAddSnack = async (newComboSnack: Partial<ComboSnack>) => {
    if (!detailsCombo) return;
    try {
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
      combosQuery.refetch();
    } catch (error) {
      console.error("Lỗi khi thêm thực phẩm vào combo:", error);
      toast.error("Lỗi khi thêm thực phẩm vào combo");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="p-4 sm:p-6 md:p-8">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Quản lý Combo</h1>
              <p className="text-gray-500 mt-1">Thêm, sửa, xóa và tìm kiếm các combo món ăn.</p>
            </div>
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus size={18} />
              Thêm Combo
            </Button>
          </div>

          <div className="mb-6 flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-2/3">
              <SearchBar
                searchOptions={searchOptions}
                onSearchChange={setSearchTerm}
                placeholder="Tìm kiếm theo ID, tên, mô tả..."
                className="w-full sm:w-auto flex-1"
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
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ComboManagement;
