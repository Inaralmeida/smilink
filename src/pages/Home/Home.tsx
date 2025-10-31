import { Box, Typography } from "@mui/material";
import { Type_Access_mapper } from "../../domain/constants/TypeAccessMapper";
import { getRole } from "../../service/http/storage";
import BoxContainer from "../../shared/components/BoxContainer/BoxContainer";
import DashboardPaciente from "../../module/dashboard/DashboardPaciente";
import { IconLink } from "../../shared/components";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useState } from "react";
import ModalNovaConsulta from "../../module/Consultas/ModalNovaConsulta";
import ModalNovoPaciente from "../../module/Pacientes/ModalNovoPaciente/ModalNovoPaciente";

const Home = () => {
  const role = getRole();
  const [openModalConsulta, setOpenModalConsulta] = useState(false);
  const [openModalNovoPaciente, setOpenModalNovoPaciente] = useState(false);
  const isProfessional = role === "profissional";
  const isAdmin = role === "admin";

  return (
    <BoxContainer>
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
          {!isProfessional && (
            <IconLink
              Icon={NoteAddIcon}
              label="Nova consulta"
              value="nova_consulta"
              onClick={() => setOpenModalConsulta(true)}
              color="blue"
            />
          )}

          {isAdmin && (
            <IconLink
              Icon={PersonAddAlt1Icon}
              label="Novo Paciente"
              value="novo_paciente"
              onClick={() => setOpenModalNovoPaciente(true)}
              color="blue"
            />
          )}
        </Box>
      </Box>
      <DashboardPaciente />

      {!isProfessional && (
        <ModalNovaConsulta
          onClose={() => setOpenModalConsulta(false)}
          open={openModalConsulta}
        />
      )}

      {isAdmin && (
        <ModalNovoPaciente
          onClose={() => setOpenModalNovoPaciente(false)}
          open={openModalNovoPaciente}
        />
      )}
    </BoxContainer>
  );
};

export default Home;
