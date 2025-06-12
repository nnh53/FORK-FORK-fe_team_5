import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import type { Staff } from '../../../interfaces/staff.interface';
import { StaffStatus } from '../../../interfaces/staff.interface';

interface StaffTableProps {
  staffs: Staff[];
  onEdit: (staff: Staff) => void;
  onDelete: (id: string) => void;
}

const getStatusDisplay = (status: StaffStatus | string) => {
  switch (status) {
    case StaffStatus.VERIFY:
      return { label: 'Đã xác minh', className: 'bg-green-100 text-green-800' };
    case StaffStatus.BAN:
      return { label: 'Bị cấm', className: 'bg-red-100 text-red-800' };
    case StaffStatus.UNVERIFY:
      return { label: 'Chưa xác minh', className: 'bg-gray-100 text-gray-800' };
    default:
      return { label: 'Không xác định', className: 'bg-yellow-100 text-yellow-800' };
  }
};

const StaffTable = ({ staffs, onEdit, onDelete }: StaffTableProps) => {
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
          {staffs.length > 0 ? (
            staffs.map((staff, index) => {
              const { label, className } = getStatusDisplay(staff.status);
              return (
                <tr key={staff.staff_id} className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-red-100`}>
                  <td className="p-4 text-sm text-gray-900">{staff.name}</td>
                  <td className="p-4 text-sm text-gray-900">{staff.email}</td>
                  <td className="p-4 text-sm text-gray-900">{staff.date_of_birth || 'Chưa cập nhật'}</td>
                  <td className="p-4 text-sm text-gray-900">{staff.phone || 'Chưa cập nhật'}</td>
                  <td className="p-4 text-sm text-gray-900">{staff.address || 'Chưa cập nhật'}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => onEdit(staff)} className="text-blue-600 hover:text-blue-800 mr-4 transition-colors" title="Chỉnh sửa">
                      <EditIcon />
                    </button>
                    <button onClick={() => onDelete(staff.staff_id)} className="text-red-500 hover:text-red-600 transition-colors" title="Xóa">
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="p-6 text-center text-gray-500 text-sm">
                Không tìm thấy nhân viên
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
