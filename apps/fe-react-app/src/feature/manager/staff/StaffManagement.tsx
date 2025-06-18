import { Filter, type FilterCriteria } from "@/components/shared/Filter";
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

// Helper functions để giảm complexity
const filterBySearch = (staff: Staff, criteria: SearchCriteria): boolean => {
  if (!criteria.value) return true;

  switch (criteria.field) {
    case "id":
      return staff.staff_id.toString().includes(criteria.value);
    case "name":
      return staff.name.toLowerCase().includes(criteria.value.toLowerCase());
    case "phone":
      return staff.phone?.toLowerCase().includes(criteria.value.toLowerCase()) || false;
    case "email":
      return staff.email.toLowerCase().includes(criteria.value.toLowerCase());
    case "address":
      return staff.address?.toLowerCase().includes(criteria.value.toLowerCase()) || false;
    default:
      return true;
  }
};

const filterByGlobalSearch = (staff: Staff, searchValue: string): boolean => {
  const lowerSearchValue = searchValue.toLowerCase();
  return (
    staff.staff_id.toString().includes(searchValue) ||
    staff.name.toLowerCase().includes(lowerSearchValue) ||
    staff.phone?.toLowerCase().includes(lowerSearchValue) ||
    staff.email.toLowerCase().includes(lowerSearchValue) ||
    staff.address?.toLowerCase().includes(lowerSearchValue)
  );
};

const filterByDateRange = (staff: Staff, range: { from: Date | undefined; to: Date | undefined }): boolean => {
  if (!range.from && !range.to) return true;

  const staffBirthDate = staff.date_of_birth ? new Date(staff.date_of_birth) : null;
  if (!staffBirthDate) return false;

  return !(range.from && staffBirthDate < range.from) && !(range.to && staffBirthDate > range.to);
};

const filterByStatus = (staff: Staff, status: string): boolean => {
  return staff.status?.toLowerCase() === status.toLowerCase();
};

const StaffManagement = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria[]>([]);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);

  // Search options - thêm ID như MemberManagement
  const searchOptions = [
    { label: "ID", value: "id" },
    { label: "Tên", value: "name" },
    { label: "Số điện thoại", value: "phone" },
    { label: "Email", value: "email" },
    { label: "Địa chỉ", value: "address" },
  ];

  // Filter options - bỏ date cụ thể, chỉ giữ dateRange và select
  const filterOptions = [
    {
      label: "Khoảng ngày sinh",
      value: "birth_date_range",
      type: "dateRange" as const,
    },
    {
      label: "Trạng thái",
      value: "status",
      type: "select" as const,
      selectOptions: [
        { value: "VERIFY", label: "Đã xác minh" },
        { value: "BAN", label: "Bị cấm" },
        { value: "UNVERIFY", label: "Chưa xác minh" },
      ],
      placeholder: "Chọn trạng thái",
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

  const filteredStaffs = useMemo(() => {
    if (!staffs) return [];

    let result = staffs;

    // Áp dụng search criteria
    if (searchCriteria.length > 0) {
      result = result.filter((staff) => {
        const globalSearchValue = searchCriteria[0]?.value;
        const isGlobalSearch = searchCriteria.every((c) => c.value === globalSearchValue);

        if (isGlobalSearch && globalSearchValue) {
          return filterByGlobalSearch(staff, globalSearchValue);
        }

        return searchCriteria.every((criteria) => filterBySearch(staff, criteria));
      });
    }

    // Áp dụng filter criteria
    if (filterCriteria.length > 0) {
      result = result.filter((staff) => {
        return filterCriteria.every((criteria) => {
          switch (criteria.field) {
            case "birth_date_range": {
              const range = criteria.value as { from: Date | undefined; to: Date | undefined };
              return filterByDateRange(staff, range);
            }
            case "status": {
              return filterByStatus(staff, criteria.value as string);
            }
            default:
              return true;
          }
        });
      });
    }

    return result;
  }, [staffs, searchCriteria, filterCriteria]);

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
          <CardHeader className="space-y-4">
            {/* Title and Add button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-2xl font-bold">Danh sách nhân viên</CardTitle>
              <Button onClick={handleCreate} className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Thêm nhân viên
              </Button>
            </div>

            {/* Search and Filter row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* Search Bar - Left */}
              <div className="flex-1">
                <SearchBar searchOptions={searchOptions} onSearchChange={setSearchCriteria} maxSelections={5} placeholder="Tìm kiếm nhân viên..." />
              </div>

              {/* Filter - Right */}
              <div className="shrink-0">
                <Filter filterOptions={filterOptions} onFilterChange={setFilterCriteria} />
              </div>
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
