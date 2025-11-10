/**
 * Tipo de pagamento da consulta
 */
export type TipoPagamento = "convenio" | "particular";

/**
 * Status da consulta (diferente do agendamento - consulta é mais detalhado)
 */
export type StatusConsulta =
  | "agendada"
  | "em_andamento"
  | "finalizada"
  | "cancelada";

/**
 * Detalhes completos de uma consulta
 * Uma consulta é um agendamento que foi ou está sendo realizado
 */
export type TConsulta = {
  id: string;
  agendamentoId: string; // Referência ao agendamento original

  // Dados básicos
  profissionalId: string;
  profissionalNome: string;
  profissionalSobrenome: string;
  pacienteId: string;
  pacienteNome: string;
  pacienteSobrenome: string;

  // Data e horário
  data: string; // YYYY-MM-DD
  horario: string; // HH:MM
  horarioInicio?: string; // HH:MM - quando a consulta realmente começou
  horarioFim?: string; // HH:MM - quando a consulta terminou

  // Procedimentos
  procedimentoPrincipal: string; // Procedimento do agendamento
  procedimentosRealizados: string[]; // Procedimentos adicionais realizados

  // Materiais e recursos
  materiaisUtilizados: string[]; // Materiais odontológicos usados
  equipamentosUtilizados: string[]; // Equipamentos/recursos utilizados

  // Exames
  examesSolicitados: string[]; // Exames solicitados pelo profissional

  // Observações
  observacoes?: string; // Observações gerais
  observacoesProfissionais?: string; // Observações do profissional (pode ser adicionada após finalizar)

  // Dados médicos do paciente
  alergias?: string[]; // Alergias registradas durante a consulta
  condicoesMedicas?: string[]; // Condições médicas registradas durante a consulta

  // Receita médica
  receita?: string; // Texto da receita médica

  // Atestado médico
  atestado?: {
    emitido: boolean;
    cid?: string; // CID (Classificação Internacional de Doenças)
    dias?: number; // Quantidade de dias de afastamento
  };

  // Status e pagamento
  status: StatusConsulta;
  tipoPagamento: TipoPagamento;
  convenio?: string; // Nome do convênio se for convênio

  // Timestamps
  criadoEm: string; // ISO string
  atualizadoEm: string; // ISO string
  finalizadoEm?: string; // ISO string - quando foi finalizada
};
