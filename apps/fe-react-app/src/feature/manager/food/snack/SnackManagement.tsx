import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Filter, type FilterCriteria } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Snack } from "@/interfaces/snacks.interface";
import { Plus, Search as SearchIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { createSnack, deleteSnack, getSnacks, updateSnack } from "../service/snackApi";
import SnackForm from "./SnackForm";
import SnackTable from "./SnackTable";

// Cập nhật hàm filter cho interface mới
const filterByGlobalSearch = (snack: Snack, searchTerm: string): boolean => {
  if (!searchTerm) return true;

  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  return (
    snack.id.toString().includes(searchTerm) ||
    snack.name.toLowerCase().includes(lowerSearchTerm) ||
    snack.description.toLowerCase().includes(lowerSearchTerm)
  );
};

const filterByNumberRange = (snack: Snack, field: string, range: { from: number | undefined; to: number | undefined }): boolean => {
  if (!range.from && !range.to) return true;

  let value: number;
  switch (field) {
    case "price_range":
      value = snack.price;
      break;
    case "quantity_range":
      value = snack.quantity;
      break;
    default:
      return true;
  }

  return !(range.from && value < range.from) && !(range.to && value > range.to);
};

const filterByCategory = (snack: Snack, category: string): boolean => {
  return snack.category.toLowerCase() === category.toLowerCase();
};

const filterBySize = (snack: Snack, size: string): boolean => {
  return snack.size.toLowerCase() === size.toLowerCase();
};

const filterByStatus = (snack: Snack, status: string): boolean => {
  return snack.status === status;
};

const SnackManagement: React.FC = () => {
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState<Snack | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackToDelete, setSnackToDelete] = useState<Snack | null>(null);
  const tableRef = useRef<{ resetPagination: () => void }>(null);

  // Cập nhật các filter options với enum mới
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
        { value: "DRINK", label: "Đồ uống" },
        { value: "FOOD", label: "Thức ăn" },
      ],
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
        { value: "SOLD_OUT", label: "Đã bán hết" },
        { value: "UNAVAILABLE", label: "Ngừng bán" },
      ],
      placeholder: "Chọn trạng thái",
    },
  ];

  const fetchSnacks = async () => {
    setLoading(true);
    try {
      const data = await getSnacks();
      setSnacks(data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách thực phẩm");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnacks();
  }, []);

  // Apply filters
  const filteredSnacks = useMemo(() => {
    if (!snacks) return [];

    let result = snacks;

    // Global search
    if (searchTerm) {
      result = result.filter((snack) => filterByGlobalSearch(snack, searchTerm));
    }

    // Apply filter criteria
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
  }, [snacks, searchTerm, filterCriteria]);

  const handleCreate = () => {
    setSelectedSnack(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (snack: Snack) => {
    console.log("Edit clicked for snack:", snack);
    setSelectedSnack(snack);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedSnack(undefined);
  };

  const handleSubmit = async (data: Omit<Snack, "id">) => {
    try {
      if (selectedSnack) {
        await updateSnack({ ...selectedSnack, ...data });
        toast.success("Cập nhật thực phẩm thành công");
      } else {
        await createSnack(data);
        toast.success("Thêm thực phẩm thành công");
      }
      setIsModalOpen(false);
      setSelectedSnack(undefined);
      fetchSnacks();
    } catch (error) {
      console.error("Lỗi khi lưu thực phẩm:", error);
      toast.error("Lỗi khi lưu thực phẩm");
    }
  };

  const handleDeleteClick = (id: number) => {
    const snack = snacks.find((f) => f.id === id);
    if (snack) {
      setSnackToDelete(snack);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (snackToDelete) {
      try {
        await deleteSnack(snackToDelete.id);
        toast.success("Xóa thực phẩm thành công");
        fetchSnacks();
      } catch (error) {
        console.error("Lỗi khi xóa thực phẩm:", error);
        toast.error("Lỗi khi xóa thực phẩm");
      }
    }
    setDeleteDialogOpen(false);
    setSnackToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size={32} className="text-primary" />
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
                <p className="text-muted-foreground mt-1">Quản lý danh sách thực phẩm và đồ uống của bạn</p>
              </div>
              <Button onClick={handleCreate} className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Thêm thực phẩm
              </Button>
            </div>

            {/* Search and Filter row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* Search Bar - Left */}
              <div className="relative w-full sm:w-auto flex-1">
                <Input
                  placeholder="Tìm kiếm theo tên, mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 pr-10"
                />
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              {/* Filter - Right */}
              <div className="shrink-0">
                <Filter filterOptions={filterOptions} onFilterChange={setFilterCriteria} />
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
          <SnackForm snack={selectedSnack} onSubmit={handleSubmit} onCancel={handleCancel} />
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
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SnackManagement;
