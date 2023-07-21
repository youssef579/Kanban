// Zustand state management
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
// Utils
import ACTIONS from "utils/actions";
import type { Board, Column, Subtask, Task } from "types/documents";
// Toaster
import { toast } from "react-toastify";

type DialogMode = "create" | "update" | null;

type Action =
    | {
          type: ACTIONS.ADD_BOARD;
          payload: { board: Board; columns: Column[] };
      }
    | {
          type: ACTIONS.ADD_TASK;
          payload: { task: Task; subtasks: Subtask[] };
      }
    | { type: ACTIONS.DELETE_BOARD }
    | {
          type: ACTIONS.UPDATE_BOARD;
          payload: Pick<Board, "name"> & { columns: Column[] };
      }
    | {
          type: ACTIONS.UPDATE_TASK;
          payload: { task: Omit<Task, "id">; subtasks: Subtask[] };
      }
    | {
          type: ACTIONS.REORDER_COLUMNS;
          payload: { from: number; to: number };
      }
    | { type: ACTIONS.TOGGLE_SIDE_BAR }
    | { type: ACTIONS.SET_CURRENT_BOARD; payload: { board: Board } }
    | { type: ACTIONS.SET_CURRENT_TASK; payload: { task: Task } }
    | {
          type: ACTIONS.SET_DIALOG_MODE;
          payload: {
              mode: DialogMode;
              for: keyof Pick<State, "boardDialogMode" | "taskDialogMode">;
          };
      }
    | {
          type: ACTIONS.REORDER_TASKS;
          payload: Record<
              "from" | "to",
              { index: number; droppableId: string }
          >;
      };

interface State {
    subtasks: Subtask[];
    tasks: Task[];
    columns: Column[];
    boards: Board[];
    currentBoard: Board | null;
    currentTask: Task | null;
    hideSideBar: boolean;
    boardDialogMode: DialogMode;
    taskDialogMode: DialogMode;
    dispatch(action: Action): void;
}

