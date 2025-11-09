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

type ModalAdicionarObservacaoProps = {
  open: boolean;
  onClose: () => void;
  consulta: TConsulta | null;
  onSalvar: (observacoes: string) => Promise<void>;
};

const ModalAdicionarObservacao = ({
  open,
  onClose,
  consulta,
  onSalvar,
}: ModalAdicionarObservacaoProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [observacoes, setObservacoes] = useState(
    consulta?.observacoesProfissionais || ""
  );

  const handleSubmit = async () => {
    if (!consulta) return;

    setLoading(true);
    setError(null);

    try {
      await onSalvar(observacoes);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar observação"
      );
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
          width: "600px",
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
          <Typography variant="h5">Adicionar Observação</Typography>
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

        <TextField
          fullWidth
          label="Observações Profissionais"
          multiline
          rows={6}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
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
            Salvar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalAdicionarObservacao;
