import { SearchBar, type SearchCriteria } from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Staff, StaffFormData } from "@/interfaces/staff.interface";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import StaffForm from "./StaffForm";
import StaffTable from "./StaffTable";
import { createStaff, deleteStaff, getStaffs, updateStaff } from "./services/staffApi";

const StaffManagement = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSearchTypes, setSelectedSearchTypes] = useState<string[]>(["name"]); // Thay đổi từ searchType thành selectedSearchTypes
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria[]>([]);

  const searchOptions = [
    { label: "Tên", value: "name", type: "text" as const },
    { label: "Số điện thoại", value: "phone", type: "text" as const },
    { label: "Email", value: "email", type: "text" as const },
    {
      label: "Ngày sinh",
      value: "date_of_birth",
      type: "date" as const,
    },
    { label: "Địa chỉ", value: "address", type: "text" as const },
    {
      label: "Trạng thái",
      value: "status",
      type: "select" as const,
      selectOptions: [
        { value: "VERIFY", label: "Đã xác minh" },
        { value: "BAN", label: "Bị cấm" },
        { value: "UNVERIFY", label: "Chưa xác minh" },
      ],
    },
  ];

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const data = await getStaffs();
      setStaffs(data);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách nhân viên");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  // Updated filtering logic
  const filteredStaffs = useMemo(() => {
    if (!staffs || searchCriteria.length === 0) return staffs;

    return staffs.filter((staff) => {
      return searchCriteria.every((criteria) => {
        if (!criteria.value) return true; // Bỏ qua criteria không có giá trị

        switch (criteria.field) {
          case "name":
            return staff.name.toLowerCase().includes((criteria.value as string).toLowerCase());
          case "phone":
            return staff.phone?.toLowerCase().includes((criteria.value as string).toLowerCase()) || false;
          case "email":
            return staff.email.toLowerCase().includes((criteria.value as string).toLowerCase());
          case "date_of_birth":
            if (criteria.value instanceof Date) {
              return staff.date_of_birth?.includes(criteria.value.toISOString().split("T")[0]) || false;
            }
            return staff.date_of_birth?.includes(criteria.value as string) || false;
          case "address":
            return staff.address?.toLowerCase().includes((criteria.value as string).toLowerCase()) || false;
          case "status":
            return staff.status?.toLowerCase() === (criteria.value as string).toLowerCase();
          default:
            return true;
        }
      });
    });
  }, [staffs, searchCriteria]);

  const handleCreate = () => {
    setSelectedStaff(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedStaff(undefined);
  };

  const handleSubmit = async (values: StaffFormData) => {
    try {
      if (selectedStaff) {
        await updateStaff({ ...selectedStaff, ...values });
        toast.success("Cập nhật nhân viên thành công");
      } else {
        await createStaff(values);
        toast.success("Thêm nhân viên thành công");
      }
      setIsModalOpen(false);
      setSelectedStaff(undefined);
      fetchStaffs();
    } catch (error) {
      console.error("Lỗi khi lưu nhân viên:", error);
      toast.error("Lỗi khi lưu nhân viên");
    }
  };

  const handleDeleteClick = (staff: Staff) => {
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (staffToDelete) {
      try {
        await deleteStaff(staffToDelete.staff_id);
        toast.success("Xóa nhân viên thành công");
        fetchStaffs();
      } catch (error) {
        console.error("Lỗi khi xóa nhân viên:", error);
        toast.error("Lỗi khi xóa nhân viên");
      }
    }
    setDeleteDialogOpen(false);
    setStaffToDelete(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold ">Danh sách nhân viên</CardTitle>
            <div className="flex items-center gap-4">
              <SearchBar searchOptions={searchOptions} onSearchChange={setSearchCriteria} maxSelections={6} />
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm nhân viên
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <StaffTable staffs={filteredStaffs} onEdit={handleEdit} onDelete={handleDeleteClick} />
          </CardContent>
        </Card>
      </div>
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCancel();
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedStaff ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
          </DialogHeader>
          <StaffForm staff={selectedStaff} onSubmit={handleSubmit} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa nhân viên</DialogTitle>
          </DialogHeader>
          <p>Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.</p>
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

export default StaffManagement;
