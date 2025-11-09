import { v4 as uuidv4 } from "uuid";
import type { TConsulta, TipoPagamento } from "../../domain/types/consulta";
import type { TAgendamento } from "../../domain/types/agendamento";
import type { TPaciente } from "../../domain/types/paciente";
import { storage, STORAGE_KEYS } from "../../shared/utils/localStorage";
import { MATERIAIS_ODONTOLOGICOS } from "./materiais";
import { EXAMES_ODONTOLOGICOS } from "./exames";

// Exportar para uso em outros módulos
export { MATERIAIS_ODONTOLOGICOS, EXAMES_ODONTOLOGICOS };
export { buscarMateriais } from "./materiais";
export { buscarExames } from "./exames";

/**
 * Converte um agendamento finalizado em uma consulta
 */
export const criarConsultaDeAgendamento = (
  agendamento: TAgendamento,
  tipoPagamento: TipoPagamento = "particular",
  convenio?: string
): TConsulta => {
  const agora = new Date().toISOString();

  return {
    id: uuidv4(),
    agendamentoId: agendamento.id,
    profissionalId: agendamento.profissionalId,
    profissionalNome: agendamento.profissionalNome,
    profissionalSobrenome: agendamento.profissionalSobrenome,
    pacienteId: agendamento.pacienteId,
    pacienteNome: agendamento.pacienteNome,
    pacienteSobrenome: agendamento.pacienteSobrenome,
    data: agendamento.data,
    horario: agendamento.horario,
    procedimentoPrincipal: agendamento.procedimento,
    procedimentosRealizados: [agendamento.procedimento],
    materiaisUtilizados: [],
    equipamentosUtilizados: [],
    examesSolicitados: [],
    observacoes: agendamento.observacoes,
    status: agendamento.status === "finalizado" ? "finalizada" : "agendada",
    tipoPagamento,
    convenio: tipoPagamento === "convenio" ? convenio : undefined,
    criadoEm: agora,
    atualizadoEm: agora,
  };
};

/**
 * Gera consultas iniciais usando o MOC específico para a tela de consultas
 * Gera dados para vários meses incluindo dezembro de 2005 e janeiro de 2001/2006
 * Nota: Os parâmetros agendamentos e pacientes não são usados, pois o MOC gera dados independentes
 */
export const gerarConsultasIniciais = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _agendamentos: TAgendamento[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _pacientes: TPaciente[]
): Promise<TConsulta[]> => {
  // Importar profissionais reais do MOC
  const { MOCK_PROFISSIONAIS } = await import("./profissionais");

  // Usar o MOC específico para gerar consultas completas
  const { gerarConsultasMockCompletas } = await import("./consultasMock");

  const { consultas } = gerarConsultasMockCompletas(MOCK_PROFISSIONAIS);

  return consultas;
};

/**
 * Busca todas as consultas
 */
export const fetchConsultas = async (): Promise<TConsulta[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const consultas = storage.get<TConsulta[]>(STORAGE_KEYS.CONSULTAS, []);
  console.log(`📋 fetchConsultas: ${consultas.length} consultas encontradas`);
  if (consultas.length > 0) {
    // Log da distribuição por mês
    const distribuicaoPorMes = consultas.reduce((acc, c) => {
      const mes = c.data.substring(0, 7); // YYYY-MM
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log("📊 Distribuição por mês:", distribuicaoPorMes);
  }
  return consultas;
};

/**
 * Busca consulta por ID
 */
export const fetchConsultaById = async (
  id: string
): Promise<TConsulta | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const consultas = storage.get<TConsulta[]>(STORAGE_KEYS.CONSULTAS, []);
  return consultas.find((c) => c.id === id) || null;
};

/**
 * Busca consultas por profissional
 */
export const fetchConsultasPorProfissional = async (
  profissionalId: string
): Promise<TConsulta[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const consultas = await fetchConsultas();
  return consultas.filter((c) => c.profissionalId === profissionalId);
};

/**
 * Busca consultas por paciente
 */
export const fetchConsultasPorPaciente = async (
  pacienteId: string
): Promise<TConsulta[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const consultas = await fetchConsultas();
  return consultas.filter((c) => c.pacienteId === pacienteId);
};

/**
 * Busca consultas do dia para um profissional
 */
export const fetchConsultasDoDia = async (
  profissionalId: string,
  data: string
): Promise<TConsulta[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const consultas = await fetchConsultasPorProfissional(profissionalId);
  return consultas.filter((c) => c.data === data);
};

/**
 * Inicia uma consulta a partir de um agendamento
 * Cria a consulta se não existir, ou atualiza se já existir
 */
export const iniciarConsultaDeAgendamento = async (
  agendamentoId: string,
  horarioInicio: string,
  pacientes: TPaciente[]
): Promise<TConsulta> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Verificar se já existe consulta para esse agendamento
  const consultas = storage.get<TConsulta[]>(STORAGE_KEYS.CONSULTAS, []);
  const consultaExistente = consultas.find(
    (c) => c.agendamentoId === agendamentoId
  );

  if (consultaExistente) {
    // Atualizar consulta existente
    return (await iniciarConsulta(
      consultaExistente.id,
      horarioInicio
    )) as TConsulta;
  }

  // Buscar agendamento
  const { fetchAgendamentoById } = await import("./agendamentos");
  const agendamento = await fetchAgendamentoById(agendamentoId);

  if (!agendamento) {
    throw new Error("Agendamento não encontrado");
  }

  // Buscar paciente para determinar tipo de pagamento
  const paciente = pacientes.find((p) => p.id === agendamento.pacienteId);
  const tipoPagamento: TipoPagamento = paciente?.tem_plano_saude
    ? "convenio"
    : "particular";
  const convenio = paciente?.name_plano_saude;

  // Criar consulta
  const consulta = criarConsultaDeAgendamento(
    agendamento,
    tipoPagamento,
    convenio
  );
  consulta.status = "em_andamento";
  consulta.horarioInicio = horarioInicio;

  // Salvar consulta
  consultas.push(consulta);
  storage.set(STORAGE_KEYS.CONSULTAS, consultas);

  // Atualizar status do agendamento
  const { atualizarAgendamento } = await import("./agendamentos");
  await atualizarAgendamento(agendamentoId, { status: "em_atendimento" });

  return consulta;
};

