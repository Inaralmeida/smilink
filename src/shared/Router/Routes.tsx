import { CssBaseline, Typography } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { ROUTES } from "../../domain/constants/Routes";
import { Home, Pacientes, Profissional, Agenda, Consultas } from "../../pages";
import { Layout } from "../components";
import { theme } from "../ui/style/theme";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute"; // 1. IMPORTE O NOVO COMPONENTE
import { AuthProvider } from "../../application/context/AuthContext";
import Login from "../../pages/login/Login";

const Routes = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <SCThemeProvider theme={theme}>
        <BrowserRouter>
          <CssBaseline />
          <AuthProvider>
            <Switch>
              <Route element={<PrivateRoute />}>
                <Route element={<Layout />}>
                  <Route path={ROUTES.home} element={<Home />} />
                  <Route path={ROUTES.pacientes} element={<Pacientes />} />
                  <Route
                    path={ROUTES.profissionais}
                    element={<Profissional />}
                  />
                  <Route path={ROUTES.agendar} element={<Agenda />} />
                  <Route path={ROUTES.consultas.base} element={<Consultas />} />
                  <Route
                    path={ROUTES.consultas.historicoProfissional}
                    element={<Consultas />}
                  />
                  <Route
                    path="*"
                    element={<Typography variant="h1">404</Typography>}
                  />
                </Route>
              </Route>

              <Route element={<PublicRoute />}>
                <Route path={ROUTES.auth.login} element={<Login />} />
              </Route>

              <Route
                path={ROUTES.notFound}
                element={<Typography variant="h1">404</Typography>}
              />
            </Switch>
          </AuthProvider>
        </BrowserRouter>
      </SCThemeProvider>
    </MuiThemeProvider>
  );
};

export default Routes;
