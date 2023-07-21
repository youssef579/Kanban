// React dnd
import { DragDropContext, type DropResult, Droppable } from "@hello-pangea/dnd";
// State management
import useStore from "hooks/useStore";
import { shallow } from "zustand/shallow";
// Utils
import ACTIONS from "utils/actions";
// Custom components
import Column from "components/Column";

export default function ColumnList() {
    const [columns, dispatch, currentBoard] = useStore(
        (state) => [state.columns, state.dispatch, state.currentBoard],
        shallow
    );
    const currentColumns = columns.filter(
        (col) => col.boardId === currentBoard?.id
    );

    function onDragEnd({ destination, source, type }: DropResult) {
        if (
            !destination ||
            (destination.index === source.index &&
                destination.droppableId === source.droppableId)
        )
            return;

        switch (type) {
            case "column":
                dispatch({
                    type: ACTIONS.REORDER_COLUMNS,
                    payload: {
                        from: source.index,
                        to: destination.index,
                    },
                });
                break;

            case "task":
                dispatch({
                    type: ACTIONS.REORDER_TASKS,
                    payload: {
                        from: source,
                        to: destination,
                    },
                });
                break;
        }
    }

    if (!currentBoard)
        return (
            <section className="grid flex-1 place-content-center gap-4">
                <p className="text-lg font-medium">
                    You do not have any boards.
                </p>
                <button
                    onClick={() =>
                        dispatch({
                            type: ACTIONS.SET_DIALOG_MODE,
                            payload: { mode: "create", for: "boardDialogMode" },
                        })
                    }
                    className="m-auto w-fit rounded-3xl bg-primary px-6 py-2.5 font-semibold shadow-md transition-all hover:opacity-80 hover:shadow-lg"
                >
                    Create New Board
                </button>
            </section>
        );

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="board" direction="horizontal" type="column">
                {(provided) => (
                    <section
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex flex-1 overflow-auto py-6 pl-8"
                    >
                        {currentColumns.map((col, index) => (
                            <Column key={col.id} index={index} col={col} />
                        ))}
                        {provided.placeholder}
                    </section>
                )}
            </Droppable>
        </DragDropContext>
    );
}
