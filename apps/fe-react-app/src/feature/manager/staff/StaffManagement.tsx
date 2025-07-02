import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Filter, type FilterCriteria } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchBar, type SearchOption } from "@/components/shared/SearchBar";
import { ROLES } from "@/interfaces/roles.interface";
import type { StaffRequest, StaffUser } from "@/interfaces/staff.interface";
import { filterStaffUsers } from "@/interfaces/staff.interface";
import {
  transformRegisterRequest,
  transformUserResponse,
  transformUserUpdateRequest,
  useDeleteUser,
  useRegister,
  useUpdateUser,
  useUsers,
} from "@/services/userService";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import StaffForm from "./StaffForm";
import StaffTable from "./StaffTable";

// Sửa lại chỉ tìm theo ID, tên và email
const filterByGlobalSearch = (staff: StaffUser, searchValue: string): boolean => {
  if (!searchValue) return true;

  const lowerSearchValue = searchValue.toLowerCase();
  return (
    staff.id.toString().includes(searchValue.trim()) ||
    staff.fullName.toLowerCase().includes(lowerSearchValue.trim()) ||
    staff.email.toLowerCase().includes(lowerSearchValue.trim())
  );
};

const filterByDateRange = (staff: StaffUser, range: { from: Date | undefined; to: Date | undefined }): boolean => {
  if (!range.from && !range.to) return true;

  const staffBirthDate = staff.dateOfBirth ? new Date(staff.dateOfBirth) : null;
  if (!staffBirthDate) return false;

  return !(range.from && staffBirthDate < range.from) && !(range.to && staffBirthDate > range.to);
};

const filterByStatus = (staff: StaffUser, status: string): boolean => {
  return staff.status.toLowerCase() === status.toLowerCase();
};

const StaffManagement = () => {
  const [staffs, setStaffs] = useState<StaffUser[]>([]);
  const [loading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffUser | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffUser | null>(null);
  const tableRef = useRef<{ resetPagination: () => void }>(null);

  // React Query hooks
  const usersQuery = useUsers();
  const registerMutation = useRegister();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Định nghĩa các trường tìm kiếm
  const searchOptions: SearchOption[] = [
    { value: "id", label: "ID" },
    { value: "fullName", label: "Tên" },
    { value: "email", label: "Email" },
  ];

  useEffect(() => {
    if (usersQuery.data?.result) {
      // Transform API response to StaffUser[] by filtering for STAFF role
      let transformedUsers: StaffUser[] = [];

      if (Array.isArray(usersQuery.data.result)) {
        const users = usersQuery.data.result.map(transformUserResponse);
        transformedUsers = filterStaffUsers(users);
      } else if (usersQuery.data.result) {
        const user = transformUserResponse(usersQuery.data.result);
        if (user.role === ROLES.STAFF) {
          transformedUsers = [user as StaffUser];
        }
      }

      setStaffs(transformedUsers);
    }
  }, [usersQuery.data]);

  // Apply search and filter
  const filteredStaffs = staffs.filter((staff) => {
    // Apply global search
    if (!filterByGlobalSearch(staff, searchTerm)) return false;

    // Apply all filter criteria
    return filterCriteria.every((criteria) => {
      switch (criteria.field) {
        case "birth_date_range":
          return filterByDateRange(staff, criteria.value as { from: Date | undefined; to: Date | undefined });
        case "status":
          return filterByStatus(staff, criteria.value as string);
        default:
          return true;
      }
    });
  });

  // CRUD Operations
  const handleCreateStaff = async (staffData: StaffRequest) => {
    try {
      // Ensure phone is not undefined for the transform function
      const transformedData = transformRegisterRequest({
        ...staffData,
        role: ROLES.STAFF,
        phone: staffData.phone ?? "",
      });

      await registerMutation.mutateAsync({
        body: transformedData,
      });
      toast.success("Đã thêm nhân viên mới thành công");
      setIsModalOpen(false);
      usersQuery.refetch(); // Refresh list
    } catch (error) {
      console.error("Error creating staff:", error);
      toast.error("Lỗi khi thêm nhân viên: " + (error instanceof Error ? error.message : "Lỗi không xác định"));
    }
  };

  const handleUpdateStaff = async (staffData: StaffRequest) => {
    if (!selectedStaff) return;

    try {
      const transformedData = transformUserUpdateRequest({
        ...staffData,
        id: selectedStaff.id,
        role: ROLES.STAFF,
      });

      await updateUserMutation.mutateAsync({
        params: { path: { userId: selectedStaff.id } },
        body: transformedData,
      });

      toast.success("Đã cập nhật nhân viên thành công");
      setIsModalOpen(false);
      usersQuery.refetch(); // Refresh list
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Lỗi khi cập nhật nhân viên: " + (error instanceof Error ? error.message : "Lỗi không xác định"));
    }
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;

    try {
      await deleteUserMutation.mutateAsync({
        params: { path: { userId: staffToDelete.id } },
      });

      toast.success("Đã xóa nhân viên thành công");
      setDeleteDialogOpen(false);
      usersQuery.refetch(); // Refresh list
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Lỗi khi xóa nhân viên: " + (error instanceof Error ? error.message : "Lỗi không xác định"));
    }
  };

  // Hiển thị Dialog xác nhận xóa
  const confirmDelete = (staff: StaffUser) => {
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
  };

  // Mở form chỉnh sửa
  const handleEdit = (staff: StaffUser) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  // Mở form thêm mới
  const handleAdd = () => {
    setSelectedStaff(undefined);
    setIsModalOpen(true);
  };

  // Filter configuration
  const filterOptions = [
    {
      label: "Ngày sinh",
      value: "birth_date_range",
      type: "dateRange" as const,
    },
    {
      label: "Trạng thái",
      value: "status",
      type: "select" as const,
      selectOptions: [
        { value: "ACTIVE", label: "Đã xác minh" },
        { value: "BAN", label: "Bị cấm" },
      ],
      placeholder: "Chọn trạng thái",
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-5">
          <CardTitle className="text-xl">Quản lý nhân viên</CardTitle>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm nhân viên
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and filter section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <SearchBar
              searchOptions={searchOptions}
              onSearchChange={setSearchTerm}
              placeholder="Tìm kiếm nhân viên..."
              resetPagination={() => tableRef.current?.resetPagination()}
              className="w-full sm:w-72"
            />
            <Filter filterOptions={filterOptions} onFilterChange={setFilterCriteria} className="w-full sm:w-auto" />
          </div>

          {/* Staff table */}
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <StaffTable ref={tableRef} staffs={filteredStaffs} onEdit={handleEdit} onDelete={confirmDelete} />
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Staff modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedStaff ? "Sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
          </DialogHeader>
          <StaffForm staff={selectedStaff} onSubmit={selectedStaff ? handleUpdateStaff : handleCreateStaff} onCancel={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <p>
            Bạn có chắc chắn muốn xóa nhân viên {staffToDelete?.fullName} ({staffToDelete?.email})?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteStaff}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
