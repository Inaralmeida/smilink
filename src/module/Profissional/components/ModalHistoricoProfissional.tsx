import {
  Box,
  Modal,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import type { TProfissional } from "../../../domain/types/profissional";

type ModalHistoricoProfissionalProps = {
  open: boolean;
  onClose: () => void;
  profissional: TProfissional | null;
};

// Tipo para consulta (mock)
type ConsultaHistorico = {
  id: string;
  pacienteNome: string;
  data: string;
  horario: string;
  procedimento: string;
  status: "concluída" | "cancelada" | "agendada";
};

// Função mock para buscar histórico
const fetchHistoricoConsultas = async (
  profissionalId: string
): Promise<ConsultaHistorico[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Mock de histórico - em produção viria da API usando profissionalId
  // Por enquanto, retorna dados mockados fixos para todos os profissionais
  // profissionalId seria usado para filtrar consultas por profissional
  void profissionalId; // Indica que o parâmetro será usado em implementação futura
  return [
    {
      id: "1",
      pacienteNome: "Paciente da Mota",
      data: "2025-01-15",
      horario: "09:00",
      procedimento: "Avaliação",
      status: "concluída",
    },
    {
      id: "2",
      pacienteNome: "Gerardo Peixoto",
      data: "2025-01-15",
      horario: "10:30",
      procedimento: "Limpeza",
      status: "concluída",
    },
    {
      id: "3",
      pacienteNome: "Amável Fogaça",
      data: "2025-01-16",
      horario: "14:00",
      procedimento: "Restauração",
      status: "agendada",
    },
    {
      id: "4",
      pacienteNome: "Sáli da Paz",
      data: "2025-01-14",
      horario: "11:00",
      procedimento: "Manutenção de Aparelho",
      status: "concluída",
    },
  ];
};

// Função para formatar data
const formatarData = (dataISO: string): string => {
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ModalHistoricoProfissional = ({
  open,
  onClose,
  profissional,
}: ModalHistoricoProfissionalProps) => {
  const [historico, setHistorico] = useState<ConsultaHistorico[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && profissional) {
      setLoading(true);
      fetchHistoricoConsultas(profissional.id)
        .then((historicoData) => {
          setHistorico(historicoData);
        })
        .catch((error) => {
          console.error("Erro ao carregar histórico:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setHistorico([]);
    }
  }, [open, profissional]);

  if (!profissional) return null;

  const getStatusColor = (
    status: string
  ): "success" | "error" | "warning" | "default" => {
    switch (status) {
      case "concluída":
        return "success";
      case "cancelada":
        return "error";
      case "agendada":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "concluída":
        return "Concluída";
      case "cancelada":
        return "Cancelada";
      case "agendada":
        return "Agendada";
      default:
        return status;
    }
  };

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
          width: "900px",
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
          <Typography variant="h5">
            Histórico de Atendimentos - {profissional.nome}{" "}
            {profissional.sobrenome}
          </Typography>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={onClose}
            aria-label="Fechar"
          />
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : historico.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ py: 4 }}
          >
            Nenhum atendimento registrado para este profissional.
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Horário</TableCell>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Procedimento</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historico.map((consulta) => (
                  <TableRow key={consulta.id}>
                    <TableCell>{formatarData(consulta.data)}</TableCell>
                    <TableCell>{consulta.horario}</TableCell>
                    <TableCell>{consulta.pacienteNome}</TableCell>
                    <TableCell>{consulta.procedimento}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(consulta.status)}
                        color={getStatusColor(consulta.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Modal>
  );
};

export default ModalHistoricoProfissional;
