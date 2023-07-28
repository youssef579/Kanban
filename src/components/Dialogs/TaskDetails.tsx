// React
import { useLayoutEffect, useRef } from "react";
// Utils
import ACTIONS from "utils/actions";
// State management
import useStore from "hooks/useStore";
import { shallow } from "zustand/shallow";
// Custom components
import Dialog from "components/Dialogs/Dialog";
import DropdownList from "components/Dialogs/DropdownList";
import Popup from "components/Dialogs/Popup";

export default function TaskDetails() {
    const [subtasks, dispatch, currentTask, tasks, taskDialogMode] = useStore(
        (state) => [
            state.subtasks,
            state.dispatch,
            state.currentTask,
            state.tasks,
            state.taskDialogMode,
        ],
        shallow
    );
    const currentSubtasks = subtasks.filter(
        (subtask) => subtask.taskId === currentTask?.id
    );
    const dialogRef = useRef<HTMLDialogElement>(null);

    useLayoutEffect(
        () =>
            currentTask && !taskDialogMode
                ? dialogRef.current!.showModal()
                : dialogRef.current!.close(),
        [currentTask, taskDialogMode]
    );

    return (
        <Dialog
            ref={dialogRef}
            onClose={() => {
                if (!taskDialogMode)
                    dispatch({
                        type: ACTIONS.SET_CURRENT,
                        payload: { currentTask: null },
                    });
            }}
        >
            <div className="flex flex-col gap-2">
                <Popup mode="task" className="absolute right-16 top-5" />
                <h1 className="text-lg font-bold">{currentTask?.name}</h1>
                <p className="mb-3 text-[13px] font-medium text-alt-text">
                    {currentTask?.description || "No Description"}
                </p>
                <h2 className="text-sm font-bold">
                    Subtasks (
                    {
                        currentSubtasks.filter((subtask) => subtask.completed)
                            .length
                    }{" "}
                    of {currentSubtasks.length})
                </h2>
                {currentSubtasks.length ? (
                    currentSubtasks.map((subtask) => (
                        <label
                            key={subtask.id}
                            className="flex cursor-pointer items-center gap-3 rounded-md bg-bg p-3 last-of-type:mb-3"
                        >
                            <input
                                type="checkbox"
                                checked={subtask.completed}
                                onChange={() =>
                                    dispatch({
                                        type: ACTIONS.TOGGLE_SUBTASK,
                                        payload: { id: subtask.id },
                                    })
                                }
                                className="checkmark peer grid aspect-square w-4 cursor-pointer appearance-none place-content-center rounded-sm border border-border bg-secondary transition-colors before:aspect-square before:w-2.5 before:origin-bottom-left before:scale-0 before:bg-white before:transition-transform checked:bg-primary checked:before:scale-100"
                            />
                            <p className="text-[13px] font-medium decoration-[1.5px] peer-checked:line-through peer-checked:opacity-60">
                                {subtask.name}
                            </p>
                        </label>
                    ))
                ) : (
                    <p className="mb-3 text-[13px] font-medium text-alt-text">
                        No Subtasks
                    </p>
                )}
                <h2 className="text-sm font-bold">State</h2>
                <DropdownList
                    onChange={(oldCol, newCol) => {
                        dispatch({
                            type: ACTIONS.REORDER_TASKS,
                            payload: {
                                from: {
                                    droppableId: oldCol.id,
                                    index: tasks
                                        .filter(
                                            (task) =>
                                                task.columnId ===
                                                currentTask!.columnId
                                        )
                                        .findIndex(
                                            (task) =>
                                                task.id === currentTask!.id
                                        ),
                                },
                                to: {
                                    droppableId: newCol.id,
                                    index: tasks.filter(
                                        (task) => task.columnId === newCol.id
                                    ).length,
                                },
                            },
                        });

                        dispatch({
                            type: ACTIONS.SET_CURRENT,
                            payload: {
                                currentTask: {
                                    ...currentTask!,
                                    columnId: newCol.id,
                                },
                            },
                        });
                    }}
                />
            </div>
        </Dialog>
    );
}
