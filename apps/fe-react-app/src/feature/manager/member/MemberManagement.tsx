import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Filter, type FilterCriteria, type FilterGroup } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchBar, type SearchOption } from "@/components/shared/SearchBar";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import MemberDetail from "./MemberDetail";
import MemberForm from "./MemberForm";
import MemberTable from "./MemberTable";

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

// Sửa lại hàm filterByGlobalSearch để xử lý undefined/null và bổ sung tìm theo giới tính, ngày sinh
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

// Sửa lại các hàm filter khác
const filterByDateRange = (member: User, field: string, range: { from: Date | undefined; to: Date | undefined }): boolean => {
  if (!range.from && !range.to) return true;
  if (!member) return false;

  let dateValue = null;
  if (field === "birth_date_range") {
    dateValue = member.dateOfBirth ? new Date(member.dateOfBirth) : null;
  } else {
    return true;
  }

  if (!dateValue) return false;

  return !(range.from && dateValue < range.from) && !(range.to && dateValue > range.to);
};

const filterByStatus = (member: User, status: string): boolean => {
  return member.status.toLowerCase() === status.toLowerCase();
};

const filterByGender = (member: User, gender: string): boolean => {
  if (gender === "NOT_SET") {
    return !member.gender; // Trả về true nếu member.gender là null hoặc undefined
  }
  return member.gender === (gender as USER_GENDER);
};

// Cập nhật định nghĩa nhóm filter
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

const MemberManagement = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
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

  // Định nghĩa các trường tìm kiếm
  const searchOptions: SearchOption[] = [
    { value: "id", label: "ID" },
    { value: "fullName", label: "Tên" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Số điện thoại" },
    { value: "address", label: "Địa chỉ" },
  ];

  useEffect(() => {
    console.log(usersQuery.status);
    if (usersQuery.data?.result) {
      // Transform API response to User[] and filter for MEMBER role
      let transformedUsers: User[] = [];

      if (Array.isArray(usersQuery.data.result)) {
        transformedUsers = usersQuery.data.result.map(transformUserResponse).filter((user) => user.role === ROLES.MEMBER);
      } else if (usersQuery.data.result) {
        const user = transformUserResponse(usersQuery.data.result);
        if (user.role === ROLES.MEMBER) {
          transformedUsers = [user];
        }
      }

      setMembers(transformedUsers);
    }
    setLoading(usersQuery.isLoading);
  }, [usersQuery.data, usersQuery.isLoading, usersQuery.error, usersQuery.isError, usersQuery.isSuccess]);

  const filteredMembers = useMemo(() => {
    if (!members) return [];

    let result = members;

    // Tìm kiếm đã giới hạn trong hàm filterByGlobalSearch
    if (searchTerm) {
      result = result.filter((member) => filterByGlobalSearch(member, searchTerm));
    }

    // Áp dụng filter criteria
    if (filterCriteria.length > 0) {
      result = result.filter((member) => {
        return filterCriteria.every((criteria) => {
          switch (criteria.field) {
            case "birth_date_range": {
              const range = criteria.value as { from: Date | undefined; to: Date | undefined };
              return filterByDateRange(member, criteria.field, range);
            }
            case "status": {
              return filterByStatus(member, criteria.value as string);
            }
            case "gender": {
              return filterByGender(member, criteria.value as string);
            }
            default:
              return true;
          }
        });
      });
    }

    return result;
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

  const handleSubmit = async (values: UserRequest) => {
    try {
      if (selectedMember) {
        // Update existing member
        const updateData: UserUpdate = transformUserUpdateRequest({
          ...values,
          role: ROLES.MEMBER,
        });

        await updateUserMutation.mutateAsync({
          params: { path: { userId: selectedMember.id } },
          body: updateData,
        });

        toast.success("Cập nhật thành viên thành công");
      } else {
        // Create new member
        const registerData: UserRequest = transformRegisterRequest({
          ...values,
          role: ROLES.MEMBER,
          phone: values.phone ?? "",
        });

        await registerMutation.mutateAsync({
          body: registerData,
        });

        toast.success("Thêm thành viên thành công");
      }
      setIsModalOpen(false);
      setSelectedMember(undefined);
      usersQuery.refetch();
    } catch (error) {
      console.error("Lỗi khi lưu thành viên:", error);
      toast.error("Lỗi khi lưu thành viên");
    }
  };

  const handleDeleteClick = (member: User) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (memberToDelete) {
      try {
        await deleteUserMutation.mutateAsync({
          params: { path: { userId: memberToDelete.id } },
        });

        toast.success("Xóa thành viên thành công");
        usersQuery.refetch();
      } catch (error) {
        console.error("Lỗi khi xóa thành viên:", error);
        toast.error("Lỗi khi xóa thành viên");
      }
    }
    setDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  // Cập nhật phần loading
  if (loading) {
    return <LoadingSpinner name="thành viên" />;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="space-y-4">
            {/* Title and Add button */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <CardTitle className="text-2xl font-bold">Danh sách thành viên</CardTitle>
              <Button onClick={handleCreate} className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Thêm thành viên
              </Button>
            </div>

            {/* Search and Filter row */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              {/* SearchBar - Thêm resetPagination prop */}
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
            <MemberTable ref={tableRef} members={filteredMembers} onEdit={handleEdit} onDelete={handleDeleteClick} onView={handleViewDetail} />
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMember ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}</DialogTitle>
          </DialogHeader>
          <MemberForm member={selectedMember} onSubmit={handleSubmit} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa thành viên</DialogTitle>
          </DialogHeader>
          <p>Bạn có chắc chắn muốn xóa thành viên này? Hành động này không thể hoàn tác.</p>
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

      {/* Member Detail Dialog */}
      <MemberDetail member={memberToView} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </>
  );
};

export default MemberManagement;
