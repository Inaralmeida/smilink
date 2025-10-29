import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../application/context/AuthContext";
import { ROUTES } from "../../domain/constants/Routes";
import { Box, CircularProgress } from "@mui/material";

const PublicRoute = () => {
  const { isAuth, loading } = useAuth();
  const homeRoute = ROUTES.home;
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

  return isAuth ? <Navigate to={homeRoute} replace /> : <Outlet />;
};

export default PublicRoute;
