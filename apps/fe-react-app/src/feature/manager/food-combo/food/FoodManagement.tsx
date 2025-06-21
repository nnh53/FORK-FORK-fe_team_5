import { Filter, type FilterCriteria } from "@/components/shared/Filter";
import { SearchBar, type SearchCriteria } from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Food } from "@/interfaces/foodAndCombo.interface";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createFood, deleteFood, getFoods, updateFood } from "../service/foodApi";
import FoodForm from "./FoodForm";
import FoodTable from "./FoodTable";

// Helper functions để giảm complexity
const filterBySearch = (food: Food, criteria: SearchCriteria): boolean => {
  if (!criteria.value) return true;
  const searchValue = criteria.value.trim();

  switch (criteria.field) {
    case "id":
      // Tìm chính xác theo ID hoặc bắt đầu bằng searchValue
      return food.id.toString() === searchValue || food.id.toString().startsWith(searchValue);
    case "name":
      return food.name.toLowerCase().includes(searchValue.toLowerCase());
    case "flavor":
      return food.flavor.toLowerCase().includes(searchValue.toLowerCase());
    case "comboId":
      // Tìm chính xác theo ComboId hoặc bắt đầu bằng searchValue
      return food.comboId.toString() === searchValue || food.comboId.toString().startsWith(searchValue);
    default:
      return true;
  }
};

const filterByNumberRange = (food: Food, field: string, range: { from: number | undefined; to: number | undefined }): boolean => {
  if (!range.from && !range.to) return true;

  let value: number;
  switch (field) {
    case "price_range":
      value = food.price;
      break;
    case "quantity_range":
      value = food.quantity;
      break;
    default:
      return true;
  }

  return !(range.from && value < range.from) && !(range.to && value > range.to);
};

const filterByCategory = (food: Food, category: string): boolean => {
  return food.category.toLowerCase() === category.toLowerCase();
};

const filterBySize = (food: Food, size: string): boolean => {
  return food.size.toLowerCase() === size.toLowerCase();
};

const filterByStatus = (food: Food, status: string): boolean => {
  return food.status.toLowerCase() === status.toLowerCase();
};

// 1) Thêm hàm filterByGlobalSearch để tìm trên tất cả trường
const filterByGlobalSearch = (food: Food, searchValue: string) => {
  if (!searchValue.trim()) return true;
  const lower = searchValue.trim().toLowerCase();

  // Tùy bạn muốn match kiểu gì:
  // Ở ví dụ này, dùng includes() trên name, flavor,
  // còn id, comboId thì dùng startsWith (hoặc includes tùy nhu cầu).
  return (
    // match id
    food.id.toString().startsWith(searchValue) ||
    // match comboId
    food.comboId.toString().startsWith(searchValue) ||
    // match name, flavor
    food.name.toLowerCase().includes(lower) ||
    food.flavor.toLowerCase().includes(lower)
  );
};

