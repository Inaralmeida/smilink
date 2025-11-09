import {
  Box,
  Modal,
  Typography,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import type { TProfissional } from "../../../domain/types/profissional";
import {
  fetchAgenda,
  type AgendaProfissional,
} from "../../../service/mock/agendas";

type ModalHorariosProfissionalProps = {
  open: boolean;
  onClose: () => void;
  profissional: TProfissional | null;
};

// Função para formatar a data
const formatarData = (
  dataISO: string,
  formato: "curto" | "longo" = "curto"
): string => {
  const data = new Date(dataISO);
  if (formato === "curto") {
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  return data.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const ModalHorariosProfissional = ({
  open,
  onClose,
  profissional,
}: ModalHorariosProfissionalProps) => {
  const [agenda, setAgenda] = useState<AgendaProfissional[]>([]);
  const [loading, setLoading] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

  useEffect(() => {
    if (open && profissional) {
      setLoading(true);
      fetchAgenda(profissional.id)
        .then((agendaData) => {
          setAgenda(agendaData);
          if (agendaData.length > 0) {
            setDiaSelecionado(agendaData[0].dia);
          }
        })
        .catch((error) => {
          console.error("Erro ao carregar agenda:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setAgenda([]);
      setDiaSelecionado(null);
    }
  }, [open, profissional]);

  if (!profissional) return null;

  const horariosDoDia =
    agenda.find((a) => a.dia === diaSelecionado)?.horarios || [];

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
          width: "800px",
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
            Horários Disponíveis - {profissional.nome} {profissional.sobrenome}
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
        ) : agenda.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ py: 4 }}
          >
            Nenhum horário disponível para este profissional.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Selecione um dia
              </Typography>
              <ToggleButtonGroup
                value={diaSelecionado}
                exclusive
                onChange={(_, novoDia) => setDiaSelecionado(novoDia)}
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
                {agenda.map((item) => (
                  <ToggleButton
                    key={item.dia}
                    value={item.dia}
                    size="small"
                    sx={{
                      bgcolor: "background.paper",
                      "&.Mui-selected": {
                        bgcolor: "primary.main",
                        color: "white",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                      },
                    }}
                  >
                    {formatarData(item.dia, "curto")}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            {diaSelecionado && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Horários disponíveis para{" "}
                  {formatarData(diaSelecionado, "longo")}
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(100px, 1fr))",
                    gap: 1,
                    maxHeight: "400px",
                    overflow: "auto",
                  }}
                >
                  {horariosDoDia.length > 0 ? (
                    horariosDoDia.map((horario) => (
                      <Box
                        key={horario}
                        sx={{
                          p: 1,
                          textAlign: "center",
                          bgcolor: "primary.light",
                          color: "primary.contrastText",
                          borderRadius: 1,
                          fontSize: "0.875rem",
                        }}
                      >
                        {horario}
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Nenhum horário disponível para este dia.
                    </Typography>
                  )}
                </Paper>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Total de {horariosDoDia.length} horários disponíveis
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ModalHorariosProfissional;
