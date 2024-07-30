import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Create from "./pages/Create";
import RecipeDetail from "./pages/RecipeDetail";
import Chart from "./pages/Chart";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { useSelector, useDispatch } from "react-redux";
import { login } from "./features/userSlice";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import { isAuthReady } from "./features/userSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.currentUser);
  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutes user={user}>
          <MainLayout />
        </ProtectedRoutes>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/create",
          element: <Create />,
        },
        {
          path: "/recipe/:id",
          element: <RecipeDetail />,
        },
        {
          path: "/chart",
          element: <Chart />,
        },
      ],
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" /> : <Login />,
    },
    {
      path: "/register",
      element: user ? <Navigate to="/" /> : <Register />,
    },
  ]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        dispatch(login(user));
        dispatch(isAuthReady());
      }
    });
  }, [user]);

  return isAuthReady && <RouterProvider router={routes} />;
}

export default App;
