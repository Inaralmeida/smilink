import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../application/context/AuthContext";
import { fetchAgendamentos } from "../../service/mock/agendamentos";
import { fetchConsultasPorPaciente } from "../../service/mock/consultas";
import { cancelarAgendamento } from "../../service/mock/agendamentos";
import type { TAgendamento } from "../../domain/types/agendamento";
import type { TConsulta } from "../../domain/types/consulta";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ScoreSaude from "./components/ScoreSaude";
import ModalReagendarConsulta from "./components/ModalReagendarConsulta";
import ModalCancelarConsulta from "./components/ModalCancelarConsulta";
import ModalUploadExame from "./components/ModalUploadExame";
import ModalNovaConsulta from "../Consultas/ModalNovaConsulta";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CancelIcon from "@mui/icons-material/Cancel";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const DashboardPaciente = () => {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState<TAgendamento[]>([]);
  const [consultas, setConsultas] = useState<TConsulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [agendamentoParaReagendar, setAgendamentoParaReagendar] =
    useState<TAgendamento | null>(null);
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] =
    useState<TAgendamento | null>(null);
  const [exameParaUpload, setExameParaUpload] = useState<string | null>(null);
  const [openModalNovaConsulta, setOpenModalNovaConsulta] = useState(false);
  const [dadosReagendamento, setDadosReagendamento] = useState<{
    profissionalId: string;
    procedimento: string;
    agendamentoId: string;
  } | null>(null);

  // Função para recarregar agendamentos
  const recarregarAgendamentos = async () => {
    if (!user?.id) return;

    try {
      const todosAgendamentos = await fetchAgendamentos();
      const agora = new Date();

      const agendamentosFuturos = todosAgendamentos
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

      setAgendamentos(agendamentosFuturos);
    } catch (error) {
      console.error("Erro ao recarregar agendamentos:", error);
    }
  };

  // Carregar dados
  useEffect(() => {
    const carregarDados = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const todosAgendamentos = await fetchAgendamentos();
        const agora = new Date();

        let agendamentosFuturos = todosAgendamentos
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

        // Se não houver agendamentos futuros, criar alguns mockados para teste
        if (agendamentosFuturos.length === 0) {
          const { fetchProfissionais } = await import(
            "../../service/mock/profissionais"
          );
          const profissionais = await fetchProfissionais();
          const profissionalAtivo =
            profissionais.find((p) => !p.arquivado) || profissionais[0];

          // Criar 3 agendamentos futuros (amanhã, depois de amanhã, e daqui a 3 dias)
          const agendamentosMockados: TAgendamento[] = [];
          for (let i = 1; i <= 3; i++) {
            const dataFutura = new Date(agora);
            dataFutura.setDate(dataFutura.getDate() + i);
            dataFutura.setHours(10 + i, 0, 0, 0); // 11h, 12h, 13h

            const ano = dataFutura.getFullYear();
            const mes = (dataFutura.getMonth() + 1).toString().padStart(2, "0");
            const dia = dataFutura.getDate().toString().padStart(2, "0");
            const hora = dataFutura.getHours().toString().padStart(2, "0");
            const minuto = dataFutura.getMinutes().toString().padStart(2, "0");

            agendamentosMockados.push({
              id: `agendamento-mock-${
                user.id
              }-${i}-${Date.now()}-${Math.random()}`,
              profissionalId: profissionalAtivo.id,
              profissionalNome: profissionalAtivo.nome,
              profissionalSobrenome: profissionalAtivo.sobrenome,
              pacienteId: user.id,
              pacienteNome: user.nome || "Paciente",
              pacienteSobrenome: user.sobrenome || "Teste",
              data: `${ano}-${mes}-${dia}`,
              horario: `${hora}:${minuto}`,
              procedimento: "Limpeza e Profilaxia",
              duracao: 30,
              status: "agendado",
              observacoes: `Consulta de teste ${i}`,
              criadoEm: new Date().toISOString(),
              atualizadoEm: new Date().toISOString(),
            });
          }

          agendamentosFuturos = [
            ...agendamentosMockados,
            ...agendamentosFuturos,
          ];
        }

        setAgendamentos(agendamentosFuturos);

        // Buscar consultas do paciente
        const consultasDoPaciente = await fetchConsultasPorPaciente(user.id);
        setConsultas(consultasDoPaciente);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [user?.id]);

  // Calcular métricas
  const metricas = useMemo(() => {
    const totalConsultas = consultas.length;
    const consultasRealizadas = consultas.filter(
      (c) => c.status === "finalizada"
    ).length;
    const consultasCanceladas = consultas.filter(
      (c) => c.status === "cancelada"
    ).length;

    return {
      totalConsultas,
      consultasRealizadas,
      consultasCanceladas,
      consultasRemarcadas: 0, // Mocado por enquanto (não temos como identificar remarcações)
    };
  }, [consultas]);

  // Exames solicitados (limitar a 4-5 exames)
  const examesSolicitados = useMemo(() => {
    const todosExames = consultas.flatMap((c) => c.examesSolicitados);
    // Remover duplicatas e limitar a 5 exames
    const examesUnicos = Array.from(new Set(todosExames));

    // Se houver muitos exames, pegar apenas os primeiros 5
    // Se não houver exames, criar alguns mockados
    if (examesUnicos.length === 0) {
      return [
        "Radiografia Periapical",
        "Hemograma completo",
        "Glicemia de jejum",
        "Tomografia Computadorizada (TC)",
      ];
    }

    return examesUnicos.slice(0, 5);
  }, [consultas]);

  // Estado para exames enviados (salvo no localStorage)
  const [examesEnviados, setExamesEnviados] = useState<Set<string>>(new Set());

  // Carregar exames enviados do localStorage
  useEffect(() => {
    if (!user?.id) return;

    const key = `exames_enviados_${user.id}`;
    const examesSalvos = localStorage.getItem(key);
    if (examesSalvos) {
      try {
        const examesArray = JSON.parse(examesSalvos) as string[];
        setExamesEnviados(new Set(examesArray));
      } catch (error) {
        console.error("Erro ao carregar exames enviados:", error);
      }
    }
  }, [user?.id]);

  // Função para marcar exame como enviado
  const handleExameEnviado = (nomeExame: string) => {
    if (!user?.id) return;

    const novosExamesEnviados = new Set(examesEnviados);
    novosExamesEnviados.add(nomeExame);
    setExamesEnviados(novosExamesEnviados);

    // Salvar no localStorage
    const key = `exames_enviados_${user.id}`;
    localStorage.setItem(key, JSON.stringify(Array.from(novosExamesEnviados)));
  };

  // Score de saúde (mocado em 870)
  const scoreSaude = 870;

  // Próximas consultas (limitar a 5)
  const proximasConsultas = useMemo(() => {
    return agendamentos.slice(0, 5);
  }, [agendamentos]);

  // Função para verificar se pode cancelar/reagendar (24h de antecedência)
  const podeCancelarOuReagendar = (agendamento: TAgendamento): boolean => {
    let dataConsulta: Date;
    if (agendamento.data.includes("T")) {
      dataConsulta = new Date(agendamento.data);
    } else {
      const [ano, mes, dia] = agendamento.data.split("-").map(Number);
      const [hora, minuto] = agendamento.horario.split(":").map(Number);
      dataConsulta = new Date(ano, mes - 1, dia, hora, minuto, 0);
    }
    const agora = new Date();
    const diferencaMs = dataConsulta.getTime() - agora.getTime();
    const diferencaHoras = diferencaMs / (1000 * 60 * 60);
    return diferencaHoras >= 24;
  };

  // Handler para cancelar consulta
  const handleCancelar = async (agendamento: TAgendamento) => {
    try {
      await cancelarAgendamento(agendamento.id);
      // Atualizar lista de agendamentos
      setAgendamentos((prev) => prev.filter((a) => a.id !== agendamento.id));
      setAgendamentoParaCancelar(null);
    } catch (error) {
      console.error("Erro ao cancelar consulta:", error);
    }
  };

  // Handler para reagendar consulta
  const handleReagendar = async () => {
    if (!agendamentoParaReagendar) return;

    // Salvar dados do agendamento antes de fechar o modal
    setDadosReagendamento({
      profissionalId: agendamentoParaReagendar.profissionalId,
      procedimento: agendamentoParaReagendar.procedimento,
      agendamentoId: agendamentoParaReagendar.id,
    });

    // Fechar modal de reagendamento e abrir modal de nova consulta com dados pré-preenchidos
    setAgendamentoParaReagendar(null);
    setOpenModalNovaConsulta(true);
  };

  // Handler para upload de exame
  const handleUploadExame = (nomeExame: string, arquivo: File) => {
    handleExameEnviado(nomeExame);
    setExameParaUpload(null);
    // Em produção, aqui faria o upload real do arquivo
    console.log(`Upload do exame ${nomeExame}:`, arquivo.name);
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Métricas */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total de Consultas
              </Typography>
              <Typography variant="h4" color="primary">
                {metricas.totalConsultas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Consultas Realizadas
              </Typography>
              <Typography variant="h4" color="success.main">
                {metricas.consultasRealizadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Consultas Remarcadas
              </Typography>
              <Typography variant="h4" color="warning.main">
                {metricas.consultasRemarcadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Consultas Canceladas
              </Typography>
              <Typography variant="h4" color="error.main">
                {metricas.consultasCanceladas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Score de Saúde */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              minHeight: "400px",
            }}
          >
            <CardContent
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                pb: 4,
                pt: 3,
                px: 3,
                overflow: "visible",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  mb: 4,
                  fontWeight: 600,
                }}
              >
                Score de Saúde
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flex: 1,
                  width: "100%",
                  minHeight: "280px",
                  overflow: "visible",
                }}
              >
                <ScoreSaude score={scoreSaude} size={350} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Próximas Consultas */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <CalendarTodayIcon color="primary" />
                <Typography variant="h6">Próximas Consultas</Typography>
              </Box>
              {proximasConsultas.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "200px",
                    gap: 2,
                  }}
                >
                  <EventNoteIcon
                    sx={{ fontSize: 48, color: "text.secondary" }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    Nenhuma consulta agendada
                  </Typography>
                </Box>
              ) : (
                <List>
                  {proximasConsultas.map((agendamento, index) => {
                    let dataConsulta: Date;
                    if (agendamento.data.includes("T")) {
                      dataConsulta = new Date(agendamento.data);
                    } else {
                      const [ano, mes, dia] = agendamento.data
                        .split("-")
                        .map(Number);
                      const [hora, minuto] = agendamento.horario
                        .split(":")
                        .map(Number);
                      dataConsulta = new Date(
                        ano,
                        mes - 1,
                        dia,
                        hora,
                        minuto,
                        0
                      );
                    }
                    const dataFormatada = format(dataConsulta, "dd/MM/yyyy", {
                      locale: ptBR,
                    });
                    const horarioFormatado = format(dataConsulta, "HH:mm", {
                      locale: ptBR,
                    });
                    const podeCancelar = podeCancelarOuReagendar(agendamento);

                    return (
                      <Box key={agendamento.id}>
                        <ListItem
                          sx={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 1,
                            py: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {dataFormatada} às {horarioFormatado}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {agendamento.profissionalNome}{" "}
                                {agendamento.profissionalSobrenome}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {agendamento.procedimento}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                onClick={() =>
                                  setAgendamentoParaReagendar(agendamento)
                                }
                                disabled={!podeCancelar}
                                startIcon={<EventNoteIcon />}
                              >
                                Reagendar
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() =>
                                  setAgendamentoParaCancelar(agendamento)
                                }
                                disabled={!podeCancelar}
                                startIcon={<CancelIcon />}
                              >
                                Cancelar
                              </Button>
                            </Box>
                          </Box>
                        </ListItem>
                        {index < proximasConsultas.length - 1 && <Divider />}
                      </Box>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Exames Solicitados */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <DescriptionIcon color="primary" />
                <Typography variant="h6">Exames Solicitados</Typography>
              </Box>
              {examesSolicitados.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100px",
                    gap: 1,
                  }}
                >
                  <AssignmentIcon
                    sx={{ fontSize: 32, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Nenhum exame solicitado
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {examesSolicitados.map((exame, index) => {
                    const foiEnviado = examesEnviados.has(exame);
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 2,
                          border: "1px solid",
                          borderColor: foiEnviado ? "success.main" : "#E0E0E0",
                          borderRadius: 1,
                          bgcolor: foiEnviado ? "#f1f8e9" : "transparent",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {foiEnviado && (
                            <CheckCircleIcon color="success" fontSize="small" />
                          )}
                          <Typography
                            variant="body1"
                            sx={{
                              color: foiEnviado
                                ? "success.main"
                                : "text.primary",
                              fontWeight: foiEnviado ? 600 : 400,
                            }}
                          >
                            {exame}
                          </Typography>
                          {foiEnviado && (
                            <Chip
                              label="Enviado"
                              color="success"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        <Button
                          variant={foiEnviado ? "outlined" : "contained"}
                          color={foiEnviado ? "success" : "primary"}
                          size="small"
                          startIcon={<AttachFileIcon />}
                          onClick={() => setExameParaUpload(exame)}
                          disabled={foiEnviado}
                        >
                          {foiEnviado ? "Já Enviado" : "Anexar Exame"}
                        </Button>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modais */}
      <ModalReagendarConsulta
        open={!!agendamentoParaReagendar}
        onClose={() => setAgendamentoParaReagendar(null)}
        agendamento={agendamentoParaReagendar}
        onConfirmar={handleReagendar}
      />

      <ModalCancelarConsulta
        open={!!agendamentoParaCancelar}
        onClose={() => setAgendamentoParaCancelar(null)}
        agendamento={agendamentoParaCancelar}
        onConfirmar={() => {
          if (agendamentoParaCancelar) {
            handleCancelar(agendamentoParaCancelar);
          }
        }}
      />

      <ModalUploadExame
        open={!!exameParaUpload}
        onClose={() => setExameParaUpload(null)}
        nomeExame={exameParaUpload || ""}
        onUpload={handleUploadExame}
      />

      {/* Modal de Nova Consulta para Reagendamento */}
      {dadosReagendamento && (
        <ModalNovaConsulta
          open={openModalNovaConsulta}
          onClose={async () => {
            setOpenModalNovaConsulta(false);
            setDadosReagendamento(null);
            // Aguardar um pouco para garantir que o agendamento foi salvo
            await new Promise((resolve) => setTimeout(resolve, 600));
            // Recarregar agendamentos após reagendamento
            await recarregarAgendamentos();
          }}
          profissionalIdPreSelecionado={dadosReagendamento.profissionalId}
          procedimentoPreSelecionado={mapearProcedimentoParaCodigo(
            dadosReagendamento.procedimento
          )}
          titulo="Reagendar Consulta"
          agendamentoAntigoId={dadosReagendamento.agendamentoId}
        />
      )}
    </Box>
  );
};

// Função para mapear procedimento do agendamento para código do formulário
const mapearProcedimentoParaCodigo = (procedimento: string): string => {
  const mapeamento: Record<string, string> = {
    "Limpeza e Profilaxia": "LIMPEZA",
    Limpeza: "LIMPEZA",
    Avaliação: "AVALIACAO",
    "Avaliação Inicial": "AVALIACAO",
    "Avaliação Ortodôntica": "AVALIACAO",
    "Manutenção de Aparelho": "MANUTENCAO",
    Restauração: "RESTAURACAO",
  };

  // Se encontrar mapeamento, retorna o código
  if (mapeamento[procedimento]) {
    return mapeamento[procedimento];
  }

  // Caso contrário, tenta mapear por palavras-chave
  const procedimentoLower = procedimento.toLowerCase();
  if (
    procedimentoLower.includes("limpeza") ||
    procedimentoLower.includes("profilaxia")
  ) {
    return "LIMPEZA";
  }
  if (
    procedimentoLower.includes("avaliação") ||
    procedimentoLower.includes("avaliacao")
  ) {
    return "AVALIACAO";
  }
  if (
    procedimentoLower.includes("manutenção") ||
    procedimentoLower.includes("manutencao") ||
    procedimentoLower.includes("aparelho")
  ) {
    return "MANUTENCAO";
  }
  if (
    procedimentoLower.includes("restauração") ||
    procedimentoLower.includes("restauracao")
  ) {
    return "RESTAURACAO";
  }

  // Padrão: AVALIACAO
  return "AVALIACAO";
};

export default DashboardPaciente;
