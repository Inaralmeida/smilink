import { Box, Typography } from "@mui/material";
import { Type_Access_mapper } from "../../domain/constants/TypeAccessMapper";
import { getRole } from "../../service/http/storage";
import BoxContainer from "../../shared/components/BoxContainer/BoxContainer";
import DashboardPaciente from "../../module/dashboard/DashboardPaciente";
import { IconLink } from "../../shared/components";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { ROUTES } from "../../domain/constants/Routes";

const Home = () => {
  const role = getRole();

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
              link={`${ROUTES.consultas.base}/nova`}
              color="blue"
            />
          )}

          {isAdmin && (
            <IconLink
              Icon={PersonAddAlt1Icon}
              label="Novo Paciente"
              value="novo_paciente"
              link="/novo-paciente"
              color="blue"
            />
          )}
        </Box>
      </Box>
      <DashboardPaciente />
    </BoxContainer>
  );
};

export default Home;
