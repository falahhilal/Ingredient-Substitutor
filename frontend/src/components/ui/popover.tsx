import * as React from "react";

interface PopoverProps {
  children: React.ReactNode;
}

export function Popover({ children }: PopoverProps) {
  return (
    <div className="relative">{children}</div>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
  return (
    <>
      {children}
    </>
  );
}

interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
}

export function PopoverContent({ children, className }: PopoverContentProps) {
  return (
    <div className={`absolute z-10 mt-2 w-60 rounded-md border bg-white p-4 shadow-lg ${className}`}>
      {children}
    </div>
  );
}
