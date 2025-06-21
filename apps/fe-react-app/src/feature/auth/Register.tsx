import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React, { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnimatedContent from "../../../Reactbits/AnimatedContent/AnimatedContent";
import Beams from "../../../Reactbits/Beams/Beams";
import FormField from "../../components/forms/FormFields";
import { API_URL } from "../../config/environments/endpoints";
import { ROUTES } from "../../routes/route.constants";
import { registerValidationSchema } from "../../utils/validation.utils";
import { Logo } from "../booking/components/HeaderTest";

interface RegisterFormData {
  fullName: string;
  dateOfBirth: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    if (data.password !== data.confirmPassword) {
      toast.error("Mật khẩu không khớp.");
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
        toast.success("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
        reset();
        setTimeout(() => {
          navigate(ROUTES.AUTH.LOGIN);
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ width: "100%", height: "100vh" }}>
        <Beams beamWidth={3} beamHeight={25} beamNumber={50} lightColor="#F52E2E" speed={3} noiseIntensity={1.3} scale={0.2} rotation={90} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatedContent
          reverse={true}
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
          <div className="w-full max-w-lg bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-white/30">
            <div className="text-center mb-6">
              <div className="inline-block">
                <Logo className="w-20 h-12 mx-auto" altText="F-Cinema Logo" logoText="" />
              </div>
            </div>{" "}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-900 text-center mb-6">Đăng Ký</h3>              {/* Row 1: Full Name & Date of Birth */}
              <div className="grid grid-cols-2 gap-4">
                <FormField name="fullName" label="Họ và tên" type="text" control={control} errors={errors} />
                <FormField name="dateOfBirth" label="Ngày sinh" type="date" control={control} errors={errors} isRequired={false} />
              </div>

              {/* Row 2: Email (full width) */}
              <FormField name="email" label="Email" type="email" control={control} errors={errors} />

              {/* Row 3: Password & Confirm Password */}
              <div className="grid grid-cols-2 gap-4">
                <FormField name="password" label="Mật khẩu" type="password" control={control} errors={errors} />
                <FormField name="confirmPassword" label="Xác nhận mật khẩu" type="password" control={control} errors={errors} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white/95 py-2 rounded-md hover:bg-red-700 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </button>

              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">Đã có tài khoản? </span>
                <Link to={ROUTES.AUTH.LOGIN} className="text-sm text-red-600 hover:text-red-800 hover:underline">
                  Đăng nhập ngay
                </Link>
              </div>
            </form>
          </div>
        </AnimatedContent>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
