import { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { TConsulta } from "../../../domain/types/consulta";
import { format } from "date-fns";

type ModalIniciarConsultaProps = {
  open: boolean;
  onClose: () => void;
  consulta: TConsulta | null;
  onIniciar: (horarioInicio: string) => Promise<void>;
};

const ModalIniciarConsulta = ({
  open,
  onClose,
  consulta,
  onIniciar,
}: ModalIniciarConsultaProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [horarioInicio, setHorarioInicio] = useState(
    format(new Date(), "HH:mm")
  );

  const handleSubmit = async () => {
    if (!consulta) return;

    setLoading(true);
    setError(null);

    try {
      await onIniciar(horarioInicio);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao iniciar consulta");
    } finally {
      setLoading(false);
    }
  };

  if (!consulta) return null;

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
          width: "500px",
          maxWidth: "90vw",
          borderRadius: "8px",
          padding: "24px",
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
          <Typography variant="h5">Iniciar Consulta</Typography>
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

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Paciente
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            {consulta.pacienteNome} {consulta.pacienteSobrenome}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Procedimento
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            {consulta.procedimentoPrincipal}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Horário de Início"
          type="time"
          value={horarioInicio}
          onChange={(e) => setHorarioInicio(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
          }}
        >
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Iniciar Consulta
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalIniciarConsulta;
