// src/components/Header/UserAvatar.tsx
import React, { useEffect, useRef, useState } from "react";
import type { UserAvatarProps } from "../../../type/userLayout.ts";

const UserAvatar: React.FC<UserAvatarProps> = ({ user, onLogout }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="focus:outline-none">
        <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full border-2 border-red-500 object-cover" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-amber-50 rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 text-sm text-gray-700">
            Chào, <strong className="font-medium">{user.name}</strong>
          </div>
          <div className="border-t border-gray-100"></div>
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 border border-transparent hover:border-red-500 hover: transition duration-200"
          >
            Tài khoản của tôi
          </a>
          <button
            onClick={onLogout}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 border border-transparent hover:border-red-500 hover: transition duration-200"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
