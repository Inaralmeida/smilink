import { CssBaseline, Typography } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { ROUTES } from "../../domain/constants/Routes";
import { Home, Pacientes } from "../../pages";
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
              {/* --- Rotas Protegidas (Só para logados) --- */}
              <Route element={<PrivateRoute />}>
                <Route element={<Layout />}>
                  <Route path={ROUTES.home} element={<Home />} />
                  <Route path={ROUTES.pacientes} element={<Pacientes />} />
                  <Route
                    path="*"
                    element={<Typography variant="h1">404</Typography>}
                  />
                </Route>
              </Route>

              {/* --- Rotas Públicas (Só para NÃO logados) --- */}
              <Route element={<PublicRoute />}>
                <Route path={ROUTES.auth.login} element={<Login />} />
              </Route>

              {/* Rota 404 geral (pode ser ajustada) */}
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
