import { cn } from "../../lib/utils"; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline"; 
}

export function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2",
        variant === "outline" ? "border-2 border-blue-600 text-blue-600 hover:bg-blue-100" : "bg-blue-600 text-white hover:bg-blue-700",
        className
      )}
      {...props}
    />
  );
}

