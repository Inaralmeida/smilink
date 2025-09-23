import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../application/Hooks/useAuth";
import { ROUTES } from "../../domain/constants/Routes";

const PrivateRoute = () => {
  const { isAuth } = useAuth();
  return isAuth ? <Outlet /> : <Navigate to={ROUTES.auth.login} replace />;
};

export default PrivateRoute;
