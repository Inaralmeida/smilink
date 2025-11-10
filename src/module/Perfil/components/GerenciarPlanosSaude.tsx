import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import type { TPaciente } from "../../../domain/types/paciente";
import { usePerfil } from "../hooks/usePerfil";

// Lista de planos de saúde disponíveis
const PLANOS_SAUDE_DISPONIVEIS = [
  "Unimed",
  "Amil",
  "SulAmérica",
  "Bradesco Saúde",
  "NotreDame Intermédica",
  "Hapvida",
  "São Francisco",
  "Prevent Senior",
  "Golden Cross",
  "Assim Saúde",
];

type PlanoSaude = {
  id: string;
  nome: string;
  numeroCarteirinha: string;
};

type GerenciarPlanosSaudeProps = {
  paciente: TPaciente | null;
};

const GerenciarPlanosSaude = ({ paciente }: GerenciarPlanosSaudeProps) => {
  const { atualizarPerfil } = usePerfil();
  const [planos, setPlanos] = useState<PlanoSaude[]>(() => {
    if (paciente?.name_plano_saude && paciente?.numero_careteirinha) {
      return [
        {
          id: "1",
          nome: paciente.name_plano_saude,
          numeroCarteirinha: paciente.numero_careteirinha,
        },
      ];
    }
    return [];
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novoPlano, setNovoPlano] = useState({
    nome: "",
    numeroCarteirinha: "",
  });

  const handleAdicionarPlano = () => {
    if (!novoPlano.nome || !novoPlano.numeroCarteirinha) {
      setError("Preencha todos os campos");
      return;
    }

    const novoPlanoComId: PlanoSaude = {
      id: Date.now().toString(),
      nome: novoPlano.nome,
      numeroCarteirinha: novoPlano.numeroCarteirinha,
    };

    setPlanos([...planos, novoPlanoComId]);
    setNovoPlano({ nome: "", numeroCarteirinha: "" });
    setModalAberto(false);
    setError(null);
  };

  const handleRemoverPlano = (id: string) => {
    setPlanos(planos.filter((p) => p.id !== id));
  };

  const handleSalvar = async () => {
    try {
      setSalvando(true);
      setError(null);

      // Atualizar paciente com os planos
      if (planos.length > 0) {
        await atualizarPerfil({
          name_plano_saude: planos[0].nome,
          numero_careteirinha: planos[0].numeroCarteirinha,
          tem_plano_saude: true,
        } as Partial<TPaciente>);
      } else {
        await atualizarPerfil({
          name_plano_saude: undefined,
          numero_careteirinha: undefined,
          tem_plano_saude: false,
        } as Partial<TPaciente>);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar planos de saúde"
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <HealthAndSafetyIcon />
          <Typography variant="h6">Gerenciar Planos de Saúde</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalAberto(true)}
        >
          Adicionar Plano
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {planos.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary">
            Nenhum plano de saúde cadastrado
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {planos.map((plano) => (
            <Paper
              key={plano.id}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {plano.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Carteirinha: {plano.numeroCarteirinha}
                </Typography>
              </Box>
              <IconButton
                color="error"
                onClick={() => handleRemoverPlano(plano.id)}
                aria-label="Remover plano"
              >
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}

      {planos.length > 0 && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={handleSalvar}
            disabled={salvando}
            startIcon={salvando ? <CircularProgress size={20} /> : null}
          >
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </Box>
      )}

      {/* Modal para adicionar plano */}
      <Dialog
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Adicionar Plano de Saúde</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Plano de Saúde</InputLabel>
              <Select
                value={novoPlano.nome}
                onChange={(e) =>
                  setNovoPlano({ ...novoPlano, nome: e.target.value })
                }
                label="Plano de Saúde"
              >
                {PLANOS_SAUDE_DISPONIVEIS.map((plano) => (
                  <MenuItem key={plano} value={plano}>
                    {plano}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Número da Carteirinha"
              fullWidth
              value={novoPlano.numeroCarteirinha}
              onChange={(e) =>
                setNovoPlano({
                  ...novoPlano,
                  numeroCarteirinha: e.target.value,
                })
              }
              placeholder="Ex: 1234567890"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalAberto(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAdicionarPlano}>
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default GerenciarPlanosSaude;
