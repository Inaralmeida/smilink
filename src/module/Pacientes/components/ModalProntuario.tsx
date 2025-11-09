import {
  Box,
  Modal,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { TPaciente } from "../../../domain/types/paciente";
import type { TConsulta } from "../../../service/mock/consultas";
import { fetchConsultasPorPaciente } from "../../../service/mock/consultas";
import { useEffect, useState } from "react";

type ModalProntuarioProps = {
  open: boolean;
  onClose: () => void;
  paciente: TPaciente | null;
};

const formatarData = (data: string): string => {
  const date = new Date(data);
  return date.toLocaleDateString("pt-BR");
};

const formatarStatus = (
  status: TConsulta["status"]
): {
  label: string;
  color: "success" | "error" | "warning" | "info" | "default";
} => {
  const statusMap = {
    agendada: { label: "Agendada", color: "info" as const },
    realizada: { label: "Realizada", color: "success" as const },
    cancelada: { label: "Cancelada", color: "error" as const },
    remarcada: { label: "Remarcada", color: "warning" as const },
  };
  return statusMap[status];
};

const formatarProcedimento = (procedimento: string): string => {
  const procedimentosMap: Record<string, string> = {
    AVALIACAO: "Avaliação",
    LIMPEZA: "Limpeza",
    MANUTENCAO: "Manutenção de Aparelho",
    RESTAURACAO: "Restauração",
  };
  return procedimentosMap[procedimento] || procedimento;
};

const ModalProntuario = ({ open, onClose, paciente }: ModalProntuarioProps) => {
  const [consultas, setConsultas] = useState<TConsulta[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && paciente) {
      setLoading(true);
      fetchConsultasPorPaciente(paciente.id)
        .then((data) => {
          setConsultas(data);
        })
        .catch((error) => {
          console.error("Erro ao buscar consultas:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, paciente]);

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
          width: "90%",
          maxWidth: "900px",
          maxHeight: "90vh",
          borderRadius: "8px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">
            Prontuário - {paciente.nome} {paciente.sobrenome}
          </Typography>
          <IconButton onClick={onClose} aria-label="Fechar">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            overflowY: "auto",
            flex: 1,
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
          ) : consultas.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
                gap: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Nenhuma consulta encontrada
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Horário</TableCell>
                    <TableCell>Profissional</TableCell>
                    <TableCell>Procedimento</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Observações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consultas.map((consulta) => {
                    const statusInfo = formatarStatus(consulta.status);
                    return (
                      <TableRow key={consulta.id}>
                        <TableCell>{formatarData(consulta.data)}</TableCell>
                        <TableCell>{consulta.horario}</TableCell>
                        <TableCell>{consulta.profissionalNome}</TableCell>
                        <TableCell>
                          {formatarProcedimento(consulta.procedimento)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={statusInfo.label}
                            color={statusInfo.color}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{consulta.observacoes || "-"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalProntuario;
