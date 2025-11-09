import { useMemo } from "react";
import BoxContainer from "../../shared/components/BoxContainer/BoxContainer";
import { useAuth } from "../../application/context/AuthContext";
import DashboardAdmin from "../../module/Consultas/components/DashboardAdmin";
import HistoricoPaciente from "../../module/Consultas/components/HistoricoPaciente";
import ConsultaProfissional from "../../module/Consultas/components/ConsultaProfissional";
import RoleProtectedRoute from "../../shared/Router/RoleProtectedRoute";
import { CircularProgress, Box, Typography } from "@mui/material";

const Consultas = () => {
  const { role, loading } = useAuth();

  const componenteConsultas = useMemo(() => {
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    switch (role) {
      case "admin":
        return <DashboardAdmin />;
      case "paciente":
        return <HistoricoPaciente />;
      case "profissional":
        return <ConsultaProfissional />;
      default:
        return (
          <Box>
            <Typography>Role não reconhecido</Typography>
          </Box>
        );
    }
  }, [role, loading]);

  return (
    <RoleProtectedRoute allowedRoles={["admin", "paciente", "profissional"]}>
      <BoxContainer>{componenteConsultas}</BoxContainer>
    </RoleProtectedRoute>
  );
};

export default Consultas;
