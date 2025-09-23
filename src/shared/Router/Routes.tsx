import { CssBaseline, Typography } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { ROUTES } from "../../domain/constants/Routes";
import { Home } from "../../pages";
import { theme } from "../ui/style/theme";
import PrivateRoute from "./PrivateRoute";
const Routes = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <SCThemeProvider theme={theme}>
        <BrowserRouter>
          <CssBaseline />
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route element={<PrivateRoute />}>
                <Route path={ROUTES.home} element={<Home />} />
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
          </Suspense>
        </BrowserRouter>
      </SCThemeProvider>
    </MuiThemeProvider>
  );
};

export default Routes;
