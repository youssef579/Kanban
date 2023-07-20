type Board = Record<"id" | "name", string>;
type Column = Record<"id" | "name" | "boardId", string>;
type Task = Record<"id" | "name" | "columnId" | "description", string>;
type Subtask = Record<"id" | "name" | "taskId", string> & {
    completed: boolean;
};

export { Board, Column, Subtask, Task };
