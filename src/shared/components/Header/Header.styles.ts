import styled from "styled-components";

export const HeaderContainer = styled.header`
  width: 100%;
  padding: 6px 24px;
  background-color: ${(props) => props.theme.palette.primary.main};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  color: ${(props) => props.theme.palette.primary.contrastText};
  display: flex;
  flex-direction: row;

  @media screen and (max-width: 600px) {
    flex-direction: column;
    height: auto;
    padding: 6px;
  }
`;
export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media screen and (max-width: 600px) {
    width: 100%;
    justify-content: space-between;
  }
`;
export const Logo = styled.img`
  height: 50px;
`;
