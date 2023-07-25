// DND
import { Draggable } from "@hello-pangea/dnd";
// Utils
import clsx from "clsx";
import ACTIONS from "utils/actions";
import type { Task } from "types/documents";
// State management
import useStore from "hooks/useStore";
import { shallow } from "zustand/shallow";

export default function Task({ task, index }: { task: Task; index: number }) {
    const [subtasks, dispatch] = useStore(
        (state) => [state.subtasks, state.dispatch],
        shallow
    );
    const currentSubtasks = subtasks.filter(
        (subtask) => subtask.taskId === task.id
    );

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, { isDragging }) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    role="button"
                    onClick={() =>
                        dispatch({
                            type: ACTIONS.SET_CURRENT,
                            payload: { currentTask: task },
                        })
                    }
                    className={clsx(
                        "mb-5 w-[280px] overflow-hidden rounded-lg bg-secondary px-4 py-6 text-left shadow-lg before:absolute before:inset-0 before:bg-black before:opacity-0 before:transition-opacity hover:before:opacity-10",
                        !isDragging && "relative"
                    )}
                >
                    <p className="mb-2 font-semibold">{task.name}</p>
                    <p className="text-xs font-semibold text-alt-text">
                        {
                            currentSubtasks.filter(
                                (subtask) => subtask.completed
                            ).length
                        }{" "}
                        of {currentSubtasks.length} subtasks
                    </p>
                </div>
            )}
        </Draggable>
    );
}
