import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../application/context/AuthContext";
import { ROUTES } from "../../domain/constants/Routes";

const PrivateRoute = () => {
  const { isAuth } = useAuth();
  return isAuth ? <Outlet /> : <Navigate to={ROUTES.auth.login} />;
};

export default PrivateRoute;
