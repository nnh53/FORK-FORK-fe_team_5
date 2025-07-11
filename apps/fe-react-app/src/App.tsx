import { Toaster } from "@/components/Shadcn/ui/sonner";
import "./App.css";
import ConditionalPageTransition from "./components/shared/ConditionalPageTransition";
import { AuthProvider } from "./contexts/AuthProvider";
import { AppRoutes } from "./routes/route.index";

const TITLE = "FCinema";

function App() {
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, []);

  // if (isLoading) {
  //   return <Loading />;
  // }

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
