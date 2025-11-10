/**
 * Utilitários para gerenciar localStorage
 * Persiste dados mock no localStorage para simular um backend
 */

const STORAGE_KEYS = {
  PROFISSIONAIS: "smilink_profissionais",
  PACIENTES: "smilink_pacientes",
  AGENDAMENTOS: "smilink_agendamentos",
  CONSULTAS: "smilink_consultas",
  INITIALIZED: "smilink_initialized",
} as const;

/**
 * Inicializa o localStorage com dados mock se ainda não foi inicializado
 */
export const initializeLocalStorage = async (force = false) => {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (initialized === "true" && !force) {
    return; // Já foi inicializado (a menos que force seja true)
  }

  // Importar dados mock dinamicamente para evitar problemas de ciclo
  const { MOCK_PROFISSIONAIS } = await import(
    "../../service/mock/profissionais"
  );
  const { MOCK_PACIENTES } = await import("../../service/mock/pacientes");
  const { gerarAgendamentosIniciais } = await import(
    "../../service/mock/agendamentos"
  );
  const { gerarConsultasIniciais } = await import(
    "../../service/mock/consultas"
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

  // Gerar e salvar consultas iniciais usando o MOC específico
  const consultas = await gerarConsultasIniciais(agendamentos, MOCK_PACIENTES);
  localStorage.setItem(STORAGE_KEYS.CONSULTAS, JSON.stringify(consultas));
  console.log(
    `✅ ${consultas.length} consultas geradas e salvas no localStorage`
  );

  // As consultas já foram geradas acima usando o MOC específico
  // que garante distribuição adequada de pacientes inativos

  // Atualizar última consulta dos pacientes reais
  // A maioria dos pacientes terá consultas recentes, apenas 2-3 serão inativos
  const hoje = new Date();
  const totalPacientes = MOCK_PACIENTES.length;
  const pacientesInativos = Math.min(3, Math.floor(totalPacientes * 0.05)); // Máximo 3 inativos

  const pacientesAtualizados = MOCK_PACIENTES.map((paciente, index) => {
    // Buscar consultas do paciente real nas consultas geradas
    const consultasDoPaciente = consultas
      .filter((c) => c.pacienteId === paciente.id && c.status === "finalizada")
      .sort((a, b) => {
        const dataA = new Date(a.finalizadoEm || `${a.data}T${a.horario}`);
        const dataB = new Date(b.finalizadoEm || `${b.data}T${b.horario}`);
        return dataB.getTime() - dataA.getTime();
      });

    if (consultasDoPaciente.length > 0) {
      // Usar a consulta mais recente do paciente
      const ultimaConsulta = consultasDoPaciente[0];
      return {
        ...paciente,
        ultimaConsulta:
          ultimaConsulta.finalizadoEm ||
          `${ultimaConsulta.data}T${ultimaConsulta.horario}`,
      };
    } else {
      // Distribuir pacientes: apenas 2-3 inativos (6+ meses), resto recentes
      // Determinar se este paciente será inativo (apenas os primeiros 2-3)
      const isInativo = index < pacientesInativos;

      let mesesAtras: number;
      if (isInativo) {
        // Inativos: 6-12 meses atrás
        mesesAtras = 6 + Math.random() * 6;
      } else {
        // Ativos: últimos 5 meses (distribuição)
        mesesAtras = Math.random() * 5;
      }

      const dataUltimaConsulta = new Date(hoje);
      dataUltimaConsulta.setMonth(dataUltimaConsulta.getMonth() - mesesAtras);
      dataUltimaConsulta.setDate(
        dataUltimaConsulta.getDate() - Math.floor(Math.random() * 28)
      );

      return {
        ...paciente,
        ultimaConsulta: dataUltimaConsulta.toISOString(),
      };
    }
  });
  localStorage.setItem(
    STORAGE_KEYS.PACIENTES,
    JSON.stringify(pacientesAtualizados)
  );

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
 * Regenera apenas os dados de consultas (útil para atualizar dados)
 */
export const regenerarConsultas = async () => {
  const { gerarConsultasIniciais } = await import(
    "../../service/mock/consultas"
  );
  const { MOCK_PROFISSIONAIS } = await import(
    "../../service/mock/profissionais"
  );
  const { MOCK_PACIENTES } = await import("../../service/mock/pacientes");
  const { gerarAgendamentosIniciais } = await import(
    "../../service/mock/agendamentos"
  );

  // Gerar agendamentos (necessário para a função, mesmo que não seja usado)
  const agendamentos = gerarAgendamentosIniciais(
    MOCK_PROFISSIONAIS,
    MOCK_PACIENTES
  );

  // Gerar novas consultas
  const consultas = await gerarConsultasIniciais(agendamentos, MOCK_PACIENTES);
  localStorage.setItem(STORAGE_KEYS.CONSULTAS, JSON.stringify(consultas));

  console.log(`✅ Regeneradas ${consultas.length} consultas`);
  console.log(
    `📊 Consultas por mês:`,
    consultas.reduce((acc, c) => {
      const mes = c.data.substring(0, 7); // YYYY-MM
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  );

  // Garantir consulta de demonstração após regenerar
  const { garantirConsultaDemonstracao } = await import(
    "../../service/mock/consultas"
  );
  await garantirConsultaDemonstracao();

  return consultas;
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
