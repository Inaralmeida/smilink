/**
 * Utilitários para gerenciar localStorage
 * Persiste dados mock no localStorage para simular um backend
 */

const STORAGE_KEYS = {
  PROFISSIONAIS: "smilink_profissionais",
  PACIENTES: "smilink_pacientes",
  AGENDAMENTOS: "smilink_agendamentos",
  INITIALIZED: "smilink_initialized",
} as const;

/**
 * Inicializa o localStorage com dados mock se ainda não foi inicializado
 */
export const initializeLocalStorage = async () => {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (initialized === "true") {
    return; // Já foi inicializado
  }

  // Importar dados mock dinamicamente para evitar problemas de ciclo
  const { MOCK_PROFISSIONAIS } = await import(
    "../../service/mock/profissionais"
  );
  const { MOCK_PACIENTES } = await import("../../service/mock/pacientes");
  const { gerarAgendamentosIniciais } = await import(
    "../../service/mock/agendamentos"
  );

  // Salvar profissionais
  localStorage.setItem(
    STORAGE_KEYS.PROFISSIONAIS,
    JSON.stringify(MOCK_PROFISSIONAIS)
  );

  // Salvar pacientes
  localStorage.setItem(STORAGE_KEYS.PACIENTES, JSON.stringify(MOCK_PACIENTES));

  // Gerar e salvar agendamentos iniciais
  const agendamentos = gerarAgendamentosIniciais(
    MOCK_PROFISSIONAIS,
    MOCK_PACIENTES
  );
  localStorage.setItem(STORAGE_KEYS.AGENDAMENTOS, JSON.stringify(agendamentos));

  // Marcar como inicializado
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
};

/**
 * Limpa todos os dados do localStorage (útil para reset)
 */
export const clearLocalStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};

/**
 * Funções genéricas para ler/escrever no localStorage
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage: ${key}`, error);
    }
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};

/**
 * Exportar chaves de storage
 */
export { STORAGE_KEYS };
