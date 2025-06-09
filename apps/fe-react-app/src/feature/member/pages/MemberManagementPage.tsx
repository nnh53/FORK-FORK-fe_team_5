import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { useGetMembers, useCreateMember, useUpdateMember, useDeleteMember } from '../hooks/useMemberQueries';
import type { Member } from '../types';
import Modal from '../../../components/ui/modal';

interface MemberFormProps {
  onSubmit: (memberData: Omit<Member, 'member_id' | 'password'>) => void;
  initialData?: Partial<Member>;
}

const MemberForm = forwardRef(({ onSubmit, initialData }: MemberFormProps, ref) => {
  const [name, setName] = useState(initialData?.name ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [phone, setPhone] = useState(initialData?.phone ?? '');
  const [address, setAddress] = useState(initialData?.address ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.date_of_birth ?? '');
  const [identityCard, setIdentityCard] = useState(initialData?.identity_card ?? '');
  const [gender, setGender] = useState(initialData?.gender ?? false);
  const [role, setRole] = useState(initialData?.role ?? 'customer');

  const handleSubmit = () => {
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

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="flex text-sm font-semibold text-gray-700">Họ và tên*</label>
        <input
          type="text"
          placeholder="VD: Trần Văn Phượng"
          className="w-full border border-gray-300 rounded-md p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="flex text-sm font-semibold text-gray-700">Email*</label>
        <input
          type="email"
          placeholder="VD: acv@gmail.com"
          className="w-full border border-gray-300 rounded-md p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="flex text-sm font-semibold text-gray-700">Số điện thoại</label>
        <input
          type="tel"
          placeholder="VD: 09xxxx"
          className="w-full border border-gray-300 rounded-md p-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label className="flex text-sm font-semibold text-gray-700">Địa chỉ</label>
        <input
          type="text"
          placeholder="VD: TP HCM"
          className="w-full border border-gray-300 rounded-md p-2"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div>
        <label className="flex text-sm font-semibold text-gray-700">Ngày sinh</label>
        <input
          type="text"
          placeholder="YYYY-MM-DD"
          className="w-full border border-gray-300 rounded-md p-2"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </div>
      <div>
        <label className="flex text-sm font-semibold text-gray-700">CCCD/CMND</label>
        <input
          type="text"
          placeholder="VD: 097xxxx"
          className="w-full border border-gray-300 rounded-md p-2"
          value={identityCard}
          onChange={(e) => setIdentityCard(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-4">
        <label className="text-lg font-medium">Gender</label>
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            className={`px-4 py-2 transition-colors ${gender ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setGender(true)}
          >
            Nam
          </button>
          <button
            className={`px-4 py-2 transition-colors ${!gender ? 'bg-pink-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setGender(false)}
          >
            Nữ
          </button>
        </div>
      </div>
      <div>
        <label className="flex text-sm font-semibold text-gray-700">Vai trò</label>
        <select className="w-full border border-gray-300 rounded-md p-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
      </div>
    </div>
  );
});

const MemberManagementPage: React.FC = () => {
  const { data: members, isLoading, error, refetch } = useGetMembers();
  const createMemberMutation = useCreateMember();
  const updateMemberMutation = useUpdateMember();
  const deleteMemberMutation = useDeleteMember();

  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<{ handleSubmit: () => void }>(null);

  const handleAddNew = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleSubmitForm = async (memberData: Omit<Member, 'member_id' | 'password'>) => {
    try {
      if (editingMember) {
        await updateMemberMutation.mutateAsync({ ...editingMember, ...memberData });
        alert('Cập nhật thành viên thành công! 🎉');
      } else {
        await createMemberMutation.mutateAsync(memberData);
        alert('Thêm thành viên mới thành công! 🎉');
      }
      setIsModalOpen(false);
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
        <h1 className="text-4xl font-bold">Quản Lý Thành Viên </h1>
        <button className="btn btn-primary bg-red-500 text-white px-4 py-2 rounded-md shadow-sm" onClick={handleAddNew}>
          Thêm Thành Viên Mới +
        </button>
      </div>

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
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingMember ? 'Sửa thông tin thành viên' : 'Thêm thành viên mới'}
          onSubmit={() => formRef.current?.handleSubmit()}
          submitLabel={editingMember ? 'Sửa' : 'Thêm'}
        >
          <MemberForm ref={formRef} onSubmit={handleSubmitForm} initialData={editingMember || undefined} />
        </Modal>
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
