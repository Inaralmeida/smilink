import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NoteIcon from "@mui/icons-material/Note";
import { useConsultasDoDia } from "../hooks/useConsultas";
import { useAuth } from "../../../application/context/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ModalIniciarConsulta from "./ModalIniciarConsulta";
import ModalFinalizarConsulta from "./ModalFinalizarConsulta";
import ModalAdicionarObservacao from "./ModalAdicionarObservacao";
import type { TConsulta } from "../../../domain/types/consulta";

const ConsultaProfissional = () => {
  const { user } = useAuth();
  const dataHoje = format(new Date(), "yyyy-MM-dd");
  const { consultas, loading, iniciar, finalizar, adicionarObservacao } =
    useConsultasDoDia(user?.id || "", dataHoje);

  const [consultaSelecionada, setConsultaSelecionada] =
    useState<TConsulta | null>(null);
  const [modalIniciarOpen, setModalIniciarOpen] = useState(false);
  const [modalFinalizarOpen, setModalFinalizarOpen] = useState(false);
  const [modalObservacaoOpen, setModalObservacaoOpen] = useState(false);

  // Separar consultas por status
  const consultasAgendadas = useMemo(() => {
    return consultas.filter((c) => c.status === "agendada");
  }, [consultas]);

  const consultasEmAndamento = useMemo(() => {
    return consultas.filter((c) => c.status === "em_andamento");
  }, [consultas]);

  const consultasFinalizadas = useMemo(() => {
    return consultas.filter((c) => c.status === "finalizada");
  }, [consultas]);

  const handleIniciarConsulta = (consulta: TConsulta) => {
    setConsultaSelecionada(consulta);
    setModalIniciarOpen(true);
  };

  const handleFinalizarConsulta = (consulta: TConsulta) => {
    setConsultaSelecionada(consulta);
    setModalFinalizarOpen(true);
  };

  const handleAdicionarObservacao = (consulta: TConsulta) => {
    setConsultaSelecionada(consulta);
    setModalObservacaoOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finalizada":
        return "success";
      case "cancelada":
        return "error";
      case "em_andamento":
        return "warning";
      default:
        return "info";
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
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} mb={3}>
        Consultas do Dia -{" "}
        {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
      </Typography>

      {/* Consultas Agendadas */}
      {consultasAgendadas.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" mb={2}>
            Agendadas ({consultasAgendadas.length})
          </Typography>
          {consultasAgendadas.map((consulta) => (
            <Card key={consulta.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="h6">
                      {consulta.pacienteNome} {consulta.pacienteSobrenome}
                    </Typography>
                    <Typography color="text.secondary">
                      {consulta.horario} - {consulta.procedimentoPrincipal}
                    </Typography>
                    <Chip
                      label={getStatusLabel(consulta.status)}
                      color={getStatusColor(consulta.status) as any}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => handleIniciarConsulta(consulta)}
                  >
                    Iniciar Consulta
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Consultas Em Andamento */}
      {consultasEmAndamento.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" mb={2}>
            Em Andamento ({consultasEmAndamento.length})
          </Typography>
          {consultasEmAndamento.map((consulta) => (
            <Card key={consulta.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="h6">
                      {consulta.pacienteNome} {consulta.pacienteSobrenome}
                    </Typography>
                    <Typography color="text.secondary">
                      Iniciada às {consulta.horarioInicio} -{" "}
                      {consulta.procedimentoPrincipal}
                    </Typography>
                    <Chip
                      label={getStatusLabel(consulta.status)}
                      color={getStatusColor(consulta.status) as any}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleFinalizarConsulta(consulta)}
                  >
                    Finalizar Consulta
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Consultas Finalizadas */}
      {consultasFinalizadas.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" mb={2}>
            Finalizadas ({consultasFinalizadas.length})
          </Typography>
          {consultasFinalizadas.map((consulta) => (
            <Card key={consulta.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="h6">
                      {consulta.pacienteNome} {consulta.pacienteSobrenome}
                    </Typography>
                    <Typography color="text.secondary">
                      {consulta.horarioInicio} - {consulta.horarioFim} -{" "}
                      {consulta.procedimentoPrincipal}
                    </Typography>
                    <Chip
                      label={getStatusLabel(consulta.status)}
                      color={getStatusColor(consulta.status) as any}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<NoteIcon />}
                    onClick={() => handleAdicionarObservacao(consulta)}
                  >
                    Adicionar Observação
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {consultas.length === 0 && (
        <Card>
          <CardContent>
            <Typography color="text.secondary" align="center">
              Nenhuma consulta agendada para hoje.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Modais */}
      <ModalIniciarConsulta
        open={modalIniciarOpen}
        onClose={() => {
          setModalIniciarOpen(false);
          setConsultaSelecionada(null);
        }}
        consulta={consultaSelecionada}
        onIniciar={async (horarioInicio) => {
          if (consultaSelecionada) {
            await iniciar(
              consultaSelecionada.id,
              horarioInicio,
              consultaSelecionada.agendamentoId
            );
            setModalIniciarOpen(false);
            setConsultaSelecionada(null);
          }
        }}
      />

      <ModalFinalizarConsulta
        open={modalFinalizarOpen}
        onClose={() => {
          setModalFinalizarOpen(false);
          setConsultaSelecionada(null);
        }}
        consulta={consultaSelecionada}
        onFinalizar={async (dados) => {
          if (consultaSelecionada) {
            await finalizar(consultaSelecionada.id, dados);
            setModalFinalizarOpen(false);
            setConsultaSelecionada(null);
          }
        }}
      />

      <ModalAdicionarObservacao
        open={modalObservacaoOpen}
        onClose={() => {
          setModalObservacaoOpen(false);
          setConsultaSelecionada(null);
        }}
        consulta={consultaSelecionada}
        onSalvar={async (observacoes) => {
          if (consultaSelecionada) {
            await adicionarObservacao(consultaSelecionada.id, observacoes);
            setModalObservacaoOpen(false);
            setConsultaSelecionada(null);
          }
        }}
      />
    </Box>
  );
};

export default ConsultaProfissional;
