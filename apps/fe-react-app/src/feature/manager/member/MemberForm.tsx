import { Button } from "@/components/Shadcn/ui/button";
import { DatePicker } from "@/components/Shadcn/ui/date-picker"; // Import DatePicker
import { DialogFooter } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import type { Member, MemberFormData } from "@/interfaces/member.interface";
import { MemberStatus } from "@/interfaces/member.interface";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface MemberFormProps {
  member?: Member;
  onSubmit: (values: MemberFormData) => void;
  onCancel: () => void;
}

const MemberForm = ({ member, onSubmit, onCancel }: MemberFormProps) => {
  const { control, handleSubmit, reset } = useForm<MemberFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      date_of_birth: "",
      identity_card: "",
      status: MemberStatus.UNVERIFY,
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (member) {
      reset(member);
    }
  }, [member, reset]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="name"
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
        <Controller
          name="phone"
          control={control}
          rules={{ pattern: { value: /^\d{9,11}$/, message: "Số điện thoại phải từ 9 đến 11 chữ số" } }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <Input {...field} type="tel" placeholder="VD: 09xxxx" className={error ? "border-red-500" : ""} />
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </div>
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: "Mật khẩu là bắt buộc" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu*</label>
              <div className="relative">
                <Input {...field} type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" className={error ? "border-red-500" : ""} />
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
          name="address"
          control={control}
          rules={{ required: "Địa chỉ là bắt buộc" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ*</label>
              <Input {...field} placeholder="VD: 123 Đường Láng, Hà Nội" className={error ? "border-red-500" : ""} />
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
                disabled={false}
                placeholder="Chọn ngày sinh"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </div>
          )}
        />
        <Controller
          name="identity_card"
          control={control}
          rules={{ pattern: { value: /^\d{9,12}$/, message: "CCCD/CMND phải từ 9 đến 12 chữ số" } }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CCCD/CMND</label>
              <Input {...field} placeholder="VD: 097xxxx" className={error ? "border-red-500" : ""} />
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
            </div>
          )}
        />
        <Controller
          name="status"
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
                  <SelectItem value={MemberStatus.VERIFY}>Đã xác minh</SelectItem>
                  <SelectItem value={MemberStatus.BAN}>Bị cấm</SelectItem>
                  <SelectItem value={MemberStatus.UNVERIFY}>Chưa xác minh</SelectItem>
                </SelectContent>
              </Select>
              {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
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
