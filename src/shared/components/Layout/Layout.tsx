import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import type { TRole } from "../../../domain/types/typeRoles";
import { getRole } from "../../../service/http/storage";
import Header from "../Header/Header";
import MainContainer from "../MainContainer/MainContainer";
import { LayoutContainer } from "./layout.style";

const Layout = () => {
  const role: TRole = getRole();
  return (
    <LayoutContainer>
      <Header role={role} />
      <MainContainer>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </MainContainer>
    </LayoutContainer>
  );
};

export default Layout;
