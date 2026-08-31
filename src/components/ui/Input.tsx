import type { InputHTMLAttributes } from "react";
export function Input({
  label,
  error,
  ...p
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="field">
      <span>
        {label}
        {p.required && <b> *</b>}
      </span>
      <input {...p} />
      {error && <small className="error">{error}</small>}
    </label>
  );
}