const FoodManagement: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | undefined>();
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria[]>([]);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState<Food | null>(null);

  // Search options - thêm comboId
  const searchOptions = [
    { label: "ID", value: "id" },
    { label: "Tên", value: "name" },
    { label: "Hương vị", value: "flavor" },
    { label: "Combo ID", value: "comboId" },
  ];

  // Filter options - sử dụng numberRange thay vì priceRange
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
      label: "Tồn kho",
      value: "quantity_range",
      type: "numberRange" as const,
      numberRangeConfig: {
        fromPlaceholder: "Từ số lượng",
        toPlaceholder: "Đến số lượng",
        min: 0,
        step: 1,
        suffix: " cái",
      },
    },
    {
      label: "Loại sản phẩm",
      value: "category",
      type: "select" as const,
      selectOptions: [
        { value: "drink", label: "Đồ uống" },
        { value: "food", label: "Thức ăn" },
        { value: "combo", label: "Combo" },
      ],
      placeholder: "Chọn loại sản phẩm",
    },
    {
      label: "Kích thước",
      value: "size",
      type: "select" as const,
      selectOptions: [
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
      ],
      placeholder: "Chọn kích thước",
    },
    {
      label: "Trạng thái",
      value: "status",
      type: "select" as const,
      selectOptions: [
        { value: "available", label: "Có sẵn" },
        { value: "sold", label: "Đã bán hết" },
      ],
      placeholder: "Chọn trạng thái",
    },
  ];

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const data = await getFoods();
      setFoods(data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách thực phẩm");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const filteredFoods = useMemo(() => {
    if (!foods) return [];

    let result = foods;

    // ---- Thêm logic này cho global search ----
    // Giả sử SearchBar khi user gõ global search sẽ gửi duy nhất 1 criteria có field="GLOBAL"
    // -> Ta nhận diện: nếu "GLOBAL" => lọc bằng filterByGlobalSearch
    if (searchCriteria.length === 1 && searchCriteria[0].field === "GLOBAL" && searchCriteria[0].value.trim() !== "") {
      const globalValue = searchCriteria[0].value;
      result = result.filter((food) => filterByGlobalSearch(food, globalValue));
    }
    // Nếu không phải "GLOBAL" => Lọc theo logic specific field
    else if (searchCriteria.length > 0) {
      result = result.filter((food) => searchCriteria.every((criteria) => filterBySearch(food, criteria)));
    }
    // -----------------------------------------

    // Áp dụng filter criteria (lọc theo khoảng giá, tồn kho, category...)
    if (filterCriteria.length > 0) {
      result = result.filter((food) => {
        return filterCriteria.every((criteria) => {
          switch (criteria.field) {
            case "price_range":
            case "quantity_range": {
              const range = criteria.value as { from: number | undefined; to: number | undefined };
              return filterByNumberRange(food, criteria.field, range);
            }
            case "category": {
              return filterByCategory(food, criteria.value as string);
            }
            case "size": {
              return filterBySize(food, criteria.value as string);
            }
            case "status": {
              return filterByStatus(food, criteria.value as string);
            }
            default:
              return true;
          }
        });
      });
    }

    return result;
  }, [foods, searchCriteria, filterCriteria]);

  const handleCreate = () => {
    setSelectedFood(undefined);
    setIsModalOpen(true);
  };

  // Sửa lại handleEdit để nhận Food object thay vì id
  const handleEdit = (food: Food) => {
    console.log("Edit clicked for food:", food); // Debug log
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedFood(undefined);
  };

  const handleSubmit = async (data: Omit<Food, "id">) => {
    try {
      if (selectedFood) {
        await updateFood({ ...selectedFood, ...data });
        toast.success("Cập nhật thực phẩm thành công");
      } else {
        await createFood(data);
        toast.success("Thêm thực phẩm thành công");
      }
      setIsModalOpen(false);
      setSelectedFood(undefined);
      fetchFoods();
    } catch (error) {
      console.error("Lỗi khi lưu thực phẩm:", error);
      toast.error("Lỗi khi lưu thực phẩm");
    }
  };

  const handleDeleteClick = (id: number) => {
    const food = foods.find((f) => f.id === id);
    if (food) {
      setFoodToDelete(food);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (foodToDelete) {
      try {
        await deleteFood(foodToDelete.id);
        toast.success("Xóa thực phẩm thành công");
        fetchFoods();
      } catch (error) {
        console.error("Lỗi khi xóa thực phẩm:", error);
        toast.error("Lỗi khi xóa thực phẩm");
      }
    }
    setDeleteDialogOpen(false);
    setFoodToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Đang tải danh sách thực phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="space-y-4">
            {/* Title and Add button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold">Quản lý thực phẩm</CardTitle>
                <p className="text-muted-foreground mt-1">Quản lý danh sách thực phẩm, đồ uống và combo của bạn</p>
              </div>
              <Button onClick={handleCreate} className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Thêm thực phẩm
              </Button>
            </div>

            {/* Search and Filter row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* Search Bar - Left */}
              <div className="flex-1">
                <SearchBar searchOptions={searchOptions} onSearchChange={setSearchCriteria} maxSelections={4} placeholder="Tìm kiếm thực phẩm..." />
              </div>

              {/* Filter - Right */}
              <div className="shrink-0">
                <Filter filterOptions={filterOptions} onFilterChange={setFilterCriteria} />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <FoodTable foods={filteredFoods} onEdit={handleEdit} onDelete={handleDeleteClick} />
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
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedFood ? "Chỉnh sửa thực phẩm" : "Thêm thực phẩm mới"}</DialogTitle>
          </DialogHeader>
          <FoodForm food={selectedFood} onSubmit={handleSubmit} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa thực phẩm</DialogTitle>
          </DialogHeader>
          <p>Bạn có chắc chắn muốn xóa thực phẩm "{foodToDelete?.name}" này? Hành động này không thể hoàn tác.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FoodManagement;
