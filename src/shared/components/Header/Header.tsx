import Logo from "../Logo/Logo";
import * as S from "./Header.styles";

const Header = () => {
  return (
    <S.HeaderContainer>
      <S.LogoContainer>
        <Logo type="complete" color="white" size="sm" />
      </S.LogoContainer>
    </S.HeaderContainer>
  );
};

export default Header;
