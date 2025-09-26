import { Typography, useTheme } from "@mui/material";
import { SIZE_LOGO } from "../../../../domain/enums/sizeLogo";

type TLogoTextProps = {
  color: "white" | "blue";
  size: "sm" | "md" | "lg" | "xl";
};

const LogoText = ({ color, size }: TLogoTextProps) => {
  const theme = useTheme();
  const primary = theme.palette.primary;
  const colorBlue = color === "blue" ? primary.main : primary.contrastText;
  return (
    <Typography
      variant="body2"
      color={colorBlue}
      fontSize={SIZE_LOGO[size]}
      style={{
        fontFamily: "Montserrat",
        letterSpacing: "5px",
        fontWeight: 400,
      }}
    >
      SmiLink
    </Typography>
  );
};

export default LogoText;
