import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Routes from "./shared/Router/Routes";
import {
  initializeLocalStorage,
  regenerarConsultas,
} from "./shared/utils/localStorage";

(async () => {
  try {
    await initializeLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await regenerarConsultas();
    const { garantirConsultaDemonstracao } = await import(
      "./service/mock/consultas"
    );
    await garantirConsultaDemonstracao();
    window.dispatchEvent(new Event("consultas-regeneradas"));
  } catch (error) {
    console.error(error);
  }
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Routes />
  </StrictMode>
);
