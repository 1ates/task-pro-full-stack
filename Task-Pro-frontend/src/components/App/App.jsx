import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn, selectIsRefreshing } from "../../redux/auth/selectors.js";
import { refreshUser } from "../../redux/auth/operations.js";
import PrivateRoute from "../../routers/PrivateRoute.jsx";
import RestrictedRoute from "../../routers/RestrictedRoute.jsx";
import { Loader } from "../Loader/Loader.jsx";
import "./App.module.css";

const WelcomePage = lazy(() => import("../../pages/WelcomePage/WelcomePage.jsx"));
const AuthPage = lazy(() => import("../../pages/AuthPage/AuthPage.jsx"));
const HomePage = lazy(() => import("../../pages/HomePage/HomePage.jsx"));
const ScreensPage = lazy(() => import("../../pages/ScreensPage/ScreensPage.jsx"));
const NotFoundPage = lazy(() => import("../../pages/NotFound/NotFound.jsx"));

function App() {
  const dispatch = useDispatch();
  const isRefreshing = useSelector(selectIsRefreshing);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  if (isRefreshing) return <Loader />;

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Default route — redirect based on auth state */}
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/home" : "/welcome"} replace />}
        />

        {/* Public: Welcome */}
        <Route
          path="/welcome"
          element={<RestrictedRoute component={<WelcomePage />} redirectTo="/home" />}
        />

        {/* Public: Auth (login / register) */}
        <Route
          path="/auth/:id"
          element={<RestrictedRoute component={<AuthPage />} redirectTo="/home" />}
        />

        {/* Private: Home (dashboard) */}
        <Route
          path="/home"
          element={<PrivateRoute component={<HomePage />} redirectTo="/welcome" />}
        />

        {/* Private: Board screens */}
        <Route
          path="/home/:boardId"
          element={<PrivateRoute component={<ScreensPage />} redirectTo="/welcome" />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;