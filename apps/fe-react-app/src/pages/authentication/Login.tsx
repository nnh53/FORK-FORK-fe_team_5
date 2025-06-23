import AnimatedContent from "@/components/Reactbits/reactbit-animations/AnimatedContent/AnimatedContent";
import Beams from "@/components/Reactbits/reactbit-backgrounds/Beams/Beams";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckboxForm from "../../components/forms/CheckboxForm";
import FormField from "../../components/forms/FormFields";
import AnimatedButton from "../../components/shared/AnimatedButton";
import NavigateButton from "../../components/shared/NavigateButton";
import { RoleRouteToEachPage } from "../../feature/auth/RoleRoute";
import { Logo } from "../../feature/booking/components/Header";
import { useAuth } from "../../hooks/useAuth";
import type { Role } from "../../interfaces/roles.interface";
import type { LoginDTO } from "../../interfaces/users.interface";
import { ROUTES } from "../../routes/route.constants";
import { loginValidationSchema } from "../../utils/validation.utils";

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
      if (data.email === "guest@example.com") {
        await new Promise((resolve) => setTimeout(resolve, 500));

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
      <div className="absolute inset-0 z-0" style={{ width: "100%", height: "100vh" }}>
        <Beams beamWidth={3} beamHeight={50} beamNumber={50} lightColor="#F52E2E" speed={3} noiseIntensity={1.3} scale={0.2} rotation={90} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatedContent
          distance={230}
          direction="horizontal"
          duration={3}
          ease="power3.out"
          delay={0.8}
          scale={0}
          initialOpacity={0.1}
          animateOpacity={true}
          threshold={0.1}
        >
          <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-white/30">
            <div className="text-center mb-6">
              <div className="inline-block">
                <Logo className="w-20 h-12 mx-auto" altText="F-Cinema Logo" logoText="" />
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField name="email" label="Email" type="email" control={control} errors={errors} />
              <FormField name="password" label="Mật khẩu" type="password" control={control} errors={errors} />{" "}
              <div className="flex justify-between items-center">
                <NavigateButton
                  to={ROUTES.AUTH.FORGOT_PASSWORD}
                  text="Quên mật khẩu?"
                  className="text-sm text-red-600 hover:text-red-800 hover:underline"
                />

                <CheckboxForm name="rememberMe" label="Ghi nhớ tôi" control={control} errors={errors} />
              </div>{" "}
              <AnimatedButton
                type="submit"
                text="Đăng nhập"
                loadingText="Đang đăng nhập..."
                loading={isLoading}
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-all duration-300 disabled:opacity-50"
              />
              <div className="text-center mt-4">
                <span className="text-sm text-brown-600">Chưa có tài khoản? </span>
                <NavigateButton to={ROUTES.AUTH.REGISTER} text="Đăng ký ngay" className="text-sm text-red-600 hover:text-red-800 hover:underline" />
              </div>
            </form>
          </div>
        </AnimatedContent>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
