import styled from "styled-components";

export const HeaderContainer = styled.header`
  width: 100%;
  padding: 6px 24px;
  background-color: ${(props) => props.theme.palette.primary.main};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  color: ${(props) => props.theme.palette.primary.contrastText};
`;
export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
export const Logo = styled.img`
  height: 50px;
`;
