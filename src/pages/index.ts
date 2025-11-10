import { lazy } from "react";

const Home = lazy(() => import("./Home/Home"));
const Pacientes = lazy(() => import("./Pacientes/Pacientes"));
const Profissional = lazy(() => import("./Profissional/Profissional"));
const Agenda = lazy(() => import("./Agenda/Agenda"));
const Consultas = lazy(() => import("./Consultas/Consultas"));
const Estoque = lazy(() => import("./Estoque/Estoque"));
const Perfil = lazy(() => import("./Perfil/Perfil"));

export { Home, Pacientes, Profissional, Agenda, Consultas, Estoque, Perfil };
