import BoxContainer from "../../shared/components/BoxContainer/BoxContainer";
import { Outlet } from "react-router-dom";

const Consultas = () => {
  return (
    <BoxContainer>
      <Outlet />
    </BoxContainer>
  );
};

export default Consultas;
