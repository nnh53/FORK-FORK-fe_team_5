// src/feature/member/pages/MemberManagementPage.tsx
import React, { useState } from 'react';
import { useGetMembers, useCreateMember, useUpdateMember, useDeleteMember } from '../hooks/useMemberQueries';
import { Member } from '../types'; // Adjust path if necessary

// Component Form (có thể tách ra file riêng nếu phức tạp hơn)
interface MemberFormProps {
  onSubmit: (memberData: Omit<Member, 'member_id' | 'password'>) => void; // Không cần member_id, password khi submit
  initialData?: Partial<Member>; // Dữ liệu ban đầu cho form (khi edit)
  onCancel: () => void;
  isEdit?: boolean;
}

const MemberForm: React.FC<MemberFormProps> = ({ onSubmit, initialData, onCancel, isEdit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.date_of_birth || '');
  const [identityCard, setIdentityCard] = useState(initialData?.identity_card || '');
  const [gender, setGender] = useState(initialData?.gender === undefined ? false : initialData.gender); // Mặc định là false (Female)
  const [role, setRole] = useState(initialData?.role || 'customer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Tên và Email là bắt buộc.');
      return;
    }
    onSubmit({
      name,
      email,
      phone,
      address,
      date_of_birth: dateOfBirth,
      identity_card: identityCard,
      gender,
      role,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 mb-8 bg-base-200 rounded-xl shadow-md">
      <h3 className="text-2xl font-semibold mb-4">{isEdit ? 'Chỉnh Sửa Thành Viên' : 'Thêm Thành Viên Mới'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">
            <span className="label-text">Tên*</span>
          </label>
          <input
            type="text"
            placeholder="Tên"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Email*</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Số điện thoại</span>
          </label>
          <input
            type="tel"
            placeholder="Số điện thoại"
            className="input input-bordered w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Địa chỉ</span>
          </label>
          <input
            type="text"
            placeholder="Địa chỉ"
            className="input input-bordered w-full"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Ngày sinh</span>
          </label>
          <input
            type="text"
            placeholder="YYYY-MM-DD"
            className="input input-bordered w-full"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">CMND/CCCD</span>
          </label>
          <input
            type="text"
            placeholder="CMND/CCCD"
            className="input input-bordered w-full"
            value={identityCard}
            onChange={(e) => setIdentityCard(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Giới tính (Nam nếu chọn)</span>
          </label>
          <input type="checkbox" className="toggle toggle-primary" checked={gender} onChange={(e) => setGender(e.target.checked)} />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Vai trò</span>
          </label>
          <select className="select select-bordered w-full" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className="btn btn-primary">
          {isEdit ? 'Cập Nhật' : 'Thêm Mới'}
        </button>
      </div>
    </form>
  );
};

const MemberManagementPage: React.FC = () => {
  const { data: members, isLoading, error, refetch } = useGetMembers();
  const createMemberMutation = useCreateMember();
  const updateMemberMutation = useUpdateMember();
  const deleteMemberMutation = useDeleteMember();

  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddNew = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setShowForm(true);
    window.scrollTo(0, 0); // Cuộn lên đầu trang để thấy form
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  const handleSubmitForm = async (memberData: Omit<Member, 'member_id' | 'password'>) => {
    try {
      if (editingMember) {
        // Chế độ Edit
        await updateMemberMutation.mutateAsync({ ...editingMember, ...memberData });
        alert('Cập nhật thành viên thành công! 🎉');
      } else {
        // Chế độ Create
        // API mock có thể cần trường password, thêm một password mặc định ở service nếu cần
        await createMemberMutation.mutateAsync(memberData);
        alert('Thêm thành viên mới thành công! 🎉');
      }
      setShowForm(false);
      setEditingMember(null);
    } catch (err) {
      console.error('Lỗi khi lưu thành viên:', err);
      alert(`Lỗi: ${editingMember ? 'cập nhật' : 'thêm mới'} thành viên thất bại.`);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      try {
        await deleteMemberMutation.mutateAsync(id);
        alert('Xóa thành viên thành công! 🗑️');
      } catch (err) {
        console.error('Lỗi khi xóa thành viên:', err);
        alert('Xóa thành viên thất bại.');
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="ml-4 text-xl">Đang tải danh sách thành viên...</p>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Lỗi tải danh sách thành viên: {error.message}</span>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Quản Lý Thành Viên 🧑‍🤝‍🧑</h1>
        <button className="btn btn-primary btn-md shadow-lg" onClick={handleAddNew}>
          Thêm Thành Viên Mới +
        </button>
      </div>

      {showForm && (
        <MemberForm
          onSubmit={handleSubmitForm}
          initialData={editingMember || undefined} // Nếu editingMember là null thì initialData là undefined
          onCancel={handleCancelForm}
          isEdit={!!editingMember}
        />
      )}

      <div className="overflow-x-auto bg-base-100 shadow-xl rounded-xl">
        <table className="table table-zebra w-full">
          <thead className="bg-base-300">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Tên</th>
              <th className="p-4">Email</th>
              <th className="p-4">Điện thoại</th>
              <th className="p-4">Giới tính</th>
              <th className="p-4">Vai trò</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {members && members.length > 0 ? (
              members.map((member) => (
                <tr key={member.member_id} className="hover">
                  <td className="p-4 font-mono text-xs">{member.member_id}</td>
                  <td className="p-4 font-semibold">{member.name}</td>
                  <td className="p-4">{member.email}</td>
                  <td className="p-4">{member.phone}</td>
                  <td className="p-4">{member.gender ? 'Nam' : 'Nữ'}</td>
                  <td className="p-4">
                    <span
                      className={`badge ${
                        member.role === 'manager' ? 'badge-primary' : member.role === 'employee' ? 'badge-secondary' : 'badge-accent'
                      } badge-lg`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4 space-x-2 text-center">
                    <button className="btn btn-sm btn-info" onClick={() => handleEdit(member)}>
                      Sửa ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeleteMember(member.member_id)}
                      disabled={deleteMemberMutation.isPending && deleteMemberMutation.variables === member.member_id}
                    >
                      {deleteMemberMutation.isPending && deleteMemberMutation.variables === member.member_id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        'Xóa 🗑️'
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-8 text-lg">
                  Không tìm thấy thành viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-center">
        <button className="btn btn-outline btn-accent" onClick={() => refetch()} disabled={isLoading}>
          {isLoading ? <span className="loading loading-spinner loading-xs"></span> : 'Làm Mới Dữ Liệu 🔄'}
        </button>
      </div>
    </div>
  );
};

export default MemberManagementPage;
