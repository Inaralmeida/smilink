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
    ],
  },
];
