import { CssBaseline, Typography } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { AuthProvider } from "../../application/context/AuthContext";
import { ROUTES } from "../../domain/constants/Routes";
import { Home, Pacientes } from "../../pages";
import Login from "../../pages/login/Login";
import { Layout } from "../components";
import { theme } from "../ui/style/theme";
import PrivateRoute from "./PrivateRoute";
const Routes = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <SCThemeProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <CssBaseline />

            <Switch>
              <Route element={<PrivateRoute />}>
                <Route element={<Layout />}>
                  <Route path={`${ROUTES.home}/:role`} element={<Home />} />
                  <Route path={ROUTES.pacientes} element={<Pacientes />} />
                  <Route
                    path="*"
                    element={<Typography variant="h1">404</Typography>}
                  />
                </Route>
              </Route>
              <Route path={ROUTES.auth.login} element={<Login />} />
              <Route
                path={ROUTES.notFound}
                element={<Typography variant="h1">404</Typography>}
              />
            </Switch>
          </BrowserRouter>
        </AuthProvider>
      </SCThemeProvider>
    </MuiThemeProvider>
  );
};

export default Routes;
