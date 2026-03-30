import React from "react";

export function Label({ className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`mb-1 block text-sm ${className}`.trim()} {...props} />;
}
