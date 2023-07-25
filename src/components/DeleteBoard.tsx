/* eslint-disable react-refresh/only-export-components */
import { forwardRef } from "react";
import { toast } from "react-toastify";
// Custom components
import Dialog from "components/Dialog";
// Custom hooks
import useStore from "hooks/useStore";
import { shallow } from "zustand/shallow";
import ACTIONS from "utils/actions";

export default forwardRef<HTMLDialogElement>(function DeleteBoard(_, ref) {
    const [currentBoard, dispatch] = useStore(
        (state) => [state.currentBoard, state.dispatch],
        shallow
    );

    const isRefObject = (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref: any
    ): ref is React.RefObject<HTMLDialogElement> => {
        return "current" in ref;
    };

    return (
        <Dialog ref={ref}>
            <h1 className="mb-3 text-lg font-bold text-danger">
                Delete this board?
            </h1>
            <p className="text-sm font-medium text-alt-text">
                Are you sure you want to delete the &quot;{currentBoard!.name}
                &quot; board? This action will remove all columns and tasks and
                cannot be reversed.
            </p>
            <div className="mt-6 flex gap-4">
                <button
                    onClick={() => {
                        dispatch({ type: ACTIONS.DELETE_BOARD });
                        toast.success("The board has been deleted", {
                            containerId: "root",
                        });
                        if (isRefObject(ref)) ref.current!.close();
                    }}
                    className="flex-1 rounded-3xl bg-danger py-2 text-sm font-semibold transition-opacity hover:opacity-60"
                >
                    Delete
                </button>
                <button
                    onClick={() => {
                        if (isRefObject(ref)) ref.current!.close();
                    }}
                    className="flex-1 rounded-3xl bg-white py-2 text-sm font-semibold text-primary transition-opacity hover:opacity-60"
                >
                    Cancel
                </button>
            </div>
        </Dialog>
    );
});
