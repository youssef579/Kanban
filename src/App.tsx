// Font
import "@fontsource-variable/plus-jakarta-sans";
// Tailwind classes
import "index.css";
// MUI Theme
import { createTheme, ThemeProvider } from "@mui/material/styles";
// Custom components
import Toaster from "components/Toaster";
import Header from "components/Header";
import ColumnList from "components/ColumnList";
import Sidebar from "components/Sidebar";
import WriteBoard from "components/WriteBoard";
import WriteTask from "components/WriteTask";
// Custom hooks
import useStore from "hooks/useStore";
// utils
import clsx from "clsx";

const theme = createTheme({
    typography: {
        fontFamily: "inherit",
    },
    palette: {
        mode: "dark",
        primary: {
            main: "#FFF",
        },
        secondary: {
            main: "#635FC7",
        },
    },
});

export default function App() {
    const hideSideBar = useStore((state) => state.hideSideBar);

    return (
        <>
            <ThemeProvider theme={theme}>
                <Sidebar />
                <main
                    className={clsx(
                        "absolute inset-0 flex flex-col transition-all",
                        !hideSideBar && "lg:left-[300px]"
                    )}
                >
                    <Header />
                    <ColumnList />
                    <WriteBoard />
                    <WriteTask />
                </main>
            </ThemeProvider>
            <Toaster id="root" />
        </>
    );
}
