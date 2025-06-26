import { Button } from "@/components/Shadcn/ui/button";
import { DatePicker } from "@/components/Shadcn/ui/date-picker";
import { DialogFooter } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Shadcn/ui/tabs";
import type { Staff, StaffFormData } from "@/interfaces/staff.interface";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface StaffFormProps {
  staff?: Staff;
  onSubmit: (values: StaffFormData) => void;
  onCancel: () => void;
}

const StaffForm = ({ staff, onSubmit, onCancel }: StaffFormProps) => {
  const { control, handleSubmit, reset } = useForm<StaffFormData>({
    defaultValues: {
      full_name: "",
      email: "",
      date_of_birth: "",
      password: "", // Sử dụng chuỗi rỗng thay vì null
      is_active: 1,
      role_name: "STAFF",
      status_name: "ACTIVE",
      avatar_url: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (staff) {
      reset({
        full_name: staff.full_name,
        email: staff.email,
        date_of_birth: staff.date_of_birth,
        password: staff.password || "", // Đảm bảo password không null
        is_active: staff.is_active,
        role_name: staff.role_name,
        status_name: staff.status_name,
        avatar_url: staff.avatar_url,
        createdAt: staff.createdAt,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [staff, reset]);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="account">Tài khoản</TabsTrigger>
        </TabsList>

        {/* Tab thông tin cơ bản */}
        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="full_name"
              control={control}
              rules={{ required: "Tên là bắt buộc" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên*</label>
                  <Input {...field} placeholder="VD: Trần Văn Phượng" className={error ? "border-red-500" : ""} />
                  {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                </div>
              )}
            />
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email là bắt buộc",
                pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{1,63}\.[a-zA-Z]{2,}$/, message: "Email không hợp lệ" },
              }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <Input {...field} type="email" placeholder="VD: acv@gmail.com" className={error ? "border-red-500" : ""} />
                  {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                </div>
              )}
            />
            <Controller
              name="date_of_birth"
              control={control}
              rules={{ required: "Ngày sinh là bắt buộc" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh*</label>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                    placeholder="Chọn ngày sinh"
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                </div>
              )}
            />
            <Controller
              name="avatar_url"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Ảnh đại diện</label>
                  <Input {...field} placeholder="https://example.com/avatar.jpg" className={error ? "border-red-500" : ""} />
                  {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                </div>
              )}
            />
          </div>
        </TabsContent>

        {/* Tab tài khoản */}
        <TabsContent value="account" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="password"
              control={control}
              rules={{ required: staff ? false : "Mật khẩu là bắt buộc" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu{!staff && "*"}</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={staff ? "Nhập để thay đổi mật khẩu" : "Nhập mật khẩu"}
                      className={error ? "border-red-500" : ""}
                      value={field.value || ""} // Đảm bảo giá trị không null
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                </div>
              )}
            />
            <Controller
              name="role_name"
              control={control}
              rules={{ required: "Vai trò là bắt buộc" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò*</label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={error ? "border-red-500" : ""}>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANAGER">Quản lý</SelectItem>
                      <SelectItem value="STAFF">Nhân viên</SelectItem>
                    </SelectContent>
                  </Select>
                  {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                </div>
              )}
            />
            <Controller
              name="status_name"
              control={control}
              rules={{ required: "Trạng thái là bắt buộc" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái*</label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={error ? "border-red-500" : ""}>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Đã xác minh</SelectItem>
                      <SelectItem value="BAN">Bị cấm</SelectItem>
                      <SelectItem value="UNVERIFY">Chưa xác minh</SelectItem>
                    </SelectContent>
                  </Select>
                  {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                </div>
              )}
            />
            <Controller
              name="is_active"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái kích hoạt</label>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                    <SelectTrigger className={error ? "border-red-500" : ""}>
                      <SelectValue placeholder="Chọn trạng thái kích hoạt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Đã kích hoạt</SelectItem>
                      <SelectItem value="0">Chưa kích hoạt</SelectItem>
                    </SelectContent>
                  </Select>
                  {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                </div>
              )}
            />
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          {staff ? "Cập nhật" : "Thêm"} Nhân viên
        </Button>
      </DialogFooter>
    </div>
  );
};

export default StaffForm;
