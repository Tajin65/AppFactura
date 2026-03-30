import React, { createContext, useContext, useState } from "react";

type DialogCtx = { open: boolean; setOpen: (open: boolean) => void };
const DialogContext = createContext<DialogCtx | null>(null);

export function Dialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = useContext(DialogContext);
  const onClick = () => ctx?.setOpen(true);
  if (asChild) return React.cloneElement(children, { onClick } as React.HTMLAttributes<HTMLElement>);
  return <button onClick={onClick}>{children}</button>;
}

export function DialogContent({ className = "", children }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(DialogContext);
  if (!ctx?.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => ctx.setOpen(false)}>
      <div className={`max-h-[90vh] w-full max-w-4xl overflow-auto rounded bg-white p-4 ${className}`.trim()} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export const DialogHeader = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />;
export const DialogTitle = (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 {...props} />;
