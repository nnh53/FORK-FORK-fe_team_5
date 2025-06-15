import { SearchBar } from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const searchOptions = [
    { label: "Tên", value: "name" },
    { label: "Số điện thoại", value: "phone" },
    { label: "Email", value: "email" },
    { label: "Ngày sinh", value: "date_of_birth" },
    { label: "Địa chỉ", value: "address" },
    { label: "Trạng thái", value: "status" },
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
    return members.filter((member) => {
      switch (searchType) {
        case "phone":
          return member.phone?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        case "email":
          return member.email.toLowerCase().includes(searchTerm.toLowerCase());
        case "date_of_birth":
          return member.date_of_birth?.includes(searchTerm) || false;
        case "address":
          return member.address?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        case "status":
          return member.status.toLowerCase().includes(searchTerm.toLowerCase());
        default:
          return member.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
  }, [members, searchTerm, searchType]);

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
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Danh sách thành viên</h2>
        <div className="flex items-center gap-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchType={searchType}
            setSearchType={setSearchType}
            searchOptions={searchOptions}
          />
          <Button onClick={handleCreate} className="bg-red-500 hover:bg-red-600">
            <Plus className="mr-2 h-4 w-4" />
            Thêm thành viên
          </Button>
        </div>
      </div>

      <MemberTable members={filteredMembers} onEdit={handleEdit} onDelete={handleDeleteClick} />

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
    </div>
  );
};

export default MemberManagement;
