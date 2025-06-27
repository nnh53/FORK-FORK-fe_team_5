import { Button } from "@/components/Shadcn/ui/button";
import { Separator } from "@/components/Shadcn/ui/separator";
import { SidebarTrigger } from "@/components/Shadcn/ui/sidebar";
import { ROUTES } from "@/routes/route.constants";
import { clearAuthData } from "@/utils/auth.utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function SiteHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth data from localStorage
    clearAuthData();

    // Show success message
    toast.success("Đăng xuất thành công!");

    // Redirect to login page
    navigate(ROUTES.AUTH.LOGIN || "/login");
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />{" "}
        <h1 className="text-base font-medium">
          <a href="/staff/dashboard" className="hover:underline flex items-center gap-2"></a>
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a href="https://git.fa.edu.vn/hcm25_cpl_react_05/fe_team_5" rel="noopener noreferrer" target="_blank" className="dark:text-foreground">
              Gitlab
            </a>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
            Đăng Xuất
          </Button>
        </div>
      </div>
    </header>
  );
}
