import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Filter, type FilterCriteria, type FilterGroup } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchBar, type SearchOption } from "@/components/shared/SearchBar";
import { ROLES } from "@/interfaces/roles.interface";
import type { StaffRequest, StaffUser } from "@/interfaces/staff.interface";
import {
  formatUserDate,
  transformRegisterRequest,
  transformUserResponse,
  transformUserUpdateRequest,
  useDeleteUser,
  useRegister,
  useUpdateUser,
  useUsers,
} from "@/services/userService";
import type { CustomAPIResponse } from "@/type-from-be";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import StaffForm from "./StaffForm";
import StaffTable from "./StaffTable";

// Định nghĩa type chặt chẽ hơn cho FilterCriteria
type FilterValue = string | { from: Date | undefined; to: Date | undefined };
interface StrictFilterCriteria extends FilterCriteria {
  field: string;
  value: FilterValue;
}

// Hàm lọc tổng hợp
const applyFilters = (staffs: StaffUser[], criteria: StrictFilterCriteria[], searchTerm: string): StaffUser[] => {
  let result = staffs;

  // Lọc theo tìm kiếm toàn cục
  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    result = result.filter(
      (staff) =>
        staff.id.toString().includes(lowerSearchTerm) ||
        (staff.fullName?.toLowerCase() ?? "").includes(lowerSearchTerm) ||
        (staff.email?.toLowerCase() ?? "").includes(lowerSearchTerm) ||
        (staff.phone?.toLowerCase() ?? "").includes(lowerSearchTerm) ||
        (staff.address?.toLowerCase() ?? "").includes(lowerSearchTerm) ||
        (formatUserDate(staff.dateOfBirth ?? "")?.toLowerCase() ?? "").includes(lowerSearchTerm) ||
        (staff.gender?.toLowerCase() ?? "").includes(lowerSearchTerm),
    );
  }

  // Áp dụng các tiêu chí lọc
  return result.filter((staff) =>
    criteria.every((criterion) => {
      switch (criterion.field) {
        case "birth_date_range": {
          const range = criterion.value as { from: Date | undefined; to: Date | undefined };
          if (!range.from && !range.to) return true;
          const birthDate = staff.dateOfBirth ? new Date(staff.dateOfBirth) : null;
          return birthDate ? !(range.from && birthDate < range.from) && !(range.to && birthDate > range.to) : false;
        }
        case "status":
          return staff.status.toLowerCase() === (criterion.value as string).toLowerCase();
        case "gender":
          return criterion.value === "NOT_SET" ? !staff.gender : staff.gender === criterion.value;
        default:
          return true;
      }
    }),
  );
};

const StaffManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffUser | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<StrictFilterCriteria[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffUser | null>(null);
  const tableRef = useRef<{ resetPagination: () => void }>(null);

  // React Query hooks
  const usersQuery = useUsers();
  const registerMutation = useRegister();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Tính toán staffs từ usersQuery.data
  const staffs = useMemo(() => {
    if (usersQuery.data?.result) {
      const users = Array.isArray(usersQuery.data.result)
        ? usersQuery.data.result.map(transformUserResponse).filter((user) => user.role === ROLES.STAFF)
        : [transformUserResponse(usersQuery.data.result)].filter((user) => user.role === ROLES.STAFF);
      // Type assertion - chỉ những User có role = STAFF mới được filter vào đây
      return users as StaffUser[];
    }
    return [];
  }, [usersQuery.data]);

  // Lọc staffs theo tiêu chí và tìm kiếm
  const filteredStaffs = useMemo(() => applyFilters(staffs, filterCriteria, searchTerm), [staffs, searchTerm, filterCriteria]);

  // Xử lý mutation với toast và theo dõi trạng thái để tránh hiển thị nhiều lần
  const registerSuccessRef = useRef(false);
  const registerErrorRef = useRef(false);
  const updateSuccessRef = useRef(false);
  const updateErrorRef = useRef(false);
  const deleteSuccessRef = useRef(false);
  const deleteErrorRef = useRef(false);

  // Xử lý toast thêm nhân viên
  useEffect(() => {
    if (registerMutation.isSuccess && !registerSuccessRef.current) {
      toast.success("Đã thêm nhân viên mới thành công");
      usersQuery.refetch();
      setIsModalOpen(false);
      setSelectedStaff(undefined);
      setTimeout(() => registerMutation.reset(), 100);
      registerSuccessRef.current = true;
    } else if (registerMutation.isError && !registerErrorRef.current) {
      toast.error((registerMutation.error as CustomAPIResponse)?.message ?? "Lỗi khi thêm nhân viên");
      registerErrorRef.current = true;
    }

    // Reset refs when mutation status changes
    if (!registerMutation.isSuccess) registerSuccessRef.current = false;
    if (!registerMutation.isError) registerErrorRef.current = false;
  }, [registerMutation.isSuccess, registerMutation.isError, registerMutation.error, registerMutation, usersQuery]);

  // Xử lý toast cập nhật nhân viên
  useEffect(() => {
    if (updateUserMutation.isSuccess && !updateSuccessRef.current) {
      toast.success("Đã cập nhật nhân viên thành công");
      usersQuery.refetch();
      setIsModalOpen(false);
      setSelectedStaff(undefined);
      setTimeout(() => updateUserMutation.reset(), 100);
      updateSuccessRef.current = true;
    } else if (updateUserMutation.isError && !updateErrorRef.current) {
      toast.error((updateUserMutation.error as CustomAPIResponse)?.message ?? "Lỗi khi cập nhật nhân viên");
      updateErrorRef.current = true;
    }

    // Reset refs when mutation status changes
    if (!updateUserMutation.isSuccess) updateSuccessRef.current = false;
    if (!updateUserMutation.isError) updateErrorRef.current = false;
  }, [updateUserMutation.isSuccess, updateUserMutation.isError, updateUserMutation.error, updateUserMutation, usersQuery]);

  // Xử lý toast xóa nhân viên
  useEffect(() => {
    if (deleteUserMutation.isSuccess && !deleteSuccessRef.current) {
      toast.success("Đã xóa nhân viên thành công");
      usersQuery.refetch();
      setDeleteDialogOpen(false);
      setStaffToDelete(null);
      setTimeout(() => deleteUserMutation.reset(), 100);
      deleteSuccessRef.current = true;
    } else if (deleteUserMutation.isError && !deleteErrorRef.current) {
      toast.error((deleteUserMutation.error as CustomAPIResponse)?.message ?? "Lỗi khi xóa nhân viên");
      deleteErrorRef.current = true;
    }

    // Reset refs when mutation status changes
    if (!deleteUserMutation.isSuccess) deleteSuccessRef.current = false;
    if (!deleteUserMutation.isError) deleteErrorRef.current = false;
  }, [deleteUserMutation.isSuccess, deleteUserMutation.isError, deleteUserMutation.error, deleteUserMutation, usersQuery]);

  // Reset pagination khi filter hoặc search thay đổi
  useEffect(() => {
    tableRef.current?.resetPagination();
  }, [filterCriteria, searchTerm]);

  // Định nghĩa các trường tìm kiếm
  const searchOptions: SearchOption[] = [
    { value: "id", label: "ID" },
    { value: "fullName", label: "Tên" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Số điện thoại" },
    { value: "address", label: "Địa chỉ" },
  ];

  // Filter configuration
  const filterGroups: FilterGroup[] = [
    {
      name: "dates",
      label: "Ngày tháng",
      options: [{ label: "Ngày sinh", value: "birth_date_range", type: "dateRange" as const }],
    },
    {
      name: "status",
      label: "Trạng thái",
      options: [
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
        {
          label: "Giới tính",
          value: "gender",
          type: "select" as const,
          selectOptions: [
            { value: "MALE", label: "Nam" },
            { value: "FEMALE", label: "Nữ" },
            { value: "OTHER", label: "Khác" },
            { value: "NOT_SET", label: "Chưa cập nhật" },
          ],
          placeholder: "Chọn giới tính",
        },
      ],
    },
  ];

  const handleAdd = () => {
    setSelectedStaff(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (staff: StaffUser) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleSubmit = (staffData: StaffRequest) => {
    if (selectedStaff) {
      updateUserMutation.mutate({
        params: { path: { userId: selectedStaff.id } },
        body: transformUserUpdateRequest({ ...staffData, id: selectedStaff.id, role: ROLES.STAFF }),
      });
    } else {
      registerMutation.mutate({
        body: transformRegisterRequest({ ...staffData, role: ROLES.STAFF, phone: staffData.phone ?? "" }),
      });
    }
  };

  const confirmDelete = (staff: StaffUser) => {
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
  };

  const handleDeleteStaff = () => {
    if (staffToDelete) {
      deleteUserMutation.mutate({
        params: { path: { userId: staffToDelete.id } },
      });
    }
  };

  if (usersQuery.isLoading) {
    return <LoadingSpinner name="nhân viên" />;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Quản lý nhân viên</CardTitle>
              <p className="text-muted-foreground mt-1">Quản lý danh sách nhân viên của bạn</p>
            </div>
            <Button onClick={handleAdd} disabled={registerMutation.isPending}>
              <Plus className="mr-2 h-4 w-4" />
              {registerMutation.isPending ? "Đang thêm..." : "Thêm nhân viên"}
            </Button>
          </div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <SearchBar
              searchOptions={searchOptions}
              onSearchChange={setSearchTerm}
              placeholder="Tìm kiếm theo ID, tên, email, số điện thoại hoặc địa chỉ..."
              className="w-full flex-1 sm:w-auto"
              resetPagination={() => tableRef.current?.resetPagination()}
            />
            <div className="shrink-0">
              <Filter
                filterOptions={filterGroups}
                onFilterChange={(criteria) => setFilterCriteria(criteria as StrictFilterCriteria[])}
                groupMode={true}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StaffTable ref={tableRef} staffs={filteredStaffs} onEdit={handleEdit} onDelete={confirmDelete} />
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedStaff ? "Sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
          </DialogHeader>
          <StaffForm
            staff={selectedStaff}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            isLoading={registerMutation.isPending || updateUserMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <p>
            Bạn có chắc chắn muốn xóa nhân viên "{staffToDelete?.fullName}"{staffToDelete?.email ? ` (${staffToDelete.email})` : ""}?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteStaff} disabled={deleteUserMutation.isPending}>
              {deleteUserMutation.isPending ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
