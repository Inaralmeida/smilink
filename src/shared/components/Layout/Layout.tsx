import { type ReactNode } from "react";
import Header from "../Header/Header";
import MainContainer from "../MainContainer/MainContainer";
import { LayoutContainer } from "./layout.style";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContainer>
        <div>{children}</div>
      </MainContainer>
    </LayoutContainer>
  );
};

export default Layout;
