import MenuIcon from "@mui/icons-material/Menu";
import { BottomNavigation, ToggleButton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { ItensHeaderNavigation } from "../../../domain/constants/ItensHeaderNavigation";
import IconLink from "../IconLink/IconLink";
import Logo from "../Logo/Logo";
import MenuSettings from "../MenuSettings/MenuSettings/MenuSettings";
import * as S from "./Header.styles";

const Header = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [showMenu, setShowMenu] = useState(false);
  const [currentPage, setcurrentPage] = useState("");
  return (
    <S.HeaderContainer>
      <S.LogoContainer>
        <Logo type="complete" color="white" size="sm" />
        {isMobile && (
          <ToggleButton
            value="check"
            selected={false}
            onChange={() => setShowMenu((showMenu) => !showMenu)}
            sx={{ border: `1px solid white` }}
          >
            <MenuIcon sx={{ color: "white" }} />
          </ToggleButton>
        )}
      </S.LogoContainer>

      {((showMenu && isMobile) || !isMobile) && (
        <BottomNavigation
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            flexDirection: isMobile ? "column" : "row",
            flex: 1,
          }}
          showLabels
          value={currentPage}
          onChange={(_, newValue) => {
            setcurrentPage(newValue);
          }}
        >
          {ItensHeaderNavigation.map((item) => (
            <>
              {item.permission.admin && (
                <IconLink
                  Icon={item.icon}
                  label={item.name}
                  value={item.name}
                  link={item.path}
                />
              )}
            </>
          ))}
          <MenuSettings />
        </BottomNavigation>
      )}
    </S.HeaderContainer>
  );
};

export default Header;
