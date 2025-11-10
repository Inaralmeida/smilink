import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  IconButton,
  Tooltip as MuiTooltip,
  Button,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EventIcon from "@mui/icons-material/Event";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useConsultas } from "../hooks/useConsultas";
import { fetchPacientes } from "../../../service/mock/pacientes";
import type { TPaciente } from "../../../domain/types/paciente";
import { regenerarConsultas } from "../../../shared/utils/localStorage";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subMonths,
  endOfWeek,
  eachWeekOfInterval,
  isWithinInterval,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../domain/constants/Routes";
import { fetchProfissionais } from "../../../service/mock/profissionais";
import type { TProfissional } from "../../../domain/types/profissional";
import { useEstoque } from "../../Estoque/hooks/useEstoque";

const COLORS = [
  "#037F8C",
  "#FF6B6B",
  "#4ECDC4",
  "#FFC145",
  "#9D72FF",
  "#6BFFB8",
  "#FF8A5B",
  "#8D9EFF",
  "#FFD166",
  "#C7F0BD",
];

const DashboardAdmin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { consultas, carregarConsultas } = useConsultas();
  const { itens: itensEstoque } = useEstoque();
  const [pacientes, setPacientes] = useState<TPaciente[]>([]);
  const [profissionais, setProfissionais] = useState<TProfissional[]>([]);
  const [mesSelecionado, setMesSelecionado] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [regenerando, setRegenerando] = useState(false);

  useEffect(() => {
    carregarConsultas();
    fetchPacientes().then(setPacientes);
    fetchProfissionais().then(setProfissionais);
  }, [carregarConsultas]);

  const handleRegenerarConsultas = async () => {
    setRegenerando(true);
    try {
      await regenerarConsultas();
      await carregarConsultas();
      window.dispatchEvent(new Event("consultas-regeneradas"));
    } catch {
      // Ignorar erro
    } finally {
      setRegenerando(false);
    }
  };

  const consultasDoMes = useMemo(() => {
    const [ano, mes] = mesSelecionado.split("-").map(Number);
    const inicioMes = startOfMonth(new Date(ano, mes - 1));
    const fimMes = endOfMonth(new Date(ano, mes - 1));

    return consultas.filter((consulta) => {
      const [anoConsulta, mesConsulta, diaConsulta] = consulta.data
        .split("-")
        .map(Number);
      const dataConsulta = new Date(anoConsulta, mesConsulta - 1, diaConsulta);
      return dataConsulta >= inicioMes && dataConsulta <= fimMes;
    });
  }, [consultas, mesSelecionado]);

  const metricas = useMemo(() => {
    const consultasFinalizadas = consultasDoMes.filter(
      (c) => c.status === "finalizada"
    );
    const realizadas = consultasFinalizadas.length;
    const canceladas = consultasDoMes.filter(
      (c) => c.status === "cancelada"
    ).length;
    const convenio = consultasFinalizadas.filter(
      (c) => c.tipoPagamento === "convenio"
    ).length;
    const particular = consultasFinalizadas.filter(
      (c) => c.tipoPagamento === "particular"
    ).length;

    return {
      realizadas,
      canceladas,
      convenio,
      particular,
    };
  }, [consultasDoMes]);

  const dadosProfissionais = useMemo(() => {
    const profissionaisMap = new Map<string, number>();

    consultasDoMes
      .filter((c) => c.status === "finalizada")
      .forEach((consulta) => {
        const nomeCompleto = `${consulta.profissionalNome} ${consulta.profissionalSobrenome}`;
        profissionaisMap.set(
          nomeCompleto,
          (profissionaisMap.get(nomeCompleto) || 0) + 1
        );
      });

    return Array.from(profissionaisMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [consultasDoMes]);

  const metricasPacientes = useMemo(() => {
    const pacientesAtendidosNoMes = new Set<string>();
    const consultasFinalizadas = consultasDoMes.filter(
      (c) => c.status === "finalizada"
    );

    consultasFinalizadas.forEach((consulta) => {
      pacientesAtendidosNoMes.add(consulta.pacienteId);
    });

    const totalPacientesUnicos = pacientesAtendidosNoMes.size;
    const totalConsultasFinalizadas = consultasFinalizadas.length;

    return {
      atendidosNoMes:
        totalConsultasFinalizadas > 0 ? Math.max(totalPacientesUnicos, 1) : 0,
      total: pacientes.length,
    };
  }, [consultasDoMes, pacientes.length]);

  const profissionaisAtivos = useMemo(() => {
    return profissionais.filter((p) => !p.arquivado).length;
  }, [profissionais]);

  const consultasPorSemana = useMemo(() => {
    const [ano, mes] = mesSelecionado.split("-").map(Number);
    const inicioMes = startOfMonth(new Date(ano, mes - 1));
    const fimMes = endOfMonth(new Date(ano, mes - 1));

    const semanas = eachWeekOfInterval(
      {
        start: inicioMes,
        end: fimMes,
      },
      { weekStartsOn: 1 }
    );

    return semanas.map((inicioSemana, index) => {
      const fimSemana = endOfWeek(inicioSemana, { weekStartsOn: 1 });
      const consultasDaSemana = consultas.filter((consulta) => {
        const [anoConsulta, mesConsulta, diaConsulta] = consulta.data
          .split("-")
          .map(Number);
        const dataConsulta = new Date(
          anoConsulta,
          mesConsulta - 1,
          diaConsulta
        );
        return isWithinInterval(dataConsulta, {
          start: inicioSemana,
          end: fimSemana,
        });
      });

      const realizadas = consultasDaSemana.filter(
        (c) => c.status === "finalizada"
      ).length;
      const canceladas = consultasDaSemana.filter(
        (c) => c.status === "cancelada"
      ).length;

      return {
        semana: `Sem ${index + 1}`,
        data: format(inicioSemana, "dd/MM", { locale: ptBR }),
        realizadas,
        canceladas,
        total: realizadas + canceladas,
      };
    });
  }, [consultas, mesSelecionado]);

  const mediaConsultasPorSemana = useMemo(() => {
    if (consultasPorSemana.length === 0) return 0;
    const total = consultasPorSemana.reduce((acc, s) => acc + s.total, 0);
    return Math.round(total / consultasPorSemana.length);
  }, [consultasPorSemana]);

  const itensEstoqueUrgencia = useMemo(() => {
    return itensEstoque.filter((item) => item.status === "emergencia");
  }, [itensEstoque]);

  const itensEstoqueAtencao = useMemo(() => {
    return itensEstoque.filter((item) => item.status === "atencao");
  }, [itensEstoque]);

  const mesesDisponiveis = useMemo(() => {
    const hoje = new Date();
    const meses = eachMonthOfInterval({
      start: subMonths(hoje, 11),
      end: hoje,
    }).reverse();

    return meses.map((mes) => ({
      value: format(mes, "yyyy-MM"),
      label: format(mes, "MMMM 'de' yyyy", { locale: ptBR }),
    }));
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
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
          Dashboard Administrativo
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            startIcon={<EventIcon />}
            onClick={() => navigate(ROUTES.agendar)}
            sx={{ whiteSpace: "nowrap" }}
          >
            Agendamento
          </Button>
          <MuiTooltip title="Regenerar dados de consultas">
            <IconButton
              onClick={handleRegenerarConsultas}
              disabled={regenerando}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </MuiTooltip>
          <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
            <InputLabel>Mês</InputLabel>
            <Select
              value={mesSelecionado}
              onChange={(e) => setMesSelecionado(e.target.value)}
              label="Mês"
            >
              {mesesDisponiveis.map((mes) => (
                <MenuItem key={mes.value} value={mes.value}>
                  {mes.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Total de Pacientes
              </Typography>
              <Typography variant="h4" color="primary">
                {metricasPacientes.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Profissionais Ativos
              </Typography>
              <Typography variant="h4" color="primary">
                {profissionaisAtivos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Média Consultas/Semana
              </Typography>
              <Typography variant="h4" color="primary">
                {mediaConsultasPorSemana}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Consultas Realizadas
              </Typography>
              <Typography variant="h4" color="primary">
                {metricas.realizadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Consultas Canceladas
              </Typography>
              <Typography variant="h4" color="error">
                {metricas.canceladas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <MuiTooltip title="Consultas realizadas via convênio">
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Convênio
                </Typography>
              </MuiTooltip>
              <Typography variant="h4" color="info.main">
                {metricas.convenio}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <MuiTooltip title="Consultas realizadas de forma particular">
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Particular
                </Typography>
              </MuiTooltip>
              <Typography variant="h4" color="warning.main">
                {metricas.particular}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Pacientes Atendidos
              </Typography>
              <Typography variant="h4" color="info.main">
                {metricasPacientes.atendidosNoMes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Consultas por Semana
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={consultasPorSemana}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="realizadas"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    name="Realizadas"
                  />
                  <Line
                    type="monotone"
                    dataKey="canceladas"
                    stroke={theme.palette.error.main}
                    strokeWidth={2}
                    name="Canceladas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profissionais que Mais Atenderam
              </Typography>
              {dadosProfissionais.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosProfissionais}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosProfissionais.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="text.secondary">
                    Nenhum dado disponível
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Status de Estoque
              </Typography>
              <Box
                sx={{
                  maxHeight: 300,
                  overflowY: "auto",
                  pr: 1,
                }}
              >
                {itensEstoqueUrgencia.length > 0 && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ErrorIcon />
                      <Typography variant="body2" fontWeight="bold">
                        {itensEstoqueUrgencia.length} itens em emergência
                      </Typography>
                    </Box>
                  </Alert>
                )}
                {itensEstoqueAtencao.length > 0 && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <WarningIcon />
                      <Typography variant="body2" fontWeight="bold">
                        {itensEstoqueAtencao.length} itens precisam de atenção
                      </Typography>
                    </Box>
                  </Alert>
                )}
                {itensEstoqueUrgencia.length === 0 &&
                  itensEstoqueAtencao.length === 0 && (
                    <Alert severity="success">
                      Todos os itens estão em níveis normais
                    </Alert>
                  )}
                {itensEstoqueUrgencia.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Itens em Emergência:
                    </Typography>
                    <List dense>
                      {itensEstoqueUrgencia.map((item) => (
                        <ListItem key={item.id}>
                          <ListItemText
                            primary={item.nome}
                            secondary={`Quantidade: ${item.quantidade} ${
                              item.unidade || "un"
                            }`}
                          />
                          <Chip
                            label="Emergência"
                            color="error"
                            size="small"
                            icon={<ErrorIcon />}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                {itensEstoqueAtencao.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Itens que Precisam de Atenção:
                    </Typography>
                    <List dense>
                      {itensEstoqueAtencao.map((item) => (
                        <ListItem key={item.id}>
                          <ListItemText
                            primary={item.nome}
                            secondary={`Quantidade: ${item.quantidade} ${
                              item.unidade || "un"
                            }`}
                          />
                          <Chip
                            label="Atenção"
                            color="warning"
                            size="small"
                            icon={<WarningIcon />}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardAdmin;
