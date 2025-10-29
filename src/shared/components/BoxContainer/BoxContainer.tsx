import { Box, useTheme } from "@mui/material";
import React from "react";

const BoxContainer = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "95%",
        margin: "0 auto",
        my: "12px",
        height: "100%",
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "24px",
        borderRadius: "8px",
        backgroundColor: theme.palette.secondary.main,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {children}
    </Box>
  );
};

export default BoxContainer;
