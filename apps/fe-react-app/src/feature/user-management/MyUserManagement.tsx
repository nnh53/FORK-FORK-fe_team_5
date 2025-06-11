import { useState } from 'react';
import { MyInfo } from './MyInfoManagement';
import { MyMembership } from './MyMembershipManagement';
import { MyMovieHistory } from './MovieHistory';
import { MyPointManagement } from './MyPointManagement';
import { MyVoucherManagement } from './MyVoucherManagement';

interface Tab {
  id: string;
  label: string;
  component: React.ReactNode;
}

const tabsData: Tab[] = [
  { id: 'account', label: 'THÔNG TIN TÀI KHOẢN', component: <MyInfo /> },
  { id: 'membership', label: 'THẺ THÀNH VIÊN', component: <MyMembership /> },
  { id: 'journey', label: 'HÀNH TRÌNH ĐIỆN ẢNH', component: <MyMovieHistory /> },
  { id: 'points', label: 'ĐIỂM FCINEMA', component: <MyPointManagement /> },
  { id: 'vouchers', label: 'VOUCHER', component: <MyVoucherManagement /> },
];
export const MyUserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(tabsData[0].id);

  const activeComponent = tabsData.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="fluid-container mx-auto p-4 md:p-8 w-[85%]">
      <nav className="flex flex-wrap items-center justify-center text-sm font-bold border-b-2 border-gray-200 ">
        {tabsData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              py-3 px-6
              focus:outline-none
              ${activeTab === tab.id ? 'text-white bg-[#E52226] -mb-[2px] border-b-2 border-[#E52226]' : 'text-gray-800 hover:bg-gray-100'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="bg-white p-6 md:p-8 rounded-b-lg rounded-r-lg shadow-md w-full">{activeComponent}</div>
    </div>
  );
};
