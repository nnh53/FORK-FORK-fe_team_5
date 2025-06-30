import { Button } from "@/components/Shadcn/ui/button";
import { ROUTES } from "@/routes/route.constants";
import { useNavigate } from "react-router-dom";

const TestNavigation = () => {
  const navigate = useNavigate();

  const testRoutes = [
    { name: "ScrollFloat Test", path: ROUTES.SCROLL_FLOAT },
    { name: "Carousel Section", path: ROUTES.CAROUSEL_SECTION },
    { name: "Hero Section", path: ROUTES.HERO_SECTION },
    { name: "Now Showing", path: ROUTES.NOW_SHOWING },
    { name: "Trending Section", path: ROUTES.TRENDING_SECTION },
    { name: "FAQ", path: ROUTES.FAQ },
    { name: "Cinema Experience", path: ROUTES.CINEMA_EXPERIENCE },
    { name: "Movie Gallery", path: ROUTES.MOVIE_GALLERY },
    { name: "Flowing Menu", path: ROUTES.FLOWING_MENU_SECTION },
    { name: "Scroll Velocity", path: ROUTES.SCROLL_VELOCITY },
    { name: "Header Test", path: ROUTES.HEADER_TEST },
  ];

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm p-4 rounded-lg max-w-xs">
      <h3 className="text-white font-semibold mb-3 text-sm">Component Tests</h3>
      <div className="grid grid-cols-1 gap-2">
        {testRoutes.map((route) => (
          <Button key={route.path} onClick={() => navigate(route.path)} variant="secondary" size="sm" className="text-xs justify-start h-8">
            {route.name}
          </Button>
        ))}
      </div>
      <Button onClick={() => navigate(ROUTES.HOME)} variant="outline" size="sm" className="w-full mt-3 text-xs h-8">
        Back to Home
      </Button>
    </div>
  );
};

export default TestNavigation;
