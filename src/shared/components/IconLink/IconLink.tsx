/* eslint-disable @typescript-eslint/no-explicit-any */
import { BottomNavigationAction } from "@mui/material";
interface IconLinkProps {
  Icon: React.ComponentType<any>;
  label: string;
  value: string;
  link: string;
  onClick?: (event: any) => void;
}

const IconLink = ({ Icon, label, value, link, onClick }: IconLinkProps) => {
  return (
    <BottomNavigationAction
      sx={(theme) => ({
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        "&.Mui-selected": {
          color: theme.palette.primary.contrastText,
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
