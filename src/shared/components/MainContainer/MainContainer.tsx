import { Box, useTheme } from "@mui/material";
import { type ReactNode } from "react";

const MainContainer = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: theme.palette.primary.contrastText,
      }}
    >
      <div>{children}</div>
    </Box>
  );
};

export default MainContainer;
