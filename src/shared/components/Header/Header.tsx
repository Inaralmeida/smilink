import MenuIcon from "@mui/icons-material/Menu";
import { BottomNavigation, Box, ToggleButton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useState } from "react";
import { ItensHeaderNavigation } from "../../../domain/constants/ItensHeaderNavigation";
import { ROUTES } from "../../../domain/constants/Routes";
import type { TRole } from "../../../domain/types/typeRoles";
import IconLink from "../IconLink/IconLink";
import Logo from "../Logo/Logo";
import MenuSettings from "../MenuSettings/MenuSettings/MenuSettings";
import TypeAccessText from "../TypeAccessText/TypeAccessText";
import * as S from "./Header.styles";

const Header = ({ role }: { role: TRole }) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [showMenu, setShowMenu] = useState(false);
  const [currentPage, setcurrentPage] = useState("");
  return (
    <S.HeaderContainer>
      <S.LogoContainer>
        <Box
          width={"fit-content"}
          display={"flex"}
          alignItems={"center"}
          gap={"6px"}
        >
          <Logo type="complete" color="white" size="sm" />
          <React.Fragment>|</React.Fragment>
          <TypeAccessText type={role} color="white" />
        </Box>
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
              {item.permission[role] && (
                <IconLink
                  Icon={item.icon}
                  label={item.name}
                  value={item.name}
                  link={
                    item.name === "Home" ? `${ROUTES.home}/${role}` : item.path
                  }
                />
              )}
            </>
          ))}
        </BottomNavigation>
      )}

      {!isMobile ? <MenuSettings /> : isMobile && showMenu && <MenuSettings />}
    </S.HeaderContainer>
  );
};

export default Header;
