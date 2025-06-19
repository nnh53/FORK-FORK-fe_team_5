import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Food } from "@/interfaces/foodAndCombo.interface";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FoodCard from "./FoodCard";
import FoodForm from "./FoodForm";
import { createFood, deleteFood, getFoods, updateFood } from "../service/foodApi";

const FoodManagement: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const data = await getFoods();
      setFoods(data);
    } catch (error) {
      console.error("Error fetching foods:", error);
      toast.error("Lỗi khi tải danh sách món ăn");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) {
      return;
    }

    try {
      await deleteFood(id);
      toast.success("Xóa món ăn thành công");
      fetchFoods();
    } catch (error) {
      console.error("Error deleting food:", error);
      toast.error("Lỗi khi xóa món ăn");
    }
  };

  const handleCreate = () => {
    setSelectedFood(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (food: Food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Omit<Food, "id">) => {
    try {
      if (selectedFood) {
        await updateFood({ ...selectedFood, ...data });
        toast.success("Cập nhật món ăn thành công");
      } else {
        await createFood(data);
        toast.success("Thêm món ăn thành công");
      }
      setIsModalOpen(false);
      setSelectedFood(undefined);
      fetchFoods();
    } catch (error) {
      console.error("Error saving food:", error);
      toast.error("Lỗi khi lưu món ăn");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedFood(undefined);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Quản lý thức ăn</CardTitle>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Thêm món ăn
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {foods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {foods.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Chưa có món ăn nào. Hãy thêm món ăn đầu tiên!
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedFood ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}
            </DialogTitle>
          </DialogHeader>
          <FoodForm
            food={selectedFood}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodManagement;
