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
  Tabs,
  Tab,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import { useConsultasPorPaciente } from "../hooks/useConsultas";
import { useAuth } from "../../../application/context/AuthContext";
import { fetchAgendamentos } from "../../../service/mock/agendamentos";
import type { TAgendamento } from "../../../domain/types/agendamento";
import type { TConsulta } from "../../../domain/types/consulta";
import ModalDetalhesConsultaPaciente from "./ModalDetalhesConsultaPaciente";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import VisibilityIcon from "@mui/icons-material/Visibility";

const HistoricoPaciente = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();
  const [abaAtiva, setAbaAtiva] = useState(0);
  const [agendamentosFuturos, setAgendamentosFuturos] = useState<
    TAgendamento[]
  >([]);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] =
    useState<TConsulta | null>(null);
  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);

  const { consultas, loading, error, carregarConsultas } =
    useConsultasPorPaciente(user?.id || "");

  // Separar consultas em passadas e futuras
  const { consultasPassadas, consultasFuturas } = useMemo(() => {
    const agora = new Date();
    const passadas: TConsulta[] = [];
    const futuras: TConsulta[] = [];

    consultas.forEach((consulta) => {
      const dataConsulta = new Date(`${consulta.data}T${consulta.horario}`);
      if (dataConsulta < agora && consulta.status !== "cancelada") {
        passadas.push(consulta);
      } else if (dataConsulta >= agora && consulta.status === "agendada") {
        futuras.push(consulta);
      }
    });

    // Ordenar passadas (mais recente primeiro)
    passadas.sort((a, b) => {
      const dataA = new Date(`${a.data}T${a.horario}`);
      const dataB = new Date(`${b.data}T${b.horario}`);
      return dataB.getTime() - dataA.getTime();
    });

    // Ordenar futuras (mais próxima primeiro)
    futuras.sort((a, b) => {
      const dataA = new Date(`${a.data}T${a.horario}`);
      const dataB = new Date(`${b.data}T${b.horario}`);
      return dataA.getTime() - dataB.getTime();
    });

    return { consultasPassadas: passadas, consultasFuturas: futuras };
  }, [consultas]);

  // Carregar agendamentos futuros
  useEffect(() => {
    const carregarAgendamentosFuturos = async () => {
      if (!user?.id) return;

      setLoadingAgendamentos(true);
      try {
        const todosAgendamentos = await fetchAgendamentos();
        const agora = new Date();

        const futuros = todosAgendamentos
          .filter((ag) => {
            if (ag.pacienteId !== user.id) return false;
            if (ag.status === "cancelado" || ag.status === "finalizado")
              return false;

            // Verificar se a data/hora é futura
            let dataAgendamento: Date;
            if (ag.data.includes("T")) {
              dataAgendamento = new Date(ag.data);
            } else {
              const [ano, mes, dia] = ag.data.split("-").map(Number);
              const [hora, minuto] = ag.horario.split(":").map(Number);
              dataAgendamento = new Date(ano, mes - 1, dia, hora, minuto, 0);
            }

            return dataAgendamento > agora;
          })
          .sort((a, b) => {
            let dataA: Date;
            if (a.data.includes("T")) {
              dataA = new Date(a.data);
            } else {
              const [anoA, mesA, diaA] = a.data.split("-").map(Number);
              const [horaA, minutoA] = a.horario.split(":").map(Number);
              dataA = new Date(anoA, mesA - 1, diaA, horaA, minutoA, 0);
            }

            let dataB: Date;
            if (b.data.includes("T")) {
              dataB = new Date(b.data);
            } else {
              const [anoB, mesB, diaB] = b.data.split("-").map(Number);
              const [horaB, minutoB] = b.horario.split(":").map(Number);
              dataB = new Date(anoB, mesB - 1, diaB, horaB, minutoB, 0);
            }

            return dataA.getTime() - dataB.getTime();
          });

        setAgendamentosFuturos(futuros);
      } catch {
        // Ignorar erro
      } finally {
        setLoadingAgendamentos(false);
      }
    };

    carregarAgendamentosFuturos();
  }, [user?.id]);

  const handleAbaChange = (_event: React.SyntheticEvent, novoValor: number) => {
    setAbaAtiva(novoValor);
  };

  const handleVerDetalhes = (consulta: TConsulta) => {
    setConsultaSelecionada(consulta);
    setModalDetalhesOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finalizada":
        return "success";
      case "cancelada":
        return "error";
      case "em_andamento":
        return "warning";
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

  if (loading || loadingAgendamentos) {
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

  // Mostrar erro se houver
  if (error) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={500} mb={3}>
          Consultas
        </Typography>
        <Card>
          <CardContent>
            <Typography color="error" align="center">
              Erro ao carregar consultas: {error}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} mb={3}>
        Consultas
      </Typography>

      <Tabs value={abaAtiva} onChange={handleAbaChange} sx={{ mb: 3 }}>
        <Tab label="Histórico" />
        <Tab label="Futuras" />
      </Tabs>

      {abaAtiva === 0 && (
        // ABA HISTÓRICO
        <Box>
          {consultasPassadas.length === 0 ? (
            <Card>
              <CardContent>
                <Typography color="text.secondary" align="center">
                  Nenhuma consulta encontrada no histórico.
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
                {consultasPassadas.map((consulta) => {
                  const dataConsulta = new Date(
                    `${consulta.data}T${consulta.horario}`
                  );
                  const dataFormatada = format(dataConsulta, "dd/MM/yyyy", {
                    locale: ptBR,
                  });

                  return (
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
                              {consulta.profissionalNome}{" "}
                              {consulta.profissionalSobrenome}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Data:</strong> {dataFormatada} às{" "}
                              {consulta.horario}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Procedimento:</strong>{" "}
                              {consulta.procedimentoPrincipal}
                              {consulta.procedimentosRealizados.length > 1 && (
                                <span>
                                  {" "}
                                  (+{" "}
                                  {consulta.procedimentosRealizados.length -
                                    1}{" "}
                                  procedimento(s))
                                </span>
                              )}
                            </Typography>
                            {consulta.examesSolicitados.length > 0 && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                <strong>Exames:</strong>{" "}
                                {consulta.examesSolicitados
                                  .slice(0, 2)
                                  .join(", ")}
                                {consulta.examesSolicitados.length > 2 &&
                                  ` (+${
                                    consulta.examesSolicitados.length - 2
                                  })`}
                              </Typography>
                            )}
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
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            color={getStatusColor(consulta.status) as any}
                            size="small"
                          />
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
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
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
                    <TableCell>Data</TableCell>
                    <TableCell>Horário</TableCell>
                    <TableCell>Profissional</TableCell>
                    <TableCell>Procedimento</TableCell>
                    <TableCell>Exames Solicitados</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consultasPassadas.map((consulta) => {
                    const dataConsulta = new Date(
                      `${consulta.data}T${consulta.horario}`
                    );
                    const dataFormatada = format(dataConsulta, "dd/MM/yyyy", {
                      locale: ptBR,
                    });

                    return (
                      <TableRow key={consulta.id} hover>
                        <TableCell>{dataFormatada}</TableCell>
                        <TableCell>{consulta.horario}</TableCell>
                        <TableCell>
                          {consulta.profissionalNome}{" "}
                          {consulta.profissionalSobrenome}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {consulta.procedimentoPrincipal}
                            </Typography>
                            {consulta.procedimentosRealizados.length > 1 && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                + {consulta.procedimentosRealizados.length - 1}{" "}
                                procedimento(s)
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {consulta.examesSolicitados.length > 0 ? (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {consulta.examesSolicitados
                                .slice(0, 2)
                                .map((exame, index) => (
                                  <Chip
                                    key={index}
                                    label={exame}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                              {consulta.examesSolicitados.length > 2 && (
                                <Chip
                                  label={`+${
                                    consulta.examesSolicitados.length - 2
                                  }`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Nenhum exame
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(consulta.status)}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            color={getStatusColor(consulta.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleVerDetalhes(consulta)}
                            aria-label="Ver detalhes"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {abaAtiva === 1 && (
        // ABA FUTURAS
        <Box>
          {consultasFuturas.length === 0 && agendamentosFuturos.length === 0 ? (
            <Card>
              <CardContent>
                <Typography color="text.secondary" align="center">
                  Nenhuma consulta futura agendada.
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
                {/* Consultas futuras */}
                {consultasFuturas.map((consulta) => {
                  const dataConsulta = new Date(
                    `${consulta.data}T${consulta.horario}`
                  );
                  const dataFormatada = format(dataConsulta, "dd/MM/yyyy", {
                    locale: ptBR,
                  });

                  return (
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
                              {consulta.profissionalNome}{" "}
                              {consulta.profissionalSobrenome}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Data:</strong> {dataFormatada} às{" "}
                              {consulta.horario}
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
                            alignItems: "center",
                          }}
                        >
                          <Chip
                            label={getStatusLabel(consulta.status)}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            color={getStatusColor(consulta.status) as any}
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
                {/* Agendamentos futuros */}
                {agendamentosFuturos.map((agendamento) => {
                  let dataAgendamento: Date;
                  if (agendamento.data.includes("T")) {
                    dataAgendamento = new Date(agendamento.data);
                  } else if (agendamento.horario) {
                    const [ano, mes, dia] = agendamento.data
                      .split("-")
                      .map(Number);
                    const [hora, minuto] = agendamento.horario
                      .split(":")
                      .map(Number);
                    dataAgendamento = new Date(
                      ano,
                      mes - 1,
                      dia,
                      hora || 0,
                      minuto || 0,
                      0
                    );
                  } else {
                    dataAgendamento = new Date(agendamento.data);
                  }
                  const dataFormatada = format(dataAgendamento, "dd/MM/yyyy", {
                    locale: ptBR,
                  });
                  const horarioFormatado =
                    agendamento.horario ||
                    format(dataAgendamento, "HH:mm", {
                      locale: ptBR,
                    });

                  return (
                    <Card key={agendamento.id} sx={{ width: "100%" }}>
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
                              {agendamento.profissionalNome}{" "}
                              {agendamento.profissionalSobrenome}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Data:</strong> {dataFormatada} às{" "}
                              {horarioFormatado}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              <strong>Procedimento:</strong>{" "}
                              {agendamento.procedimento}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            alignItems: "center",
                          }}
                        >
                          <Chip label="Agendada" color="info" size="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
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
                    <TableCell>Data</TableCell>
                    <TableCell>Horário</TableCell>
                    <TableCell>Profissional</TableCell>
                    <TableCell>Procedimento</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Consultas futuras */}
                  {consultasFuturas.map((consulta) => {
                    const dataConsulta = new Date(
                      `${consulta.data}T${consulta.horario}`
                    );
                    const dataFormatada = format(dataConsulta, "dd/MM/yyyy", {
                      locale: ptBR,
                    });

                    return (
                      <TableRow key={consulta.id} hover>
                        <TableCell>{dataFormatada}</TableCell>
                        <TableCell>{consulta.horario}</TableCell>
                        <TableCell>
                          {consulta.profissionalNome}{" "}
                          {consulta.profissionalSobrenome}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {consulta.procedimentoPrincipal}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(consulta.status)}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            color={getStatusColor(consulta.status) as any}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Agendamentos futuros */}
                  {agendamentosFuturos.map((agendamento) => {
                    let dataAgendamento: Date;
                    if (agendamento.data.includes("T")) {
                      dataAgendamento = new Date(agendamento.data);
                    } else if (agendamento.horario) {
                      const [ano, mes, dia] = agendamento.data
                        .split("-")
                        .map(Number);
                      const [hora, minuto] = agendamento.horario
                        .split(":")
                        .map(Number);
                      dataAgendamento = new Date(
                        ano,
                        mes - 1,
                        dia,
                        hora || 0,
                        minuto || 0,
                        0
                      );
                    } else {
                      dataAgendamento = new Date(agendamento.data);
                    }
                    const dataFormatada = format(
                      dataAgendamento,
                      "dd/MM/yyyy",
                      {
                        locale: ptBR,
                      }
                    );
                    const horarioFormatado =
                      agendamento.horario ||
                      format(dataAgendamento, "HH:mm", {
                        locale: ptBR,
                      });

                    return (
                      <TableRow key={agendamento.id} hover>
                        <TableCell>{dataFormatada}</TableCell>
                        <TableCell>{horarioFormatado}</TableCell>
                        <TableCell>
                          {agendamento.profissionalNome}{" "}
                          {agendamento.profissionalSobrenome}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {agendamento.procedimento}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label="Agendada" color="info" size="small" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      <ModalDetalhesConsultaPaciente
        open={modalDetalhesOpen}
        onClose={() => {
          setModalDetalhesOpen(false);
          setConsultaSelecionada(null);
        }}
        consulta={consultaSelecionada}
        onAtualizada={() => {
          carregarConsultas();
        }}
      />
    </Box>
  );
};

export default HistoricoPaciente;
