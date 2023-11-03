import { ButtonHTMLAttributes, FC, ReactNode, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "white";
  isDisabled?: boolean;
  isLoading?: boolean;
  loadingContent?: ReactNode;
}

const classNames = {
  base: "font-semibold px-4 py-2 shadow-sm hover:translate-y-[1px] hover:shadow-xs active:shadow-inset active:translate-y-[2px]",
  primary: "bg-primary text-[#fff]  active:bg-primary-600  ",
  secondary: "bg-secondary text-[#fff]  active:bg-secondary-600",
  white:
    "bg-content1 border-[1px] border-b-0 text-secondary  active:shadow-inset-md  active:bg-slate-50 active:h-[calc(100%_-_2px)]",
  ghost:
    "shadow-none bg-black bg-opacity-0 hover:bg-opacity-5 hover:shadow-inset active:shadow-inset-md active::h-[calc(100%_-_2px)] active:bg-opacity-10 ",
};

export const Button: FC<ButtonProps> = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      variant = "primary",
      className,
      isDisabled = false,
      isLoading = false,
      children,
      loadingContent = children,
      ...props
    },
    ref
  ) => {
    const buttonClasses = twMerge(
      classNames.base,
      classNames[variant],
      className
    );

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={buttonClasses}
        {...props}
      >
        {isLoading ? loadingContent : children}
        {/* TODO: Add loading animation/style */}
      </button>
    );
  }
);
