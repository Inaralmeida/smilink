import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import MainContainer from "../MainContainer/MainContainer";
import { LayoutContainer } from "./layout.style";

const Layout = () => {
  return (
    <LayoutContainer>
      <Header />
      <MainContainer>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </MainContainer>
    </LayoutContainer>
  );
};

export default Layout;
