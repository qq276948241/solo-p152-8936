import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}

export function FormField({ label, error, children, className, htmlFor }: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="label-base">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('input-base', className)} {...props} />;
}

export function TextArea({ className, rows = 4, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('input-base resize-none', className)} rows={rows} {...props} />;
}

export function NumberInput({ className, min = 0, step = 1, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return (
    <input
      type="number"
      className={cn('input-base', className)}
      min={min}
      step={step}
      {...props}
    />
  );
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: { value: string; label: string }[];
}

export function SelectInput({ className, options, ...props }: SelectProps) {
  return (
    <select className={cn('input-base appearance-none cursor-pointer pr-10', className)} {...props}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-primary-700 text-white">
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function DateTimeInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="datetime-local" className={cn('input-base', className)} {...props} />;
}
