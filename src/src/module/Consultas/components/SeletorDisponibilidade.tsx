/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useController, type Control } from "react-hook-form";
import type { AgendaProfissional } from "../../../../service/mock/agendas";

// Tipos
interface Props {
  control: Control<any>; // Controle do React Hook Form
  agenda: AgendaProfissional[];
  loading: boolean;
}

// Função para formatar a data (pode ser movida para um utils)
const formatarData = (diaISO: string, formato: "curto" | "longo") => {
  const data = new Date(diaISO);
  if (formato === "longo") {
    return data.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
  }
  // Formato "curto"
  return data.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
  });
};

const SeletorDisponibilidade = ({ control, agenda, loading }: Props) => {
  // --- Controle do React Hook Form ---
  // Registra o campo "data"
  const {
    field: dataField,
    fieldState: { error: dataError },
  } = useController({
    name: "data",
    control,
    rules: { required: "Selecione um dia" },
  });

  // Registra o campo "horario"
  const {
    field: horarioField,
    fieldState: { error: horarioError },
  } = useController({
    name: "horario",
    control,
    rules: { required: "Selecione um horário" },
  });

  // --- Estado Interno ---
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

  // Atualiza os horários disponíveis quando a 'data' (do RHF) muda
  useEffect(() => {
    if (dataField.value) {
      const agendaDoDia = agenda.find((a) => a.dia === dataField.value);
      setHorariosDisponiveis(agendaDoDia ? agendaDoDia.horarios : []);
      horarioField.onChange(""); // Reseta o horário ao trocar o dia
    } else {
      setHorariosDisponiveis([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataField.value, agenda]);

  // Handler para trocar o dia
  const handleDiaChange = (
    _event: React.MouseEvent<HTMLElement>,
    novoDia: string | null
  ) => {
    dataField.onChange(novoDia || ""); // Atualiza o RHF
  };

  // Handler para trocar o horário
  const handleHorarioChange = (
    _event: React.MouseEvent<HTMLElement>,
    novoHorario: string | null
  ) => {
    horarioField.onChange(novoHorario || ""); // Atualiza o RHF
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", height: 100 }}>
        <CircularProgress size={20} />
        <Typography variant="body2">Buscando agenda...</Typography>
      </Box>
    );
  }

  if (agenda.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Nenhuma data disponível para este profissional.
      </Typography>
    );
  }

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12 }}>
        <FormControl required error={!!dataError}>
          <FormLabel>Dias disponíveis</FormLabel>
          <ToggleButtonGroup
            value={dataField.value}
            exclusive
            onChange={handleDiaChange}
            sx={{ flexWrap: "wrap", gap: 1, mt: 1 }}
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
          {dataError && <FormHelperText>{dataError.message}</FormHelperText>}
        </FormControl>
      </Grid>

      {dataField.value && (
        <Grid size={{ xs: 12 }}>
          <FormControl required error={!!horarioError}>
            <FormLabel>
              Horários para {formatarData(dataField.value, "curto")}
            </FormLabel>
            <ToggleButtonGroup
              value={horarioField.value}
              exclusive
              onChange={handleHorarioChange}
              sx={{ flexWrap: "wrap", gap: 1, mt: 1 }}
            >
              {horariosDisponiveis.map((horario) => (
                <ToggleButton
                  key={horario}
                  value={horario}
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
                  {horario}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            {horarioError && (
              <FormHelperText>{horarioError.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
};

export default SeletorDisponibilidade;
