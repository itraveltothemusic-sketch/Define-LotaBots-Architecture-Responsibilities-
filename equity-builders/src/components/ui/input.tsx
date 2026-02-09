/**
 * Input components — text input, textarea, and select.
 * Styled for the dark forensic theme with clear focus states.
 */

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-navy-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full px-3 py-2 bg-navy-800 border border-navy-600 rounded-lg",
          "text-white placeholder:text-navy-500",
          "focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500",
          "transition-colors duration-200",
          error && "border-danger-500 focus:ring-danger-500/50 focus:border-danger-500",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger-400">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-navy-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "w-full px-3 py-2 bg-navy-800 border border-navy-600 rounded-lg",
          "text-white placeholder:text-navy-500",
          "focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500",
          "transition-colors duration-200 resize-y min-h-[80px]",
          error && "border-danger-500 focus:ring-danger-500/50 focus:border-danger-500",
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger-400">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-navy-300 mb-1.5">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          "w-full px-3 py-2 bg-navy-800 border border-navy-600 rounded-lg",
          "text-white",
          "focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500",
          "transition-colors duration-200",
          error && "border-danger-500 focus:ring-danger-500/50 focus:border-danger-500",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-danger-400">{error}</p>}
    </div>
  );
}
