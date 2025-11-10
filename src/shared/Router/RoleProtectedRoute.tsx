import { Navigate } from "react-router-dom";
import { useAuth } from "../../application/context/AuthContext";
import { ROUTES } from "../../domain/constants/Routes";
import { Box, CircularProgress, Typography } from "@mui/material";
import type { TRole } from "../../domain/types/typeRoles";

type RoleProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: TRole[];
};

const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) => {
  const { role, loading } = useAuth();

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

  if (!role || !allowedRoles.includes(role as TRole)) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            gap: 2,
          }}
        >
          <Typography variant="h4">Acesso Negado</Typography>
          <Typography variant="body1">
            Você não tem permissão para acessar esta página.
          </Typography>
        </Box>
        <Navigate to={ROUTES.home} replace />
      </>
    );
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
