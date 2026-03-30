import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "icon";
};

export function Button({ variant = "default", size = "default", className = "", ...props }: ButtonProps) {
  const variantClass =
    variant === "outline"
      ? "border border-slate-300 bg-white"
      : variant === "ghost"
        ? "bg-transparent"
        : "bg-slate-900 text-white";
  const sizeClass = size === "icon" ? "h-8 w-8 p-1" : "px-3 py-2";

  return <button className={`${variantClass} ${sizeClass} rounded ${className}`.trim()} {...props} />;
}
