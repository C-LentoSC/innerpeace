import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles - common to all buttons
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform active:scale-95",
  {
    variants: {
      variant: {
        // Primary - Your signature gradient
        default:
          "bg-gradient-to-b from-warm-gray to-soft-yellow text-background hover:shadow-lg hover:-translate-y-0.5",

        // Secondary - Sage green accent
        secondary:
          "bg-sage-green text-background hover:bg-sage-green/90 hover:shadow-md hover:-translate-y-0.5",

        // Accent - Warm gold solid
        accent:
          "bg-warm-gold text-background hover:bg-warm-gold/90 hover:shadow-md hover:-translate-y-0.5",

        // Destructive - Red for dangerous actions
        destructive:
          "bg-destructive text-foreground hover:bg-destructive/90 hover:shadow-md hover:-translate-y-0.5",

        // Outline - Border with transparent background
        outline:
          "border-2 border-warm-gold bg-transparent text-warm-gold hover:bg-warm-gold hover:text-background hover:shadow-md",

        // Ghost - Minimal styling
        ghost:
          "bg-transparent text-foreground hover:bg-card hover:text-warm-gold",

        // Link - Text link style
        link: "bg-transparent text-warm-gold underline-offset-4 hover:underline hover:text-accent p-0",

        // Muted - Subtle background
        muted:
          "bg-muted text-foreground hover:bg-muted/80 hover:shadow-sm hover:-translate-y-0.5",
      },
      size: {
        // Size variants
        xs: "h-8 px-3 text-xs rounded-sm",
        sm: "h-9 px-4 text-sm rounded-md",
        default: "h-10 px-6 py-2 text-sm rounded-md",
        lg: "h-12 px-8 py-3 text-base rounded-md",
        xl: "h-14 px-10 py-4 text-lg rounded-lg",

        // Icon only sizes
        icon: "h-10 w-10 rounded-md",
        "icon-sm": "h-8 w-8 rounded-sm",
        "icon-lg": "h-12 w-12 rounded-md",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      // asChild param is reserved for future use
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}

        {!loading && leftIcon && (
          <span className="mr-2 flex items-center">{leftIcon}</span>
        )}

        {children}

        {!loading && rightIcon && (
          <span className="ml-2 flex items-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
