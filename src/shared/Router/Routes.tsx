import { CssBaseline, Typography } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { ROUTES } from "../../domain/constants/Routes";
import { Home, Pacientes } from "../../pages";
import { Layout } from "../components";
import { theme } from "../ui/style/theme";
import PrivateRoute from "./PrivateRoute";
const Routes = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <SCThemeProvider theme={theme}>
        <BrowserRouter>
          <CssBaseline />

          <Switch>
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
            <Route
              path={ROUTES.auth.login}
              element={<Typography variant="h1">login</Typography>}
            />
            <Route
              path={ROUTES.notFound}
              element={<Typography variant="h1">404</Typography>}
            />
          </Switch>
        </BrowserRouter>
      </SCThemeProvider>
    </MuiThemeProvider>
  );
};

export default Routes;
