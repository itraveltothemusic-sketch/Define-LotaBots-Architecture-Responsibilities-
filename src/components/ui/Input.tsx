/**
 * Input Component
 * 
 * Form input with consistent styling and error states.
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-3 py-2 border rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent',
            'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
            error
              ? 'border-brand-danger focus:ring-brand-danger'
              : 'border-slate-300',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-brand-danger">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-brand-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
