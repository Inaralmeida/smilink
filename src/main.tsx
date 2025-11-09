import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Routes from "./shared/Router/Routes";
import { initializeLocalStorage } from "./shared/utils/localStorage";

// Inicializar localStorage com dados mock
initializeLocalStorage().catch((error) => {
  console.error("Erro ao inicializar localStorage:", error);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Routes />
  </StrictMode>
);
