import { useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useConsultasPorPaciente } from "../hooks/useConsultas";
import { useAuth } from "../../../application/context/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const HistoricoPaciente = () => {
  const { user } = useAuth();
  const { consultas, loading } = useConsultasPorPaciente(user?.id || "");

  // Ordenar consultas por data (mais recente primeiro)
  const consultasOrdenadas = useMemo(() => {
    return [...consultas].sort((a, b) => {
      const dataA = new Date(`${a.data}T${a.horario}`);
      const dataB = new Date(`${b.data}T${b.horario}`);
      return dataB.getTime() - dataA.getTime();
    });
  }, [consultas]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finalizada":
        return "success";
      case "cancelada":
        return "error";
      case "em_andamento":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "finalizada":
        return "Finalizada";
      case "cancelada":
        return "Cancelada";
      case "em_andamento":
        return "Em Andamento";
      case "agendada":
        return "Agendada";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography>Carregando histórico...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} mb={3}>
        Histórico de Consultas
      </Typography>

      {consultasOrdenadas.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" align="center">
              Nenhuma consulta encontrada no histórico.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Horário</TableCell>
                <TableCell>Profissional</TableCell>
                <TableCell>Procedimento</TableCell>
                <TableCell>Exames Solicitados</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultasOrdenadas.map((consulta) => {
                const dataConsulta = new Date(
                  `${consulta.data}T${consulta.horario}`
                );
                const dataFormatada = format(dataConsulta, "dd/MM/yyyy", {
                  locale: ptBR,
                });

                return (
                  <TableRow key={consulta.id}>
                    <TableCell>{dataFormatada}</TableCell>
                    <TableCell>{consulta.horario}</TableCell>
                    <TableCell>
                      {consulta.profissionalNome}{" "}
                      {consulta.profissionalSobrenome}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {consulta.procedimentoPrincipal}
                        </Typography>
                        {consulta.procedimentosRealizados.length > 1 && (
                          <Typography variant="caption" color="text.secondary">
                            + {consulta.procedimentosRealizados.length - 1}{" "}
                            procedimento(s)
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {consulta.examesSolicitados.length > 0 ? (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {consulta.examesSolicitados.map((exame, index) => (
                            <Chip
                              key={index}
                              label={exame}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Nenhum exame solicitado
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(consulta.status)}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        color={getStatusColor(consulta.status) as any}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default HistoricoPaciente;
