import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Member } from "@/interfaces/member.interface";
import { MemberStatus } from "@/interfaces/member.interface";
import { Edit, Trash } from "lucide-react";

interface MemberTableProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

const getStatusDisplay = (status: MemberStatus) => {
  switch (status) {
    case MemberStatus.VERIFY:
      return { label: "Đã xác minh", className: "bg-green-100 text-green-800" };
    case MemberStatus.BAN:
      return { label: "Bị cấm", className: "bg-red-100 text-red-800" };
    case MemberStatus.UNVERIFY:
      return { label: "Chưa xác minh", className: "bg-gray-100 text-gray-800" };
    default:
      return { label: "Không xác định", className: "bg-yellow-100 text-yellow-800" };
  }
};

const MemberTable = ({ members, onEdit, onDelete }: MemberTableProps) => {
  return (
    <div className="w-full overflow-hidden rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-red-50 hover:bg-red-100">
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  Không tìm thấy thành viên
                </TableCell>
              </TableRow>
            ) : (
              members.map((member, index) => {
                const { label, className } = getStatusDisplay(member.status);
                return (
                  <TableRow key={member.member_id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.date_of_birth || "Chưa cập nhật"}</TableCell>
                    <TableCell>{member.phone || "Chưa cập nhật"}</TableCell>
                    <TableCell>{member.address || "Chưa cập nhật"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(member)}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(member)}>
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MemberTable;
