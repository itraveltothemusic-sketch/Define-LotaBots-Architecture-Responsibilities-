import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm",
          "placeholder:text-zinc-400",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-500 dark:focus-visible:outline-zinc-100",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

