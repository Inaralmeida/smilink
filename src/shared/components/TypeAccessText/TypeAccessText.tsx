import { Typography } from "@mui/material";
import { Type_Access_mapper } from "../../../domain/constants/TypeAccessMapper";
import type { TypeAccess } from "../../../domain/enums/TypeAccess";

const TypeAccessText = ({ type }: { type: TypeAccess }) => {
  return (
    <Typography
      variant="body2"
      fontWeight={600}
      style={{ color: "#037F8C", letterSpacing: "5px" }}
    >
      {Type_Access_mapper[type].toUpperCase()}
    </Typography>
  );
};

export default TypeAccessText;
