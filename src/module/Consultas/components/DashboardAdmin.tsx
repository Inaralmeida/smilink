import { useState, useMemo } from "react";
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
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useConsultas } from "../hooks/useConsultas";
import { fetchPacientes } from "../../../service/mock/pacientes";
import type { TPaciente } from "../../../domain/types/paciente";
import { useEffect } from "react";
import { regenerarConsultas } from "../../../shared/utils/localStorage";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

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
  const { consultas, carregarConsultas } = useConsultas();
  const [pacientes, setPacientes] = useState<TPaciente[]>([]);
  const [mesSelecionado, setMesSelecionado] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [regenerando, setRegenerando] = useState(false);

  useEffect(() => {
    carregarConsultas();
    fetchPacientes().then(setPacientes);
  }, [carregarConsultas]);

  const handleRegenerarConsultas = async () => {
    setRegenerando(true);
    try {
      await regenerarConsultas();
      // Recarregar consultas após regenerar
      await carregarConsultas();
      // Disparar evento para outros componentes também recarregarem
      window.dispatchEvent(new Event("consultas-regeneradas"));
    } catch (error) {
      console.error("Erro ao regenerar consultas:", error);
    } finally {
      setRegenerando(false);
    }
  };

  // Debug: log quando consultas mudarem
  useEffect(() => {
    console.log(`📊 DashboardAdmin: ${consultas.length} consultas carregadas`);
    console.log(`📅 Mês selecionado: ${mesSelecionado}`);

    const consultasDoMesFiltradas = consultas.filter((consulta) => {
      const [anoConsulta, mesConsulta] = consulta.data.split("-").map(Number);
      const [ano, mes] = mesSelecionado.split("-").map(Number);
      return anoConsulta === ano && mesConsulta === mes;
    });
    console.log(
      `📊 Consultas do mês ${mesSelecionado}: ${consultasDoMesFiltradas.length}`
    );

    const canceladas = consultasDoMesFiltradas.filter(
      (c) => c.status === "cancelada"
    ).length;
    const finalizadas = consultasDoMesFiltradas.filter(
      (c) => c.status === "finalizada"
    ).length;
    console.log(`   ❌ Canceladas: ${canceladas}`);
    console.log(`   ✅ Finalizadas: ${finalizadas}`);

    if (consultas.length > 0) {
      const distribuicao = consultas.reduce((acc, c) => {
        const mes = c.data.substring(0, 7);
        acc[mes] = (acc[mes] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log("📊 Distribuição de consultas:", distribuicao);
    } else {
      console.warn(
        "⚠️ Nenhuma consulta encontrada! Verifique se os dados foram gerados."
      );
    }
  }, [consultas, mesSelecionado]);

  // Filtrar consultas do mês selecionado
  const consultasDoMes = useMemo(() => {
    const [ano, mes] = mesSelecionado.split("-").map(Number);
    const inicioMes = startOfMonth(new Date(ano, mes - 1));
    const fimMes = endOfMonth(new Date(ano, mes - 1));

    return consultas.filter((consulta) => {
      // Parse da data no formato YYYY-MM-DD como data local
      const [anoConsulta, mesConsulta, diaConsulta] = consulta.data
        .split("-")
        .map(Number);
      const dataConsulta = new Date(anoConsulta, mesConsulta - 1, diaConsulta);
      return dataConsulta >= inicioMes && dataConsulta <= fimMes;
    });
  }, [consultas, mesSelecionado]);

  // Métricas básicas
  const metricas = useMemo(() => {
    const realizadas = consultasDoMes.filter(
      (c) => c.status === "finalizada"
    ).length;
    const canceladas = consultasDoMes.filter(
      (c) => c.status === "cancelada"
    ).length;
    const convenio = consultasDoMes.filter(
      (c) => c.tipoPagamento === "convenio"
    ).length;
    const particular = consultasDoMes.filter(
      (c) => c.tipoPagamento === "particular"
    ).length;

    return {
      realizadas,
      canceladas,
      convenio,
      particular,
    };
  }, [consultasDoMes]);

  // Gráfico de pizza dos profissionais
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

  // Pacientes novos, inativos e constantes
  const pacientesMetricas = useMemo(() => {
    const pacientesAtendidosNoMes = new Set<string>();
    consultasDoMes
      .filter((c) => c.status === "finalizada")
      .forEach((consulta) => {
        pacientesAtendidosNoMes.add(consulta.pacienteId);
      });

    const hoje = new Date();
    const seisMesesAtras = new Date(hoje);
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

    const pacientesNovos: string[] = [];
    const pacientesConstantes: string[] = [];
    const pacientesInativos: string[] = [];

    const [ano, mes] = mesSelecionado.split("-").map(Number);
    const inicioMesSelecionado = startOfMonth(new Date(ano, mes - 1));

    pacientes.forEach((paciente) => {
      if (pacientesAtendidosNoMes.has(paciente.id)) {
        // Verificar se é novo (primeira consulta no mês)
        const consultasAnteriores = consultas.filter((c) => {
          if (c.pacienteId !== paciente.id || c.status !== "finalizada") {
            return false;
          }
          // Parse da data no formato YYYY-MM-DD como data local
          const [anoConsulta, mesConsulta, diaConsulta] = c.data
            .split("-")
            .map(Number);
          const dataConsulta = new Date(
            anoConsulta,
            mesConsulta - 1,
            diaConsulta
          );
          return dataConsulta < inicioMesSelecionado;
        });
        if (consultasAnteriores.length === 0) {
          pacientesNovos.push(paciente.id);
        } else {
          pacientesConstantes.push(paciente.id);
        }
      } else {
        // Verificar se é inativo (última consulta há mais de 6 meses)
        if (paciente.ultimaConsulta) {
          const ultimaConsulta = new Date(paciente.ultimaConsulta);
          if (ultimaConsulta < seisMesesAtras) {
            pacientesInativos.push(paciente.id);
          }
        } else {
          // Se nunca teve consulta e não foi atendido no mês, considerar inativo
          pacientesInativos.push(paciente.id);
        }
      }
    });

    return {
      novos: pacientesNovos.length,
      constantes: pacientesConstantes.length,
      inativos: pacientesInativos.length,
      atendidosNoMes: pacientesAtendidosNoMes.size,
    };
  }, [consultasDoMes, pacientes, consultas, mesSelecionado]);

  // Dados para gráfico de barras (semana do mês)
  const dadosSemana = useMemo(() => {
    const semanas: Record<number, { realizadas: number; canceladas: number }> =
      {};

    consultasDoMes.forEach((consulta) => {
      // Parse da data no formato YYYY-MM-DD para obter o dia
      const [, , diaConsulta] = consulta.data.split("-").map(Number);
      const semana = Math.ceil(diaConsulta / 7);
      if (!semanas[semana]) {
        semanas[semana] = { realizadas: 0, canceladas: 0 };
      }
      if (consulta.status === "finalizada") {
        semanas[semana].realizadas++;
      } else if (consulta.status === "cancelada") {
        semanas[semana].canceladas++;
      }
    });

    return Array.from({ length: 4 }, (_, i) => ({
      semana: `Semana ${i + 1}`,
      realizadas: semanas[i + 1]?.realizadas || 0,
      canceladas: semanas[i + 1]?.canceladas || 0,
    }));
  }, [consultasDoMes]);

  // Gerar lista de meses para seleção (últimos 12 meses)
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
          Dashboard de Consultas
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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

      {/* Cards de métricas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
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
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
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
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Convênio
              </Typography>
              <Typography variant="h4" color="info.main">
                {metricas.convenio}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Particular
              </Typography>
              <Typography variant="h4" color="warning.main">
                {metricas.particular}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Consultas por Semana
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosSemana}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="realizadas" fill={theme.palette.primary.main} />
                  <Bar dataKey="canceladas" fill={theme.palette.error.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
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
                      // label={({ name, value }) => {
                      //   if (!name) return "";
                      //   return `${name.substring(0, 15)}${
                      //     name.length > 15 ? "..." : ""
                      //   }: ${value}`;
                      // }}
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
      </Grid>

      {/* Métricas de pacientes */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Novos Pacientes
              </Typography>
              <Typography variant="h4" color="success.main">
                {pacientesMetricas.novos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Pacientes Constantes
              </Typography>
              <Typography variant="h4" color="primary">
                {pacientesMetricas.constantes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Pacientes Inativos
              </Typography>
              <Typography variant="h4" color="warning.main">
                {pacientesMetricas.inativos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Pacientes Atendidos no Mês
              </Typography>
              <Typography variant="h4" color="info.main">
                {pacientesMetricas.atendidosNoMes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardAdmin;
