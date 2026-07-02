import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
};

export const Field = ({ label, htmlFor, error, children }: FieldProps) => (
  <div className="space-y-2">
    {htmlFor ? (
      <label
        className="block text-sm font-medium text-cafe-700"
        htmlFor={htmlFor}
      >
        {label}
      </label>
    ) : (
      <span className="block text-sm font-medium text-cafe-700">{label}</span>
    )}
    {children}
    {error ? <p className="text-sm text-red-700">{error}</p> : null}
  </div>
);
