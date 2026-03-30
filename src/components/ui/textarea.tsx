import React from "react";

export function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`w-full rounded border border-slate-300 px-2 py-1 ${className}`.trim()} {...props} />;
}
