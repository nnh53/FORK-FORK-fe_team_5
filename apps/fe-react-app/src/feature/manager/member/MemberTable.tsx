import type { Member } from "@/interfaces/member.interface";
import { MemberStatus } from "@/interfaces/member.interface";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

interface MemberTableProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

const getStatusDisplay = (status: MemberStatus | string) => {
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
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-red-50">
          <tr>
            <th className="p-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Tên</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Email</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Ngày sinh</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Số điện thoại</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Địa chỉ</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">Trạng thái</th>
            <th className="p-4 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {members.length > 0 ? (
            members.map((member, index) => {
              const { label, className } = getStatusDisplay(member.status);
              return (
                <tr
                  key={member.member_id}
                  className={`transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-red-100`}
                >
                  <td className="p-4 text-sm text-gray-900">{member.name}</td>
                  <td className="p-4 text-sm text-gray-900">{member.email}</td>
                  <td className="p-4 text-sm text-gray-900">{member.date_of_birth || "Chưa cập nhật"}</td>
                  <td className="p-4 text-sm text-gray-900">{member.phone || "Chưa cập nhật"}</td>
                  <td className="p-4 text-sm text-gray-900">{member.address || "Chưa cập nhật"}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => onEdit(member)} className="text-blue-600 hover:text-blue-800 mr-4 transition-colors" title="Chỉnh sửa">
                      <EditIcon />
                    </button>
                    <button onClick={() => onDelete(member.member_id)} className="text-red-500 hover:text-red-600 transition-colors" title="Xóa">
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="p-6 text-center text-gray-500 text-sm">
                Không tìm thấy thành viên
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
