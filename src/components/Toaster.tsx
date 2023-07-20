import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const Toaster = ({ id }: { id: string }) => (
    <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="font-sans"
        enableMultiContainer
        containerId={id}
    />
);

export default Toaster;
