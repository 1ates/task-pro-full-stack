import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { refreshUser } from "../../redux/auth/operations.js";
import { selectIsLoggedIn, selectIsRefreshing, selectTheme } from "../../redux/auth/selectors.js";
import PrivateRoute from "../../routers/PrivateRoute.jsx";
import RestrictedRoute from "../../routers/RestrictedRoute.jsx";
import { Loader } from "../Loader/Loader.jsx";
import "./App.module.css";

const WelcomePage = lazy(() => import("../../pages/WelcomePage/WelcomePage.jsx"));
const AuthPage = lazy(() => import("../../pages/AuthPage/AuthPage.jsx"));
const ForgotPasswordPage = lazy(() => import("../../pages/ForgotPasswordPage/ForgotPasswordPage.jsx"));
const ResetPasswordPage = lazy(() => import("../../pages/ResetPasswordPage/ResetPasswordPage.jsx"));
const HomePage = lazy(() => import("../../pages/HomePage/HomePage.jsx"));
const NotFoundPage = lazy(() => import("../../pages/NotFoundPage/NotFoundPage.jsx"));

function App() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  if (isRefreshing) return <Loader />;

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path='/' element={<Navigate to={isLoggedIn ? "/home" : "/welcome"} replace />} />
        <Route path='/welcome' element={<RestrictedRoute component={<WelcomePage />} redirectTo='/home' />} />
        <Route path='/auth/:id' element={<RestrictedRoute component={<AuthPage />} redirectTo='/home' />} />
        <Route
          path='/auth/forgot-password'
          element={<RestrictedRoute component={<ForgotPasswordPage />} redirectTo='/home' />}
        />
        <Route path='/home' element={<PrivateRoute component={<HomePage />} redirectTo='/welcome' />} />
        <Route path='/home/:boardId' element={<PrivateRoute component={<HomePage />} redirectTo='/welcome' />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
