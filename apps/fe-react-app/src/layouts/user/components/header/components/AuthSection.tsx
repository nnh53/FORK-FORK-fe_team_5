// src/components/Header/AuthSection.tsx
import React from "react";
import type { User } from "../../../type/userLayout.ts";
import UserAvatar from "./UserAvatar.tsx";

interface AuthSectionProps {
  user: User | null; // User có thể là null nếu chưa đăng nhập
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
}

const AuthSection: React.FC<AuthSectionProps> = ({ user, onLogin, onRegister, onLogout }) => {
  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <UserAvatar user={user} onLogout={onLogout} />
      ) : (
        <>
          <button
            onClick={onRegister}
            className="px-4 py-2 bg-amber-50 rounded-xl border border-red-500 text-red-500 shadow-6xl shadow-black hover:bg-red-500 hover:text-white transition duration-300 font-medium"
          >
            Đăng ký
          </button>
          <button onClick={onLogin} className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition duration-300 font-medium">
            Đăng nhập
          </button>
        </>
      )}
    </div>
  );
};

export default AuthSection;
