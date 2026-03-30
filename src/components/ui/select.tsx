import React, { createContext, useContext, useMemo, useState } from "react";

type SelectCtx = {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SelectContext = createContext<SelectCtx | null>(null);

export function Select({ value, onValueChange, children }: { value?: string; onValueChange?: (value: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ctx = useMemo(() => ({ value, onValueChange, open, setOpen }), [value, onValueChange, open]);
  return <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ className = "", children }: React.HTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(SelectContext);
  return (
    <button type="button" className={`w-full rounded border border-slate-300 px-2 py-1 text-left ${className}`.trim()} onClick={() => ctx?.setOpen(!ctx.open)}>
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = useContext(SelectContext);
  return <span>{ctx?.value || placeholder || "Selecciona"}</span>;
}

export function SelectContent({ className = "", children }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(SelectContext);
  if (!ctx?.open) return null;
  return <div className={`mt-1 max-h-56 overflow-auto rounded border border-slate-300 bg-white p-1 ${className}`.trim()}>{children}</div>;
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(SelectContext);
  return (
    <button
      type="button"
      className="block w-full rounded px-2 py-1 text-left hover:bg-slate-100"
      onClick={() => {
        ctx?.onValueChange?.(value);
        ctx?.setOpen(false);
      }}
    >
      {children}
    </button>
  );
}
