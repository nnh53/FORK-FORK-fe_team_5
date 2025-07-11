import { cn } from "@/utils/utils";

export const Highlight = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <span className={cn("text-secondary p-1 py-0.5 font-medium dark:font-semibold", className)}>{children}</span>;
};