function reducer(state: State, action: Action) {
    switch (action.type) {
        case ACTIONS.ADD_BOARD:
            return {
                boards: [...state.boards, action.payload.board],
                columns: [...state.columns, ...action.payload.columns],
                currentBoard: action.payload.board,
            };

        case ACTIONS.ADD_TASK:
            return {
                tasks: [...state.tasks, action.payload.task],
                subtasks: [...state.subtasks, ...action.payload.subtasks],
            };

        case ACTIONS.UPDATE_BOARD: {
            const updatedBoard = {
                name: action.payload.name,
                id: state.currentBoard!.id,
            };

            const updatedColumns = [
                ...state.columns.filter(
                    (col) => col.boardId !== updatedBoard.id
                ),
                ...action.payload.columns,
            ];
            const updatedColumnsIds = updatedColumns.map((col) => col.id);

            const updatedTasks = state.tasks.filter((task) =>
                updatedColumnsIds.includes(task.columnId)
            );
            const updatedTasksIds = updatedTasks.map((task) => task.id);

            const updatedSubtasks = state.subtasks.filter((subtask) =>
                updatedTasksIds.includes(subtask.taskId)
            );

            return {
                boards: state.boards.with(
                    state.boards.findIndex(
                        (i) => i.id === state.currentBoard!.id
                    ),
                    updatedBoard
                ),
                columns: updatedColumns,
                tasks: updatedTasks,
                subtasks: updatedSubtasks,
                currentBoard: updatedBoard,
            };
        }

        case ACTIONS.UPDATE_TASK: {
            const updatedTask = {
                ...action.payload.task,
                id: state.currentTask!.id,
            };

            return {
                tasks: state.tasks.with(
                    state.tasks.findIndex(
                        (i) => i.id === state.currentTask!.id
                    ),
                    updatedTask
                ),
                subtasks: [
                    ...state.subtasks.filter(
                        (task) => task.taskId !== updatedTask.id
                    ),
                    ...action.payload.subtasks,
                ],
            };
        }

        case ACTIONS.DELETE_BOARD: {
            const remainingBoards = state.boards.toSpliced(
                state.boards.findIndex((i) => i.id === state.currentBoard!.id),
                1
            );

            const remainingColumns = state.columns.filter(
                (col) => col.boardId !== state.currentBoard!.id
            );
            const columnsIds = remainingColumns.map((col) => col.id);

            const remainingTasks = state.tasks.filter((task) =>
                columnsIds.includes(task.columnId)
            );
            const tasksIds = remainingTasks.map((task) => task.id);

            const remainingSubtasks = state.subtasks.filter((task) =>
                tasksIds.includes(task.taskId)
            );

            return {
                boards: remainingBoards,
                columns: remainingColumns,
                tasks: remainingTasks,
                subtasks: remainingSubtasks,
                currentBoard: remainingBoards[0] ?? null,
            };
        }

        case ACTIONS.REORDER_COLUMNS: {
            const currentColumns = state.columns.filter(
                (col) => col.boardId === state.currentBoard!.id
            );

            return {
                columns: [
                    ...state.columns.filter(
                        (col) => col.boardId !== state.currentBoard!.id
                    ),
                    ...currentColumns
                        .toSpliced(action.payload.from, 1)
                        .toSpliced(
                            action.payload.to,
                            0,
                            currentColumns[action.payload.from]
                        ),
                ],
            };
        }
        case ACTIONS.REORDER_TASKS: {
            if (
                action.payload.from.droppableId ===
                action.payload.to.droppableId
            ) {
                const currentTasks = state.tasks.filter(
                    (task) => task.columnId === action.payload.from.droppableId
                );

                return {
                    tasks: [
                        ...state.tasks.filter(
                            (task) =>
                                task.columnId !==
                                action.payload.from.droppableId
                        ),
                        ...currentTasks
                            .toSpliced(action.payload.from.index, 1)
                            .toSpliced(
                                action.payload.to.index,
                                0,
                                currentTasks[action.payload.from.index]
                            ),
                    ],
                };
            } else {
                const sourceTasks = state.tasks.filter(
                    (task) => task.columnId === action.payload.from.droppableId
                );

                const destinationTasks = state.tasks.filter(
                    (task) => task.columnId === action.payload.to.droppableId
                );

                for (const task of destinationTasks) {
                    if (
                        task.name.trim() ===
                        sourceTasks[action.payload.from.index].name.trim()
                    ) {
                        toast.error(
                            `There is already a task called "${task.name}" on the other column remove it to be able to drag it`,
                            { containerId: "root" }
                        );
                        return {};
                    }
                }

                return {
                    tasks: [
                        ...state.tasks.filter(
                            (task) =>
                                task.columnId !==
                                    action.payload.from.droppableId &&
                                task.columnId !== action.payload.to.droppableId
                        ),
                        ...sourceTasks.toSpliced(action.payload.from.index, 1),
                        ...destinationTasks.toSpliced(
                            action.payload.to.index,
                            0,
                            {
                                ...sourceTasks[action.payload.from.index],
                                columnId: action.payload.to.droppableId,
                            }
                        ),
                    ],
                };
            }
        }

        case ACTIONS.TOGGLE_SIDE_BAR:
            return { hideSideBar: !state.hideSideBar };

        case ACTIONS.SET_CURRENT_BOARD:
            return { currentBoard: action.payload.board };

        case ACTIONS.SET_CURRENT_TASK:
            return { currentTask: action.payload.task };

        case ACTIONS.SET_DIALOG_MODE:
            return {
                [action.payload.for]: action.payload.mode,
            };
    }
}

export default create<State>()(
    devtools(
        persist(
            (set) => ({
                boards: [],
                columns: [],
                tasks: [],
                subtasks: [],
                currentBoard: null,
                currentTask: null,
                hideSideBar: false,
                boardDialogMode: null,
                taskDialogMode: null,
                dispatch(action) {
                    set((state) => reducer(state, action));
                },
            }),
            {
                name: "boards",
                version: 13,
                partialize(state) {
                    return Object.fromEntries(
                        Object.entries(state).filter(
                            ([key]) =>
                                ![
                                    "boardDialogMode",
                                    "taskDialogMode",
                                    "hideSideBar",
                                    "currentTask",
                                ].includes(key)
                        )
                    );
                },
            }
        ),
        { enabled: import.meta.env.DEV }
    )
);
