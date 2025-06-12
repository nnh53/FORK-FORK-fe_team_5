import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Staff, StaffFormData } from '../../../interfaces/staff.interface';
import { StaffStatus } from '../../../interfaces/staff.interface'; // Import enum as value
interface StaffFormProps {
  staff?: Staff;
  onSubmit: (values: StaffFormData) => void;
  onCancel: () => void;
}

const StaffForm = ({ staff, onSubmit, onCancel }: StaffFormProps) => {
  const { control, handleSubmit, reset } = useForm<StaffFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      address: '',
      date_of_birth: '',
      identity_card: '',
      status: StaffStatus.VERIFY, // Default status
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (staff) {
      reset(staff);
    }
  }, [staff, reset]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Tên là bắt buộc' }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên*</label>
                <input
                  {...field}
                  type="text"
                  placeholder="VD: Trần Văn Phượng"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
              </div>
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{ required: 'Email là bắt buộc', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email không hợp lệ' } }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  {...field}
                  type="email"
                  placeholder="VD: acv@gmail.com"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
              </div>
            )}
          />
          <Controller
            name="phone"
            control={control}
            rules={{ pattern: { value: /^\d{9,11}$/, message: 'Số điện thoại phải từ 9 đến 11 chữ số' } }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  {...field}
                  type="tel"
                  placeholder="VD: 09xxxx"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
              </div>
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Mật khẩu là bắt buộc' }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu*</label>
                <div className="relative">
                  <input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                      error ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
              </div>
            )}
          />
          <Controller
            name="address"
            control={control}
            rules={{ required: 'Địa chỉ là bắt buộc' }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ*</label>
                <input
                  {...field}
                  type="text"
                  placeholder="VD: 123 Đường Láng, Hà Nội"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
              </div>
            )}
          />
          <Controller
            name="date_of_birth"
            control={control}
            rules={{ required: 'Ngày sinh là bắt buộc' }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh*</label>
                <input
                  {...field}
                  type="date"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
              </div>
            )}
          />
          <Controller
            name="identity_card"
            control={control}
            rules={{ pattern: { value: /^\d{9,12}$/, message: 'CCCD/CMND phải từ 9 đến 12 chữ số' } }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CCCD/CMND</label>
                <input
                  {...field}
                  type="text"
                  placeholder="VD: 097xxxx"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
              </div>
            )}
          />
          <Controller
            name="status"
            control={control}
            rules={{ required: 'Trạng thái là bắt buộc' }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái*</label>
                <select
                  {...field}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value={StaffStatus.VERIFY}>Đã xác minh</option>
                  <option value={StaffStatus.BAN}>Bị cấm</option>
                  <option value={StaffStatus.UNVERIFY}>Chưa xác minh</option>
                </select>
                {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
              </div>
            )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Hủy
          </button>
          <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            {staff ? 'Cập nhật' : 'Tạo'} Nhân viên
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;
