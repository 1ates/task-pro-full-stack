import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/selectors.js";
import PrivateRoute from "../../routers/PrivateRoute.jsx";
import RestrictedRoute from "../../routers/RestrictedRoute.jsx";
import "./App.module.css";

const WelcomePage = lazy(() =>
  import("../../pages/WelcomePage/WelcomePage.jsx")
);
const AuthPage = lazy(() => import("../../pages/AuthPage/AuthPage.jsx"));
const HomePage = lazy(() => import("../../pages/HomePage/HomePage.jsx"));
const ScreensPage = lazy(() =>
  import("../../pages/ScreensPage/ScreensPage.jsx")
);
const NotFoundPage = lazy(() =>
  import("../../pages/NotFound/NotFound.jsx")
);

function App() {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Default route — redirect based on auth state */}
        <Route
          path="/"
          element={
            <Navigate to={isLoggedIn ? "/home" : "/welcome"} replace />
          }
        />

        {/* Public: Welcome */}
        <Route
          path="/welcome"
          element={
            <RestrictedRoute
              component={<WelcomePage />}
              redirectTo="/home"
            />
          }
        />

        {/* Public: Auth (login / register) */}
        <Route
          path="/auth/:id"
          element={
            <RestrictedRoute
              component={<AuthPage />}
              redirectTo="/home"
            />
          }
        />

        {/* Private: Home (dashboard) */}
        <Route
          path="/home"
          element={
            <PrivateRoute
              component={<HomePage />}
              redirectTo="/welcome"
            />
          }
        />

        {/* Private: Board screens */}
        <Route
          path="/home/:boardId"
          element={
            <PrivateRoute
              component={<ScreensPage />}
              redirectTo="/welcome"
            />
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
