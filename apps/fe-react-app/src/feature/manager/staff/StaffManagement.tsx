import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Filter, type FilterCriteria, type FilterGroup } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchBar, type SearchOption } from "@/components/shared/SearchBar";
import { ROLES } from "@/interfaces/roles.interface";
import type { StaffRequest, StaffUser } from "@/interfaces/staff.interface";
import type { USER_GENDER } from "@/interfaces/users.interface";
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
import { type UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import StaffForm from "./StaffForm";
import StaffTable from "./StaffTable";

// Type guard để kiểm tra StaffUser hợp lệ
const isValidStaff = (staff: StaffUser | undefined | null): staff is StaffUser => {
  return !!staff && typeof staff.id === "number" && !!staff.fullName;
};

// Hàm định dạng thời gian
const formatDateTime = (dateString?: string) => {
  if (!dateString) return "Chưa cập nhật";
  try {
    return formatUserDate(dateString);
  } catch {
    return "Không hợp lệ";
  }
};

// Hàm hiển thị giới tính
const formatGender = (gender?: string) => {
  if (!gender) return "Chưa cập nhật";
  switch (gender) {
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    case "OTHER":
      return "Khác";
    default:
      return "Chưa cập nhật";
  }
};

// Hàm tìm kiếm toàn cục
const filterByGlobalSearch = (staff: StaffUser, searchValue: string): boolean => {
  if (!searchValue || !isValidStaff(staff)) return false;

  const lowerSearchValue = searchValue.toLowerCase().trim();
  return (
    staff.id.toString().includes(lowerSearchValue) ||
    (staff.fullName?.toLowerCase() ?? "").includes(lowerSearchValue) ||
    (staff.email?.toLowerCase() ?? "").includes(lowerSearchValue) ||
    (staff.phone?.toLowerCase() ?? "").includes(lowerSearchValue) ||
    (staff.address?.toLowerCase() ?? "").includes(lowerSearchValue) ||
    formatDateTime(staff.dateOfBirth).toLowerCase().includes(lowerSearchValue) ||
    formatGender(staff.gender).toLowerCase().includes(lowerSearchValue)
  );
};

// Hàm lọc theo khoảng ngày
const filterByDateRange = (staff: StaffUser, range: { from: Date | undefined; to: Date | undefined }): boolean => {
  if (!range.from && !range.to) return true;
  if (!isValidStaff(staff)) return false;

  const staffBirthDate = staff.dateOfBirth ? new Date(staff.dateOfBirth) : null;
  if (!staffBirthDate) return false;

  return !(range.from && staffBirthDate < range.from) && !(range.to && staffBirthDate > range.to);
};

// Hàm lọc theo trạng thái
const filterByStatus = (staff: StaffUser, status: string): boolean => {
  if (!isValidStaff(staff)) return false;
  return staff.status.toLowerCase() === status.toLowerCase();
};

// Hàm lọc theo giới tính
const filterByGender = (staff: StaffUser, gender: string): boolean => {
  if (!isValidStaff(staff)) return false;
  if (gender === "NOT_SET") {
    return !staff.gender;
  }
  return staff.gender === (gender as USER_GENDER);
};

// Custom hook để xử lý mutation
const useStaffMutationHandler = <TData, TError extends CustomAPIResponse, TVariables>(
  mutation: UseMutationResult<TData, TError, TVariables>,
  successMessage: string,
  errorMessage: string,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();
  const usersQuery = useUsers();

  useEffect(() => {
    if (mutation.isSuccess) {
      toast.success(successMessage, { id: successMessage });
      usersQuery.refetch();
      onSuccess?.();
      setTimeout(() => mutation.reset(), 100);
    } else if (mutation.isError) {
      toast.error(mutation.error?.message || errorMessage, { id: `${successMessage}-error` });
    }
  }, [mutation, queryClient, usersQuery, successMessage, errorMessage, onSuccess]);
};

// Hàm lọc chính
const applyFilters = (staffs: StaffUser[], criteria: FilterCriteria[], searchTerm: string): StaffUser[] => {
  let result = staffs;

  if (searchTerm) {
    result = result.filter((staff) => filterByGlobalSearch(staff, searchTerm));
  }

  return result.filter((staff) =>
    criteria.every((criterion) => {
      switch (criterion.field) {
        case "birth_date_range":
          return filterByDateRange(staff, criterion.value as { from: Date; to: Date });
        case "status":
          return filterByStatus(staff, criterion.value as string);
        case "gender":
          return filterByGender(staff, criterion.value as string);
        default:
          return true;
      }
    }),
  );
};

const StaffManagement = () => {
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

  // Sử dụng custom hook để xử lý mutation
  useStaffMutationHandler(registerMutation, "Đã thêm nhân viên mới thành công", "Lỗi khi thêm nhân viên", () => {
    setIsModalOpen(false);
    setSelectedStaff(undefined);
  });

  useStaffMutationHandler(updateUserMutation, "Đã cập nhật nhân viên thành công", "Lỗi khi cập nhật nhân viên", () => {
    setIsModalOpen(false);
    setSelectedStaff(undefined);
  });

  useStaffMutationHandler(deleteUserMutation, "Đã xóa nhân viên thành công", "Lỗi khi xóa nhân viên", () => {
    setDeleteDialogOpen(false);
    setStaffToDelete(null);
  });

  // Chuyển đổi dữ liệu từ API sang StaffUser
  const staffs = useMemo(() => {
    if (!usersQuery.data?.result) return [];
    const result = Array.isArray(usersQuery.data.result) ? usersQuery.data.result : [usersQuery.data.result];
    return result.map(transformUserResponse).filter((user) => user.role === ROLES.STAFF) as StaffUser[];
  }, [usersQuery.data]);

  // Lọc staff theo các tiêu chí
  const filteredStaffs = useMemo(() => {
    return applyFilters(staffs, filterCriteria, searchTerm);
  }, [staffs, searchTerm, filterCriteria]);

  // Reset pagination khi filter thay đổi
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.resetPagination();
    }
  }, [filterCriteria]);

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
      options: [
        {
          label: "Ngày sinh",
          value: "birth_date_range",
          type: "dateRange" as const,
        },
      ],
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

  // Mở form thêm mới
  const handleAdd = () => {
    setSelectedStaff(undefined);
    setIsModalOpen(true);
  };

  // Mở form chỉnh sửa
  const handleEdit = (staff: StaffUser) => {
    if (isValidStaff(staff)) {
      setSelectedStaff(staff);
      setIsModalOpen(true);
    }
  };

  // Hủy thao tác
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedStaff(undefined);
  };

  // Xử lý submit form
  const handleSubmit = (staffData: StaffRequest) => {
    if (selectedStaff) {
      if (!isValidStaff(selectedStaff)) return;
      const transformedData = transformUserUpdateRequest({
        ...staffData,
        id: selectedStaff.id,
        role: ROLES.STAFF,
      });
      updateUserMutation.mutate({
        params: { path: { userId: selectedStaff.id } },
        body: transformedData,
      });
    } else {
      const transformedData = transformRegisterRequest({
        ...staffData,
        role: ROLES.STAFF,
        phone: staffData.phone ?? "",
      });
      registerMutation.mutate({
        body: transformedData,
      });
    }
  };

  // Hiển thị dialog xác nhận xóa
  const confirmDelete = (staff: StaffUser) => {
    if (isValidStaff(staff)) {
      setStaffToDelete(staff);
      setDeleteDialogOpen(true);
    } else {
      toast.error("Không tìm thấy nhân viên để xóa", { id: "delete-staff-error" });
    }
  };

  // Xử lý xóa
  const handleDeleteStaff = () => {
    if (!isValidStaff(staffToDelete)) {
      toast.error("Không tìm thấy nhân viên để xóa", { id: "delete-staff-error" });
      return;
    }
    deleteUserMutation.mutate({
      params: { path: { userId: staffToDelete.id } },
    });
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
              <Filter filterOptions={filterGroups} onFilterChange={setFilterCriteria} groupMode={true} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StaffTable ref={tableRef} staffs={filteredStaffs} onEdit={handleEdit} onDelete={confirmDelete} />
        </CardContent>
      </Card>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCancel();
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedStaff ? "Sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
          </DialogHeader>
          <StaffForm
            staff={selectedStaff}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
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
            Bạn có chắc chắn muốn xóa nhân viên {staffToDelete?.fullName} ({staffToDelete?.email})?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteStaff} disabled={deleteUserMutation.isPending || !isValidStaff(staffToDelete)}>
              {deleteUserMutation.isPending ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffManagement;
