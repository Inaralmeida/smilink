/* eslint-disable @typescript-eslint/no-explicit-any */
import { BottomNavigationAction } from "@mui/material";
interface IconLinkProps {
  Icon: React.ComponentType<any>;
  label: string;
  value: string;
  link: string;
  onClick?: (event: any) => void;
  backgroundColor?: boolean;
  color: "blue" | "white";
}

const IconLink = ({
  Icon,
  label,
  value,
  link,
  onClick,
  backgroundColor = false,
  color = "white",
}: IconLinkProps) => {
  return (
    <BottomNavigationAction
      sx={(theme) => ({
        backgroundColor: backgroundColor
          ? theme.palette.primary.main
          : "transparent",
        color:
          color === "white"
            ? theme.palette.primary.contrastText
            : theme.palette.primary.main,
        "&.Mui-selected": {
          color:
            color === "white"
              ? theme.palette.primary.contrastText
              : theme.palette.primary.main,
        },
        "@media screen and (max-width: 600px)": {
          width: "100%",
          display: "flex",
          flexDirection: "row",
          maxWidth: "100%",
          justifyContent: "flex-start",
          gap: "12px",
          padding: "6px",
        },
      })}
      showLabel
      label={label}
      icon={<Icon />}
      value={value}
      href={link}
      onClick={onClick}
    />
  );
};

export default IconLink;
