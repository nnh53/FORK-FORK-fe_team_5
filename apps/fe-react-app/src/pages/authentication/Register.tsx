import { yupResolver } from "@hookform/resolvers/yup";
import { animated, useSpring } from "@react-spring/web";
import axios from "axios";
import React, { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormField from "../../components/forms/FormFields";
import { Logo } from "../../components/logo/Logo";
import BannerTransition from "../../components/shared/BannerTransition";
import { API_URL } from "../../config/environments/endpoints";
import { registerValidationSchema } from "../../utils/validation.utils";

interface RegisterFormData {
  fullName: string;
  dateOfBirth: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Cinema-related images for background transition
const slides = [
  "photo-1524985069026-dd778a71c7b4",
  "photo-1489599849927-2ee91cede3ba",
  "photo-1536440136628-1c6cb5a2a869",
  "photo-1542204637-e9f12f144cca",
];

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerValidationSchema) as Resolver<RegisterFormData>,
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setMessage(null);
    setLoading(true);
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      // Using our mock API instead of Supabase
      const response = await axios.post(`${API_URL}/users/register`, {
        email: data.email,
        password: data.password,
        full_name: data.fullName,
        date_of_birth: data.dateOfBirth,
      });

      if (response.status === 200) {
        setMessage("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
        reset();
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Page entrance animation
  const pageAnimation = useSpring({
    from: {
      opacity: 0,
      transform: "translateX(-50px)",
    },
    to: {
      opacity: 1,
      transform: "translateX(0px)",
    },
    config: {
      tension: 280,
      friction: 20,
    },
  });

  return (
    <animated.div style={pageAnimation} className="flex h-screen">
      {/* Left Banner*/}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-4" />
            <h3 className="text-2xl font-semibold">Đăng Ký</h3>
            <p className="text-gray-600">Tạo tài khoản mới để trải nghiệm dịch vụ tốt nhất</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md" role="alert">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded-md" role="alert">
                {message}
              </div>
            )}

            <FormField name="fullName" label="Họ và tên" type="text" control={control} errors={errors} />

            <FormField name="dateOfBirth" label="Ngày sinh" type="date" control={control} errors={errors} isRequired={false} />

            <FormField name="email" label="Email" type="email" control={control} errors={errors} />

            <FormField name="password" label="Mật khẩu" type="password" control={control} errors={errors} />

            <FormField name="confirmPassword" label="Xác nhận mật khẩu" type="password" control={control} errors={errors} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors justify-center"
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">Đã có tài khoản? </span>
              <a href="/login" className="text-red-600 hover:underline">
                Đăng nhập ngay
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Right Banner with Animated Background */}
      <BannerTransition slides={slides}>
        <h2 className="text-3xl font-bold">Tham gia cùng chúng tôi</h2>
        <p className="text-lg">Khám phá thế giới điện ảnh đầy màu sắc với hàng ngàn bộ phim hấp dẫn</p>
      </BannerTransition>
    </animated.div>
  );
};

export default Register;
