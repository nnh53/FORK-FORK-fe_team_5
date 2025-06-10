import { useState } from "react";
import { MyInfo } from "./MyInfoManagement";


  interface Tab {
    id: string;
    label: string;
    component: React.ReactNode; 
  }

  const tabsData: Tab[] = [
    { id: 'account', label: 'THÔNG TIN TÀI KHOẢN', component: <MyInfo/> },
    { id: 'membership', label: 'THẺ THÀNH VIÊN', component: <MyInfo/> },
    { id: 'journey', label: 'HÀNH TRÌNH ĐIỆN ẢNH', component: <MyInfo/> },
    { id: 'points', label: 'ĐIỂM BETA',  component: <MyInfo/> },
    { id: 'vouchers', label: 'VOUCHER',  component: <MyInfo/> },
  ];
export const MyUserManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>(tabsData[0].id);

    const activeComponent = tabsData.find((tab) => tab.id === activeTab)?.component;

    return (
      <div className="container mx-auto p-4 md:p-8">
        <nav className="flex flex-wrap items-center text-sm font-bold border-b-2 border-gray-200 mb-6">
          {tabsData.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
              py-3 px-6
              focus:outline-none
              ${
                activeTab === tab.id
                  ? 'text-white bg-blue-700 -mb-[2px] border-b-2 border-blue-700'
                  : 'text-gray-800 hover:bg-gray-100'
              }
            `}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="content">{activeComponent}</div>
      </div>
    );
  };
