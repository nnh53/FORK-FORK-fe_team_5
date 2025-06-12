import { Add as AddIcon } from '@mui/icons-material';
import { Alert, CircularProgress, Dialog, Snackbar } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import SearchBar from '../../../components/shared/SearchBar';
import type { Member, MemberFormData } from '../../../interfaces/member.interface';
import MemberForm from './MemberForm';
import MemberTable from './MemberTable';
import { createMember, deleteMember, getMembers, updateMember } from './services/memberApi';

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const searchOptions = [
    { label: 'Tên', value: 'name' },
    { label: 'Số điện thoại', value: 'phone' },
    { label: 'Email', value: 'email' },
    { label: 'Ngày sinh', value: 'date_of_birth' },
    { label: 'Địa chỉ', value: 'address' },
    { label: 'Trạng thái', value: 'status' },
  ];

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (err) {
      setError('Lỗi khi tải danh sách thành viên');
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
        case 'phone':
          return member.phone?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        case 'email':
          return member.email.toLowerCase().includes(searchTerm.toLowerCase());
        case 'date_of_birth':
          return member.date_of_birth?.includes(searchTerm) || false;
        case 'address':
          return member.address?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        case 'status':
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

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (values: MemberFormData) => {
    try {
      if (selectedMember) {
        await updateMember({ ...selectedMember, ...values });
        showSnackbar('Cập nhật thành viên thành công', 'success');
      } else {
        await createMember(values);
        showSnackbar('Tạo thành viên thành công', 'success');
      }
      setIsModalOpen(false);
      setSelectedMember(undefined);
      fetchMembers();
    } catch (error) {
      console.error('Lỗi khi lưu thành viên:', error);
      showSnackbar('Lỗi khi lưu thành viên', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      try {
        await deleteMember(id);
        showSnackbar('Xóa thành viên thành công', 'success');
        fetchMembers();
      } catch (error) {
        console.error('Lỗi khi xóa thành viên:', error);
        showSnackbar('Lỗi khi xóa thành viên', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
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
          <button onClick={handleCreate} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            <AddIcon className="mr-2" />
            Thêm thành viên
          </button>
        </div>
      </div>

      <MemberTable members={filteredMembers} onEdit={handleEdit} onDelete={handleDelete} />

      <Dialog open={isModalOpen} onClose={handleCancel} maxWidth="md" fullWidth>
        <MemberForm member={selectedMember} onSubmit={handleSubmit} onCancel={handleCancel} />
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MemberManagement;
