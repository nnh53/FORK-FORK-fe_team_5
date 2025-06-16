import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import PageTransition from "./components/shared/PageTransition";
import { AuthProvider } from "./contexts/AuthProvider";
import { AppRoutes } from "./routes/route.index";

const TITLE = "FCinema";

function App() {
  return (
    <AuthProvider>
      <div data-theme="caramellatte">
        <title>{TITLE}</title>
        <PageTransition>
          <Toaster />
          <AppRoutes />
        </PageTransition>
      </div>
    </AuthProvider>
  );
}

export default App;
