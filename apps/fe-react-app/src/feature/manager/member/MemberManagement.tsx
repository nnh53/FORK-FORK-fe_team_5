import { Filter, type FilterCriteria } from "@/components/shared/Filter";
import { SearchBar, type SearchCriteria } from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Member, MemberFormData } from "@/interfaces/member.interface";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import MemberForm from "./MemberForm";
import MemberTable from "./MemberTable";
import { createMember, deleteMember, getMembers, updateMember } from "./services/memberApi";

// Helper functions để giảm complexity
const filterBySearch = (member: Member, criteria: SearchCriteria): boolean => {
  if (!criteria.value) return true;
  switch (criteria.field) {
    case "id":
      return member.member_id.toString().includes(criteria.value);
    case "name":
      return member.name.toLowerCase().includes(criteria.value.toLowerCase());
    case "phone":
      return member.phone?.toLowerCase().includes(criteria.value.toLowerCase()) || false;
    case "email":
      return member.email.toLowerCase().includes(criteria.value.toLowerCase());
    case "address":
      return member.address?.toLowerCase().includes(criteria.value.toLowerCase()) || false;
    default:
      return true;
  }
};

const filterByGlobalSearch = (member: Member, searchValue: string): boolean => {
  const lowerSearchValue = searchValue.toLowerCase();
  return (
    member.member_id.toString().includes(searchValue) ||
    member.name.toLowerCase().includes(lowerSearchValue) ||
    member.phone?.toLowerCase().includes(lowerSearchValue) ||
    member.email.toLowerCase().includes(lowerSearchValue) ||
    member.address?.toLowerCase().includes(lowerSearchValue)
  );
};

const filterByDateRange = (member: Member, range: { from: Date | undefined; to: Date | undefined }): boolean => {
  if (!range.from && !range.to) return true;

  const memberBirthDate = member.date_of_birth ? new Date(member.date_of_birth) : null;
  if (!memberBirthDate) return false;

  // Sửa logic để bao gồm cả ngày from và to (inclusive)
  return !(range.from && memberBirthDate < range.from) && !(range.to && memberBirthDate > range.to);
};

const filterByStatus = (member: Member, status: string): boolean => {
  return member.status.toLowerCase() === status.toLowerCase();
};

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria[]>([]);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Search options
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

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await getMembers();
      setMembers(data);
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

    // Áp dụng search criteria
    if (searchCriteria.length > 0) {
      result = result.filter((member) => {
        const globalSearchValue = searchCriteria[0]?.value;
        const isGlobalSearch = searchCriteria.every((c) => c.value === globalSearchValue);

        if (isGlobalSearch && globalSearchValue) {
          return filterByGlobalSearch(member, globalSearchValue);
        }

        return searchCriteria.every((criteria) => filterBySearch(member, criteria));
      });
    }

    // Áp dụng filter criteria
    if (filterCriteria.length > 0) {
      result = result.filter((member) => {
        return filterCriteria.every((criteria) => {
          switch (criteria.field) {
            case "birth_date_range": {
              const range = criteria.value as { from: Date | undefined; to: Date | undefined };
              return filterByDateRange(member, range);
            }
            case "status": {
              return filterByStatus(member, criteria.value as string);
            }
            default:
              return true;
          }
        });
      });
    }

    return result;
  }, [members, searchCriteria, filterCriteria]);

  const handleCreate = () => {
    setSelectedMember(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMember(undefined);
  };

  const handleSubmit = async (values: MemberFormData) => {
    try {
      if (selectedMember) {
        await updateMember({ ...selectedMember, ...values });
        toast.success("Cập nhật thành viên thành công");
      } else {
        await createMember(values);
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

  const handleDeleteClick = (member: Member) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (memberToDelete) {
      try {
        await deleteMember(memberToDelete.member_id);
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
              <CardTitle className="text-2xl font-bold">Danh sách thành viên</CardTitle>
              <Button onClick={handleCreate} className="shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Thêm thành viên
              </Button>
            </div>

            {/* Search and Filter row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* Search Bar - Left */}
              <div className="flex-1">
                <SearchBar searchOptions={searchOptions} onSearchChange={setSearchCriteria} maxSelections={5} placeholder="Tìm kiếm thành viên..." />
              </div>

              {/* Filter - Right */}
              <div className="shrink-0">
                <Filter filterOptions={filterOptions} onFilterChange={setFilterCriteria} />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <MemberTable members={filteredMembers} onEdit={handleEdit} onDelete={handleDeleteClick} />
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
            <DialogTitle>{selectedMember ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}</DialogTitle>
          </DialogHeader>
          <MemberForm member={selectedMember} onSubmit={handleSubmit} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>

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
    </>
  );
};

export default MemberManagement;
