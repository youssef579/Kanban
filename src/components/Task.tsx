import { Draggable } from "@hello-pangea/dnd";
import useStore from "hooks/useStore";
import type { Task } from "types/documents";

export default function Task({ task, index }: { task: Task; index: number }) {
    const subtasks = useStore((state) => state.subtasks);
    const currentSubtasks = subtasks.filter(
        (subtask) => subtask.taskId === task.id
    );

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="mb-5 w-[280px] rounded-lg bg-secondary px-4 py-6 text-left shadow-lg"
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
