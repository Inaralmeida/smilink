import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../domain/constants/Routes";
import { useConsultasDoDia } from "../hooks/useConsultas";
import { useAuth } from "../../../application/context/AuthContext";
import ModalHorariosProfissional from "../../Profissional/components/ModalHorariosProfissional";
import { fetchProfissionais } from "../../../service/mock/profissionais";
import type { TProfissional } from "../../../domain/types/profissional";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import type { View } from "react-big-calendar";
import { parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { TAgendamento } from "../../../domain/types/agendamento";
import { fetchAgendamentos } from "../../../service/mock/agendamentos";
import { obterCorProfissional } from "../../Agenda/utils/colors";
import type { EventAgendamento } from "../../../domain/types/agendamento";

// Configurar localizador para date-fns
const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: ptBR }),
  getDay,
  locales,
});

// Dados mockados para o dashboard
const DADOS_MOCK_DASHBOARD = {
  consultasMes: 45,
  consultasRemarcadas: 8,
  consultasCanceladas: 3,
  procedimentos: [
    { nome: "Limpeza e Profilaxia", quantidade: 15 },
    { nome: "Restauração", quantidade: 12 },
    { nome: "Consulta de Rotina", quantidade: 10 },
    { nome: "Tratamento de Canal", quantidade: 5 },
    { nome: "Extração", quantidade: 3 },
  ],
};

