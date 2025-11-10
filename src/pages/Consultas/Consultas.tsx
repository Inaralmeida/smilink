import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import BoxContainer from "../../shared/components/BoxContainer/BoxContainer";
import { useAuth } from "../../application/context/AuthContext";
import DashboardAdmin from "../../module/Consultas/components/DashboardAdmin";
import HistoricoPaciente from "../../module/Consultas/components/HistoricoPaciente";
import ConsultaProfissional from "../../module/Consultas/components/ConsultaProfissional";
import HistoricoConsultasProfissional from "../../module/Consultas/components/HistoricoConsultasProfissional";
import RoleProtectedRoute from "../../shared/Router/RoleProtectedRoute";
import { CircularProgress, Box, Typography } from "@mui/material";
import { ROUTES } from "../../domain/constants/Routes";

const Consultas = () => {
  const { role, loading } = useAuth();
  const location = useLocation();

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

    // Se for profissional e estiver na rota de histórico
    if (
      role === "profissional" &&
      location.pathname === ROUTES.consultas.historicoProfissional
    ) {
      return <HistoricoConsultasProfissional />;
    }

    switch (role) {
      case "admin":
        return <DashboardAdmin />;
      case "paciente":
        return <HistoricoPaciente />;
      case "profissional":
        // Profissional sempre vê as consultas do dia em /consultas
        return <ConsultaProfissional />;
      default:
        return (
          <Box>
            <Typography>Role não reconhecido</Typography>
          </Box>
        );
    }
  }, [role, loading, location.pathname]);

  return (
    <RoleProtectedRoute allowedRoles={["admin", "paciente", "profissional"]}>
      <BoxContainer>{componenteConsultas}</BoxContainer>
    </RoleProtectedRoute>
  );
};

export default Consultas;
