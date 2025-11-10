import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../application/context/AuthContext";
import { ROUTES } from "../../domain/constants/Routes";
import { Box, CircularProgress } from "@mui/material";

const PrivateRoute = () => {
  const { isAuth, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuth ? <Outlet /> : <Navigate to={ROUTES.auth.login} replace />;
};

export default PrivateRoute;
