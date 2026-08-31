import type { ButtonHTMLAttributes, ReactNode } from "react";

interface P extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "secondary" | "navy" | "ghost";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  loading,
  className,
  ...p
}: P) {
  return (
    <button
      {...p}
      disabled={loading || p.disabled}
      className={`btn btn-${variant} ${className || ""}`}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
