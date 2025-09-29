import { Typography, useTheme } from "@mui/material";
import { Type_Access_mapper } from "../../../domain/constants/TypeAccessMapper";
import type { TypeAccess } from "../../../domain/enums/TypeAccess";

const TypeAccessText = ({
  type,
  color = "default",
}: {
  type: TypeAccess;
  color: "default" | "white";
}) => {
  const theme = useTheme();
  const { primary } = theme.palette;
  const mapColor = {
    default: primary.main,
    white: primary.contrastText,
  };
  return (
    <Typography
      variant="body2"
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
