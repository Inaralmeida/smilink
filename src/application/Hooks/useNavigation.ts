import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../domain/constants/Routes";
import type { TRole } from "../../domain/types/typeRoles";

export const useNavigation = () => {
  const navigate = useNavigate();
  const { role } = useParams();

  const navigationToHome = () => {
    navigate(`${ROUTES.home}/${role}`);
  };

  const navigationToHomeFromLogin = (role: TRole) => {
    navigate(`${ROUTES.home}/${role}`);
  };

  const navigationToLogin = () => {
    navigate(ROUTES.auth.login);
  };

  return {
    navigationToHome,
    navigationToHomeFromLogin,
    navigationToLogin,
  };
};
