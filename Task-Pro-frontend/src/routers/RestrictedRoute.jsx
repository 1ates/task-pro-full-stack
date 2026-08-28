import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn, selectIsRefreshing } from "../redux/auth/selectors.js";

const RestrictedRoute = ({ component: Component, redirectTo = "/home" }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  const location = useLocation();

  if (isRefreshing) {
    return null;
  }

  return isLoggedIn ? <Navigate to={redirectTo} state={{ from: location }} replace /> : Component;
};

export default RestrictedRoute;
