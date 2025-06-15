"use client";

import { type ReactNode, createContext, useContext, useEffect, useState } from "react";

const COOKIE_NAME = "active_theme";
const DEFAULT_THEME = "default";

function setThemeCookie(theme: string) {
  if (typeof window === "undefined") return;

  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === "https:" ? "Secure;" : ""}`;
}

type ThemeContextType = {
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ActiveThemeProvider({ children, initialTheme }: { children: ReactNode; initialTheme?: string }) {
  const [activeTheme, setActiveTheme] = useState<string>(() => initialTheme || DEFAULT_THEME);

  useEffect(() => {
    setThemeCookie(activeTheme);

    // Remove old theme classes
    Array.from(document.body.classList)
      .filter((className) => className.startsWith("theme-"))
      .forEach((className) => {
        document.body.classList.remove(className);
      });

    // Add new theme class to body
    document.body.classList.add(`theme-${activeTheme}`);
    if (activeTheme.endsWith("-scaled")) {
      document.body.classList.add("theme-scaled");
    }

    // Set DaisyUI theme
    const daisyTheme = mapToDaisyTheme(activeTheme);
    document.documentElement.setAttribute("data-theme", daisyTheme);
  }, [activeTheme]);

  // Map internal theme names to DaisyUI theme names
  function mapToDaisyTheme(theme: string): string {
    switch (theme) {
      case "default":
        return "caramellatte";
      case "valentine":
        return "valentine";
      case "retro":
        return "retro";
      case "lemonade":
        return "lemonade";
      // Add mappings for other themes as needed
      default:
        return "caramellatte";
    }
  }

  return <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>{children}</ThemeContext.Provider>;
}

export function useThemeConfig() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within an ActiveThemeProvider");
  }
  return context;
}
