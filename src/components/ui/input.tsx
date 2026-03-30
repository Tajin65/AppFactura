import React from "react";

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`w-full rounded border border-slate-300 px-2 py-1 ${className}`.trim()} {...props} />;
}
