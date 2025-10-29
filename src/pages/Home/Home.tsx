import { Box, Typography } from "@mui/material";
import { Type_Access_mapper } from "../../domain/constants/TypeAccessMapper";
import { getRole } from "../../service/http/storage";
import BoxContainer from "../../shared/components/BoxContainer/BoxContainer";
import DashboardPaciente from "../../module/dashboard/DashboardPaciente";

const Home = () => {
  const role = getRole();
  return (
    <BoxContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
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
      </Box>
      <DashboardPaciente />
    </BoxContainer>
  );
};

export default Home;
