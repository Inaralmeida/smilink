export type StatusAgendamento =
  | "agendado"
  | "em_atendimento"
  | "finalizado"
  | "cancelado";

export type TAgendamento = {
  id: string;
  profissionalId: string;
  profissionalNome: string;
  profissionalSobrenome: string;
  pacienteId: string;
  pacienteNome: string;
  pacienteSobrenome: string;
  data: string; // ISO string
  horario: string; // HH:mm
  procedimento: string;
  duracao: number; // em minutos
  status: StatusAgendamento;
  observacoes?: string;
  criadoEm: string; // ISO string
  atualizadoEm: string; // ISO string
};

// Tipo para eventos do React Big Calendar
export type EventAgendamento = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: TAgendamento;
  color?: string; // Cor do profissional
};
