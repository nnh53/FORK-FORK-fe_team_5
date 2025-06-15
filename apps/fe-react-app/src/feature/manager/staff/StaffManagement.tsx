import { SearchBar } from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
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
  const [searchType, setSearchType] = useState("name");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

  const searchOptions = [
    { label: "Tên", value: "name" },
    { label: "Số điện thoại", value: "phone" },
    { label: "Email", value: "email" },
    { label: "Ngày sinh", value: "date_of_birth" },
    { label: "Địa chỉ", value: "address" },
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

  const filteredStaffs = useMemo(() => {
    if (!staffs) return [];
    return staffs.filter((staff) => {
      switch (searchType) {
        case "phone":
          return staff.phone?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        case "email":
          return staff.email.toLowerCase().includes(searchTerm.toLowerCase());
        case "date_of_birth":
          return staff.date_of_birth?.includes(searchTerm) || false;
        case "address":
          return staff.address?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        case "status":
          return staff.status?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        default:
          return staff.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
  }, [staffs, searchTerm, searchType]);

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
    <div className="p-6  min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Danh sách nhân viên</h2>
        <div className="flex items-center gap-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchType={searchType}
            setSearchType={setSearchType}
            searchOptions={searchOptions}
          />
          <Button onClick={handleCreate} className="bg-red-500 hover:bg-red-600">
            <Plus className="mr-2 h-4 w-4" />
            Thêm nhân viên
          </Button>
        </div>
      </div>

      <StaffTable staffs={filteredStaffs} onEdit={handleEdit} onDelete={handleDeleteClick} />

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
    </div>
  );
};

export default StaffManagement;
