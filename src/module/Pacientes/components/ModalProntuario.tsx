import {
  Box,
  Modal,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
  Divider,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MedicationIcon from "@mui/icons-material/Medication";
import DescriptionIcon from "@mui/icons-material/Description";
import type { TPaciente } from "../../../domain/types/paciente";
import type { TConsulta, StatusConsulta } from "../../../domain/types/consulta";
import { fetchConsultasPorPaciente } from "../../../service/mock/consultas";
import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type ModalProntuarioProps = {
  open: boolean;
  onClose: () => void;
  paciente: TPaciente | null;
};

const formatarDataHora = (data: string, horario: string): string => {
  try {
    const [ano, mes, dia] = data.split("-").map(Number);
    const [hora, minuto] = horario.split(":").map(Number);
    const date = new Date(ano, mes - 1, dia, hora, minuto);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return `${data} ${horario}`;
  }
};

const formatarStatus = (
  status: StatusConsulta
): {
  label: string;
  color: "success" | "error" | "warning" | "info" | "default";
} => {
  const statusMap: Record<
    StatusConsulta,
    {
      label: string;
      color: "success" | "error" | "warning" | "info" | "default";
    }
  > = {
    agendada: { label: "Agendada", color: "info" },
    em_andamento: { label: "Em Andamento", color: "warning" },
    finalizada: { label: "Finalizada", color: "success" },
    cancelada: { label: "Cancelada", color: "error" },
  };
  return statusMap[status] || { label: status, color: "default" };
};

const ModalProntuario = ({ open, onClose, paciente }: ModalProntuarioProps) => {
  const [consultas, setConsultas] = useState<TConsulta[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && paciente) {
      setLoading(true);
      fetchConsultasPorPaciente(paciente.id)
        .then((data) => {
          // Ordenar consultas por data (mais recente primeiro)
          const consultasOrdenadas = [...data].sort((a, b) => {
            const dataA = new Date(`${a.data}T${a.horario}`);
            const dataB = new Date(`${b.data}T${b.horario}`);
            return dataB.getTime() - dataA.getTime();
          });
          setConsultas(consultasOrdenadas);
        })
        .catch((error) => {
          console.error("Erro ao buscar consultas:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, paciente]);

  // Estatísticas do prontuário
  const estatisticas = useMemo(() => {
    const totalConsultas = consultas.length;
    const consultasFinalizadas = consultas.filter(
      (c) => c.status === "finalizada"
    ).length;
    const consultasCanceladas = consultas.filter(
      (c) => c.status === "cancelada"
    ).length;
    const totalExames = consultas.reduce(
      (acc, c) => acc + c.examesSolicitados.length,
      0
    );
    const totalMateriais = consultas.reduce(
      (acc, c) => acc + c.materiaisUtilizados.length,
      0
    );
    const procedimentosUnicos = new Set(
      consultas.flatMap((c) => [
        c.procedimentoPrincipal,
        ...c.procedimentosRealizados,
      ])
    ).size;

    return {
      totalConsultas,
      consultasFinalizadas,
      consultasCanceladas,
      totalExames,
      totalMateriais,
      procedimentosUnicos,
    };
  }, [consultas]);

  // Todas as consultas ordenadas
  const todasConsultas = useMemo(() => {
    return [...consultas].sort((a, b) => {
      const dataA = new Date(`${a.data}T${a.horario}`);
      const dataB = new Date(`${b.data}T${b.horario}`);
      return dataB.getTime() - dataA.getTime();
    });
  }, [consultas]);

  if (!paciente) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          width: "95%",
          maxWidth: "1200px",
          maxHeight: "95vh",
          borderRadius: "8px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={600} color="primary">
              Prontuário Eletrônico
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {paciente.nome} {paciente.sobrenome}
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Fechar">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Conteúdo */}
        <Box
          sx={{
            overflowY: "auto",
            flex: 1,
            pr: 1,
          }}
        >
          {loading ? (
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
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Estatísticas */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Total de Consultas
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {estatisticas.totalConsultas}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Consultas Finalizadas
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {estatisticas.consultasFinalizadas}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Exames Solicitados
                      </Typography>
                      <Typography variant="h4" color="info.main">
                        {estatisticas.totalExames}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Procedimentos Únicos
                      </Typography>
                      <Typography variant="h4" color="warning.main">
                        {estatisticas.procedimentosUnicos}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Histórico de Consultas */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }} color="primary">
                  <AssignmentIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Histórico de Consultas
                </Typography>

                {todasConsultas.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "200px",
                      gap: 2,
                      border: "1px dashed #ddd",
                      borderRadius: "8px",
                      p: 4,
                    }}
                  >
                    <DescriptionIcon
                      sx={{ fontSize: 48, color: "text.secondary" }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      Nenhuma consulta encontrada
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      O histórico de consultas deste paciente aparecerá aqui
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {todasConsultas.map((consulta, index) => {
                      const statusInfo = formatarStatus(consulta.status);
                      return (
                        <Accordion
                          key={consulta.id}
                          defaultExpanded={index === 0}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                width: "100%",
                                pr: 2,
                              }}
                            >
                              <LocalHospitalIcon color="primary" />
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                >
                                  {formatarDataHora(
                                    consulta.data,
                                    consulta.horario
                                  )}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {consulta.profissionalNome}{" "}
                                  {consulta.profissionalSobrenome} •{" "}
                                  {consulta.procedimentoPrincipal}
                                </Typography>
                              </Box>
                              <Chip
                                label={statusInfo.label}
                                color={statusInfo.color}
                                size="small"
                              />
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container spacing={2}>
                              {/* Informações Básicas */}
                              <Grid size={{ xs: 12, md: 6 }}>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  Informações da Consulta
                                </Typography>
                                <List dense>
                                  <ListItem disablePadding>
                                    <ListItemText
                                      primary="Data e Horário"
                                      secondary={formatarDataHora(
                                        consulta.data,
                                        consulta.horario
                                      )}
                                    />
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText
                                      primary="Profissional"
                                      secondary={`${consulta.profissionalNome} ${consulta.profissionalSobrenome}`}
                                    />
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText
                                      primary="Tipo de Pagamento"
                                      secondary={
                                        consulta.tipoPagamento === "convenio"
                                          ? `Convênio: ${
                                              consulta.convenio || "N/A"
                                            }`
                                          : "Particular"
                                      }
                                    />
                                  </ListItem>
                                  {consulta.horarioInicio && (
                                    <ListItem disablePadding>
                                      <ListItemText
                                        primary="Horário de Início"
                                        secondary={consulta.horarioInicio}
                                      />
                                    </ListItem>
                                  )}
                                  {consulta.horarioFim && (
                                    <ListItem disablePadding>
                                      <ListItemText
                                        primary="Horário de Término"
                                        secondary={consulta.horarioFim}
                                      />
                                    </ListItem>
                                  )}
                                </List>
                              </Grid>

                              {/* Procedimentos */}
                              <Grid size={{ xs: 12, md: 6 }}>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  Procedimentos Realizados
                                </Typography>
                                {consulta.procedimentosRealizados.length > 0 ? (
                                  <List dense>
                                    {consulta.procedimentosRealizados.map(
                                      (proc, idx) => (
                                        <ListItem key={idx} disablePadding>
                                          <ListItemText primary={proc} />
                                        </ListItem>
                                      )
                                    )}
                                  </List>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {consulta.procedimentoPrincipal}
                                  </Typography>
                                )}
                              </Grid>

                              {/* Materiais Utilizados */}
                              {consulta.materiaisUtilizados.length > 0 && (
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    <MedicationIcon
                                      sx={{
                                        verticalAlign: "middle",
                                        mr: 0.5,
                                        fontSize: 16,
                                      }}
                                    />
                                    Materiais Utilizados
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 1,
                                    }}
                                  >
                                    {consulta.materiaisUtilizados.map(
                                      (material, idx) => (
                                        <Chip
                                          key={idx}
                                          label={material}
                                          size="small"
                                          variant="outlined"
                                        />
                                      )
                                    )}
                                  </Box>
                                </Grid>
                              )}

                              {/* Exames Solicitados */}
                              {consulta.examesSolicitados.length > 0 && (
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    <DescriptionIcon
                                      sx={{
                                        verticalAlign: "middle",
                                        mr: 0.5,
                                        fontSize: 16,
                                      }}
                                    />
                                    Exames Solicitados
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 1,
                                    }}
                                  >
                                    {consulta.examesSolicitados.map(
                                      (exame, idx) => (
                                        <Chip
                                          key={idx}
                                          label={exame}
                                          size="small"
                                          color="info"
                                          variant="outlined"
                                        />
                                      )
                                    )}
                                  </Box>
                                </Grid>
                              )}

                              {/* Equipamentos Utilizados */}
                              {consulta.equipamentosUtilizados.length > 0 && (
                                <Grid size={{ xs: 12 }}>
                                  <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    Equipamentos Utilizados
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 1,
                                    }}
                                  >
                                    {consulta.equipamentosUtilizados.map(
                                      (equipamento, idx) => (
                                        <Chip
                                          key={idx}
                                          label={equipamento}
                                          size="small"
                                          variant="outlined"
                                          color="secondary"
                                        />
                                      )
                                    )}
                                  </Box>
                                </Grid>
                              )}

                              {/* Observações */}
                              {(consulta.observacoes ||
                                consulta.observacoesProfissionais) && (
                                <Grid size={{ xs: 12 }}>
                                  <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    Observações
                                  </Typography>
                                  <Paper
                                    variant="outlined"
                                    sx={{ p: 2, bgcolor: "#fafafa" }}
                                  >
                                    {consulta.observacoes && (
                                      <Typography variant="body2" paragraph>
                                        <strong>Observações Gerais:</strong>{" "}
                                        {consulta.observacoes}
                                      </Typography>
                                    )}
                                    {consulta.observacoesProfissionais && (
                                      <Typography variant="body2">
                                        <strong>
                                          Observações do Profissional:
                                        </strong>{" "}
                                        {consulta.observacoesProfissionais}
                                      </Typography>
                                    )}
                                  </Paper>
                                </Grid>
                              )}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalProntuario;
