import { forwardRef, type ReactNode, useId } from "react";
import { cn } from "@/shared/lib/variants";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  disabled?: boolean;
  status?: "default" | "success" | "error";
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      placeholder,
      disabled,
      label,
      id,
      leftIcon,
      rightIcon,
      onChange,
      ...props
    },
    ref,
  ) => {
    const randomId = useId();
    const inputId = id || `input-${randomId}`;

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (
      event,
    ) => {
      const originalOnChange = onChange;

      if (originalOnChange) {
        originalOnChange(event);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <p className="text-foreground text-sm font-medium">{label}</p>
        )}
        <div className="group relative flex items-center px-2 py-1.5 rounded-md">
          {leftIcon && <div className="text-foreground">{leftIcon}</div>}
          <input
            id={inputId}
            className={cn("group focus:outline-none w-full", className)}
            placeholder={placeholder}
            disabled={disabled}
            ref={ref}
            onChange={handleChange}
            autoComplete="off"
            {...props}
          />
          {rightIcon && <div className="text-foregroun">{rightIcon}</div>}
        </div>
      </div>
    );
  },
);

export { Input };
