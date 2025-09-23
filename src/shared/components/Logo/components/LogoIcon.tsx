import styled from "styled-components";
import { SIZE_LOGO } from "../../../../domain/enums/sizeLogo";
import logoAzul from "../../../assets/images/logo-azul.png";
import logoBranco from "../../../assets/images/logo-branco.png";

type TLogoIconProps = {
  color: "white" | "blue";
  size: "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
};

const LogoIcon = ({ color, size, backgroundColor }: TLogoIconProps) => {
  const image = color === "white" ? logoBranco : logoAzul;

  return (
    <StyledLogo
      src={image}
      alt="logo smilink"
      size={SIZE_LOGO[size]}
      backgroundColor={backgroundColor}
    />
  );
};

export default LogoIcon;

const StyledLogo = styled.img<{
  size: number;
  backgroundColor?: string;
}>`
  width: ${(props) => props.size + 12}px;

  ${(props) =>
    props.backgroundColor ? `background-color: ${props.backgroundColor};` : ``}
  border-radius: 50%;
`;
