/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography, useTheme } from "@mui/material";
import { Type_Access_mapper } from "../../../domain/constants/TypeAccessMapper";
import type { TypeAccess } from "../../../domain/enums/TypeAccess";

const TypeAccessText = ({
  type,
  color = "default",
  size = "sm",
}: {
  type: TypeAccess;
  color?: "default" | "white";
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  const theme = useTheme();
  const { primary } = theme.palette;
  const mapColor = {
    default: primary.main,
    white: primary.contrastText,
  };

  const sizes: any = {
    sm: "body2",
    md: "body1",
    lg: "h3",
    xl: "h1",
  };

  return (
    <Typography
      variant={sizes[size]}
      fontWeight={600}
      style={{
        color: mapColor[color],
        fontFamily: "Montserrat",
        letterSpacing: "5px",
      }}
    >
      {Type_Access_mapper[type].toUpperCase()}
    </Typography>
  );
};

export default TypeAccessText;
