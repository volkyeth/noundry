import { ButtonHTMLAttributes, FC } from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "white";
  isDisabled?: boolean;
  isLoading?: boolean;
}

const classNames = {
  base: "font-semibold px-4 py-2 shadow-sm hover:translate-y-[1px] hover:shadow-xs active:shadow-inset active:translate-y-[2px]",
  primary: "bg-primary text-[#fff]  active:bg-primary-600  ",
  secondary: "bg-secondary text-[#fff]  active:bg-secondary-600",
  white:
    "bg-content1 text-secondary  active:text-primary active:bg-white active:h-[calc(100%_-_2px)]",
  ghost:
    "shadow-none bg-black bg-opacity-0 hover:bg-opacity-5 hover:shadow-inset active:shadow-inset-md active:scale-y-95 active:bg-opacity-10 ",
};

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  className,
  isDisabled = false,
  isLoading = false,
  ...props
}) => {
  const buttonClasses = twMerge(
    classNames.base,
    classNames[variant],
    className
  );

  return <button disabled={isDisabled} className={buttonClasses} {...props} />;
};

export default Button;
