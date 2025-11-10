import { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Chip,
  Divider,
  Stack,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type {
  TAgendamento,
  StatusAgendamento,
} from "../../../domain/types/agendamento";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { obterCorProfissional } from "../utils/colors";

type ModalDetalhesAgendamentoProps = {
  open: boolean;
  onClose: () => void;
  agendamento: TAgendamento | null;
  onEditar?: (agendamento: TAgendamento) => void;
  onCancelar?: (id: string) => Promise<void>;
  onIniciarAtendimento?: (id: string) => Promise<void>;
  onFinalizarAtendimento?: (id: string) => Promise<void>;
};

const getStatusLabel = (status: StatusAgendamento): string => {
  switch (status) {
    case "agendado":
      return "Agendado";
    case "em_atendimento":
      return "Em Atendimento";
    case "finalizado":
      return "Finalizado";
    case "cancelado":
      return "Cancelado";
    default:
      return status;
  }
};

const getStatusColor = (
  status: StatusAgendamento
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  switch (status) {
    case "agendado":
      return "info";
    case "em_atendimento":
      return "warning";
    case "finalizado":
      return "success";
    case "cancelado":
      return "error";
    default:
      return "default";
  }
};

const ModalDetalhesAgendamento = ({
  open,
  onClose,
  agendamento,
  onEditar,
  onCancelar,
  onIniciarAtendimento,
  onFinalizarAtendimento,
}: ModalDetalhesAgendamentoProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!agendamento || !open) {
    return null;
  }

  const corProfissional = obterCorProfissional(agendamento.profissionalId);

  // Criar data local a partir da string YYYY-MM-DD
  const [ano, mes, dia] = agendamento.data.split("-").map(Number);
  const [hora, minuto] = agendamento.horario.split(":").map(Number);
  const dataInicio = new Date(ano, mes - 1, dia, hora, minuto, 0);

  // Formatar data
  const dataFormatada = format(dataInicio, "EEEE, dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  // Calcular horário de término
  const dataFim = new Date(dataInicio);
  dataFim.setMinutes(dataFim.getMinutes() + agendamento.duracao);
  const horarioFim = format(dataFim, "HH:mm");

  const handleCancelar = async () => {
    if (!onCancelar) return;
    setLoading(true);
    setError(null);
    try {
      await onCancelar(agendamento.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao cancelar agendamento"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarAtendimento = async () => {
    if (!onIniciarAtendimento) return;
    setLoading(true);
    setError(null);
    try {
      await onIniciarAtendimento(agendamento.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao iniciar atendimento"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarAtendimento = async () => {
    if (!onFinalizarAtendimento) return;
    setLoading(true);
    setError(null);
    try {
      await onFinalizarAtendimento(agendamento.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao finalizar atendimento"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          width: "600px",
          maxWidth: "90vw",
          borderRadius: "8px",
          padding: "24px",
          maxHeight: "90vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5">Detalhes do Agendamento</Typography>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={onClose}
            aria-label="Fechar"
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={getStatusLabel(agendamento.status)}
              color={getStatusColor(agendamento.status)}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: 1, minWidth: "200px" }}>
              <Typography variant="body2" color="text.secondary">
                Profissional
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {agendamento.profissionalNome}{" "}
                {agendamento.profissionalSobrenome}
              </Typography>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: corProfissional,
                  mt: 0.5,
                }}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: "200px" }}>
              <Typography variant="body2" color="text.secondary">
                Paciente
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {agendamento.pacienteNome} {agendamento.pacienteSobrenome}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ flex: 1, minWidth: "200px" }}>
              <Typography variant="body2" color="text.secondary">
                Data
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {dataFormatada}
              </Typography>
            </Box>

            <Box sx={{ flex: 1, minWidth: "200px" }}>
              <Typography variant="body2" color="text.secondary">
                Horário
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {agendamento.horario} - {horarioFim} ({agendamento.duracao} min)
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Procedimento
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              {agendamento.procedimento}
            </Typography>
          </Box>

          {agendamento.observacoes && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Observações
              </Typography>
              <Typography variant="body1">{agendamento.observacoes}</Typography>
            </Box>
          )}

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {onEditar &&
              agendamento.status !== "finalizado" &&
              agendamento.status !== "cancelado" && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    onEditar(agendamento);
                    onClose();
                  }}
                  disabled={loading}
                >
                  Reagendar
                </Button>
              )}

            {onCancelar &&
              agendamento.status !== "finalizado" &&
              agendamento.status !== "cancelado" && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelar}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              )}

            {onIniciarAtendimento && agendamento.status === "agendado" && (
              <Button
                variant="contained"
                color="warning"
                startIcon={<PlayArrowIcon />}
                onClick={handleIniciarAtendimento}
                disabled={loading}
              >
                Iniciar Atendimento
              </Button>
            )}

            {onFinalizarAtendimento &&
              agendamento.status === "em_atendimento" && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleFinalizarAtendimento}
                  disabled={loading}
                >
                  Finalizar Atendimento
                </Button>
              )}
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModalDetalhesAgendamento;
