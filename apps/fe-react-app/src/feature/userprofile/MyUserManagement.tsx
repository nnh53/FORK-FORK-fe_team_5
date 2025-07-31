import { Card, CardContent } from "@/components/Shadcn/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Shadcn/ui/tabs";
import { Film, Info, Receipt, Trophy } from "lucide-react";
import { MovieHistory } from "./components/MovieHistory";
import { MyInfo } from "./components/MyInfoManagement";
import PointHistory from "./components/PointHistory";
import ReceiptHistory from "./components/ReceiptHistory";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const tabsData: Tab[] = [
  {
    id: "account",
    label: "THÔNG TIN CHUNG",
    icon: <Info className="h-4 w-4" />,
    component: <MyInfo />,
  },
  {
    id: "movie-history",
    label: "LỊCH SỬ XEM PHIM",
    icon: <Film className="h-4 w-4" />,
    component: <MovieHistory />,
  },
  {
    id: "receipt-history",
    label: "LỊCH SỬ GIAO DỊCH",
    icon: <Receipt className="h-4 w-4" />,
    component: <ReceiptHistory />,
  },
  {
    id: "point-history",
    label: "LỊCH SỬ ĐIỂM THƯỞNG",
    icon: <Trophy className="h-4 w-4" />,
    component: <PointHistory />,
  },
];

export const MyUserManagement: React.FC = () => {
  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-4">
          {tabsData.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 data-[state=active]:bg-[#E52226] data-[state=active]:text-white"
            >
              {/* Icon hiển thị trên mobile, ẩn trên desktop */}
              <span className="md:hidden">{tab.icon}</span>
              {/* Text hiển thị trên desktop, ẩn trên mobile */}
              <span className="hidden text-xs font-medium md:inline">{tab.label}</span>
              {/* Icon hiển thị trên desktop cùng với text */}
              <span className="hidden md:inline">{tab.icon}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabsData.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <Card>
              <CardContent className="p-6 md:p-8">{tab.component}</CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
