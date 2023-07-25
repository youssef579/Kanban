// Static assets
import logo from "assets/logo.svg";
// Material icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
// Hooks
import useStore from "hooks/useStore";
// Utils
import clsx from "clsx";
import ACTIONS from "utils/actions";
import { shallow } from "zustand/shallow";

export default function Sidebar() {
    const [boards, currentBoard, hideSideBar, dispatch] = useStore(
        (state) => [
            state.boards,
            state.currentBoard,
            state.hideSideBar,
            state.dispatch,
        ],
        shallow
    );

    return (
        <nav
            className={clsx(
                "absolute bottom-0 left-0 top-0 z-50 w-[300px] border-r border-border bg-secondary transition-transform max-lg:hidden",
                hideSideBar && "-translate-x-full"
            )}
        >
            <img
                className="box-content p-8"
                src={logo}
                alt="kanban"
                width={153}
                height={26}
            />
            <hr className="mb-4 border-border" />
            <p className="mb-4 px-8 text-[13px] font-semibold uppercase tracking-widest text-alt-text">
                All Boards ({boards?.length})
            </p>
            <div className="h-[calc(100vh_-_262px)] overflow-y-auto p-8 pt-0">
                <div className="my-7 flex flex-col items-start gap-6">
                    {boards?.map((board) => (
                        <button
                            key={board.id}
                            onClick={() =>
                                dispatch({
                                    type: ACTIONS.SET_CURRENT,
                                    payload: { currentBoard: board },
                                })
                            }
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
            </div>
            <div className="flex flex-col items-start gap-2.5 p-8 py-6">
                <button
                    onClick={() =>
                        dispatch({
                            type: ACTIONS.SET_DIALOG_MODE,
                            payload: { mode: "create", for: "boardDialogMode" },
                        })
                    }
                    className="font-bold text-primary transition-opacity hover:opacity-80"
                >
                    <SpaceDashboardIcon
                        sx={{ marginRight: 1, position: "relative", bottom: 2 }}
                    />{" "}
                    Create New Board
                </button>
                <button
                    onClick={() => dispatch({ type: ACTIONS.TOGGLE_SIDE_BAR })}
                    className="font-semibold text-alt-text transition-opacity hover:opacity-60"
                >
                    <VisibilityOff
                        sx={{
                            fontSize: 19,
                            marginRight: 1,
                            position: "relative",
                            bottom: 1.5,
                        }}
                    />{" "}
                    Hide Sidebar
                </button>
            </div>
            <button
                onClick={() => dispatch({ type: ACTIONS.TOGGLE_SIDE_BAR })}
                className={clsx(
                    "absolute bottom-8 left-full grid place-content-center rounded-r-3xl bg-primary p-4 pl-5 transition-opacity hover:opacity-80",
                    !hideSideBar && "pointer-events-none opacity-0"
                )}
            >
                <Visibility sx={{ fontSize: 19 }} />
            </button>
        </nav>
    );
}
