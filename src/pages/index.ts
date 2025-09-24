import { lazy } from "react";

const Home = lazy(() => import("./Home/Home"));
const Pacientes = lazy(() => import("./Pacientes/Pacientes"));

export { Home, Pacientes };
