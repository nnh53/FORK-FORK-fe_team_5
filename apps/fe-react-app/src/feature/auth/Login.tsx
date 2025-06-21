import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Beams from "../../../Reactbits/Beams/Beams";
import AuthFormContainer from "../../components/forms/AuthFormContainer";
import CheckboxForm from "../../components/forms/CheckboxForm";
import FormField from "../../components/forms/FormFields";
import { Logo } from "../../components/logo/Logo";
import { useAuth } from "../../hooks/useAuth";
import type { Role } from "../../interfaces/roles.interface";
import type { LoginDTO } from "../../interfaces/users.interface";
import { ROUTES } from "../../routes/route.constants";
import { loginValidationSchema } from "../../utils/validation.utils";
import { RoleRouteToEachPage } from "./RoleRoute";

// Mock user data for direct login
const mockUserData = {
  guest: {
    token: "mock-jwt-token-for-guest-user",
    roles: ["ROLE_GUEST" as Role],
    id: 1,
    username: "Guest User",
    refresh_token: "mock-refresh-token-for-guest-user",
  },
};

const Login: React.FC = () => {
  const { authLogin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginDTO) => {
    setIsLoading(true);
    try {
      // Mock login - check if email is guest@example.com
      if (data.email === "guest@example.com") {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Use mock data instead of API call
        const userData = mockUserData.guest;

        authLogin({
          token: userData.token,
          roles: userData.roles,
          id: userData.id,
          username: userData.username,
          refresh_token: userData.refresh_token,
        });

        toast.success("Login successfully!");
        setTimeout(() => {
          navigate(RoleRouteToEachPage(userData.roles[0]));
        }, 1000);
      } else {
        // For any other email, show error
        toast.error("Invalid email or password");
      }
    } catch (error) {
      const errorMessage = (error as Error).message || "An error occurred during login";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Beams Background */}
      <div className="absolute inset-0 z-0">
        <Beams beamWidth={5} beamHeight={30} beamNumber={20 } lightColor="#EE3F3F" speed={3} noiseIntensity={1.75} scale={0.2} rotation={30} />
      </div>
      {/* Login Form Overlay */}
      <AuthFormContainer transparent>
        <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white">Đăng Nhập</h3>
            <p className="text-white/80">Đăng nhập để trải nghiệm dịch vụ tốt nhất</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="email" label="Email" type="email" control={control} errors={errors} />
            <FormField name="password" label="Mật khẩu" type="password" control={control} errors={errors} />

            <div className="flex justify-between items-center">
              <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="text-sm text-blue-300 hover:text-blue-200 hover:underline">
                Quên mật khẩu?
              </Link>
              <CheckboxForm name="rememberMe" label="Ghi nhớ tôi" control={control} errors={errors} />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600/80 backdrop-blur-sm text-white py-2 rounded-md hover:bg-red-700/80 transition-all duration-300 disabled:opacity-50 border border-red-500/30"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <div className="text-center mt-4">
              <span className="text-sm text-white/70">Chưa có tài khoản? </span>
              <Link to={ROUTES.AUTH.REGISTER} className="text-sm text-blue-300 hover:text-blue-200 hover:underline">
                Đăng ký ngay
              </Link>
            </div>
          </form>
        </div>
      </AuthFormContainer>
    </div>
  );
};

export default Login;
