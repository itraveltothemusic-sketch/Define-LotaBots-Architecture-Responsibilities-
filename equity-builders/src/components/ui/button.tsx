/**
 * Button component with variants for the forensic intelligence aesthetic.
 * 
 * Variants:
 * - primary: High-emphasis action (brand blue)
 * - secondary: Medium-emphasis (navy with border)
 * - ghost: Low-emphasis (transparent)
 * - danger: Destructive actions
 * - success: Positive confirmations
 */

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20",
  secondary: "bg-navy-800 hover:bg-navy-700 text-navy-100 border border-navy-600",
  ghost: "bg-transparent hover:bg-navy-800/50 text-navy-200",
  danger: "bg-danger-600 hover:bg-danger-500 text-white shadow-lg shadow-danger-600/20",
  success: "bg-forensic-600 hover:bg-forensic-500 text-white shadow-lg shadow-forensic-600/20",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2 focus:ring-offset-navy-900",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
