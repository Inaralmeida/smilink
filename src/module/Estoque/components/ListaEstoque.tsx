import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { TItemEstoque } from "../../../domain/types/estoque";

type ListaEstoqueProps = {
  itens: TItemEstoque[];
  onEditar: (item: TItemEstoque) => void;
  loading?: boolean;
};

const ListaEstoque = ({
  itens,
  onEditar,
  loading = false,
}: ListaEstoqueProps) => {
  const getStatusColor = (status: TItemEstoque["status"]) => {
    switch (status) {
      case "normal":
        return "primary";
      case "atencao":
        return "warning";
      case "emergencia":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (
    status: TItemEstoque["status"]
  ): React.ReactElement | undefined => {
    switch (status) {
      case "normal":
        return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case "atencao":
        return <WarningIcon sx={{ fontSize: 16 }} />;
      case "emergencia":
        return <ErrorIcon sx={{ fontSize: 16 }} />;
      default:
        return undefined;
    }
  };

  const getStatusLabel = (status: TItemEstoque["status"]) => {
    switch (status) {
      case "normal":
        return "Normal";
      case "atencao":
        return "Atenção";
      case "emergencia":
        return "Emergência";
      default:
        return "Desconhecido";
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  if (itens.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">
          Nenhum item de estoque encontrado.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Nome do Item</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell align="right">Quantidade</TableCell>
            <TableCell>Unidade</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {itens.map((item) => (
            <TableRow
              key={item.id}
              sx={{
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <TableCell>
                <Chip
                  {...(getStatusIcon(item.status) && {
                    icon: getStatusIcon(item.status),
                  })}
                  label={getStatusLabel(item.status)}
                  color={getStatusColor(item.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {item.nome}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {item.tipo
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color={
                    item.status === "emergencia"
                      ? "error.main"
                      : item.status === "atencao"
                      ? "warning.main"
                      : "text.primary"
                  }
                >
                  {item.quantidade}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {item.unidade || "unidade"}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Editar item">
                  <IconButton
                    size="small"
                    onClick={() => onEditar(item)}
                    aria-label="Editar item"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListaEstoque;
