import AuthLogo from "@/components/auth/AuthLogo";
import NavigateButton from "@/components/shared/NavigateButton";
import { forgotPasswordValidationSchema } from "@/utils/validation.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { animated, useSpring, useTransition } from "@react-spring/web";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const slides = [
  "photo-1524985069026-dd778a71c7b4",
  "photo-1489599849927-2ee91cede3ba",
  "photo-1536440136628-1c6cb5a2a869",
  "photo-1542204637-e9f12f144cca",
];

interface ForgotPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ForgotPassword: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Background transition
  const transitions = useTransition(index, {
    key: index,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 3000 },
    onRest: (_a, _b, item) => {
      if (index === item) {
        setIndex((state) => (state + 1) % slides.length);
      }
    },
    exitBeforeEnter: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordValidationSchema),
  });

  const onSubmit = async () => {
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      // This is a placeholder for now - we'll implement this later
      // Instead of using Supabase, we'll just show a success message
      setMessage("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      setTimeout(() => navigate("/login"), 2000);
      reset();
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Page entrance animation
  const pageAnimation = useSpring({
    from: {
      opacity: 0,
      transform: "translateX(50px)",
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
      {/* Left Banner */}
      <div className="relative flex w-1/2 flex-col justify-center overflow-hidden bg-red-700 p-12 text-white">
        {transitions((style, i) => (
          <animated.div
            key={i}
            style={{
              ...style,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(https://images.unsplash.com/${slides[i]}?w=1920&q=80&auto=format&fit=crop)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold">Quên mật khẩu?</h2>
          <p className="text-lg">Tạo lại mật khẩu mới để tiếp tục trải nghiệm dịch vụ của chúng tôi</p>
        </div>
      </div>
      {/* Right Banner */}
      <div className="flex w-1/2 items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <AuthLogo />
            <h3 className="text-2xl font-semibold">Tạo mật khẩu mới</h3>
            <p className="text-gray-600">Nhập mật khẩu mới cho tài khoản của bạn</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md border border-red-400 bg-red-100 p-3 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-md border border-green-400 bg-green-100 p-3 text-sm text-green-700" role="alert">
                {message}
              </div>
            )}
            <div className="relative">
              <label htmlFor="password" className="mb-1 block text-left text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  placeholder="Nhập mật khẩu mới"
                  disabled={loading}
                  className={`w-full rounded-md border px-3 py-2 pr-10 focus:outline-none focus:ring-2 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : "border-blue-300 hover:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                >
                  <img
                    src={showPassword ? "/icons/eye-open.svg" : "/icons/eye-closed.svg"}
                    alt="toggle password visibility"
                    className="h-5 w-5 cursor-pointer"
                  />
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message as string}</p>}
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="mb-1 block text-left text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={loading}
                  className={`w-full rounded-md border px-3 py-2 pr-10 focus:outline-none focus:ring-2 ${
                    errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-blue-300 hover:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onMouseDown={() => setShowConfirmPassword(true)}
                  onMouseUp={() => setShowConfirmPassword(false)}
                  onMouseLeave={() => setShowConfirmPassword(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
                >
                  <img
                    src={showConfirmPassword ? "/icons/eye-open.svg" : "/icons/eye-closed.svg"}
                    alt="toggle password visibility"
                    className="h-5 w-5 cursor-pointer"
                  />
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message as string}</p>}
            </div>
            <NavigateButton to="/" text="Đổi mật khẩu" className="text-red w-full rounded-md bg-red-600 py-2 transition-colors hover:bg-red-700" />

            <div className="mt-4 text-center">
              <NavigateButton text="Quay lại đăng nhập" to="/login" className="mx-auto text-sm text-red-600 hover:underline" />
            </div>
          </form>
        </div>
      </div>
    </animated.div>
  );
};

export default ForgotPassword;