/**
 * Cria uma nova consulta
 */
export const criarConsulta = async (
  consulta: Omit<TConsulta, "id" | "criadoEm" | "atualizadoEm">
): Promise<TConsulta> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const consultas = storage.get<TConsulta[]>(STORAGE_KEYS.CONSULTAS, []);

  const agora = new Date().toISOString();
  const novaConsulta: TConsulta = {
    ...consulta,
    id: uuidv4(),
    criadoEm: agora,
    atualizadoEm: agora,
  };

  consultas.push(novaConsulta);
  storage.set(STORAGE_KEYS.CONSULTAS, consultas);

  return novaConsulta;
};

/**
 * Atualiza uma consulta
 */
export const atualizarConsulta = async (
  id: string,
  dados: Partial<TConsulta>
): Promise<TConsulta | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const consultas = storage.get<TConsulta[]>(STORAGE_KEYS.CONSULTAS, []);

  const index = consultas.findIndex((c) => c.id === id);
  if (index === -1) return null;

  consultas[index] = {
    ...consultas[index],
    ...dados,
    atualizadoEm: new Date().toISOString(),
  };

  storage.set(STORAGE_KEYS.CONSULTAS, consultas);

  return consultas[index];
};

/**
 * Inicia uma consulta (muda status e salva horário de início)
 */
export const iniciarConsulta = async (
  id: string,
  horarioInicio: string
): Promise<TConsulta | null> => {
  return atualizarConsulta(id, {
    status: "em_andamento",
    horarioInicio,
  });
};

/**
 * Finaliza uma consulta
 */
export const finalizarConsulta = async (
  id: string,
  dados: {
    procedimentosRealizados?: string[];
    materiaisUtilizados?: string[];
    equipamentosUtilizados?: string[];
    examesSolicitados?: string[];
    observacoes?: string;
    horarioFim: string;
  }
): Promise<TConsulta | null> => {
  const agora = new Date().toISOString();
  const consultaAtualizada = await atualizarConsulta(id, {
    status: "finalizada",
    finalizadoEm: agora,
    ...dados,
  });

  // Atualizar status do agendamento para finalizado
  if (consultaAtualizada) {
    const { atualizarAgendamento } = await import("./agendamentos");
    await atualizarAgendamento(consultaAtualizada.agendamentoId, {
      status: "finalizado",
    });

    // Atualizar última consulta do paciente
    const { fetchPacienteById, atualizarPaciente } = await import(
      "./pacientes"
    );
    const paciente = await fetchPacienteById(consultaAtualizada.pacienteId);
    if (paciente) {
      await atualizarPaciente(consultaAtualizada.pacienteId, {
        ultimaConsulta: agora,
      });
    }
  }

  return consultaAtualizada;
};

/**
 * Adiciona observação profissional a uma consulta finalizada
 */
export const adicionarObservacaoProfissional = async (
  id: string,
  observacoes: string
): Promise<TConsulta | null> => {
  return atualizarConsulta(id, {
    observacoesProfissionais: observacoes,
  });
};

// Mock inicial de consultas (será gerado a partir de agendamentos)
export const MOCK_CONSULTAS: TConsulta[] = [];
