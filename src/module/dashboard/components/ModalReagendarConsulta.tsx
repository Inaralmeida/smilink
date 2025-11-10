import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import type { TAgendamento } from "../../../domain/types/agendamento";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type ModalReagendarConsultaProps = {
  open: boolean;
  onClose: () => void;
  agendamento: TAgendamento | null;
  onConfirmar: () => void;
  horariosDisponiveis?: string[];
};

const ModalReagendarConsulta = ({
  open,
  onClose,
  agendamento,
  onConfirmar,
}: ModalReagendarConsultaProps) => {
  if (!agendamento) return null;

  // Calcular data/hora da consulta
  let dataConsulta: Date;
  if (agendamento.data.includes("T")) {
    dataConsulta = new Date(agendamento.data);
  } else {
    const [ano, mes, dia] = agendamento.data.split("-").map(Number);
    const [hora, minuto] = agendamento.horario.split(":").map(Number);
    dataConsulta = new Date(ano, mes - 1, dia, hora, minuto, 0);
  }
  const agora = new Date();

  // Calcular diferença em horas
  const diferencaMs = dataConsulta.getTime() - agora.getTime();
  const diferencaHoras = diferencaMs / (1000 * 60 * 60);

  // Verificar se pode reagendar (pelo menos 24 horas de antecedência)
  const podeReagendar = diferencaHoras >= 24;

  const dataFormatada = format(dataConsulta, "dd/MM/yyyy 'às' HH:mm", {
    locale: ptBR,
  });

  const horasRestantes = Math.floor(diferencaHoras);
  const minutosRestantes = Math.floor((diferencaHoras - horasRestantes) * 60);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reagendar Consulta</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Typography variant="body1">
            <strong>Consulta atual:</strong> {dataFormatada}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {agendamento.profissionalNome} {agendamento.profissionalSobrenome} •{" "}
            {agendamento.procedimento}
          </Typography>

          {!podeReagendar && (
            <Alert severity="warning">
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Não é possível reagendar esta consulta
              </Typography>
              <Typography variant="body2">
                Para reagendar uma consulta, é necessário ter pelo menos 24
                horas de antecedência. Esta consulta está agendada para daqui a{" "}
                {horasRestantes}h {minutosRestantes}min.
              </Typography>
            </Alert>
          )}

          {podeReagendar && (
            <Alert severity="info">
              <Typography variant="body2">
                Você pode reagendar esta consulta. Restam {horasRestantes} horas
                até o horário agendado.
              </Typography>
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        {podeReagendar && (
          <Button onClick={onConfirmar} variant="contained" color="primary">
            Reagendar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModalReagendarConsulta;
