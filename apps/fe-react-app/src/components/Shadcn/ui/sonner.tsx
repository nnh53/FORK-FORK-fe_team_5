import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group "
      position="top-right"
      style={
        {
          "--normal-bg": "#FFF4E7", // Màu nền cụ thể (caramel latte vibe)
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          transform: "scale(1.2)",
          transformOrigin: "top right",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
