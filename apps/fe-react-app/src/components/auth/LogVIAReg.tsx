import { gsap } from 'gsap';
import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

//thằng này sử dụng khi guest nhấn vào luồng chính
const LogVIAReg: React.FC = () => {
  const navigate = useNavigate();
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const registerButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Animation for initial load
    if (!containerRef.current || !loginButtonRef.current || !registerButtonRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(containerRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8 }).fromTo(
      [loginButtonRef.current, registerButtonRef.current],
      { scale: 0.5, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'back.out(1.7)',
      }
    );

    // Hover and interaction animations
    const buttons = [loginButtonRef.current, registerButtonRef.current];
    const cleanupFns = buttons.map((button) => {
      if (!button) return () => {};

      // Hover effect
      const mouseEnterHandler = () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power1.out',
        });
      };

      const mouseLeaveHandler = () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: 'power1.out',
        });
      };

      button.addEventListener('mouseenter', mouseEnterHandler);
      button.addEventListener('mouseleave', mouseLeaveHandler);

      // Return cleanup function
      return () => {
        button.removeEventListener('mouseenter', mouseEnterHandler);
        button.removeEventListener('mouseleave', mouseLeaveHandler);
      };
    });

    // Cleanup function
    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, []);

  const createButtonAnimation = useCallback(
    (buttonRef: React.RefObject<HTMLButtonElement>, navigatePath: string) => {
      return () => {
        if (buttonRef.current) {
          gsap
            .timeline()
            .to(buttonRef.current, {
              scale: 0.9,
              duration: 0.1,
              ease: 'power1.inOut',
            })
            .to(buttonRef.current, {
              scale: 1,
              duration: 0.1,
              ease: 'power1.inOut',
              onComplete: () => {
                navigate(navigatePath);
              },
            });
        }
      };
    },
    [navigate]
  );

  const handleLogin = useCallback(() => {
    if (loginButtonRef.current) {
      createButtonAnimation(loginButtonRef as React.RefObject<HTMLButtonElement>, '/login')();
    }
  }, [createButtonAnimation]);

  const handleRegister = useCallback(() => {
    if (registerButtonRef.current) {
      createButtonAnimation(registerButtonRef as React.RefObject<HTMLButtonElement>, '/register')();
    }
  }, [createButtonAnimation]);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 text-center space-y-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Đăng ký ngay để bắt đầu mua vé</h2>
        <p className="text-gray-400 mb-6">Bạn chưa có tài khoản?</p>
        <div className="flex justify-center space-x-4">
          <button
            ref={registerButtonRef}
            onClick={handleRegister}
            className="pushable-button relative group overflow-hidden rounded-lg border-none outline-none focus:outline-none"
          >
            <span className="button-shadow absolute inset-0 bg-gray-900 opacity-50 transform translate-y-1 rounded-lg"></span>
            <span className="button-edge absolute inset-0 bg-gradient-to-l from-gray-700 to-gray-800 rounded-lg"></span>
            <span
              className="button-front relative block px-6 py-3 bg-gray-700 text-white rounded-lg transform -translate-y-1 
                            transition-all duration-300 ease-out group-hover:translate-y-0 
                            group-hover:bg-gray-600 group-active:translate-y-1"
            >
              Tạo Tài Khoản
            </span>
          </button>
          <button
            ref={loginButtonRef}
            onClick={handleLogin}
            className="pushable-button relative group overflow-hidden rounded-lg border-none outline-none focus:outline-none"
          >
            <span className="button-shadow absolute inset-0 bg-gray-900 opacity-50 transform translate-y-1 rounded-lg"></span>
            <span className="button-edge absolute inset-0 bg-gradient-to-l from-gray-700 to-gray-800 rounded-lg"></span>
            <span
              className="button-front relative block px-6 py-3 bg-gray-700 text-white rounded-lg transform -translate-y-1 
                            transition-all duration-300 ease-out group-hover:translate-y-0 
                            group-hover:bg-gray-600 group-active:translate-y-1"
            >
              Đăng Nhập
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogVIAReg;

