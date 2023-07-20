import { Draggable, Droppable } from "@hello-pangea/dnd";
import useStore from "hooks/useStore";
import Task from "components/Task";
import type { Column } from "types/documents";

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
                        {!currentTasks.length ? (
                            <div className="grid w-[280px] flex-1 place-content-center rounded-lg border-2 border-dashed border-[rgba(130,143,163,.4)] text-3xl font-semibold text-alt-text">
                                {" "}
                                No Tasks
                            </div>
                        ) : (
                            <Droppable
                                droppableId={col.id}
                                direction="vertical"
                                type="task"
                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="w-[280px] flex-1 overflow-y-auto"
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
                        )}
                    </div>
                );
            }}
        </Draggable>
    );
}
