import styled from "styled-components";
import { LogoIcon } from "./components";
import LogoText from "./components/LogoText";

type TLogoProps = {
  type: "icon" | "text" | "complete";
  color: "white" | "blue";
  size: "sm" | "md" | "lg" | "xl";
};

const Logo = ({ type, color, size }: TLogoProps) => {
  const isIcon = type === "icon";
  const isText = type === "text";
  const isComplete = type === "complete";

  return (
    <>
      {isIcon && <LogoIcon color={color} size={size} />}
      {isText && <LogoText color={color} size={size} />}
      {isComplete && (
        <LogoContainer>
          <LogoIcon color={color} size={size} />
          <LogoText color={color} size={size} />
        </LogoContainer>
      )}
    </>
  );
};

export default Logo;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;
