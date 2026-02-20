import * as React from "react";
import { buttonVariants, cn } from "@/shared/lib/variants";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "delete" | "common";
  className?: string;
  tooltip?: React.ReactNode;
  tooltipPosition?: "top" | "bottom";
  tooltipClassName?: string;
  tooltipContentClassName?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { asChild = false, variant = "common", className, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const mergedClassName = cn(buttonVariants({ variant }), className);

    return (
      <Comp
        className={mergedClassName}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    );
  },
);
