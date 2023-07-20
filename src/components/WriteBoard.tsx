/* eslint-disable react-hooks/exhaustive-deps */
// React state
import { type FormEvent, useState, useLayoutEffect, useRef } from "react";
// React toastify
import { toast } from "react-toastify";
// Custom components
import Dialog from "components/Dialog";
import Toaster from "components/Toaster";
// Custom hooks
import useStore from "hooks/useStore";
import { shallow } from "zustand/shallow";
// MUI
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { TransitionGroup } from "react-transition-group";
import Collapse from "@mui/material/Collapse";
// Utils
import ACTIONS from "utils/actions";
import type { Board } from "types/documents";
// Unique id
import { v4 as uuidv4 } from "uuid";

export default function WriteBoard() {
    const [boards, columns, dispatch, currentBoard, boardDialogMode] = useStore(
        (state) => [
            state.boards,
            state.columns,
            state.dispatch,
            state.currentBoard,
            state.boardDialogMode,
        ],
        shallow
    );
    const [name, setName] = useState("");
    const [boardColumns, setBoardColumns] = useState<
        (Pick<Board, "name"> & Partial<Omit<Board, "name">>)[]
    >([{ name: "" }]);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const toastIds = useRef<ReturnType<typeof toast>[]>([]);

    useLayoutEffect(() => {
        if (!boardDialogMode) return;

        dialogRef.current!.showModal();

        if (boardDialogMode === "create") {
            setName("");
            setBoardColumns([{ name: "" }]);
        } else {
            setName(currentBoard!.name);
            setBoardColumns(
                columns.filter((col) => col.boardId === currentBoard!.id)
            );
        }
    }, [boardDialogMode]);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!name.trim()) {
            toastIds.current.push(
                toast.error("The name field can't be empty", {
                    containerId: "child",
                })
            );
            return;
        }

        if (
            boards!.find((board) => board.name === name.trim()) &&
            (boardDialogMode === "create" || name !== currentBoard!.name)
        ) {
            toastIds.current.push(
                toast.error("The board name must be unique", {
                    containerId: "child",
                })
            );
            return;
        }

        if (boardColumns.some((column) => !column.name.trim())) {
            toastIds.current.push(
                toast.error("Some columns are empty", { containerId: "child" })
            );
            return;
        }

        if (
            boardColumns.length !==
            new Set(boardColumns.map(({ name }) => name.trim())).size
        ) {
            toastIds.current.push(
                toast.error("Each column must be unique", {
                    containerId: "child",
                })
            );
            return;
        }

        if (boardDialogMode === "create") {
            const boardId = uuidv4();

            dispatch({
                type: ACTIONS.ADD_BOARD,
                payload: {
                    board: { name, id: boardId },
                    columns: boardColumns.map(({ name }) => ({
                        name,
                        boardId,
                        id: uuidv4(),
                    })),
                },
            });
            toast.success("A new board has been created", {
                containerId: "root",
            });
        } else {
            dispatch({
                type: ACTIONS.UPDATE_BOARD,
                payload: {
                    name,
                    columns: boardColumns.map((col) => ({
                        name: col.name,
                        boardId: currentBoard!.id,
                        id: col.id ?? uuidv4(),
                    })),
                },
            });
            toast.success("The board has been updated", {
                containerId: "root",
            });
        }

        dialogRef.current!.close();
    }

    return (
        <Dialog
            onClose={() => {
                dispatch({
                    type: ACTIONS.SET_DIALOG_MODE,
                    payload: { mode: null, for: "boardDialogMode" },
                });

                for (const id of toastIds.current) toast.dismiss(id);
                toastIds.current = [];
            }}
            ref={dialogRef}
        >
            <Toaster id="child" />
            <form onSubmit={handleSubmit}>
                <h1 className="mb-3 text-lg font-bold">
                    {boardDialogMode === "create"
                        ? "Add New Board"
                        : "Update The Board"}
                </h1>
                <label className="mb-2 inline-block text-sm font-semibold">
                    Name
                </label>
                <input
                    type="text"
                    value={name}
                    className="mb-4 block w-full rounded border-2 border-border bg-transparent p-2 text-sm caret-primary outline-none transition-colors focus:border-primary"
                    onInput={(e) => setName(e.currentTarget.value)}
                />
                <label className="mb-2 inline-block text-sm font-semibold">
                    Columns
                </label>
                <TransitionGroup>
                    {boardColumns.map((column, index) => (
                        <Collapse key={index}>
                            {boardColumns.length === 1 ? (
                                <input
                                    type="text"
                                    value={column.name}
                                    className="mb-4 block w-full rounded border-2 border-border bg-transparent p-2 text-sm caret-primary outline-none transition-colors focus:border-primary"
                                    onInput={(e) =>
                                        setBoardColumns(
                                            boardColumns.with(index, {
                                                ...boardColumns[index],
                                                name: e.currentTarget.value,
                                            })
                                        )
                                    }
                                />
                            ) : (
                                <div
                                    className="mb-4 flex items-center gap-2"
                                    key={index}
                                >
                                    <input
                                        type="text"
                                        value={column.name}
                                        className="block w-full rounded border-2 border-border bg-transparent p-2 text-sm caret-primary outline-none transition-colors focus:border-primary"
                                        onInput={(e) =>
                                            setBoardColumns(
                                                boardColumns.with(index, {
                                                    ...boardColumns[index],
                                                    name: e.currentTarget.value,
                                                })
                                            )
                                        }
                                    />
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() =>
                                            setBoardColumns(
                                                boardColumns.toSpliced(index, 1)
                                            )
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            )}
                        </Collapse>
                    ))}
                </TransitionGroup>
                <button
                    type="button"
                    onClick={() =>
                        setBoardColumns([...boardColumns, { name: "" }])
                    }
                    className="mb-4 w-full rounded-3xl bg-white p-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                >
                    Add New Column
                </button>
                <input
                    type="submit"
                    value={
                        boardDialogMode === "create"
                            ? "Create New Board"
                            : "Save Changes"
                    }
                    className="w-full cursor-pointer rounded-3xl bg-primary p-2 text-sm font-semibold transition-opacity hover:opacity-80"
                />
            </form>
        </Dialog>
    );
}
