import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { ROUTES } from "./Routes";

type MuiIcon = OverridableComponent<SvgIconTypeMap<object, "svg">>;

type ItemHeaderNavigation = {
  name: string;
  path: string;
  permission: {
    admin: boolean;
    paciente: boolean;
    profissional: boolean;
  };
  icon: MuiIcon;
};

export const ItensHeaderNavigation: ItemHeaderNavigation[] = [
  {
    name: "Home",
    path: `${ROUTES.home}`,
    permission: { admin: true, paciente: true, profissional: true },
    icon: HomeIcon,
  },
  {
    name: "Consultas",
    path: ROUTES.consultas.base,
    permission: { admin: true, paciente: true, profissional: true },
    icon: CalendarMonthIcon,
  },
  {
    name: "Agendar",
    path: ROUTES.agendar,
    permission: { admin: true, paciente: false, profissional: false },
    icon: EventIcon,
  },
  {
    name: "Pacientes",
    path: ROUTES.pacientes,
    permission: { admin: true, paciente: false, profissional: true },
    icon: PeopleIcon,
  },
  {
    name: "Profissionais",
    path: ROUTES.profissionais,
    permission: { admin: true, paciente: false, profissional: false },
    icon: PersonIcon,
  },
  {
    name: "Estoque",
    path: ROUTES.estoque,
    permission: { admin: true, paciente: false, profissional: false },
    icon: InventoryIcon,
  },
];
