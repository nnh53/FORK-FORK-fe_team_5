import { Button } from "@/components/Shadcn/ui/button";
import { ROUTES } from "@/routes/route.constants";
import { clearAuthData } from "@/utils/auth.utils";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ParallaxSectionProps {
  className?: string;
}

const ParallaxSection = forwardRef<HTMLElement, ParallaxSectionProps>(({ className }, ref) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthData();
    toast.success("Đăng xuất thành công!");
    navigate(ROUTES.AUTH.LOGIN);
  };

  return (
    <section className={`parallax-section ${className || ""}`} ref={ref}>
      <div className="parallax-layer" data-depth="0.1"></div>
      <div className="parallax-layer" data-depth="0.2"></div>
      <div className="parallax-layer" data-depth="0.3"></div>
      <div className="parallax-content">
        <h2
          style={{
            background: "linear-gradient(to right, #946b38, #392819)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            fontWeight: "800",
          }}
        >
          The Ultimate Movie Experience
        </h2>
        <p>Feel the magic of cinema</p>

        {/* Logout Button */}
        <div className="mt-6">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Đăng Xuất
          </Button>
        </div>
      </div>
    </section>
  );
});

ParallaxSection.displayName = "ParallaxSection";

export default ParallaxSection;
