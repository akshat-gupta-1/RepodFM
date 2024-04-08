import React from "react";
import { cn } from "@/lib/utils";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  typeButton: "normal" | "hangup";
  typeName: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, typeButton, typeName, onClick, className }, ref) => {
    return (
      <div className={cn("flex flex-col items-center gap-y-0.5 ", className)}>
        <button
          ref={ref}
          onClick={onClick}
          className={cn(
            "bg-slate-7 text-textM-800 rounded-xl px-3 py-3  hover:bg-slate-8 ",
            {
              "bg-red-200 text-red-500 hover:bg-red-300 dark:bg-red-500  dark:hover:bg-red-500/90 dark:text-red-200":
                typeButton === "hangup",
            },
          )}
        >
          {children}
        </button>
        <span className="text-xs text-slate-11">{typeName}</span>
      </div>
    );
  },
);

Button.displayName = "Button";
export default Button;
