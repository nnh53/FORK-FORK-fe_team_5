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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Filter, type FilterCriteria, type FilterGroup } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchBar, type SearchOption } from "@/components/shared/SearchBar";
import { useMutationHandler } from "@/hooks/useMutationHandler";
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
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
        (staff.id?.toString() ?? "").includes(lowerSearchTerm) ||
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
          return (staff.status?.toLowerCase() ?? "") === (criterion.value as string).toLowerCase();
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
  let staffs: StaffUser[] = [];
  if (usersQuery.data?.result) {
    const raw = Array.isArray(usersQuery.data.result)
      ? usersQuery.data.result
      : [usersQuery.data.result];
    staffs = raw
      .map(transformUserResponse)
      .filter((user) => user.role === ROLES.STAFF) as StaffUser[];
  }

  // Lọc staffs theo tiêu chí và tìm kiếm
  const filteredStaffs = applyFilters(staffs, filterCriteria, searchTerm);

  // Sử dụng hook chung useMutationHandler để xử lý các mutation
  useMutationHandler(
    registerMutation,
    "Đã thêm nhân viên mới thành công",
    "Lỗi khi thêm nhân viên",
    () => {
      setIsModalOpen(false);
      setSelectedStaff(undefined);
    },
    usersQuery.refetch,
    undefined,
    "register-staff",
  );

  useMutationHandler(
    updateUserMutation,
    "Đã cập nhật nhân viên thành công",
    "Lỗi khi cập nhật nhân viên",
    () => {
      setIsModalOpen(false);
      setSelectedStaff(undefined);
    },
    usersQuery.refetch,
    undefined,
    "update-staff",
  );

  useMutationHandler(
    deleteUserMutation,
    "Đã xóa nhân viên thành công",
    "Lỗi khi xóa nhân viên",
    () => {
      setDeleteDialogOpen(false);
      setStaffToDelete(null);
    },
    usersQuery.refetch,
    undefined,
    "delete-staff",
  );

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
        params: { path: { userId: selectedStaff.id ?? "" } },
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
        params: { path: { userId: staffToDelete.id ?? "" } },
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhân viên "{staffToDelete?.fullName}"{staffToDelete?.email ? ` (${staffToDelete.email})` : ""}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStaff}
              disabled={deleteUserMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteUserMutation.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffManagement;
