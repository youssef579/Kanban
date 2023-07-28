/* eslint-disable react-refresh/only-export-components */
// React
import { forwardRef } from "react";
// MUI
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
// Tailwind utils
import { twMerge } from "tailwind-merge";

export default forwardRef<
    HTMLDialogElement,
    {
        children: React.ReactNode;
        className?: string;
        popup?: boolean;
        onClose?: (e: React.SyntheticEvent) => void;
    }
>(function Dialog({ children, className, popup = false, onClose }, ref) {
    return (
        <dialog
            onClose={onClose}
            onClick={(e) => {
                if (e.currentTarget === e.target && !popup)
                    (
                        ref as React.RefObject<HTMLDialogElement>
                    ).current!.close();
            }}
            ref={ref}
            className={twMerge(
                "relative w-[480px] rounded-lg bg-secondary p-6 text-white backdrop:bg-[rgb(0_0_0_/_0.5)] open:animate-fade-in open:backdrop:animate-fade-in",
                className
            )}
        >
            {!popup && (
                <IconButton
                    aria-label="close"
                    onClick={() => {
                        (
                            ref as React.RefObject<HTMLDialogElement>
                        ).current!.close();
                    }}
                    className="absolute right-5 top-5"
                >
                    <CloseIcon />
                </IconButton>
            )}
            {children}
        </dialog>
    );
});
