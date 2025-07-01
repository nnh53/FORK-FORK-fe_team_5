import { Toaster } from "@/components/Shadcn/ui/sonner";
import { useEffect, useState } from "react";
import "./App.css";
import ConditionalPageTransition from "./components/shared/ConditionalPageTransition";
import Loading from "./components/shared/Loading";
import { AuthProvider } from "./contexts/AuthContext";
import { AppRoutes } from "./routes/route.index";

const TITLE = "FCinema";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for all resources to be ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust this time as needed (2 seconds)

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  // Show loading screen while app is initializing
  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthProvider>
      <div data-theme="aaaaaa">
        <title>{TITLE}</title>
        <ConditionalPageTransition>
          <Toaster position="top-right" />
          <AppRoutes />
        </ConditionalPageTransition>
      </div>
    </AuthProvider>
  );
}

export default App;
