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
import type { User, USER_GENDER, UserRequest, UserUpdate } from "@/interfaces/users.interface";
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
import { useMemo, useRef, useState } from "react";
import MemberDetail from "./MemberDetail";
import MemberForm from "./MemberForm";
import MemberTable from "./MemberTable";

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

// Hàm lọc tổng quát
const applyMemberFilters = (members: User[], criteria: FilterCriteria[], searchTerm: string): User[] => {
  let result = members;

  if (searchTerm) {
    result = result.filter((member) => filterByGlobalSearch(member, searchTerm));
  }

  return result.filter((member) =>
    criteria.every((criterion) => {
      switch (criterion.field) {
        case "birth_date_range":
          return filterByDateRange(member, criterion.field, criterion.value as { from: Date | undefined; to: Date | undefined });
        case "status":
          return filterByStatus(member, criterion.value as string);
        case "gender":
          return filterByGender(member, criterion.value as string);
        default:
          return true;
      }
    }),
  );
};

// Hàm lọc chi tiết
const filterByGlobalSearch = (member: User, searchValue: string): boolean => {
  if (!searchValue) return true;
  if (!member) return false;

  const lowerSearchValue = searchValue.toLowerCase();
  return (
    (member.id?.toString() ?? "").includes(searchValue.trim()) ||
    (member.fullName?.toLowerCase() ?? "").includes(lowerSearchValue.trim()) ||
    (member.email?.toLowerCase() ?? "").includes(lowerSearchValue.trim()) ||
    (member.phone?.toLowerCase() ?? "").includes(lowerSearchValue.trim()) ||
    (member.address?.toLowerCase() ?? "").includes(lowerSearchValue.trim()) ||
    (formatDateTime(member.dateOfBirth)?.toLowerCase() ?? "").includes(lowerSearchValue.trim()) ||
    (formatGender(member.gender)?.toLowerCase() ?? "").includes(lowerSearchValue.trim())
  );
};

const filterByDateRange = (member: User, field: string, range: { from: Date | undefined; to: Date | undefined }): boolean => {
  if (!range.from && !range.to) return true;
  if (!member) return false;

  const dateValue = field === "birth_date_range" && member.dateOfBirth ? new Date(member.dateOfBirth) : null;
  if (!dateValue) return false;

  return !(range.from && dateValue < range.from) && !(range.to && dateValue > range.to);
};

const filterByStatus = (member: User, status: string): boolean => {
  return (member.status?.toLowerCase() ?? "") === status.toLowerCase();
};

const filterByGender = (member: User, gender: string): boolean => {
  if (gender === "NOT_SET") return !member.gender;
  return member.gender === (gender as USER_GENDER);
};

