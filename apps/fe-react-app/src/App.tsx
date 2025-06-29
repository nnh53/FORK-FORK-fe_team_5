import { Toaster } from "@/components/Shadcn/ui/sonner";
import "./App.css";
import ConditionalPageTransition from "./components/shared/ConditionalPageTransition";
import { AuthProvider } from "./contexts/AuthContext";
import { AppRoutes } from "./routes/route.index";

const TITLE = "FCinema";

function App() {
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
