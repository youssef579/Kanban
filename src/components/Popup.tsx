import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import { useRef } from "react";
import Dialog from "components/Dialog";
import DeleteBoard from "components/DeleteBoard";
import useStore from "hooks/useStore";
import ACTIONS from "utils/actions";

export default function Popup() {
    const dispatch = useStore((state) => state.dispatch);
    const popupRef = useRef<HTMLDialogElement>(null);
    const deleteDialogRef = useRef<HTMLDialogElement>(null);

    return (
        <>
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
                className="fixed right-8 top-20 z-50 mr-0 w-40 bg-bg p-4 font-semibold shadow-lg"
            >
                <button
                    onClick={() => {
                        popupRef.current!.close();
                        dispatch({
                            type: ACTIONS.SET_DIALOG_MODE,
                            payload: { mode: "update", for: "boardDialogMode" },
                        });
                    }}
                    className="mb-2 text-alt-text transition-opacity hover:opacity-60"
                >
                    Edit Board
                </button>
                <br />
                <button
                    onClick={() => {
                        popupRef.current!.close();
                        deleteDialogRef.current!.showModal();
                    }}
                    className="text-danger transition-opacity hover:opacity-60"
                >
                    Delete Board
                </button>
            </Dialog>
            <DeleteBoard ref={deleteDialogRef} />
        </>
    );
}