// Định nghĩa nhóm filter
const filterGroups: FilterGroup[] = [
  { name: "dates", label: "Ngày tháng", options: [{ label: "Ngày sinh", value: "birth_date_range", type: "dateRange" }] },
  {
    name: "status",
    label: "Trạng thái",
    options: [
      {
        label: "Trạng thái",
        value: "status",
        type: "select",
        selectOptions: [
          { value: "ACTIVE", label: "Hoạt động" },
          { value: "INACTIVE", label: "Không hoạt động" },
          { value: "BANNED", label: "Bị cấm" },
        ],
        placeholder: "Chọn trạng thái",
      },
      {
        label: "Giới tính",
        value: "gender",
        type: "select",
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

const MemberManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [memberToView, setMemberToView] = useState<User | null>(null);
  const tableRef = useRef<{ resetPagination: () => void }>(null);

  // React Query hooks
  const usersQuery = useUsers();
  const registerMutation = useRegister();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Function reset pagination khi cần thiết
  const resetTablePagination = () => {
    tableRef.current?.resetPagination();
  };

  // Sử dụng custom hook cho mutation
  useMutationHandler(
    registerMutation,
    "Thêm thành viên thành công",
    "Lỗi khi thêm thành viên",
    () => {
      setIsModalOpen(false);
      setSelectedMember(undefined);
      resetTablePagination();
    },
    usersQuery.refetch,
    undefined,
    "register-member",
  );

  useMutationHandler(
    updateUserMutation,
    "Cập nhật thành viên thành công",
    "Lỗi khi cập nhật thành viên",
    () => {
      setIsModalOpen(false);
      setSelectedMember(undefined);
    },
    usersQuery.refetch,
    undefined,
    "update-member",
  );

  useMutationHandler(
    deleteUserMutation,
    "Xóa thành viên thành công",
    "Lỗi khi xóa thành viên",
    () => {
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
      resetTablePagination();
    },
    usersQuery.refetch,
    undefined,
    "delete-member",
  );

  // Định nghĩa các trường tìm kiếm
  const searchOptions: SearchOption[] = [
    { value: "fullName", label: "Tên" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Số điện thoại" },
    { value: "address", label: "Địa chỉ" },
  ];

  // Xử lý dữ liệu từ API và chuyển đổi thành members
  const members = useMemo(() => {
    if (usersQuery.data?.result) {
      const transformedUsers = Array.isArray(usersQuery.data.result)
        ? usersQuery.data.result.map(transformUserResponse)
        : [transformUserResponse(usersQuery.data.result)];
      return transformedUsers.filter((user) => user.role === ROLES.MEMBER);
    }
    return [];
  }, [usersQuery.data]);

  // Lọc members theocác tiêu chí
  const filteredMembers = useMemo(() => {
    if (!members) return [];
    return applyMemberFilters(members, filterCriteria, searchTerm);
  }, [members, searchTerm, filterCriteria]);

  const handleViewDetail = (member: User) => {
    setMemberToView(member);
    setDetailOpen(true);
  };

  const handleCreate = () => {
    setSelectedMember(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (member: User) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMember(undefined);
  };

  const handleSubmit = (values: UserRequest) => {
    if (selectedMember) {
      const updateData: UserUpdate = transformUserUpdateRequest({ ...values, role: ROLES.MEMBER });
      updateUserMutation.mutate({
        params: { path: { userId: selectedMember.id ?? "" } },
        body: updateData,
      });
    } else {
      const registerData: UserRequest = transformRegisterRequest({ ...values, role: ROLES.MEMBER, phone: values.phone ?? "" });
      registerMutation.mutate({ body: registerData });
    }
  };

  const handleDeleteClick = (member: User) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (memberToDelete) {
      deleteUserMutation.mutate({
        params: { path: { userId: memberToDelete.id ?? "" } },
      });
    }
  };

  if (usersQuery.isLoading) {
    return <LoadingSpinner name="thành viên" />;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="space-y-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <CardTitle className="text-2xl font-bold">Danh sách thành viên</CardTitle>
              <Button onClick={handleCreate} className="shrink-0">
                <Plus className="mr-2 h-4 w-4" /> Thêm thành viên
              </Button>
            </div>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <SearchBar
                searchOptions={searchOptions}
                onSearchChange={setSearchTerm}
                placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc địa chỉ..."
                className="w-full sm:w-1/2"
                resetPagination={resetTablePagination}
              />
              <div className="shrink-0">
                <Filter
                  filterOptions={filterGroups}
                  onFilterChange={(criteria) => {
                    setFilterCriteria(criteria);
                    resetTablePagination();
                  }}
                  groupMode={true}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MemberTable ref={tableRef} members={filteredMembers} onEdit={handleEdit} onDelete={handleDeleteClick} onView={handleViewDetail} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMember ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}</DialogTitle>
          </DialogHeader>
          <MemberForm member={selectedMember} onSubmit={handleSubmit} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa thành viên</AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc chắn muốn xóa thành viên này? Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MemberDetail member={memberToView} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </>
  );
};

export default MemberManagement;
