import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Routes from "./shared/Router/Routes";
import {
  initializeLocalStorage,
  regenerarConsultas,
} from "./shared/utils/localStorage";

// Inicializar localStorage com dados mock
// SEMPRE regenerar consultas para garantir dados atualizados do MOC
(async () => {
  try {
    await initializeLocalStorage();
    // Aguardar um pouco para garantir que tudo foi inicializado
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("🔄 Forçando regeneração de consultas...");
    await regenerarConsultas();
    console.log("✅ Consultas regeneradas com sucesso!");

    // Disparar evento para componentes recarregarem
    window.dispatchEvent(new Event("consultas-regeneradas"));
  } catch (error) {
    console.error("❌ Erro ao inicializar/regenerar:", error);
  }
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Routes />
  </StrictMode>
);
