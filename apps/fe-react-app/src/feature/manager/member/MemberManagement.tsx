import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Filter, type FilterCriteria, type FilterGroup } from "@/components/shared/Filter";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchBar, type SearchOption } from "@/components/shared/SearchBar";
import type { StaffRegisterDTO, UserBase } from "@/interfaces/users.interface";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import MemberDetail from "./MemberDetail";
import MemberForm from "./MemberForm";
import MemberTable from "./MemberTable";
import { createMember, deleteMember, getMembers, updateMember } from "./services/memberApi";

// Sửa lại hàm filterByGlobalSearch để xử lý undefined/null
const filterByGlobalSearch = (member: UserBase, searchValue: string): boolean => {
  if (!searchValue) return true;
  if (!member) return false;

  const lowerSearchValue = searchValue.toLowerCase();
  return (
    (member.id?.toString() || "").includes(searchValue.trim()) ||
    (member.full_name?.toLowerCase() || "").includes(lowerSearchValue.trim()) ||
    (member.email?.toLowerCase() || "").includes(lowerSearchValue.trim())
  );
};

// Sửa lại các hàm filter khác
const filterByDateRange = (member: UserBase, field: string, range: { from: Date | undefined; to: Date | undefined }): boolean => {
  if (!range.from && !range.to) return true;
  if (!member) return false;

  let dateValue;
  switch (field) {
    case "birth_date_range":
      dateValue = member.date_of_birth ? new Date(member.date_of_birth) : null;
      break;
    case "created_date_range":
      dateValue = member.createdAt ? new Date(member.createdAt) : null;
      break;
    case "updated_date_range":
      dateValue = member.updatedAt ? new Date(member.updatedAt) : null;
      break;
    default:
      return true;
  }

  if (!dateValue) return false;

  return !(range.from && dateValue < range.from) && !(range.to && dateValue > range.to);
};

const filterByStatus = (member: UserBase, status: string): boolean => {
  return member.status_name.toLowerCase() === status.toLowerCase();
};

const filterByMembership = (member: UserBase, level: string): boolean => {
  if (level === "none") return member.membershipLevel === null;
  return member.membershipLevel === level;
};

const filterByActive = (member: UserBase, active: string): boolean => {
  return member.is_active === parseInt(active);
};

const filterBySubscription = (member: UserBase, subscription: string): boolean => {
  return member.is_subscription === parseInt(subscription);
};

const filterByNumberRange = (member: UserBase, field: string, range: { min?: number; max?: number }): boolean => {
  if (!range.min && !range.max) return true;

  let value;
  switch (field) {
    case "loyalty_point_range":
      value = member.loyalty_point;
      break;
    case "total_spent_range":
      value = member.totalSpent;
      break;
    default:
      return true;
  }

  return (range.min === undefined || value >= range.min) && (range.max === undefined || value <= range.max);
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
      {
        label: "Ngày tạo",
        value: "created_date_range",
        type: "dateRange" as const,
      },
      {
        label: "Ngày cập nhật",
        value: "updated_date_range",
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
          { value: "UNVERIFY", label: "Chưa xác minh" },
        ],
        placeholder: "Chọn trạng thái",
      },
      {
        label: "Kích hoạt",
        value: "active",
        type: "select" as const,
        selectOptions: [
          { value: "1", label: "Đã kích hoạt" },
          { value: "0", label: "Chưa kích hoạt" },
        ],
        placeholder: "Chọn trạng thái kích hoạt",
      },
      {
        label: "Đăng ký thông báo",
        value: "subscription",
        type: "select" as const,
        selectOptions: [
          { value: "1", label: "Đã đăng ký" },
          { value: "0", label: "Chưa đăng ký" },
        ],
        placeholder: "Chọn trạng thái đăng ký",
      },
    ],
  },
  {
    name: "membership",
    label: "Thành viên",
    options: [
      {
        label: "Hạng thành viên",
        value: "membership",
        type: "select" as const,
        selectOptions: [
          { value: "none", label: "Không có" },
          { value: "Silver", label: "Silver" },
          { value: "Gold", label: "Gold" },
          { value: "Platinum", label: "Platinum" },
          { value: "Diamond", label: "Diamond" },
        ],
        placeholder: "Chọn hạng thành viên",
      },
      {
        label: "Điểm tích lũy",
        value: "loyalty_point_range",
        type: "numberRange" as const,
        numberRangeConfig: {
          min: 0,
          max: 1000,
          step: 50,
          fromPlaceholder: "Từ điểm",
          toPlaceholder: "Đến điểm",
        },
      },
      {
        label: "Tổng chi tiêu",
        value: "total_spent_range",
        type: "numberRange" as const,
        numberRangeConfig: {
          min: 0,
          max: 5000000,
          step: 100000,
          fromPlaceholder: "Từ số tiền",
          toPlaceholder: "Đến số tiền",
          suffix: " đ",
        },
      },
    ],
  },
];

