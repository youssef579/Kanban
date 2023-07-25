/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
// State
import {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
    useLayoutEffect,
} from "react";
import useStore from "hooks/useStore";
import { shallow } from "zustand/shallow";
// MUI & Custom components
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Dialog from "components/Dialog";
// Utils
import clsx from "clsx";
import type { Column } from "types/documents";

export default forwardRef<
    Column,
    { onChange?: (oldCol: Column, newCol: Column) => void }
>(function DropdownList({ onChange }, ref) {
    const [columns, currentBoard, currentTask] = useStore(
        (state) => [state.columns, state.currentBoard, state.currentTask],
        shallow
    );
    const currentColumns = columns.filter(
        (col) => col.boardId === currentBoard!.id
    );
    const [isOpen, setIsOpen] = useState(false);
    const [currentColumn, setCurrentColumn] = useState(currentColumns[0]);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => currentColumn, [currentColumn]);

    useEffect(
        () => (isOpen ? dialogRef.current!.show() : dialogRef.current!.close()),
        [isOpen]
    );

    useLayoutEffect(() => {
        setCurrentColumn(
            currentColumns.find(
                (column) => column.id === currentTask?.columnId
            ) ?? currentColumns[0]
        );
    }, [currentTask]);

    useEffect(() => {
        dialogRef
            .current!.closest("dialog:not(.popup)")!
            .addEventListener("close", () => setIsOpen(false));
    }, []);

    useEffect(() => setCurrentColumn(currentColumns[0]), [currentBoard]);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "mb-4 flex w-full justify-between rounded border-2 bg-transparent p-2 text-sm caret-primary outline-none transition-colors",
                    isOpen ? "border-primary" : "border-border"
                )}
            >
                <p>{currentColumn?.name}</p>
                <KeyboardArrowUpIcon
                    color="secondary"
                    className={clsx(
                        "transition-transform",
                        isOpen && "rotate-180"
                    )}
                />
            </button>
            <Dialog
                popup
                onClose={(e: React.SyntheticEvent) => e.stopPropagation()}
                ref={dialogRef}
                className="popup fixed z-50 max-h-32 w-[min(432px,calc(100vw-38px-48px))] overflow-y-auto rounded bg-bg p-3"
            >
                <div className="flex flex-col gap-2">
                    {currentColumns.map((col) => (
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                if (currentColumn.id !== col.id)
                                    onChange?.(currentColumn, col);
                                setCurrentColumn(col);
                            }}
                            type="button"
                            key={col.id}
                            className="text-left text-sm opacity-60 transition-opacity hover:opacity-100"
                        >
                            {col.name}
                        </button>
                    ))}
                </div>
            </Dialog>
        </div>
    );
});
