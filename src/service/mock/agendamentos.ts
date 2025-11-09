import type {
  TAgendamento,
  StatusAgendamento,
} from "../../domain/types/agendamento";
import type { TProfissional } from "../../domain/types/profissional";
import type { TPaciente } from "../../domain/types/paciente";

// Lista de procedimentos odontológicos
const procedimentos = [
  "Consulta de Rotina",
  "Limpeza e Profilaxia",
  "Restauração",
  "Extração",
  "Tratamento de Canal",
  "Clareamento Dental",
  "Avaliação Ortodôntica",
  "Manutenção de Aparelho",
  "Implante",
  "Prótese",
  "Periodontia",
  "Cirurgia",
  "Radiografia",
  "Avaliação Inicial",
];

// Durações padrão por procedimento (em minutos)
const duracaoPorProcedimento: Record<string, number> = {
  "Consulta de Rotina": 30,
  "Limpeza e Profilaxia": 45,
  Restauração: 60,
  Extração: 30,
  "Tratamento de Canal": 90,
  "Clareamento Dental": 60,
  "Avaliação Ortodôntica": 45,
  "Manutenção de Aparelho": 30,
  Implante: 120,
  Prótese: 60,
  Periodontia: 60,
  Cirurgia: 120,
  Radiografia: 15,
  "Avaliação Inicial": 30,
};

// Status possíveis (removido - não utilizado)
// const statusPossiveis: StatusAgendamento[] = [
//   "agendado",
//   "em_atendimento",
//   "finalizado",
//   "cancelado",
// ];

/**
 * Gera uma data aleatória nos próximos 30 dias
 */
const gerarDataAleatoria = (): string => {
  const hoje = new Date();
  const diasNoFuturo = Math.floor(Math.random() * 30);
  const data = new Date(hoje);
  data.setDate(data.getDate() + diasNoFuturo);
  return data.toISOString().split("T")[0]; // YYYY-MM-DD
};

/**
 * Gera um horário aleatório no horário comercial (8h às 18h)
 */
const gerarHorarioAleatorio = (): string => {
  const hora = Math.floor(Math.random() * 10) + 8; // 8 a 17
  const minutos = Math.random() > 0.5 ? "00" : "30";
  return `${hora.toString().padStart(2, "0")}:${minutos}`;
};

/**
 * Gera agendamentos iniciais baseados em profissionais e pacientes
 */
export const gerarAgendamentosIniciais = (
  profissionais: TProfissional[],
  pacientes: TPaciente[]
): TAgendamento[] => {
  const agendamentos: TAgendamento[] = [];
  const profissionaisAtivos = profissionais.filter((p) => !p.arquivado);
  const pacientesAtivos = pacientes.filter((p) => !p.arquivado);

  if (profissionaisAtivos.length === 0 || pacientesAtivos.length === 0) {
    return agendamentos;
  }

  // Gerar entre 20 e 40 agendamentos
  const quantidadeAgendamentos = Math.floor(Math.random() * 21) + 20;

  for (let i = 0; i < quantidadeAgendamentos; i++) {
    const profissional =
      profissionaisAtivos[
        Math.floor(Math.random() * profissionaisAtivos.length)
      ];
    const paciente =
      pacientesAtivos[Math.floor(Math.random() * pacientesAtivos.length)];
    const procedimento =
      procedimentos[Math.floor(Math.random() * procedimentos.length)];
    const data = gerarDataAleatoria();
    const horario = gerarHorarioAleatorio();
    const duracao = duracaoPorProcedimento[procedimento] || 30;

    // Determinar status baseado na data
    const dataAgendamento = new Date(data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dataAgendamento.setHours(0, 0, 0, 0);

    let status: StatusAgendamento = "agendado";
    if (dataAgendamento < hoje) {
      // Se a data já passou, pode ser finalizado ou cancelado
      status = Math.random() > 0.1 ? "finalizado" : "cancelado";
    } else if (dataAgendamento.getTime() === hoje.getTime()) {
      // Se é hoje, pode estar em atendimento
      status = Math.random() > 0.7 ? "em_atendimento" : "agendado";
    }

    const agora = new Date();
    const criadoEm = new Date(
      agora.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(); // Criado entre 30 dias atrás e agora

    const agendamento: TAgendamento = {
      id: `agendamento-${Date.now()}-${i}`,
      profissionalId: profissional.id,
      profissionalNome: profissional.nome,
      profissionalSobrenome: profissional.sobrenome,
      pacienteId: paciente.id,
      pacienteNome: paciente.nome,
      pacienteSobrenome: paciente.sobrenome,
      data,
      horario,
      procedimento,
      duracao,
      status,
      observacoes:
        Math.random() > 0.7 ? `Observações do agendamento ${i + 1}` : undefined,
      criadoEm,
      atualizadoEm: criadoEm,
    };

    agendamentos.push(agendamento);
  }

  return agendamentos;
};

/**
 * Busca agendamentos do localStorage
 */
export const fetchAgendamentos = async (): Promise<TAgendamento[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  return storage.get<TAgendamento[]>(STORAGE_KEYS.AGENDAMENTOS, []);
};

/**
 * Busca agendamento por ID
 */
export const fetchAgendamentoById = async (
  id: string
): Promise<TAgendamento | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const agendamentos = storage.get<TAgendamento[]>(
    STORAGE_KEYS.AGENDAMENTOS,
    []
  );
  return agendamentos.find((a) => a.id === id) || null;
};

/**
 * Cria um novo agendamento
 */
export const criarAgendamento = async (
  agendamento: Omit<TAgendamento, "id" | "criadoEm" | "atualizadoEm">
): Promise<TAgendamento> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const agendamentos = storage.get<TAgendamento[]>(
    STORAGE_KEYS.AGENDAMENTOS,
    []
  );

  const agora = new Date().toISOString();
  const novoAgendamento: TAgendamento = {
    ...agendamento,
    id: `agendamento-${Date.now()}`,
    criadoEm: agora,
    atualizadoEm: agora,
  };

  agendamentos.push(novoAgendamento);
  storage.set(STORAGE_KEYS.AGENDAMENTOS, agendamentos);

  return novoAgendamento;
};

/**
 * Atualiza um agendamento
 */
export const atualizarAgendamento = async (
  id: string,
  dados: Partial<TAgendamento>
): Promise<TAgendamento | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const agendamentos = storage.get<TAgendamento[]>(
    STORAGE_KEYS.AGENDAMENTOS,
    []
  );

  const index = agendamentos.findIndex((a) => a.id === id);
  if (index === -1) return null;

  agendamentos[index] = {
    ...agendamentos[index],
    ...dados,
    atualizadoEm: new Date().toISOString(),
  };

  storage.set(STORAGE_KEYS.AGENDAMENTOS, agendamentos);

  return agendamentos[index];
};

/**
 * Cancela um agendamento
 */
export const cancelarAgendamento = async (id: string): Promise<void> => {
  await atualizarAgendamento(id, { status: "cancelado" });
};

/**
 * Inicia atendimento
 */
export const iniciarAtendimento = async (id: string): Promise<void> => {
  await atualizarAgendamento(id, { status: "em_atendimento" });
};

/**
 * Finaliza atendimento
 */
export const finalizarAtendimento = async (id: string): Promise<void> => {
  await atualizarAgendamento(id, { status: "finalizado" });
};
