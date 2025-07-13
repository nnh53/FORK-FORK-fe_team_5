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
import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import StaffForm from "./StaffForm";
import StaffTable from "./StaffTable";

// Thêm hàm để định dạng thời gian
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

// Tìm kiếm theo tất cả các trường có liên quan
const filterByGlobalSearch = (staff: StaffUser, searchValue: string): boolean => {
  if (!searchValue) return true;

  const lowerSearchValue = searchValue.toLowerCase();
  return (
    staff.id.toString().includes(searchValue.trim()) ||
    (staff.fullName?.toLowerCase() ?? "").includes(lowerSearchValue.trim()) ||
    (staff.email?.toLowerCase() ?? "").includes(lowerSearchValue.trim()) ||
    (staff.phone?.toLowerCase() ?? "").includes(lowerSearchValue.trim()) ||
    (staff.address?.toLowerCase() ?? "").includes(lowerSearchValue.trim()) ||
    (formatDateTime(staff.dateOfBirth)?.toLowerCase() ?? "").includes(lowerSearchValue.trim()) ||
    (formatGender(staff.gender)?.toLowerCase() ?? "").includes(lowerSearchValue.trim())
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

const filterByGender = (staff: StaffUser, gender: string): boolean => {
  if (gender === "NOT_SET") {
    return !staff.gender; // Trả về true nếu staff.gender là null hoặc undefined
  }
  return staff.gender === (gender as USER_GENDER);
};

const StaffManagement = () => {
  const [staffs, setStaffs] = useState<StaffUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffUser | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffUser | null>(null);
  const tableRef = useRef<{ resetPagination: () => void }>(null);

  // Sử dụng refs để theo dõi xem đã hiển thị toast chưa
  const registerToastShownRef = useRef(false);
  const updateToastShownRef = useRef(false);
  const deleteToastShownRef = useRef(false);

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
    { value: "phone", label: "Số điện thoại" },
    { value: "address", label: "Địa chỉ" },
  ];

  // Chuyển đổi dữ liệu từ API sang dạng StaffUser
  useEffect(() => {
    if (usersQuery.data?.result) {
      // Transform API response to StaffUser[] by filtering for STAFF role
      let transformedUsers: StaffUser[] = [];

      if (Array.isArray(usersQuery.data.result)) {
        transformedUsers = usersQuery.data.result.map(transformUserResponse).filter((user) => user.role === ROLES.STAFF) as StaffUser[];
      } else if (usersQuery.data.result) {
        const user = transformUserResponse(usersQuery.data.result);
        if (user.role === ROLES.STAFF) {
          transformedUsers = [user as StaffUser];
        }
      }

      setStaffs(transformedUsers);
    }
  }, [usersQuery.data]);

  //kiểm tra trang thai cua query
  useEffect(() => {
    console.log("Staff data:", usersQuery.data);
    console.log("Staff status:", usersQuery.status);
    console.log("Staff error:", usersQuery.error);
  }, [usersQuery.data, usersQuery.status, usersQuery.error]);

  useEffect(() => {
    console.log("Create staff status:", registerMutation.status);
    console.log("Create staff error:", registerMutation.error);
  }, [registerMutation.status, registerMutation.error]);

  useEffect(() => {
    console.log("Update staff status:", updateUserMutation.status);
    console.log("Update staff error:", updateUserMutation.error);
  }, [updateUserMutation.status, updateUserMutation.error]);

  useEffect(() => {
    console.log("Delete staff status:", deleteUserMutation.status);
    console.log("Delete staff error:", deleteUserMutation.error);
  }, [deleteUserMutation.status, deleteUserMutation.error]);

  // Xử lý trạng thái của register mutation
  useEffect(() => {
    if (registerMutation.isSuccess) {
      if (!registerToastShownRef.current) {
        toast.success("Đã thêm nhân viên mới thành công");
        registerToastShownRef.current = true;
      }
      usersQuery.refetch(); // Refetch users to get the latest data
      setIsModalOpen(false);
      setSelectedStaff(undefined);
      setTimeout(() => {
        registerMutation.reset();
        registerToastShownRef.current = false;
      }, 100);
    } else if (registerMutation.isError) {
      toast.error((registerMutation.error as CustomAPIResponse)?.message ?? "Lỗi khi thêm nhân viên");
    }
  }, [registerMutation.isSuccess, registerMutation.isError, registerMutation.error, usersQuery]);

  // Xử lý trạng thái của update mutation
  useEffect(() => {
    if (updateUserMutation.isSuccess) {
      if (!updateToastShownRef.current) {
        toast.success("Đã cập nhật nhân viên thành công");
        updateToastShownRef.current = true;
      }
      usersQuery.refetch(); // Refetch users to get the latest data
      setIsModalOpen(false);
      setSelectedStaff(undefined);
      setTimeout(() => {
        updateUserMutation.reset();
        updateToastShownRef.current = false;
      }, 100);
    } else if (updateUserMutation.isError) {
      toast.error((updateUserMutation.error as CustomAPIResponse)?.message ?? "Lỗi khi cập nhật nhân viên");
    }
  }, [updateUserMutation.isSuccess, updateUserMutation.isError, updateUserMutation.error, usersQuery, updateUserMutation]);

  // Xử lý trạng thái của delete mutation
  useEffect(() => {
    if (deleteUserMutation.isSuccess) {
      if (!deleteToastShownRef.current) {
        toast.success("Đã xóa nhân viên thành công");
        deleteToastShownRef.current = true;
      }
      usersQuery.refetch(); // Refetch users to get the latest data
      setDeleteDialogOpen(false);
      setStaffToDelete(null);
      setTimeout(() => {
        deleteUserMutation.reset();
        deleteToastShownRef.current = false;
      }, 100);
    } else if (deleteUserMutation.isError) {
      toast.error((deleteUserMutation.error as CustomAPIResponse)?.message ?? "Lỗi khi xóa nhân viên");
    }
  }, [deleteUserMutation.isSuccess, deleteUserMutation.isError, deleteUserMutation.error, usersQuery, deleteUserMutation]);

  // Reset pagination khi filter thay đổi
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.resetPagination();
    }
  }, [filterCriteria]);

  // Lọc staff theo các tiêu chí
  const filteredStaffs = useMemo(() => {
    // Apply global search
    let filtered = staffs.filter((staff) => filterByGlobalSearch(staff, searchTerm));

    // Apply all filter criteria
    if (filterCriteria.length > 0) {
      filtered = filtered.filter((staff) => {
        return filterCriteria.every((criteria) => {
          switch (criteria.field) {
            case "birth_date_range":
              return filterByDateRange(staff, criteria.value as { from: Date; to: Date });
            case "status":
              return filterByStatus(staff, criteria.value as string);
            case "gender":
              return filterByGender(staff, criteria.value as string);
            default:
              return true;
          }
        });
      });
    }

    return filtered;
  }, [staffs, searchTerm, filterCriteria]);

  // Mở form thêm mới
  const handleAdd = () => {
    setSelectedStaff(undefined);
    setIsModalOpen(true);
  };

  // Mở form chỉnh sửa
  const handleEdit = (staff: StaffUser) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  // CRUD Operations
  const handleCreateStaff = (staffData: StaffRequest) => {
    // Ensure phone is not undefined for the transform function
    const transformedData = transformRegisterRequest({
      ...staffData,
      role: ROLES.STAFF,
      phone: staffData.phone ?? "",
    });

    registerMutation.mutate({
      body: transformedData,
    });
  };

  const handleUpdateStaff = (staffData: StaffRequest) => {
    if (!selectedStaff) return;

    const transformedData = transformUserUpdateRequest({
      ...staffData,
      id: selectedStaff.id,
      role: ROLES.STAFF,
    });

    updateUserMutation.mutate({
      params: { path: { userId: selectedStaff.id } },
      body: transformedData,
    });
  };

  // Hiển thị Dialog xác nhận xóa
  const confirmDelete = (staff: StaffUser) => {
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
  };

  const handleDeleteStaff = () => {
    if (!staffToDelete) return;

    deleteUserMutation.mutate({
      params: { path: { userId: staffToDelete.id } },
    });
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (usersQuery.isLoading) {
    return <LoadingSpinner name="nhân viên" />;
  }

  // Filter configuration - sử dụng FilterGroup giống như Member
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

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="space-y-4">
          {/* Title and Add button */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle className="text-2xl font-bold">Quản lý nhân viên</CardTitle>
            <Button onClick={handleAdd} className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhân viên
            </Button>
          </div>

          {/* Search and Filter row */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            {/* SearchBar */}{" "}
            <SearchBar
              searchOptions={searchOptions}
              onSearchChange={setSearchTerm}
              placeholder="Tìm kiếm theo ID, tên, email, số điện thoại hoặc địa chỉ..."
              className="w-full sm:w-1/2"
              resetPagination={() => tableRef.current?.resetPagination()}
            />
            {/* Filter - Right */}
            <div className="shrink-0">
              <Filter
                filterOptions={filterGroups}
                onFilterChange={(criteria) => {
                  setFilterCriteria(criteria);
                  // Reset pagination khi filter thay đổi
                  if (tableRef.current) {
                    tableRef.current.resetPagination();
                  }
                }}
                groupMode={true}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {usersQuery.isLoading ? (
            <LoadingSpinner name="nhân viên..." />
          ) : (
            <StaffTable ref={tableRef} staffs={filteredStaffs} onEdit={handleEdit} onDelete={confirmDelete} />
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Staff modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) setIsModalOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
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
