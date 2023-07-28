import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
// Custom components
import Dialog from "components/Dialogs/Dialog";
// Custom hooks
import useStore from "hooks/useStore";
import { shallow } from "zustand/shallow";
import ACTIONS from "utils/actions";

export default function DeleteDialog() {
    const [
        currentBoard,
        currentTask,
        dispatch,
        boardDialogMode,
        taskDialogMode,
    ] = useStore(
        (state) => [
            state.currentBoard,
            state.currentTask,
            state.dispatch,
            state.boardDialogMode,
            state.taskDialogMode,
        ],
        shallow
    );
    const dialogRef = useRef<HTMLDialogElement>(null);
    const isBoard = boardDialogMode === "delete";

    useEffect(() => {
        if (taskDialogMode === "delete" || boardDialogMode === "delete")
            dialogRef.current!.showModal();
        else dialogRef.current!.close();
    }, [taskDialogMode, boardDialogMode]);

    return (
        <Dialog
            ref={dialogRef}
            onClose={() =>
                dispatch({
                    type: ACTIONS.SET_DIALOG_MODE,
                    payload: {
                        [isBoard ? "boardDialogMode" : "taskDialogMode"]: null,
                    },
                })
            }
        >
            <h1 className="mb-3 text-lg font-bold text-danger">
                Delete this {isBoard ? "Board" : "Task"}?
            </h1>
            <p className="text-sm font-medium text-alt-text">
                Are you sure you want to delete the &quot;
                {isBoard ? currentBoard?.name : currentTask?.name}
                &quot; {isBoard ? "board" : "task"}? This action will remove all{" "}
                {isBoard ? "columns and tasks" : "subtasks"} and cannot be
                reversed.
            </p>
            <div className="mt-6 flex gap-4">
                <button
                    onClick={() => {
                        dispatch({
                            type: isBoard
                                ? ACTIONS.DELETE_BOARD
                                : ACTIONS.DELETE_TASK,
                        });
                        toast.success(
                            `The ${
                                isBoard ? "columns and tasks" : "subtasks"
                            } has been deleted`,
                            {
                                containerId: "root",
                            }
                        );

                        dialogRef.current!.close();
                    }}
                    className="flex-1 rounded-3xl bg-danger py-2 text-sm font-semibold transition-opacity hover:opacity-60"
                >
                    Delete
                </button>
                <button
                    onClick={() => dialogRef.current!.close()}
                    className="flex-1 rounded-3xl bg-white py-2 text-sm font-semibold text-primary transition-opacity hover:opacity-60"
                >
                    Cancel
                </button>
            </div>
        </Dialog>
    );
}
