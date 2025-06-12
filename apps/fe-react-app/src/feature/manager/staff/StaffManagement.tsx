import { Add as AddIcon } from "@mui/icons-material";
import { Alert, CircularProgress, Dialog, Snackbar } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import type { Staff, StaffFormData } from "../../../interfaces/staff.interface";
import { createStaff, deleteStaff, getStaffs, updateStaff } from "./services/staffApi";
import StaffForm from "./StaffForm";
import StaffTable from "./StaffTable";

const StaffManagement = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const searchOptions = [
    { label: "Tên", value: "name" },
    { label: "Số điện thoại", value: "phone" },
    { label: "Email", value: "email" },
    { label: "Ngày sinh", value: "date_of_birth" },
    { label: "Địa chỉ", value: "address" },
  ];

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const data = await getStaffs();
      setStaffs(data);
    } catch (err) {
      setError("Lỗi khi tải danh sách nhân viên");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const filteredStaffs = useMemo(() => {
    if (!staffs) return [];
    return staffs.filter((staff) => {
      switch (searchType) {
        case "phone":
          return staff.phone?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        case "email":
          return staff.email.toLowerCase().includes(searchTerm.toLowerCase());
        case "date_of_birth":
          return staff.date_of_birth?.includes(searchTerm) || false;
        case "address":
          return staff.address?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        case "status":
          return staff.status?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        default:
          return staff.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
  }, [staffs, searchTerm, searchType]);

  const handleCreate = () => {
    setSelectedStaff(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedStaff(undefined);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (values: StaffFormData) => {
    try {
      if (selectedStaff) {
        await updateStaff({ ...selectedStaff, ...values });
        showSnackbar("Cập nhật nhân viên thành công", "success");
      } else {
        await createStaff(values);
        showSnackbar("Tạo nhân viên thành công", "success");
      }
      setIsModalOpen(false);
      setSelectedStaff(undefined);
      fetchStaffs();
    } catch (error) {
      console.error("Lỗi khi lưu nhân viên:", error);
      showSnackbar("Lỗi khi lưu nhân viên", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        await deleteStaff(id);
        showSnackbar("Xóa nhân viên thành công", "success");
        fetchStaffs();
      } catch (error) {
        console.error("Lỗi khi xóa nhân viên:", error);
        showSnackbar("Lỗi khi xóa nhân viên", "error");
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
        <h2 className="text-2xl font-bold text-gray-800">Danh sách nhân viên</h2>
        <div className="flex items-center gap-4">
          {/* <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchType={searchType}
            setSearchType={setSearchType}
            searchOptions={searchOptions}
          /> */}
          <button onClick={handleCreate} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            <AddIcon className="mr-2" />
            Thêm nhân viên
          </button>
        </div>
      </div>

      <StaffTable staffs={filteredStaffs} onEdit={handleEdit} onDelete={handleDelete} />

      <Dialog open={isModalOpen} onClose={handleCancel} maxWidth="md" fullWidth>
        <StaffForm staff={selectedStaff} onSubmit={handleSubmit} onCancel={handleCancel} />
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StaffManagement;
