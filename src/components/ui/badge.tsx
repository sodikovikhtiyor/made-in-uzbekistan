import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-primary-light text-primary-dark": variant === "default",
          "bg-accent-light text-accent-dark": variant === "success",
          "bg-yellow-100 text-yellow-800": variant === "warning",
          "bg-danger-light text-danger-dark": variant === "danger",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
