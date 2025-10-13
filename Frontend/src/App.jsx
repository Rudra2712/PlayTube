import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser } from "./app/Slices/authSlice";
import { healthCheck } from "./app/Slices/healthcheck";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LoadingPage from "./components/Loading/LoadingPage";
import { clearToastsOnRouteChange } from "./utils/toast";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [initialLoading, setInitialLoading] = useState(true);
  const authLoading = useSelector((state) => state.auth?.loading);

  // Clear toasts on route change
  useEffect(() => {
    clearToastsOnRouteChange();
  }, [location.pathname]);

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
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={true}
        theme="dark"
        limit={3}
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
    </>
  );
}

export default App;
