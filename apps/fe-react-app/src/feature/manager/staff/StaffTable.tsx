import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Staff } from "@/interfaces/staff.interface";
import { StaffStatus } from "@/interfaces/staff.interface";
import { Edit, Trash } from "lucide-react";

interface StaffTableProps {
  staffs: Staff[];
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
}

const getStatusDisplay = (status: StaffStatus) => {
  switch (status) {
    case StaffStatus.VERIFY:
      return { label: "Đã xác minh", className: "bg-green-100 text-green-800" };
    case StaffStatus.BAN:
      return { label: "Bị cấm", className: "bg-red-100 text-red-800" };
    case StaffStatus.UNVERIFY:
      return { label: "Chưa xác minh", className: "bg-gray-100 text-gray-800" };
    default:
      return { label: "Không xác định", className: "bg-yellow-100 text-yellow-800" };
  }
};

const StaffTable = ({ staffs, onEdit, onDelete }: StaffTableProps) => {
  return (
    <div className="w-full overflow-hidden rounded-lg">
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
            {staffs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  Không tìm thấy nhân viên
                </TableCell>
              </TableRow>
            ) : (
              staffs.map((staff) => {
                const { label, className } = getStatusDisplay(staff.status);
                return (
                  <TableRow key={staff.staff_id}>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.date_of_birth || "Chưa cập nhật"}</TableCell>
                    <TableCell>{staff.phone || "Chưa cập nhật"}</TableCell>
                    <TableCell>{staff.address || "Chưa cập nhật"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(staff)}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(staff)}>
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

export default StaffTable;
