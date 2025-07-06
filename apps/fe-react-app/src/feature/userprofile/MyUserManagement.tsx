import { Card, CardContent } from "@/components/Shadcn/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Shadcn/ui/tabs";
import { MyMovieHistory } from "./components/MovieHistory";
import { MyInfo } from "./components/MyInfoManagement";

interface Tab {
  id: string;
  label: string;
  component: React.ReactNode;
}

const tabsData: Tab[] = [
  {
    id: "account",
    label: "THÔNG TIN CHUNG",
    component: <MyInfo />,
  },
  {
    id: "movie-history",
    label: "LỊCH SỬ GIAO DỊCH",
    component: <MyMovieHistory />,
  },
];

export const MyUserManagement: React.FC = () => {
  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          {tabsData.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 data-[state=active]:bg-[#E52226] data-[state=active]:text-white"
            >
              <span className="hidden text-xs font-medium md:inline">{tab.label}</span>
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
