import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white shadow-sm hover:bg-primary-700 active:bg-primary-800",
        accent: "bg-accent text-accent-foreground shadow-sm hover:bg-accent-300",
        outline:
          "border border-slate-200 bg-white text-slate-900 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-transparent dark:text-slate-100 dark:hover:border-accent dark:hover:text-accent",
        ghost:
          "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
        danger: "bg-red-600 text-white hover:bg-red-700",
        light: "bg-white text-primary hover:bg-slate-100",
        glass:
          "border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
