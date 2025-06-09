// src/components/Header/NavigationBar.tsx
import React from 'react';

export interface NavItemData {
  label: string;
  path: string;
  children?: NavItemData[]; // Mảng con cho menu đa cấp
}

interface NavigationBarProps {
  items: NavItemData[];
}

const NavItem: React.FC<{ item: NavItemData }> = ({ item }) => {
  // Sử dụng group-hover của Tailwind để hiển thị submenu
  return (
    <div className="relative group">
      <a href={item.path} className="navItem text-black uppercase hover:text-red-500 transition duration-300 cursor-pointer font-bold px-4 py-2">
        {item.label}
        {item.children && (
          <svg className="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        )}
      </a>
      {item.children && (
        <div className="absolute left-0 mt-2 w-48 bg-amber-50 rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible">
          {item.children.map((child) => (
            <a key={child.path} href={child.path} className="block px-4 py-2 text-sm text-gray-900 border border-transparent hover:border-red-500 hover: transition duration-200">
              {child.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const NavigationBar: React.FC<NavigationBarProps> = ({ items }) => {
  return (
    <nav className="flex space-x-4 mt-8">
      {items.map((item) => (
        <NavItem key={item.path} item={item} />
      ))}
    </nav>
  );
};

export default NavigationBar;
