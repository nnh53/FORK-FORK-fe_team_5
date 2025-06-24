import { Button } from "@/components/Shadcn/ui/button";
import { DatePicker } from "@/components/Shadcn/ui/date-picker";
import { DialogFooter } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import type { StaffRegisterDTO, USER_STATUS, UserBase } from "@/interfaces/users.interface";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface MemberFormProps {
  member?: UserBase;
  onSubmit: (values: StaffRegisterDTO | UserBase) => void;
  onCancel: () => void;
}

const MemberForm = ({ member, onSubmit, onCancel }: MemberFormProps) => {
  const { control, handleSubmit, reset } = useForm<StaffRegisterDTO | UserBase>({
    defaultValues: member || {
      full_name: "",
      email: "",
      date_of_birth: "",
      password: "", // Changed from null to empty string
      is_active: 1,
      is_subscription: 0,
      status_name: "UNVERIFY" as USER_STATUS,
      avatar_url: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (member) {
      // Convert null password to empty string when resetting form
      reset({
        ...member,
        password: member.password || "", // Convert null to empty string
      });
    }
  }, [member, reset]);

  return (
    <div className="space-y-4">
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
            pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email không hợp lệ" },
          }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
              <Input {...field} type="email" placeholder="VD: acv@gmail.com" className={error ? "border-red-500" : ""} />
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </div>
          )}
        />
        {!member && (
          <Controller
            name="password"
            control={control}
            rules={{ required: "Mật khẩu là bắt buộc" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu*</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    className={error ? "border-red-500" : ""}
                    value={field.value || ""} // Fix: Ensure value is never null
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
        )}
        <Controller
          name="date_of_birth"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                setDate={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                disabled={false}
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
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kích hoạt</label>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái kích hoạt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Đã kích hoạt</SelectItem>
                  <SelectItem value="0">Chưa kích hoạt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <Controller
          name="is_subscription"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đăng ký nhận thông báo</label>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái đăng ký" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Đã đăng ký</SelectItem>
                  <SelectItem value="0">Chưa đăng ký</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>
          {member ? "Cập nhật" : "Thêm"} Thành viên
        </Button>
      </DialogFooter>
    </div>
  );
};

export default MemberForm;
