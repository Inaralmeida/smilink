import { CssBaseline, ThemeProvider, Typography } from "@mui/material";
import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";
import { theme } from "../ui/style/theme";
const Routes = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <Switch>
          <Route
            path="/"
            element={<Typography variant="h1">Home</Typography>}
          />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default Routes;
