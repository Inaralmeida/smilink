const STORAGE_KEYS = {
  PROFISSIONAIS: "smilink_profissionais",
  PACIENTES: "smilink_pacientes",
  AGENDAMENTOS: "smilink_agendamentos",
  CONSULTAS: "smilink_consultas",
  ESTOQUE: "smilink_estoque",
  INITIALIZED: "smilink_initialized",
} as const;

export const initializeLocalStorage = async (force = false) => {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (initialized === "true" && !force) {
    return;
  }
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

  localStorage.setItem(
    STORAGE_KEYS.PROFISSIONAIS,
    JSON.stringify(MOCK_PROFISSIONAIS)
  );

  localStorage.setItem(STORAGE_KEYS.PACIENTES, JSON.stringify(MOCK_PACIENTES));

  const agendamentos = gerarAgendamentosIniciais(
    MOCK_PROFISSIONAIS,
    MOCK_PACIENTES
  );
  localStorage.setItem(STORAGE_KEYS.AGENDAMENTOS, JSON.stringify(agendamentos));

  const consultas = await gerarConsultasIniciais(agendamentos, MOCK_PACIENTES);
  localStorage.setItem(STORAGE_KEYS.CONSULTAS, JSON.stringify(consultas));
  const hoje = new Date();
  const totalPacientes = MOCK_PACIENTES.length;
  const pacientesInativos = Math.min(3, Math.floor(totalPacientes * 0.05));

  const pacientesAtualizados = MOCK_PACIENTES.map((paciente, index) => {
    const consultasDoPaciente = consultas
      .filter((c) => c.pacienteId === paciente.id && c.status === "finalizada")
      .sort((a, b) => {
        const dataA = new Date(a.finalizadoEm || `${a.data}T${a.horario}`);
        const dataB = new Date(b.finalizadoEm || `${b.data}T${b.horario}`);
        return dataB.getTime() - dataA.getTime();
      });

    if (consultasDoPaciente.length > 0) {
      const ultimaConsulta = consultasDoPaciente[0];
      return {
        ...paciente,
        ultimaConsulta:
          ultimaConsulta.finalizadoEm ||
          `${ultimaConsulta.data}T${ultimaConsulta.horario}`,
      };
    } else {
      const isInativo = index < pacientesInativos;

      let mesesAtras: number;
      if (isInativo) {
        mesesAtras = 6 + Math.random() * 6;
      } else {
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

  localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
};

export const clearLocalStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};

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

  const agendamentos = gerarAgendamentosIniciais(
    MOCK_PROFISSIONAIS,
    MOCK_PACIENTES
  );

  const consultas = await gerarConsultasIniciais(agendamentos, MOCK_PACIENTES);
  localStorage.setItem(STORAGE_KEYS.CONSULTAS, JSON.stringify(consultas));

  const { garantirConsultaDemonstracao } = await import(
    "../../service/mock/consultas"
  );
  await garantirConsultaDemonstracao();

  return consultas;
};

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
      console.error("Falha ao setar item no localStorage", error);
      // Error handled silently
    }
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};

export { STORAGE_KEYS };
