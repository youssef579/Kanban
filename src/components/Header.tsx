// MUI
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
// Custom components
import Dialog from "components/Dialog";
import Popup from "components/Popup";
// Hooks & Utils
import { useRef } from "react";
import useStore from "hooks/useStore";
import { shallow } from "zustand/shallow";
import ACTIONS from "utils/actions";
import clsx from "clsx";

export default function Header() {
    const [boards, currentBoard, dispatch] = useStore(
        (state) => [state.boards, state.currentBoard, state.dispatch],
        shallow
    );
    const boardsDialogRef = useRef<HTMLDialogElement>(null);

    const addTask = () =>
        dispatch({
            type: ACTIONS.SET_DIALOG_MODE,
            payload: {
                mode: "create",
                for: "taskDialogMode",
            },
        });

    const MobileSideBar = () => (
        <Dialog ref={boardsDialogRef} className="w-[300px]">
            <p className="text-[13px] font-semibold uppercase tracking-widest text-alt-text">
                All Boards ({boards?.length})
            </p>
            <div className="my-7 flex flex-col items-start gap-6">
                {boards?.map((board) => (
                    <button
                        key={board.id}
                        onClick={() => {
                            dispatch({
                                type: ACTIONS.SET_CURRENT_BOARD,
                                payload: { board },
                            });
                            boardsDialogRef.current!.close();
                        }}
                        className={clsx(
                            "relative z-10 box-content text-lg font-semibold transition-colors before:absolute before:-left-8 before:top-1/2 before:-z-10 before:h-full before:w-64 before:-translate-y-1/2 before:rounded-r-3xl before:py-6 before:transition-colors hover:text-white hover:before:bg-primary",
                            currentBoard!.id === board.id
                                ? "text-white before:bg-primary"
                                : "text-alt-text before:bg-transparent"
                        )}
                    >
                        <SpaceDashboardIcon
                            sx={{
                                marginRight: 1,
                                position: "relative",
                                bottom: 2,
                            }}
                        />{" "}
                        {board.name}
                    </button>
                ))}
            </div>
            <button
                onClick={() => {
                    boardsDialogRef.current!.close();
                    dispatch({
                        type: ACTIONS.SET_DIALOG_MODE,
                        payload: { mode: "create", for: "boardDialogMode" },
                    });
                }}
                className="font-bold text-primary transition-opacity hover:opacity-80"
            >
                <SpaceDashboardIcon
                    sx={{
                        marginRight: 1,
                        position: "relative",
                        bottom: 2,
                    }}
                />{" "}
                Create New Board
            </button>
        </Dialog>
    );

    return (
        <header
            className={clsx(
                "flex items-center justify-between border-b border-border bg-secondary p-5",
                boards.length ? "lg:p-[25px]" : "lg:p-[29px]"
            )}
        >
            <div>
                <h1 className="text-2xl font-bold max-lg:hidden">
                    {currentBoard?.name ?? "No Board Found"}
                </h1>
                <button
                    onClick={() => {
                        boardsDialogRef.current!.showModal();
                    }}
                    className="text-2xl font-bold lg:hidden"
                >
                    {currentBoard?.name ?? "No Board Found"}{" "}
                    <KeyboardArrowUpIcon color="secondary" />
                </button>
                <MobileSideBar />
            </div>
            {currentBoard && (
                <div className="flex gap-2 sm:gap-3">
                    <button
                        onClick={addTask}
                        className="rounded-3xl bg-primary px-4 py-2 text-sm font-semibold shadow-md transition-all hover:opacity-80 hover:shadow-lg max-sm:hidden"
                    >
                        Add New Task
                    </button>
                    <IconButton
                        onClick={addTask}
                        className="bg-primary sm:hidden"
                    >
                        <AddIcon />
                    </IconButton>
                    <Popup />
                </div>
            )}
        </header>
    );
}