const MemberManagement = () => {
  const [members, setMembers] = useState<UserBase[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<UserBase | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<UserBase | null>(null);
  const [viewDetailOpen, setViewDetailOpen] = useState(false);
  const [memberToView, setMemberToView] = useState<UserBase | null>(null);
  const tableRef = useRef<{ resetPagination: () => void }>(null);

  // Định nghĩa các trường tìm kiếm
  const searchOptions: SearchOption[] = [
    { value: "id", label: "ID" },
    { value: "full_name", label: "Tên" },
    { value: "email", label: "Email" },
  ];

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await getMembers();
      // Filter to only show members with role_name "Member"
      const memberData = data.filter((member) => member.role_name === "MEMBER");
      setMembers(memberData);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách thành viên");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

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
            case "birth_date_range":
            case "created_date_range":
            case "updated_date_range": {
              const range = criteria.value as { from: Date | undefined; to: Date | undefined };
              return filterByDateRange(member, criteria.field, range);
            }
            case "status": {
              return filterByStatus(member, criteria.value as string);
            }
            case "membership": {
              return filterByMembership(member, criteria.value as string);
            }
            case "active": {
              return filterByActive(member, criteria.value as string);
            }
            case "subscription": {
              return filterBySubscription(member, criteria.value as string);
            }
            case "loyalty_point_range":
            case "total_spent_range": {
              const range = criteria.value as { min?: number; max?: number };
              return filterByNumberRange(member, criteria.field, range);
            }
            default:
              return true;
          }
        });
      });
    }

    return result;
  }, [members, searchTerm, filterCriteria]);

  const handleCreate = () => {
    setSelectedMember(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (member: UserBase) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMember(undefined);
  };

  const handleView = (member: UserBase) => {
    setMemberToView(member);
    setViewDetailOpen(true);
  };

  const handleSubmit = async (values: StaffRegisterDTO | UserBase) => {
    try {
      // Ensure role_name is always "Member"
      const memberData = {
        ...values,
        role_name: "MEMBER",
      };

      if (selectedMember) {
        await updateMember({ ...selectedMember, ...memberData } as UserBase);
        toast.success("Cập nhật thành viên thành công");
      } else {
        await createMember(memberData as StaffRegisterDTO);
        toast.success("Thêm thành viên thành công");
      }
      setIsModalOpen(false);
      setSelectedMember(undefined);
      fetchMembers();
    } catch (error) {
      console.error("Lỗi khi lưu thành viên:", error);
      toast.error("Lỗi khi lưu thành viên");
    }
  };

  const handleDeleteClick = (member: UserBase) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (memberToDelete) {
      try {
        await deleteMember(memberToDelete.id);
        toast.success("Xóa thành viên thành công");
        fetchMembers();
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
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <LoadingSpinner size={40} className="text-primary mb-4" />
        <p className="text-gray-500 text-lg">Đang tải dữ liệu thành viên...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="space-y-4">
            {/* Title and Add button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-2xl font-bold">Danh sách thành viên</CardTitle>
              <Button onClick={handleCreate} className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Thêm thành viên
              </Button>
            </div>

            {/* Search and Filter row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* SearchBar - Thêm resetPagination prop */}
              <SearchBar
                searchOptions={searchOptions}
                onSearchChange={setSearchTerm}
                placeholder="Tìm kiếm theo ID, tên hoặc email..."
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
            <MemberTable ref={tableRef} members={filteredMembers} onEdit={handleEdit} onDelete={handleDeleteClick} onView={handleView} />
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

      {/* Member Detail Dialog - using the new component */}
      {memberToView && (
        <Dialog open={viewDetailOpen} onOpenChange={setViewDetailOpen}>
          <MemberDetail member={memberToView} />
        </Dialog>
      )}
    </>
  );
};

export default MemberManagement;
