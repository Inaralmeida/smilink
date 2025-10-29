// dashboardMock.ts

import type { TRole } from "../../domain/types/typeRoles";
import { theme } from "../../shared/ui/style/theme";

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
        mockData: [
          {
            name: "Agosto",
            data: "2025-08-01",
            horario: "10:00",
            profissional: "Dr. João",
          },
          {
            name: "Setembro",
            data: "2025-09-01",
            horario: "10:00",
            profissional: "Dr. João",
          },
          {
            name: "Outubro",
            data: "2025-10-01",
            horario: "10:00",
            profissional: "Dr. João",
          },
        ],
        metrics: [
          {
            dataKey: "data",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.main,
          },
          {
            dataKey: "horário",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.main,
          },
          {
            dataKey: "profissional",
            type: "monotone",
            stroke: theme.palette.warning.main,
            fill: theme.palette.warning.main,
          },
        ],
      },
      {
        id: "historico",
        name: "Histórico de Consultas",
        chart: "bar",
        metrics: [
          {
            dataKey: "consultas realizadas",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "profissional",
            type: "monotone",
            stroke: theme.palette.warning.main,
            fill: theme.palette.warning.light,
          },
        ],
      },
      {
        id: "status",
        name: "Status de Solicitações",
        chart: "pie",
        metrics: [
          {
            dataKey: "aguardando",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "confirmada",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.light,
          },
          {
            dataKey: "desmarcada",
            type: "monotone",
            stroke: theme.palette.warning.main,
            fill: theme.palette.warning.light,
          },
        ],
      },
      {
        id: "tratamentos-ativos",
        name: "Tratamentos em Andamento",
        chart: "bar",
        metrics: [
          {
            dataKey: "ortodontia",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "implante",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.light,
          },
          {
            dataKey: "limpeza",
            type: "monotone",
            stroke: theme.palette.warning.main,
            fill: theme.palette.warning.light,
          },
          {
            dataKey: "outros",
            type: "monotone",
            stroke: theme.palette.error.main,
            fill: theme.palette.error.light,
          },
        ],
      },
      {
        id: "financeiro",
        name: "Financeiro",
        chart: "pie",
        metrics: [
          {
            dataKey: "pagos",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "pendentes",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.light,
          },
          {
            dataKey: "em aberto",
            type: "monotone",
            stroke: theme.palette.warning.main,
            fill: theme.palette.warning.light,
          },
        ],
      },
      {
        id: "avaliacoes",
        name: "Avaliações de Atendimento",
        chart: "line",
        metrics: [
          {
            dataKey: "satisfação",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "tempo de espera",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.light,
          },
          {
            dataKey: "qualidade",
            type: "monotone",
            stroke: theme.palette.warning.main,
            fill: theme.palette.warning.light,
          },
        ],
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
        metrics: [
          {
            dataKey: "consultas confirmadas",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "canceladas",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.light,
          },
          {
            dataKey: "encaixes",
            type: "monotone",
            stroke: theme.palette.warning.main,
            fill: theme.palette.warning.light,
          },
        ],
      },
      {
        id: "consultas-mes",
        name: "Consultas do Mês",
        chart: "area",
        metrics: [
          {
            dataKey: "realizadas",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "faltas",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.light,
          },
          {
            dataKey: "novos pacientes",
            type: "monotone",
            stroke: theme.palette.warning.main,
            fill: theme.palette.warning.light,
          },
        ],
      },
      {
        id: "alertas",
        name: "Alertas de Pacientes",
        chart: "pie",
        metrics: [
          {
            dataKey: "prioritários",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "tratamento contínuo",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.light,
          },
        ],
      },
      {
        id: "tempo-medio",
        name: "Tempo Médio por Consulta",
        chart: "line",
        metrics: [
          {
            dataKey: "ortodontia",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "implante",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.light,
          },
          {
            dataKey: "limpeza",
            type: "monotone",
            stroke: theme.palette.warning.main,
            fill: theme.palette.warning.light,
          },
          {
            dataKey: "outros",
            type: "monotone",
            stroke: theme.palette.error.main,
            fill: theme.palette.error.light,
          },
        ],
      },
      {
        id: "produtividade",
        name: "Produtividade",
        chart: "bar",
        metrics: [
          {
            dataKey: "consultas/dia",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "consultas/semana",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.light,
          },
        ],
      },
      {
        id: "feedback-pacientes",
        name: "Feedback dos Pacientes",
        chart: "pie",
        metrics: [
          {
            dataKey: "ótimo",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "bom",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.light,
          },
          {
            dataKey: "regular",
            type: "monotone",
            stroke: theme.palette.warning.main,
            fill: theme.palette.warning.light,
          },
          {
            dataKey: "ruim",
            type: "monotone",
            stroke: theme.palette.error.main,
            fill: theme.palette.error.light,
          },
        ],
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
        metrics: [
          {
            dataKey: "total pacientes ativos",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
        ],
      },
      {
        id: "total-consultas",
        name: "Consultas Mensais",
        chart: "bar",
        metrics: [
          {
            dataKey: "realizadas",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "canceladas",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.light,
          },
          {
            dataKey: "faltas",
            type: "monotone",
            stroke: theme.palette.warning.main,
            fill: theme.palette.warning.light,
          },
        ],
      },
      {
        id: "ranking-prof",
        name: "Produção por Profissional",
        chart: "bar",
        metrics: [
          {
            dataKey: "atendimentos por profissional",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
        ],
      },
      {
        id: "financeiro-clinica",
        name: "Receitas e Despesas",
        chart: "line",
        metrics: [
          {
            dataKey: "receita total",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "despesas fixas",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.light,
          },
          {
            dataKey: "despesas variáveis",
            type: "monotone",
            stroke: theme.palette.warning.main,
            fill: theme.palette.warning.light,
          },
        ],
      },
      {
        id: "ocupacao",
        name: "Taxa de Ocupação",
        chart: "pie",
        metrics: [
          {
            dataKey: "consultórios disponíveis",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "consultórios ocupados",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.light,
          },
        ],
      },
      {
        id: "crescimento",
        name: "Crescimento Mensal de Pacientes",
        chart: "area",
        metrics: [
          {
            dataKey: "novos pacientes",
            type: "monotone",
            stroke: theme.palette.primary.main,
            fill: theme.palette.primary.light,
          },
          {
            dataKey: "pacientes recorrentes",
            type: "monotone",
            stroke: theme.palette.secondary.main,
            fill: theme.palette.secondary.light,
          },
        ],
      },
    ],
  },
];
