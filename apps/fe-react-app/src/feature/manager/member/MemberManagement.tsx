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

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const searchOptions = [
    { label: "Tên", value: "name", type: "text" as const },
    { label: "Số điện thoại", value: "phone", type: "text" as const },
    { label: "Email", value: "email", type: "text" as const },
    {
      label: "Ngày sinh",
      value: "date_of_birth",
      type: "date" as const,
    },
    { label: "Địa chỉ", value: "address", type: "text" as const },
    {
      label: "Trạng thái",
      value: "status",
      type: "select" as const,
      selectOptions: [
        { value: "VERIFY", label: "Đã xác minh" },
        { value: "BAN", label: "Bị cấm" },
        { value: "UNVERIFY", label: "Chưa xác minh" },
      ],
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
    if (!members || searchCriteria.length === 0) return members;

    return members.filter((member) => {
      return searchCriteria.every((criteria) => {
        if (!criteria.value) return true; // Bỏ qua criteria không có giá trị

        switch (criteria.field) {
          case "name":
            return member.name.toLowerCase().includes((criteria.value as string).toLowerCase());
          case "phone":
            return member.phone?.toLowerCase().includes((criteria.value as string).toLowerCase()) || false;
          case "email":
            return member.email.toLowerCase().includes((criteria.value as string).toLowerCase());
          case "date_of_birth":
            if (criteria.value instanceof Date) {
              return member.date_of_birth?.includes(criteria.value.toISOString().split("T")[0]) || false;
            }
            return member.date_of_birth?.includes(criteria.value as string) || false;
          case "address":
            return member.address?.toLowerCase().includes((criteria.value as string).toLowerCase()) || false;
          case "status":
            return member.status.toLowerCase() === (criteria.value as string).toLowerCase();
          default:
            return true;
        }
      });
    });
  }, [members, searchCriteria]);

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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">Danh sách thành viên</CardTitle>
            <div className="flex items-center gap-4">
              <SearchBar searchOptions={searchOptions} onSearchChange={setSearchCriteria} maxSelections={6} />
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm thành viên
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <MemberTable members={filteredMembers} onEdit={handleEdit} onDelete={handleDeleteClick} />
          </CardContent>
        </Card>
      </div>{" "}
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
