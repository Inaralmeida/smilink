import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Alert,
  Grid,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import BoxContainer from "../../shared/components/BoxContainer/BoxContainer";
import { useEstoque } from "../../module/Estoque/hooks/useEstoque";
import ListaEstoque from "../../module/Estoque/components/ListaEstoque";
import ModalItemEstoque from "../../module/Estoque/components/ModalItemEstoque";
import type {
  TItemEstoque,
  TItemEstoqueInput,
  StatusEstoque,
} from "../../domain/types/estoque";
import RoleProtectedRoute from "../../shared/Router/RoleProtectedRoute";

const Estoque = () => {
  const { itens, loading, error, adicionarItem, editarItem } = useEstoque();

  const [modalOpen, setModalOpen] = useState(false);
  const [itemEditando, setItemEditando] = useState<TItemEstoque | null>(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<StatusEstoque | "todos">(
    "todos"
  );

  // Filtrar itens pelo nome e status
  const itensFiltrados = useMemo(() => {
    let itensFiltradosPorStatus = itens;

    // Aplicar filtro de status
    if (filtroStatus !== "todos") {
      itensFiltradosPorStatus = itens.filter(
        (item) => item.status === filtroStatus
      );
    }

    // Aplicar filtro de busca
    if (!termoBusca.trim()) {
      return itensFiltradosPorStatus;
    }
    const termoLower = termoBusca.toLowerCase().trim();
    return itensFiltradosPorStatus.filter(
      (item) =>
        item.nome.toLowerCase().includes(termoLower) ||
        item.tipo.toLowerCase().includes(termoLower)
    );
  }, [itens, termoBusca, filtroStatus]);

  // Estatísticas
  const estatisticas = useMemo(() => {
    const total = itens.length;
    const normal = itens.filter((i) => i.status === "normal").length;
    const atencao = itens.filter((i) => i.status === "atencao").length;
    const emergencia = itens.filter((i) => i.status === "emergencia").length;

    return { total, normal, atencao, emergencia };
  }, [itens]);

  const handleAbrirModalNovo = () => {
    setItemEditando(null);
    setModalOpen(true);
  };

  const handleAbrirModalEditar = (item: TItemEstoque) => {
    setItemEditando(item);
    setModalOpen(true);
  };

  const handleFecharModal = () => {
    setModalOpen(false);
    setItemEditando(null);
  };

  const handleSalvar = async (dados: TItemEstoqueInput) => {
    setSalvando(true);
    try {
      if (itemEditando) {
        await editarItem(itemEditando.id, dados);
      } else {
        await adicionarItem(dados);
      }
      handleFecharModal();
    } finally {
      setSalvando(false);
    }
  };

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <BoxContainer>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InventoryIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography variant="h4" component="h1">
                Gerenciamento de Estoque
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAbrirModalNovo}
            >
              Adicionar Item
            </Button>
          </Box>

          {/* Estatísticas - Botões Filtros */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={3}>
              <Paper
                component="button"
                onClick={() => setFiltroStatus("todos")}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor:
                    filtroStatus === "todos" ? "primary.main" : "primary.main",
                  opacity: filtroStatus === "todos" ? 1 : 0.7,
                  cursor: "pointer",
                  border: "none",
                  width: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "primary.dark",
                    opacity: 1,
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                }}
              >
                <Typography variant="h6" color="white" fontWeight="bold">
                  {estatisticas.total}
                </Typography>
                <Typography variant="body2" color="white">
                  Total de Itens
                </Typography>
              </Paper>
            </Grid>
            <Grid size={3}>
              <Paper
                component="button"
                onClick={() => setFiltroStatus("normal")}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "primary.main",
                  opacity: filtroStatus === "normal" ? 1 : 0.7,
                  cursor: "pointer",
                  border: "none",
                  width: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "primary.dark",
                    opacity: 1,
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                }}
              >
                <Typography variant="h6" color="white" fontWeight="bold">
                  {estatisticas.normal}
                </Typography>
                <Typography variant="body2" color="white">
                  Normal
                </Typography>
              </Paper>
            </Grid>
            <Grid size={3}>
              <Paper
                component="button"
                onClick={() => setFiltroStatus("atencao")}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "warning.main",
                  opacity: filtroStatus === "atencao" ? 1 : 0.7,
                  cursor: "pointer",
                  border: "none",
                  width: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "warning.dark",
                    opacity: 1,
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                }}
              >
                <Typography variant="h6" color="white" fontWeight="bold">
                  {estatisticas.atencao}
                </Typography>
                <Typography variant="body2" color="white">
                  Atenção
                </Typography>
              </Paper>
            </Grid>
            <Grid size={3}>
              <Paper
                component="button"
                onClick={() => setFiltroStatus("emergencia")}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "error.main",
                  opacity: filtroStatus === "emergencia" ? 1 : 0.7,
                  cursor: "pointer",
                  border: "none",
                  width: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "error.dark",
                    opacity: 1,
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                }}
              >
                <Typography variant="h6" color="white" fontWeight="bold">
                  {estatisticas.emergencia}
                </Typography>
                <Typography variant="body2" color="white">
                  Emergência
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Alertas de estoque baixo */}
          {estatisticas.emergencia > 0 && (
            <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
              <strong>{estatisticas.emergencia} item(s)</strong> em estado de
              emergência (quantidade abaixo de 15). É necessário comprar
              urgentemente!
            </Alert>
          )}

          {estatisticas.atencao > 0 && (
            <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2 }}>
              <strong>{estatisticas.atencao} item(s)</strong> em estado de
              atenção (quantidade abaixo de 30). Considere fazer um pedido.
            </Alert>
          )}

          {/* Busca */}
          <TextField
            fullWidth
            placeholder="Buscar por nome ou tipo..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Lista de itens */}
          <ListaEstoque
            itens={itensFiltrados}
            onEditar={handleAbrirModalEditar}
            loading={loading}
          />
        </Box>

        {/* Modal de adicionar/editar */}
        <ModalItemEstoque
          open={modalOpen}
          onClose={handleFecharModal}
          item={itemEditando}
          onSalvar={handleSalvar}
          loading={salvando}
        />
      </BoxContainer>
    </RoleProtectedRoute>
  );
};

export default Estoque;
