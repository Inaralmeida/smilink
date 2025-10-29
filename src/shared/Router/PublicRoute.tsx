import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../../domain/constants/Routes";
import { useAuth } from "../../application/context/AuthContext";

const PublicRoute = () => {
  const { isAuth } = useAuth();
  return isAuth ? <Navigate to={ROUTES.home} replace /> : <Outlet />;
};

export default PublicRoute;
