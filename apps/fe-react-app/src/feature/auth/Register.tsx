import { yupResolver } from '@hookform/resolvers/yup';
import { animated, useSpring, useTransition } from '@react-spring/web';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Logo } from '../../components/logo/Logo';
import NavigateButton from '../../components/shared/NavigateButton';
import { supaClient } from '../../services/supabase';
import { registerValidationSchema } from '../../utils/validation.utils';

interface RegisterFormData {
  fullName: string;
  dateOfBirth: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Cinema-related images for background transition
const slides = [
  'photo-1524985069026-dd778a71c7b4',
  'photo-1489599849927-2ee91cede3ba',
  'photo-1536440136628-1c6cb5a2a869',
  'photo-1542204637-e9f12f144cca',
];

const Register: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Background transition using useTransition
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
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerValidationSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setMessage(null);
    setLoading(true);
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      const { data: signUpData, error: authError } = await supaClient.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            date_of_birth: data.dateOfBirth,
          },
        },
      });
      if (authError) {
        setError(authError.message);
      } else if (signUpData.user) {
        if (signUpData.user.identities && signUpData.user.identities.length > 0 && !signUpData.user.email_confirmed_at) {
          setMessage(`Đăng ký thành công! Vui lòng kiểm tra ${signUpData.user.email} để xác nhận email.`);
        } else {
          setMessage('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
        }
        reset();
      } else {
        setMessage('Đăng ký đã được gửi. Nếu bật xác nhận email, vui lòng kiểm tra email.');
      }
    } catch (e: any) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Page entrance animation
  const pageAnimation = useSpring({
    from: {
      opacity: 0,
      transform: 'translateX(-50px)',
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
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 text-left mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                {...register('fullName')}
                placeholder="Nhập họ và tên"
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                  ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-blue-300 hover:border-blue-500 focus:ring-blue-500'}`}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 text-left mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                id="dateOfBirth"
                {...register('dateOfBirth')}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                  ${errors.dateOfBirth ? 'border-red-500 focus:ring-red-500' : 'border-blue-300 hover:border-blue-500 focus:ring-blue-500'}`}
              />
              {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                placeholder="Nhập email của bạn"
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                  ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-blue-300 hover:border-blue-500 focus:ring-blue-500'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password')}
                  placeholder="Nhập mật khẩu"
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10
                    ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-blue-300 hover:border-blue-500 focus:ring-blue-500'}`}
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
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
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
                  placeholder="Nhập lại mật khẩu"
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10
                    ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-blue-300 hover:border-blue-500 focus:ring-blue-500'}`}
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
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <NavigateButton
              text={loading ? 'Đang đăng ký...' : 'Đăng ký'}
              to="#"
              className="w-full bg-red-600 text-red py-2 rounded-md hover:bg-red-700 transition-colors justify-center"
              type="submit"
              disabled={loading}
            />
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">Đã có tài khoản? </span>
              <a href="/login">
                Đăng nhập ngay
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Right Banner with Animated Background */}
      <div className="w-1/2 bg-red-700 text-white flex flex-col justify-center p-12 relative overflow-hidden">
        {/* Animated Background Images */}
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

        {/* Dark Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50" style={{ zIndex: 1 }} />

        {/* Text Overlay */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold">Tham gia cùng chúng tôi</h2>
          <p className="text-lg">Khám phá thế giới điện ảnh đầy màu sắc với hàng ngàn bộ phim hấp dẫn</p>
        </div>
      </div>
    </animated.div>
  );
};

export default Register;

