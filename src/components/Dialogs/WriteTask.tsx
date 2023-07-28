/* eslint-disable react-hooks/exhaustive-deps */
// React state
import { type FormEvent, useState, useLayoutEffect, useRef } from "react";
// React toastify
import { toast } from "react-toastify";
// Custom components
import Dialog from "components/Dialogs/Dialog";
import Toaster from "components/Toaster";
import DropdownList from "components/Dialogs/DropdownList";
// Custom hooks
import useStore from "hooks/useStore";
import { shallow } from "zustand/shallow";
// MUI
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import { TransitionGroup } from "react-transition-group";
// Utils
import ACTIONS from "utils/actions";
import type { Column, Subtask } from "types/documents";
// Unique id
import { v4 as uuidv4 } from "uuid";

export default function WriteBoard() {
    const [dispatch, taskDialogMode, subtasks, currentTask] = useStore(
        (state) => [
            state.dispatch,
            state.taskDialogMode,
            state.subtasks,
            state.currentTask,
        ],
        shallow
    );
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [currentSubtasks, setCurrentSubtasks] = useState<
        (Pick<Subtask, "name"> & Partial<Omit<Subtask, "name">>)[]
    >([{ name: "" }]);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const currentColumn = useRef<Column>(null);
    const toastIds = useRef<ReturnType<typeof toast>[]>([]);

    console.log(taskDialogMode);

    useLayoutEffect(() => {
        if (!taskDialogMode || taskDialogMode === "delete") return;

        dialogRef.current!.showModal();

        switch (taskDialogMode) {
            case "create":
                setTitle("");
                setDescription("");
                setCurrentSubtasks([{ name: "" }]);
                break;

            case "update":
                setTitle(currentTask!.name);
                setDescription(currentTask!.description);
                setCurrentSubtasks(
                    subtasks.filter(
                        (subtask) => subtask.taskId === currentTask!.id
                    )
                );
                break;
        }
    }, [taskDialogMode]);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!title.trim()) {
            toastIds.current.push(
                toast.error("The task title can't be empty", {
                    containerId: "child",
                })
            );
            return;
        }

        if (currentSubtasks.some((task) => !task.name.trim())) {
            toastIds.current.push(
                toast.error("Some subtasks are empty", { containerId: "child" })
            );
            return;
        }

        if (taskDialogMode === "create") {
            const taskId = uuidv4();

            dispatch({
                type: ACTIONS.ADD_TASK,
                payload: {
                    task: {
                        name: title,
                        id: taskId,
                        description,
                        columnId: currentColumn.current!.id,
                    },
                    subtasks: currentSubtasks.map(({ name }) => ({
                        name,
                        taskId,
                        completed: false,
                        id: uuidv4(),
                    })),
                },
            });
            toast.success("A new task has been created", {
                containerId: "root",
            });
        } else {
            dispatch({
                type: ACTIONS.UPDATE_TASK,
                payload: {
                    task: {
                        name: title,
                        description,
                        columnId: currentColumn.current!.id,
                    },
                    subtasks: currentSubtasks.map((task) => ({
                        name: task.name,
                        taskId: currentTask!.id,
                        id: task.id ?? uuidv4(),
                        completed: task.completed ?? false,
                    })),
                },
            });
            toast.success("The task has been updated", {
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
                    payload: { taskDialogMode: null },
                });

                for (const id of toastIds.current) toast.dismiss(id);
                toastIds.current = [];
            }}
            ref={dialogRef}
        >
            <Toaster id="child" />
            <form onSubmit={handleSubmit}>
                <h1 className="mb-3 text-lg font-bold">
                    {taskDialogMode === "create"
                        ? "Add New Task"
                        : "Update The Task"}
                </h1>
                <label className="mb-2 inline-block text-sm font-semibold">
                    Title
                </label>
                <input
                    type="text"
                    value={title}
                    className="mb-4 block w-full rounded border-2 border-border bg-transparent p-2 text-sm caret-primary outline-none transition-colors focus:border-primary"
                    onInput={(e) => setTitle(e.currentTarget.value)}
                />
                <label className="mb-2 inline-block text-sm font-semibold">
                    Description
                </label>
                <textarea
                    rows={4}
                    value={description}
                    className="mb-4 block w-full resize-none rounded border-2 border-border bg-transparent p-2 text-sm caret-primary outline-none transition-colors focus:border-primary"
                    onInput={(e) => setDescription(e.currentTarget.value)}
                ></textarea>
                <label className="mb-2 inline-block text-sm font-semibold">
                    State
                </label>
                <DropdownList ref={currentColumn} />
                <label className="mb-2 inline-block text-sm font-semibold">
                    Subtasks
                </label>
                <TransitionGroup>
                    {currentSubtasks.map((subtask, index) => (
                        <Collapse key={index}>
                            <div
                                className="mb-4 flex items-center gap-2"
                                key={index}
                            >
                                <input
                                    type="text"
                                    value={subtask.name}
                                    className="block w-full rounded border-2 border-border bg-transparent p-2 text-sm caret-primary outline-none transition-colors focus:border-primary"
                                    onInput={(e) =>
                                        setCurrentSubtasks(
                                            currentSubtasks.with(index, {
                                                ...currentSubtasks[index],
                                                name: e.currentTarget.value,
                                            })
                                        )
                                    }
                                />
                                <IconButton
                                    aria-label="delete"
                                    onClick={() =>
                                        setCurrentSubtasks(
                                            currentSubtasks.toSpliced(index, 1)
                                        )
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </Collapse>
                    ))}
                </TransitionGroup>
                <button
                    type="button"
                    onClick={() =>
                        setCurrentSubtasks([...currentSubtasks, { name: "" }])
                    }
                    className="mb-4 w-full rounded-3xl bg-white p-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
                >
                    Add New Subtask
                </button>
                <input
                    type="submit"
                    value={
                        taskDialogMode === "create"
                            ? "Create New Task"
                            : "Save Changes"
                    }
                    className="w-full cursor-pointer rounded-3xl bg-primary p-2 text-sm font-semibold transition-opacity hover:opacity-80"
                />
            </form>
        </Dialog>
    );
}
