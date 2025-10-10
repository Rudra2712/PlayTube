import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser } from "./app/Slices/authSlice";
import { healthCheck } from "./app/Slices/healthcheck";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import LoadingPage from "./components/Loading/LoadingPage";

function App() {
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = useState(true);
  const authLoading = useSelector((state) => state.auth?.loading);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await dispatch(healthCheck()).unwrap();
        await dispatch(getCurrentUser()).unwrap();
      } catch (error) {
        // Handle initialization errors silently
      } finally {
        // Show loading for at least 1.5 seconds for better UX
        setTimeout(() => {
          setInitialLoading(false);
        }, 1500);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (initialLoading) {
    return <LoadingPage message="Initializing PlayTube..." />;
  }

  return (
    <>
      <Outlet />
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition="Bounce"
      />
    </>
  );
}

export default App;
