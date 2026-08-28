import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn, selectIsRefreshing } from "../redux/auth/selectors.js";

const PrivateRoute = ({ component: Component, redirectTo = "/welcome" }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  const location = useLocation();
  const redirect = !isLoggedIn && !isRefreshing;

  return redirect ? <Navigate to={redirectTo} state={{ from: location }} replace /> : Component;
};

export default PrivateRoute;
