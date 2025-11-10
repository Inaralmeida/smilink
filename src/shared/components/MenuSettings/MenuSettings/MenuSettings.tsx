import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "../../../../application/Hooks/useNavigation";
import { clearToken, removeUser } from "../../../../service/http/storage";
import IconLink from "../../IconLink/IconLink";
import { useAuth } from "../../../../application/context/AuthContext";
import { ROUTES } from "../../../../domain/constants/Routes";

const MenuSettings = () => {
  const { handleSetAuth } = useAuth();
  const { navigationToLogin } = useNavigation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePerfil = () => {
    navigate(ROUTES.perfil);
    handleClose();
  };

  const handleLogout = () => {
    handleSetAuth(false);
    removeUser();
    clearToken();
    navigationToLogin();
    handleClose();
  };
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <IconLink
          Icon={AccountCircleIcon}
          label="Perfil"
          value="Perfil"
          link=""
          color="white"
          onClick={handleClick}
          aria-controls={open ? "Configurações" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        />
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handlePerfil}>
          <Avatar /> Perfil
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default MenuSettings;
