import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import { ActiveThemeProvider } from "./components/active-theme";
import PageTransition from "./components/shared/PageTransition";
import { AuthProvider } from "./contexts/AuthContext";
import { AppRoutes } from "./routes/route.index";

const TITLE = "FCinema";

function App() {
  return (
    <AuthProvider>
      <div data-theme="caramellatte">
        <title>{TITLE}</title>
        <PageTransition>
          <ActiveThemeProvider>
            <Toaster />
            <AppRoutes />
          </ActiveThemeProvider>
        </PageTransition>
      </div>
    </AuthProvider>
  );
}

export default App;
