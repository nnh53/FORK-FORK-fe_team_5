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
import { Input } from "@/components/Shadcn/ui/input";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Food } from "@/interfaces/foodAndCombo.interface";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ComboForm from "./ComboForm";
import ComboTable from "./ComboTable";
import { deleteFood, getFoods } from "./service/foodApi";

const ComboManagement = () => {
  const [combos, setCombos] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<Food | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [comboToDelete, setComboToDelete] = useState<Food | null>(null);

  const fetchCombos = async () => {
    setLoading(true);
    try {
      const allFoods = await getFoods();
      const comboFoods = allFoods.filter((food) => food.category === "combo");
      setCombos(comboFoods);
    } catch (error) {
      console.error("Failed to fetch combos:", error);
      toast.error("Lỗi khi tải danh sách combo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const filteredCombos = useMemo(() => {
    if (!searchTerm) return combos;
    return combos.filter((combo) => combo.name.toLowerCase().includes(searchTerm.toLowerCase()) || combo.id.toString().includes(searchTerm));
  }, [combos, searchTerm]);

  const handleAdd = () => {
    setSelectedCombo(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (combo: Food) => {
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

  const confirmDelete = async () => {
    if (comboToDelete) {
      try {
        await deleteFood(comboToDelete.id);
        toast.success(`Đã xóa combo: ${comboToDelete.name}`);
        fetchCombos(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete combo:", error);
        toast.error("Lỗi khi xóa combo");
      } finally {
        setDeleteDialogOpen(false);
        setComboToDelete(null);
      }
    }
  };

  const handleFormSubmit = () => {
    setIsModalOpen(false);
    fetchCombos(); // Refresh data after add/edit
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <Card className="p-4 sm:p-6 md:p-8">
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-800">Quản lý Combo</h1>
              <p className="text-gray-500 mt-1">Thêm, sửa, xóa và tìm kiếm các combo đồ ăn.</p>
            </div>
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus size={18} />
              Thêm Combo
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-1/3"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size={40} className="text-primary" />
            </div>
          ) : (
            <ComboTable combos={filteredCombos} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-190">
          <DialogHeader>
            <DialogTitle>{selectedCombo ? "Chỉnh sửa Combo" : "Tạo Combo mới"}</DialogTitle>
          </DialogHeader>
          <ComboForm combo={selectedCombo} onSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>

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
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ComboManagement;
