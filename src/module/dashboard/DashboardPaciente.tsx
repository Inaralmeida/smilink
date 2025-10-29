import { Box, Grid, Paper, Typography } from "@mui/material";
import { MockDashPacientes } from "../../service/mock/dashboardPaciente";

const DashboardPaciente = () => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="body1" textAlign="center">
            Próxima consulta
          </Typography>

          <Box>
            {MockDashPacientes.proximasConsultas.map((consulta, i) => (
              <Box key={i}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent={"center"}
                  alignItems="center"
                >
                  <Typography color="primary" variant="h2">
                    {consulta.dia}{" "}
                  </Typography>
                  <Typography> </Typography>
                  <Typography variant="h5">{consulta.hora}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="body1" textAlign="center">
            Ultima consulta
          </Typography>

          <Box>
            {MockDashPacientes.ultimaConsulta.map((consulta, i) => (
              <Box key={i}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent={"center"}
                  alignItems="center"
                >
                  <Typography color="primary" variant="h2">
                    {consulta.dia}{" "}
                  </Typography>
                  <Typography> </Typography>
                  <Typography variant="h5">{consulta.hora}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
        <Paper sx={{ padding: 2, height: "160px" }}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
          >
            <Typography variant="body1" textAlign="center">
              Consultas Realizadas
            </Typography>

            <Typography color="green" variant="h2" textAlign="center">
              15
            </Typography>
            <Typography variant="caption">Out 24 - Out 25</Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, sm: 4, md: 2 }} height="100%">
        <Paper sx={{ padding: 2, height: "160px" }}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
          >
            <Typography variant="body1" textAlign="center">
              Consultas Canceladas
            </Typography>

            <Typography color="error" variant="h2" textAlign="center">
              03
            </Typography>
            <Typography variant="caption">Out 24 - Out 25</Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
        <Paper sx={{ padding: 2, height: "160px" }}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
          >
            <Typography variant="body1" textAlign="center">
              Consultas Remarcadas
            </Typography>

            <Typography color="warning" variant="h2" textAlign="center">
              07
            </Typography>
            <Typography variant="caption">Out 24 - Out 25</Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardPaciente;
