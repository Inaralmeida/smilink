import { Typography } from "@mui/material";
import { SIZE_LOGO } from "../../../../domain/enums/sizeLogo";

type TLogoTextProps = {
  color: "white" | "blue";
  size: "sm" | "md" | "lg" | "xl";
};

const LogoText = ({ color, size }: TLogoTextProps) => {
  return (
    <Typography
      variant="body2"
      color={color}
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
