import { lazy } from "react";

const Home = lazy(() => import("./Home/Home"));
const Pacientes = lazy(() => import("./Pacientes/Pacientes"));
const Profissional = lazy(() => import("./Profissional/Profissional"));

export { Home, Pacientes, Profissional };
