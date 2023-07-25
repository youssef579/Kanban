import { Draggable, Droppable } from "@hello-pangea/dnd";
import useStore from "hooks/useStore";
import Task from "components/Task";
import type { Column } from "types/documents";
import clsx from "clsx";

export default function Column({ col, index }: { col: Column; index: number }) {
    const tasks = useStore((state) => state.tasks);

    return (
        <Draggable draggableId={col.id} index={index}>
            {(dragProvider) => {
                const currentTasks = tasks.filter(
                    (task) => task.columnId === col.id
                );

                return (
                    <div
                        {...dragProvider.draggableProps}
                        {...(!currentTasks.length
                            ? dragProvider.dragHandleProps
                            : {})}
                        ref={dragProvider.innerRef}
                        className="mr-8 flex flex-col gap-4"
                    >
                        <p
                            {...(currentTasks.length
                                ? dragProvider.dragHandleProps
                                : {})}
                            className="text-center text-sm font-semibold uppercase tracking-widest text-alt-text"
                        >
                            {col.name} ({currentTasks.length})
                        </p>
                        <Droppable
                            droppableId={col.id}
                            direction="vertical"
                            type="task"
                        >
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={clsx(
                                        "relative w-[280px] flex-1 before:absolute before:inset-0 before:grid before:place-content-center before:rounded-lg before:border-2 before:border-dashed before:border-[rgba(130,143,163,.4)] before:text-3xl before:font-semibold before:text-alt-text before:opacity-0 before:transition-opacity before:content-['No_Tasks'] ",
                                        !currentTasks.length &&
                                            !snapshot.isDraggingOver &&
                                            "before:opacity-100"
                                    )}
                                >
                                    {currentTasks.map((task, index) => (
                                        <Task
                                            key={task.id}
                                            task={task}
                                            index={index}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                );
            }}
        </Draggable>
    );
}
