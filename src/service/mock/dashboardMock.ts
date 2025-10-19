// dashboardMock.ts

import type { TRole } from "../../domain/types/typeRoles";

export const dashboardMock = [
  {
    id: "paciente-1",
    role: "paciente" as TRole,
    title: "Visão do Paciente",
    description: "Indicadores e informações relevantes para o paciente",
    items: [
      {
        id: "prox-consultas",
        name: "Próximas Consultas",
        chart: "line",
        metrics: ["data", "horário", "profissional"],
      },
      {
        id: "historico",
        name: "Histórico de Consultas",
        chart: "bar",
        metrics: ["consultas realizadas", "profissional"],
      },
      {
        id: "status",
        name: "Status de Solicitações",
        chart: "pie",
        metrics: ["aguardando", "confirmada", "desmarcada"],
      },
      {
        id: "tratamentos-ativos",
        name: "Tratamentos em Andamento",
        chart: "bar",
        metrics: ["ortodontia", "implante", "limpeza", "outros"],
      },
      {
        id: "financeiro",
        name: "Financeiro",
        chart: "pie",
        metrics: ["pagos", "pendentes", "em aberto"],
      },
      {
        id: "avaliacoes",
        name: "Avaliações de Atendimento",
        chart: "line",
        metrics: ["satisfação", "tempo de espera", "qualidade"],
      },
    ],
  },
  {
    id: "prof-1",
    role: "profissional" as TRole,
    title: "Visão do Profissional",
    description: "Agenda e métricas para dentistas/médicos",
    items: [
      {
        id: "agenda-dia",
        name: "Agenda do Dia",
        chart: "bar",
        metrics: ["consultas confirmadas", "canceladas", "encaixes"],
      },
      {
        id: "consultas-mes",
        name: "Consultas do Mês",
        chart: "area",
        metrics: ["realizadas", "faltas", "novos pacientes"],
      },
      {
        id: "alertas",
        name: "Alertas de Pacientes",
        chart: "pie",
        metrics: ["prioritários", "tratamento contínuo"],
      },
      {
        id: "tempo-medio",
        name: "Tempo Médio por Consulta",
        chart: "line",
        metrics: ["ortodontia", "implante", "limpeza", "outros"],
      },
      {
        id: "produtividade",
        name: "Produtividade",
        chart: "bar",
        metrics: ["consultas/dia", "consultas/semana"],
      },
      {
        id: "feedback-pacientes",
        name: "Feedback dos Pacientes",
        chart: "pie",
        metrics: ["ótimo", "bom", "regular", "ruim"],
      },
    ],
  },
  {
    id: "admin-1",
    role: "admin" as TRole,
    title: "Visão da Gestão",
    description: "Indicadores gerais da clínica",
    items: [
      {
        id: "total-pacientes",
        name: "Pacientes Ativos",
        chart: "line",
        metrics: ["total pacientes ativos"],
      },
      {
        id: "total-consultas",
        name: "Consultas Mensais",
        chart: "bar",
        metrics: ["realizadas", "canceladas", "faltas"],
      },
      {
        id: "ranking-prof",
        name: "Produção por Profissional",
        chart: "bar",
        metrics: ["atendimentos por profissional"],
      },
      {
        id: "financeiro-clinica",
        name: "Receitas e Despesas",
        chart: "line",
        metrics: ["receita total", "despesas fixas", "despesas variáveis"],
      },
      {
        id: "ocupacao",
        name: "Taxa de Ocupação",
        chart: "pie",
        metrics: ["consultórios disponíveis", "consultórios ocupados"],
      },
      {
        id: "crescimento",
        name: "Crescimento Mensal de Pacientes",
        chart: "area",
        metrics: ["novos pacientes", "pacientes recorrentes"],
      },
    ],
  },
];
