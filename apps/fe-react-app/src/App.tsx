import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import ConditionalPageTransition from "./components/shared/ConditionalPageTransition";
import { AuthProvider } from "./contexts/AuthProvider";
import { AppRoutes } from "./routes/route.index";

const TITLE = "FCinema";

function App() {
  return (
    <AuthProvider>
      <div data-theme="caramellatte">
        <title>{TITLE}</title>
        <ConditionalPageTransition>
          <Toaster />
          <AppRoutes />
        </ConditionalPageTransition>
      </div>
    </AuthProvider>
  );
}

export default App;