const DashboardProfissional = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dataHoje = format(new Date(), "yyyy-MM-dd");
  const { consultas, loading } = useConsultasDoDia(user?.id || "", dataHoje);
  const [modalHorariosOpen, setModalHorariosOpen] = useState(false);
  const [profissional, setProfissional] = useState<TProfissional | null>(null);
  const [agendamentos, setAgendamentos] = useState<TAgendamento[]>([]);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(false);
  const [viewCalendario, setViewCalendario] = useState<View>(Views.MONTH);

  // Data do mês a ser exibido no calendário
  // Por padrão, mostrar novembro de 2025 onde há mais agendamentos para o profissional Inara
  const dataMesAtual = useMemo(() => {
    const hoje = new Date();
    // Se for o profissional Inara, mostrar novembro de 2025 (onde há mais dados)
    // Caso contrário, mostrar o mês atual
    if (user?.id === "inara-profissional-001") {
      return new Date(2025, 10, 1); // Novembro de 2025 (mês 10 = novembro, 0-indexed)
    }
    return hoje;
  }, [user?.id]);

  // Carregar dados do profissional
  useEffect(() => {
    const carregarProfissional = async () => {
      if (user?.id) {
        const profissionais = await fetchProfissionais();
        const prof = profissionais.find((p) => p.id === user.id);
        if (prof) {
          setProfissional(prof);
        }
      }
    };
    carregarProfissional();
  }, [user?.id]);

  // Carregar agendamentos do profissional
  // Não filtrar por mês - o React-Big-Calendar filtra automaticamente baseado na view
  const carregarAgendamentos = useCallback(async () => {
    if (!user?.id) return;

    setLoadingAgendamentos(true);
    try {
      const todosAgendamentos = await fetchAgendamentos();

      const agendamentosDoProfissional = todosAgendamentos.filter((ag) => {
        if (ag.profissionalId !== user.id) return false;
        if (ag.status === "cancelado") return false;
        return true;
      });

      setAgendamentos(agendamentosDoProfissional);
    } catch (error) {
      // Ignorar erro
    } finally {
      setLoadingAgendamentos(false);
    }
  }, [user?.id]);

  useEffect(() => {
    carregarAgendamentos();
  }, [carregarAgendamentos]);

  const eventos = useMemo<EventAgendamento[]>(() => {
    return agendamentos.map((agendamento) => {
      const [hora, minuto] = agendamento.horario.split(":").map(Number);
      const [ano, mes, dia] = agendamento.data.split("-").map(Number);
      const dataInicio = new Date(ano, mes - 1, dia, hora, minuto, 0);
      const dataFim = new Date(dataInicio);
      dataFim.setMinutes(dataFim.getMinutes() + agendamento.duracao);
      const cor = obterCorProfissional(agendamento.profissionalId);

      return {
        id: agendamento.id,
        title: `${agendamento.pacienteNome} ${agendamento.pacienteSobrenome} - ${agendamento.procedimento}`,
        start: dataInicio,
        end: dataFim,
        resource: agendamento,
        color: cor,
      };
    });
  }, [agendamentos]);

  // Estilizar eventos
  const eventStyleGetter = (event: EventAgendamento) => {
    return {
      style: {
        backgroundColor: event.color || "#1976d2",
        borderColor: event.color || "#1976d2",
        color: "#fff",
        borderRadius: "4px",
        border: "none",
        padding: "2px 4px",
      },
    };
  };

  // Mensagens em português
  const messages = {
    next: "Próximo",
    previous: "Anterior",
    today: "Hoje",
    month: "Mês",
    week: "Semana",
    day: "Dia",
    agenda: "Agenda",
    date: "Data",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "Não há agendamentos neste período.",
  };

  // Formatar data para exibição
  const dataFormatada = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  // Ordenar consultas por horário
  const consultasOrdenadas = useMemo(() => {
    return [...consultas].sort((a, b) => {
      const horaA = a.horario.split(":").map(Number);
      const horaB = b.horario.split(":").map(Number);
      const minutosA = horaA[0] * 60 + horaA[1];
      const minutosB = horaB[0] * 60 + horaB[1];
      return minutosA - minutosB;
    });
  }, [consultas]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finalizada":
        return "success";
      case "cancelada":
        return "error";
      case "em_andamento":
        return "warning";
      case "agendada":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "finalizada":
        return "Finalizada";
      case "cancelada":
        return "Cancelada";
      case "em_andamento":
        return "Em Andamento";
      case "agendada":
        return "Agendada";
      default:
        return status;
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          color="primary"
          fontWeight={500}
          fontFamily="Montserrat"
          fontSize={24}
        >
          Dashboard Profissional
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => navigate(ROUTES.consultas.historicoProfissional)}
          >
            Histórico de Consultas
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setModalHorariosOpen(true)}
          >
            Modificar Horários da Agenda
          </Button>
        </Box>
      </Box>

      {/* Cards de Métricas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Consultas do Mês
              </Typography>
              <Typography variant="h4" color="primary">
                {DADOS_MOCK_DASHBOARD.consultasMes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Consultas Remarcadas
              </Typography>
              <Typography variant="h4" color="warning.main">
                {DADOS_MOCK_DASHBOARD.consultasRemarcadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Consultas Canceladas
              </Typography>
              <Typography variant="h4" color="error.main">
                {DADOS_MOCK_DASHBOARD.consultasCanceladas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Consultas do Dia */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <CalendarTodayIcon color="primary" />
                <Typography variant="h6">Consultas de Hoje</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {dataFormatada}
              </Typography>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : consultasOrdenadas.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px",
                  }}
                >
                  <Typography color="text.secondary">
                    Nenhuma consulta agendada para hoje
                  </Typography>
                </Box>
              ) : (
                <TableContainer
                  sx={{
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Horário</TableCell>
                        <TableCell>Paciente</TableCell>
                        <TableCell>Procedimento</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {consultasOrdenadas.map((consulta) => (
                        <TableRow key={consulta.id}>
                          <TableCell>{consulta.horario}</TableCell>
                          <TableCell>
                            {consulta.pacienteNome} {consulta.pacienteSobrenome}
                          </TableCell>
                          <TableCell>
                            {consulta.procedimentoPrincipal}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(consulta.status)}
                              color={getStatusColor(consulta.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Procedimentos */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Procedimentos Mais Realizados
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={DADOS_MOCK_DASHBOARD.procedimentos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="nome"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantidade" fill="#037F8C" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pré-visualização do Calendário */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Pré-visualização do Calendário -{" "}
                {format(dataMesAtual, "MMMM yyyy", { locale: ptBR })}
              </Typography>
              {loadingAgendamentos ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "500px",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Box
                  sx={{
                    height: "500px",
                    marginTop: "16px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    padding: "16px",
                    "& .rbc-toolbar": {
                      backgroundColor: "#fff",
                      marginBottom: "16px",
                      "& button": {
                        backgroundColor: "#fff",
                        color: "#333A3B",
                        border: "1px solid #ddd",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                        "&:active, &.rbc-active": {
                          backgroundColor: "#037F8C",
                          color: "#fff",
                          borderColor: "#037F8C",
                        },
                        // Desabilitar botões de navegação (próximo/anterior)
                        "&.rbc-btn-group": {
                          "& button:first-of-type": {
                            // Botão "Anterior"
                            "&:disabled": {
                              opacity: 0.5,
                              cursor: "not-allowed",
                            },
                          },
                          "& button:last-of-type": {
                            // Botão "Próximo"
                            "&:disabled": {
                              opacity: 0.5,
                              cursor: "not-allowed",
                            },
                          },
                        },
                      },
                      // Esconder botões de navegação (anterior/próximo) mas manter o botão "Hoje"
                      "& .rbc-toolbar .rbc-btn-group:first-of-type button:nth-of-type(1)":
                        {
                          display: "none", // Esconder botão "Anterior"
                        },
                      "& .rbc-toolbar .rbc-btn-group:first-of-type button:nth-of-type(2)":
                        {
                          display: "none", // Esconder botão "Próximo"
                        },
                    },
                    "& .rbc-calendar": {
                      backgroundColor: "#fff",
                    },
                    "& .rbc-month-view, & .rbc-time-view, & .rbc-agenda-view": {
                      backgroundColor: "#fff",
                    },
                    "& .rbc-header": {
                      backgroundColor: "#fff",
                      borderBottom: "2px solid #E7F2F4",
                      padding: "8px",
                    },
                    "& .rbc-time-slot": {
                      borderTop: "1px solid #E7F2F4",
                    },
                    "& .rbc-day-slot .rbc-time-slot": {
                      borderTop: "1px solid #E7F2F4",
                    },
                    "& .rbc-today": {
                      backgroundColor: "#f0f9fa",
                    },
                    "& .rbc-off-range-bg": {
                      backgroundColor: "#fafafa",
                    },
                    "& .rbc-time-content": {
                      borderTop: "2px solid #E7F2F4",
                    },
                    "& .rbc-time-header-content": {
                      borderLeft: "1px solid #E7F2F4",
                    },
                  }}
                >
                  <Calendar
                    localizer={localizer}
                    events={eventos}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%" }}
                    view={viewCalendario}
                    views={[Views.MONTH, Views.WEEK, Views.DAY]}
                    onView={setViewCalendario}
                    date={dataMesAtual}
                    onNavigate={() => {
                      // Não permitir navegação - sempre manter no mês atual
                    }}
                    messages={messages}
                    eventPropGetter={eventStyleGetter}
                    culture="pt-BR"
                    step={30}
                    timeslots={1}
                    min={new Date(1970, 0, 1, 7, 0)}
                    max={new Date(1970, 0, 1, 19, 0)}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal de Horários */}
      {profissional && (
        <ModalHorariosProfissional
          open={modalHorariosOpen}
          onClose={() => setModalHorariosOpen(false)}
          profissional={profissional}
        />
      )}
    </Box>
  );
};

export default DashboardProfissional;
