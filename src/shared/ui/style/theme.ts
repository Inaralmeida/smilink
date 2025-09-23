import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#037F8C",
      dark: "#045159",
      light: "#03A6A6",
      contrastText: "#fff",
    },
    secondary: {
      main: "#E7F2F4",
      dark: "#045159",
      light: "#037F8C",
      contrastText: "#037F8C",
    },
    error: {
      main: "#B81C11",
      dark: "#8F2315",
      light: "#FC7B7B",
      contrastText: "#fff",
    },
    warning: {
      main: "#FFD700",
      dark: "#D49E39",
      light: "#FFF800",
      contrastText: "#333A3B",
    },
    success: {
      main: "#8AD649",
      dark: "#598A2F",
      light: "#BAD69C",
      contrastText: "#fff",
    },
    grey: {
      900: "#333A3B",
      500: "#CCCCCC",
      100: "#F2F2F2",
    },
    background: {
      default: "#F2F2F2",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#333A3B",
      secondary: "#045159",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#037F8C",
          textDecoration: "none",
          fontWeight: 500,
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
  },
});
