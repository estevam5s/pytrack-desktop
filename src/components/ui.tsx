import React from "react";

export function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`rounded-2xl border border-border bg-surface p-5 ${onClick ? "cursor-pointer hover:border-primary/40 transition-colors" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function Button({
  children, onClick, variant = "primary", disabled, type = "button", className = "",
}: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "outline"; disabled?: boolean; type?: "button" | "submit"; className?: string }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50";
  const styles = variant === "primary"
    ? "bg-gradient-to-r from-primary to-primary-light text-white hover:opacity-90"
    : "border border-border bg-surface-2 text-zinc-200 hover:text-white";
  return <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>{children}</button>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-text-dim focus:border-primary ${props.className ?? ""}`}
    />
  );
}

export function Badge({ children, color = "#8234E9" }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ background: color + "22", borderColor: color + "55", color }} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
      {children}
    </span>
  );
}

export function Spinner() {
  return <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-light border-t-transparent" />;
}
