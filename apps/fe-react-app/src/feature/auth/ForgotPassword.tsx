import { yupResolver } from '@hookform/resolvers/yup';
import { animated, useSpring, useTransition } from '@react-spring/web';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Logo } from '../../components/logo/Logo';
import { supaClient } from '../../services/supabase';
import { forgotPasswordValidationSchema } from '../../utils/validation.utils';

const slides = [
  'photo-1524985069026-dd778a71c7b4',
  'photo-1489599849927-2ee91cede3ba',
  'photo-1536440136628-1c6cb5a2a869',
  'photo-1542204637-e9f12f144cca',
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

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      // Nếu user đã đăng nhập, có thể dùng updateUser
      const { error: updateError } = await supaClient.auth.updateUser({ password: data.password });
      if (updateError) {
        setError(updateError.message || 'Đổi mật khẩu thất bại.');
      } else {
        setMessage('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
        toast.success('Đổi mật khẩu thành công!');
        setTimeout(() => navigate('/login'), 2000);
        reset();
      }
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Page entrance animation
  const pageAnimation = useSpring({
    from: {
      opacity: 0,
      transform: 'translateX(50px)',
    },
    to: {
      opacity: 1,
      transform: 'translateX(0px)',
    },
    config: {
      tension: 280,
      friction: 20,
    },
  });

  return (
    <animated.div style={pageAnimation} className="flex h-screen">
      {/* Left Banner */}
      <div className="w-1/2 bg-red-700 text-white flex flex-col justify-center p-12 relative overflow-hidden">
        {transitions((style, i) => (
          <animated.div
            key={i}
            style={{
              ...style,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(https://images.unsplash.com/${slides[i]}?w=1920&q=80&auto=format&fit=crop)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold">Quên mật khẩu?</h2>
          <p className="text-lg">Tạo lại mật khẩu mới để tiếp tục trải nghiệm dịch vụ của chúng tôi</p>
        </div>
      </div>
      {/* Right Banner */}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-4" />
            <h3 className="text-2xl font-semibold">Tạo mật khẩu mới</h3>
            <p className="text-gray-600">Nhập mật khẩu mới cho tài khoản của bạn</p>
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
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left mb-1">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password')}
                  placeholder="Nhập mật khẩu mới"
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-blue-300 hover:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                <a
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <img
                    src={showPassword ? '/icons/eye-open.svg' : '/icons/eye-closed.svg'}
                    alt="toggle password visibility"
                    className="w-5 h-5 cursor-pointer"
                  />
                </a>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>}
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 text-left mb-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-blue-300 hover:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                <a
                  onMouseDown={() => setShowConfirmPassword(true)}
                  onMouseUp={() => setShowConfirmPassword(false)}
                  onMouseLeave={() => setShowConfirmPassword(false)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <img
                    src={showConfirmPassword ? '/icons/eye-open.svg' : '/icons/eye-closed.svg'}
                    alt="toggle password visibility"
                    className="w-5 h-5 cursor-pointer"
                  />
                </a>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message as string}</p>}
            </div>
            <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors" disabled={loading}>
              {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </button>
            <div className="text-center mt-4">
              <a href="/login" className="text-sm text-red-600 hover:underline">
                Quay lại đăng nhập
              </a>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </animated.div>
  );
};

export default ForgotPassword;
