import { Box, Typography } from "@mui/material";
import { Type_Access_mapper } from "../../domain/constants/TypeAccessMapper";
import { getRole } from "../../service/http/storage";
import BoxContainer from "../../shared/components/BoxContainer/BoxContainer";
import DashboardPaciente from "../../module/dashboard/DashboardPaciente";
import DashboardProfissional from "../../module/Consultas/components/DashboardProfissional";
import DashboardAdmin from "../../module/Consultas/components/DashboardAdmin";
import { IconLink } from "../../shared/components";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useState } from "react";
import ModalNovaConsulta from "../../module/Consultas/ModalNovaConsulta";

const Home = () => {
  const role = getRole();
  const [openModalConsulta, setOpenModalConsulta] = useState(false);
  const isProfessional = role === "profissional";
  const isAdmin = role === "admin";

  return (
    <BoxContainer>
      {isProfessional ? (
        <DashboardProfissional />
      ) : isAdmin ? (
        <DashboardAdmin />
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Typography
              color="primary"
              fontWeight={500}
              fontFamily={"Montserrat"}
              fontSize={18}
            >
              DASHBOARD {Type_Access_mapper[role].toUpperCase()}
            </Typography>

            <Box>
              <IconLink
                Icon={NoteAddIcon}
                label="Nova consulta"
                value="nova_consulta"
                onClick={() => setOpenModalConsulta(true)}
                color="blue"
              />
            </Box>
          </Box>
          <DashboardPaciente />

          <ModalNovaConsulta
            onClose={() => setOpenModalConsulta(false)}
            open={openModalConsulta}
          />
        </>
      )}
    </BoxContainer>
  );
};

export default Home;
