// MUI
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
// React state
import { useRef } from "react";
// Custom components
import Dialog from "components/Dialogs/Dialog";
// Store
import useStore from "hooks/useStore";
// Utils
import ACTIONS from "utils/actions";
import { twMerge } from "tailwind-merge";

export default function Popup({
    mode,
    className,
}: {
    mode: "task" | "board";
    className?: string;
}) {
    const dispatch = useStore((state) => state.dispatch);
    const popupRef = useRef<HTMLDialogElement>(null);

    return (
        <div className={twMerge("relative", className)}>
            <IconButton
                onClick={() =>
                    popupRef.current!.open
                        ? popupRef.current!.close()
                        : popupRef.current!.show()
                }
            >
                <MoreVertIcon />
            </IconButton>
            <Dialog
                ref={popupRef}
                popup
                onClose={(e: React.SyntheticEvent) => e.stopPropagation()}
                className="absolute right-3 top-12 z-50 mr-0 w-40 bg-bg p-4 font-semibold shadow-lg"
            >
                <button
                    onClick={() => {
                        popupRef.current!.close();
                        dispatch({
                            type: ACTIONS.SET_DIALOG_MODE,
                            payload: {
                                [`${mode}DialogMode`]: "update",
                            },
                        });
                    }}
                    className="mb-2 capitalize text-alt-text transition-opacity hover:opacity-60"
                >
                    Edit {mode}
                </button>
                <br />
                <button
                    onClick={() => {
                        popupRef.current!.close();
                        dispatch({
                            type: ACTIONS.SET_DIALOG_MODE,
                            payload: {
                                [`${mode}DialogMode`]: "delete",
                            },
                        });
                    }}
                    className="capitalize text-danger transition-opacity hover:opacity-60"
                >
                    Delete {mode}
                </button>
            </Dialog>
        </div>
    );
}
