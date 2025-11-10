import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Grid,
  useMediaQuery,
  useTheme,
  Divider,
  Stack,
} from "@mui/material";
import { useConsultas } from "../hooks/useConsultas";
import type { TConsulta } from "../../../domain/types/consulta";
import ModalDetalhesConsultaPaciente from "./ModalDetalhesConsultaPaciente";
import ModalNovaConsulta from "../ModalNovaConsulta";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import { atualizarConsulta } from "../../../service/mock/consultas";
import { fetchProfissionais } from "../../../service/mock/profissionais";
import type { TProfissional } from "../../../domain/types/profissional";
import { fetchPacientes } from "../../../service/mock/pacientes";
import type { TPaciente } from "../../../domain/types/paciente";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import type { View } from "react-big-calendar";
import { parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { obterCorProfissional } from "../../Agenda/utils/colors";
import { DURACAO_POR_PROCEDIMENTO } from "../../../service/mock/agendamentos";

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

type EventConsulta = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: TConsulta;
  color: string;
};

type OrdenacaoTipo =
  | "data_desc"
  | "data_asc"
  | "alfabetica_asc"
  | "alfabetica_desc";

const ListaConsultasAdmin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { consultas, loading, carregarConsultas } = useConsultas();
  const [profissionais, setProfissionais] = useState<TProfissional[]>([]);
  const [pacientes, setPacientes] = useState<TPaciente[]>([]);
  const [consultaSelecionada, setConsultaSelecionada] =
    useState<TConsulta | null>(null);
  const [pacienteSelecionado, setPacienteSelecionado] =
    useState<TPaciente | null>(null);
  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [modalReagendarOpen, setModalReagendarOpen] = useState(false);
  const [modalCancelarOpen, setModalCancelarOpen] = useState(false);
  const [filtroBusca, setFiltroBusca] = useState("");
  const [filtroProfissional, setFiltroProfissional] = useState<string>("");
  const [filtroStatus, setFiltroStatus] = useState<string>("");
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [ordenacao, setOrdenacao] = useState<OrdenacaoTipo>("data_desc");
  const [viewTipo, setViewTipo] = useState<"tabela" | "calendario">("tabela");
  const [viewCalendario, setViewCalendario] = useState<View>(Views.MONTH);
  const [dateCalendario, setDateCalendario] = useState<Date>(new Date());

  useEffect(() => {
    fetchProfissionais().then(setProfissionais);
    fetchPacientes().then(setPacientes);
  }, []);

  useEffect(() => {
    const handleConsultasRegeneradas = () => {
      carregarConsultas();
    };

    window.addEventListener(
      "consultas-regeneradas",
      handleConsultasRegeneradas
    );
    window.addEventListener("agendamento-criado", handleConsultasRegeneradas);
    window.addEventListener(
      "agendamento-cancelado",
      handleConsultasRegeneradas
    );

    return () => {
      window.removeEventListener(
        "consultas-regeneradas",
        handleConsultasRegeneradas
      );
      window.removeEventListener(
        "agendamento-criado",
        handleConsultasRegeneradas
      );
      window.removeEventListener(
        "agendamento-cancelado",
        handleConsultasRegeneradas
      );
    };
  }, [carregarConsultas]);

  const consultasFiltradas = useMemo(() => {
    let filtradas = consultas;

    if (filtroBusca.trim()) {
      const busca = filtroBusca.toLowerCase();
      filtradas = filtradas.filter(
        (consulta) =>
          consulta.pacienteNome.toLowerCase().includes(busca) ||
          consulta.pacienteSobrenome.toLowerCase().includes(busca) ||
          consulta.profissionalNome.toLowerCase().includes(busca) ||
          consulta.profissionalSobrenome.toLowerCase().includes(busca) ||
          consulta.procedimentoPrincipal.toLowerCase().includes(busca)
      );
    }

    if (filtroProfissional) {
      filtradas = filtradas.filter(
        (consulta) => consulta.profissionalId === filtroProfissional
      );
    }

    if (filtroStatus) {
      filtradas = filtradas.filter(
        (consulta) => consulta.status === filtroStatus
      );
    }

    if (filtroPeriodo) {
      const [ano, mes] = filtroPeriodo.split("-").map(Number);
      const inicioMes = startOfMonth(new Date(ano, mes - 1));
      const fimMes = endOfMonth(new Date(ano, mes - 1));

      filtradas = filtradas.filter((consulta) => {
        const [anoConsulta, mesConsulta, diaConsulta] = consulta.data
          .split("-")
          .map(Number);
        const dataConsulta = new Date(
          anoConsulta,
          mesConsulta - 1,
          diaConsulta
        );
        return dataConsulta >= inicioMes && dataConsulta <= fimMes;
      });
    }

    return filtradas;
  }, [consultas, filtroBusca, filtroProfissional, filtroStatus, filtroPeriodo]);

  const consultasOrdenadas = useMemo(() => {
    const consultas = [...consultasFiltradas];

    switch (ordenacao) {
      case "data_desc":
        return consultas.sort((a, b) => {
          const dataA = new Date(`${a.data}T${a.horario}`);
          const dataB = new Date(`${b.data}T${b.horario}`);
          return dataB.getTime() - dataA.getTime();
        });
      case "data_asc":
        return consultas.sort((a, b) => {
          const dataA = new Date(`${a.data}T${a.horario}`);
          const dataB = new Date(`${b.data}T${b.horario}`);
          return dataA.getTime() - dataB.getTime();
        });
      case "alfabetica_asc":
        return consultas.sort((a, b) => {
          const nomeA =
            `${a.pacienteNome} ${a.pacienteSobrenome}`.toLowerCase();
          const nomeB =
            `${b.pacienteNome} ${b.pacienteSobrenome}`.toLowerCase();
          return nomeA.localeCompare(nomeB);
        });
      case "alfabetica_desc":
        return consultas.sort((a, b) => {
          const nomeA =
            `${a.pacienteNome} ${a.pacienteSobrenome}`.toLowerCase();
          const nomeB =
            `${b.pacienteNome} ${b.pacienteSobrenome}`.toLowerCase();
          return nomeB.localeCompare(nomeA);
        });
      default:
        return consultas;
    }
  }, [consultasFiltradas, ordenacao]);

  const eventosCalendario = useMemo<EventConsulta[]>(() => {
    return consultasFiltradas
      .filter((c) => c.status !== "cancelada")
      .map((consulta) => {
        const [hora, minuto] = consulta.horario.split(":").map(Number);
        const [ano, mes, dia] = consulta.data.split("-").map(Number);
        const dataInicio = new Date(ano, mes - 1, dia, hora, minuto, 0);

        const duracao =
          DURACAO_POR_PROCEDIMENTO[consulta.procedimentoPrincipal] || 30;
        const dataFim = new Date(dataInicio);
        dataFim.setMinutes(dataFim.getMinutes() + duracao);

        const cor = obterCorProfissional(consulta.profissionalId);

        return {
          id: consulta.id,
          title: `${consulta.pacienteNome} ${consulta.pacienteSobrenome} - ${consulta.procedimentoPrincipal}`,
          start: dataInicio,
          end: dataFim,
          resource: consulta,
          color: cor,
        };
      });
  }, [consultasFiltradas]);

  const mesesDisponiveis = useMemo(() => {
    const hoje = new Date();
    const meses: { value: string; label: string }[] = [];

    for (let i = 11; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      meses.push({
        value: format(data, "yyyy-MM"),
        label: format(data, "MMMM 'de' yyyy", { locale: ptBR }),
      });
    }

    return meses;
  }, []);

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

  const formatarDataHora = (data: string, horario: string): string => {
    try {
      const dataObj = new Date(`${data}T${horario}`);
      return format(dataObj, "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    } catch {
      return `${data} às ${horario}`;
    }
  };

  const handleVerDetalhes = (consulta: TConsulta) => {
    setConsultaSelecionada(consulta);
    setModalDetalhesOpen(true);
  };

  const handleCancelar = (consulta: TConsulta) => {
    setConsultaSelecionada(consulta);
    setModalCancelarOpen(true);
  };

  const handleReagendar = (consulta: TConsulta) => {
    setConsultaSelecionada(consulta);
    const paciente = pacientes.find((p) => p.id === consulta.pacienteId);
    setPacienteSelecionado(paciente || null);
    setModalReagendarOpen(true);
  };

  const confirmarCancelar = async () => {
    if (!consultaSelecionada) return;

    await atualizarConsulta(consultaSelecionada.id, {
      status: "cancelada",
    });

    await carregarConsultas();
    setModalCancelarOpen(false);
    setConsultaSelecionada(null);
    window.dispatchEvent(new Event("consultas-regeneradas"));
  };

  const handleSelectEvent = (event: EventConsulta) => {
    setConsultaSelecionada(event.resource);
    setModalDetalhesOpen(true);
  };

  const eventStyleGetter = (event: EventConsulta) => {
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
    noEventsInRange: "Não há consultas neste período.",
  };

  const podeCancelar = (consulta: TConsulta): boolean => {
    return consulta.status === "agendada" || consulta.status === "em_andamento";
  };

  const podeReagendar = (consulta: TConsulta): boolean => {
    return consulta.status === "agendada";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={500}>
          Consultas
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <TextField
            fullWidth
            placeholder="Buscar..."
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Profissional</InputLabel>
            <Select
              value={filtroProfissional}
              onChange={(e) => setFiltroProfissional(e.target.value)}
              label="Profissional"
            >
              <MenuItem value="">Todos</MenuItem>
              {profissionais.map((prof) => (
                <MenuItem key={prof.id} value={prof.id}>
                  {prof.nome} {prof.sobrenome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="agendada">Agendada</MenuItem>
              <MenuItem value="em_andamento">Em Andamento</MenuItem>
              <MenuItem value="finalizada">Finalizada</MenuItem>
              <MenuItem value="cancelada">Cancelada</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Período</InputLabel>
            <Select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              label="Período"
            >
              {mesesDisponiveis.map((mes) => (
                <MenuItem key={mes.value} value={mes.value}>
                  {mes.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as OrdenacaoTipo)}
              label="Ordenar por"
            >
              <MenuItem value="data_desc">Data (Mais Recente)</MenuItem>
              <MenuItem value="data_asc">Data (Mais Antiga)</MenuItem>
              <MenuItem value="alfabetica_asc">Paciente (A-Z)</MenuItem>
              <MenuItem value="alfabetica_desc">Paciente (Z-A)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Tabs
        value={viewTipo}
        onChange={(_, novoValor) => setViewTipo(novoValor)}
        sx={{ mb: 3 }}
      >
        <Tab label="Histórico de Consultas" value="tabela" />
        <Tab label="Calendário" value="calendario" />
      </Tabs>

      {viewTipo === "tabela" ? (
        consultasOrdenadas.length === 0 ? (
          <Card>
            <CardContent>
              <Typography color="text.secondary" align="center">
                {filtroBusca || filtroProfissional || filtroStatus
                  ? "Nenhuma consulta encontrada com os filtros aplicados."
                  : "Nenhuma consulta encontrada."}
              </Typography>
            </CardContent>
          </Card>
        ) : isMobile ? (
          <Box
            sx={{
              maxHeight: "calc(100vh - 400px)",
              overflowY: "auto",
              pr: 1,
            }}
          >
            <Stack spacing={2}>
              {consultasOrdenadas.map((consulta) => (
                <Card key={consulta.id} sx={{ width: "100%" }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {consulta.pacienteNome} {consulta.pacienteSobrenome}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          <strong>Data:</strong>{" "}
                          {formatarDataHora(consulta.data, consulta.horario)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          <strong>Profissional:</strong>{" "}
                          {consulta.profissionalNome}{" "}
                          {consulta.profissionalSobrenome}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          <strong>Procedimento:</strong>{" "}
                          {consulta.procedimentoPrincipal}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 2,
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        label={getStatusLabel(consulta.status)}
                        color={getStatusColor(consulta.status)}
                        size="small"
                      />
                      {consulta.tipoPagamento === "convenio" ? (
                        <Chip
                          label={`Convênio: ${consulta.convenio || "N/A"}`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          label="Particular"
                          size="small"
                          color="default"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleVerDetalhes(consulta)}
                      >
                        Ver Detalhes
                      </Button>
                      {podeReagendar(consulta) && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          startIcon={<EventRepeatIcon />}
                          onClick={() => handleReagendar(consulta)}
                        >
                          Reagendar
                        </Button>
                      )}
                      {podeCancelar(consulta) && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleCancelar(consulta)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "calc(100vh - 400px)",
              overflowY: "auto",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Data e Horário</TableCell>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Profissional</TableCell>
                  <TableCell>Procedimento</TableCell>
                  <TableCell>Tipo de Pagamento</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {consultasOrdenadas.map((consulta) => (
                  <TableRow key={consulta.id} hover>
                    <TableCell>
                      {formatarDataHora(consulta.data, consulta.horario)}
                    </TableCell>
                    <TableCell>
                      {consulta.pacienteNome} {consulta.pacienteSobrenome}
                    </TableCell>
                    <TableCell>
                      {consulta.profissionalNome}{" "}
                      {consulta.profissionalSobrenome}
                    </TableCell>
                    <TableCell>{consulta.procedimentoPrincipal}</TableCell>
                    <TableCell>
                      {consulta.tipoPagamento === "convenio" ? (
                        <Chip
                          label={`Convênio: ${consulta.convenio || "N/A"}`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          label="Particular"
                          size="small"
                          color="default"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(consulta.status)}
                        color={getStatusColor(consulta.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleVerDetalhes(consulta)}
                          color="primary"
                          title="Ver detalhes"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        {podeReagendar(consulta) && (
                          <IconButton
                            size="small"
                            onClick={() => handleReagendar(consulta)}
                            color="warning"
                            title="Reagendar"
                          >
                            <EventRepeatIcon fontSize="small" />
                          </IconButton>
                        )}
                        {podeCancelar(consulta) && (
                          <IconButton
                            size="small"
                            onClick={() => handleCancelar(consulta)}
                            color="error"
                            title="Cancelar"
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      ) : (
        <Box
          sx={{
            height: "600px",
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
            events={eventosCalendario}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            onSelectEvent={handleSelectEvent}
            view={viewCalendario}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            onView={setViewCalendario}
            date={dateCalendario}
            onNavigate={setDateCalendario}
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

      {consultaSelecionada && (
        <>
          <ModalDetalhesConsultaPaciente
            open={modalDetalhesOpen}
            onClose={() => {
              setModalDetalhesOpen(false);
              setConsultaSelecionada(null);
            }}
            consulta={consultaSelecionada}
            onAtualizada={carregarConsultas}
          />

          <ModalNovaConsulta
            open={modalReagendarOpen}
            onClose={async () => {
              if (
                consultaSelecionada &&
                consultaSelecionada.status === "agendada"
              ) {
                await atualizarConsulta(consultaSelecionada.id, {
                  status: "cancelada",
                });
                await carregarConsultas();
                window.dispatchEvent(new Event("consultas-regeneradas"));
              }
              setModalReagendarOpen(false);
              setConsultaSelecionada(null);
              setPacienteSelecionado(null);
            }}
            pacientePreSelecionado={pacienteSelecionado}
            profissionalIdPreSelecionado={consultaSelecionada.profissionalId}
            procedimentoPreSelecionado={
              consultaSelecionada.procedimentoPrincipal
            }
            agendamentoAntigoId={consultaSelecionada.agendamentoId}
            titulo="Reagendar Consulta"
          />

          <Dialog
            open={modalCancelarOpen}
            onClose={() => {
              setModalCancelarOpen(false);
              setConsultaSelecionada(null);
            }}
          >
            <DialogTitle>Cancelar Consulta</DialogTitle>
            <DialogContent>
              <Typography>
                Tem certeza que deseja cancelar a consulta de{" "}
                {consultaSelecionada.pacienteNome}{" "}
                {consultaSelecionada.pacienteSobrenome} em{" "}
                {formatarDataHora(
                  consultaSelecionada.data,
                  consultaSelecionada.horario
                )}
                ?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setModalCancelarOpen(false);
                  setConsultaSelecionada(null);
                }}
              >
                Não
              </Button>
              <Button
                onClick={confirmarCancelar}
                color="error"
                variant="contained"
              >
                Sim, Cancelar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default ListaConsultasAdmin;
