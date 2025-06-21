import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnimatedContent from "../../../Reactbits/AnimatedContent/AnimatedContent";
import Beams from "../../../Reactbits/Beams/Beams";
import FormField from "../../components/forms/FormFields";
import AnimatedButton from "../../components/shared/AnimatedButton";
import NavigateButton from "../../components/shared/NavigateButton";
import { ROUTES } from "../../routes/route.constants";
import { forgotPasswordValidationSchema } from "../../utils/validation.utils";
import { Logo } from "../booking/components/HeaderTest";

interface ForgotPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordValidationSchema),
  });
  const onSubmit = async () => {
    setLoading(true);
    try {
      toast.success("Đổi mật khẩu thành công!");
      setTimeout(() => navigate(ROUTES.AUTH.LOGIN), 2000);
      reset();
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
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

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <FormField name="password" label="Mật khẩu mới" type="password" control={control} errors={errors} />
              <FormField name="confirmPassword" label="Xác nhận mật khẩu" type="password" control={control} errors={errors} />{" "}
              
              <AnimatedButton
                type="submit"
                text="Đổi mật khẩu"
                loadingText="Đang đổi mật khẩu..."
                loading={loading}
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-all duration-300 disabled:opacity-50"
              />

              <div className="text-center mt-4">

                <NavigateButton
                  text="Quay lại đăng nhập"
                  to={ROUTES.AUTH.LOGIN}
                  className="text-sm text-red-600 hover:text-red-800 hover:underline"
                />

              </div>
            </form>
          </div>

        </AnimatedContent>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ForgotPassword;
