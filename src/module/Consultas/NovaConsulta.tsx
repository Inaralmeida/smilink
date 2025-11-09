/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import type { TPaciente } from "../../domain/types/paciente";
import { useNovaConsultaForm } from "./hooks/useNovaConsultaForm";
import SeletorDisponibilidade from "./components/SeletorDisponibilidade";

type NovaConsultaProps = {
  onCloseModal: () => void;
  pacientePreSelecionado?: TPaciente | null;
};

const NovaConsulta = ({
  onCloseModal,
  pacientePreSelecionado,
}: NovaConsultaProps) => {
  const {
    control,
    handleSubmit,
    isValid,
    isSubmitting,
    role,
    user,
    pacientes,
    profissionais,
    agenda,
    loadingPacientes,
    loadingProfissionais,
    loadingAgenda,
    profissionalIdSelecionado,
    onSubmit,
    toastOpen,
    handleToastClose,
    textFieldSx,
  } = useNovaConsultaForm({ onCloseModal, pacientePreSelecionado });

  if (!user) {
    return <Typography>Erro: Usuário não autenticado.</Typography>;
  }

  return (
    <Box
      width={"100%"}
      sx={{
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        p: 3,
      }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h4">Nova consulta</Typography>

      <Grid container spacing={4}>
        {role === "admin" && (
          <Grid size={{ xs: 12 }}>
            <Controller
              name="pacienteId"
              control={control}
              rules={{ required: "Paciente é obrigatório" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  select
                  required
                  fullWidth
                  variant="outlined"
                  sx={textFieldSx}
                  label="Paciente"
                  error={!!error}
                  helperText={error?.message}
                  disabled={loadingPacientes || !!pacientePreSelecionado}
                  InputProps={{
                    endAdornment: loadingPacientes && (
                      <CircularProgress size={20} />
                    ),
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione...</em>
                  </MenuItem>
                  {pacientes.map((p: any) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.nome} {p.sobrenome}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
        )}

        {role === "paciente" && (
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              variant="outlined"
              sx={textFieldSx}
              label="Paciente"
              value={`${user.nome} ${user.sobrenome}`}
              disabled
              helperText="Você está agendando para si mesmo."
            />
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Controller
            name="profissionalId"
            control={control}
            rules={{ required: "Profissional é obrigatório" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                select
                required
                fullWidth
                variant="outlined"
                sx={textFieldSx}
                label="Profissional"
                error={!!error}
                helperText={error?.message}
                disabled={loadingProfissionais}
                InputProps={{
                  endAdornment: loadingProfissionais && (
                    <CircularProgress size={20} />
                  ),
                }}
              >
                <MenuItem value="">
                  <em>Selecione...</em>
                </MenuItem>
                {profissionais.map((p: any) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nome} {p.sobrenome}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="procedimento"
            control={control}
            rules={{ required: "Procedimento é obrigatório" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                select
                required
                fullWidth
                variant="outlined"
                sx={textFieldSx}
                label="Procedimento"
                error={!!error}
                helperText={error?.message}
              >
                <MenuItem value="AVALIACAO">Avaliação</MenuItem>
                <MenuItem value="LIMPEZA">Limpeza</MenuItem>
                <MenuItem value="MANUTENCAO">Manutenção de Aparelho</MenuItem>
                <MenuItem value="RESTAURACAO">Restauração</MenuItem>
              </TextField>
            )}
          />
        </Grid>

        {profissionalIdSelecionado && (
          <Grid size={{ xs: 12 }}>
            <SeletorDisponibilidade
              control={control}
              agenda={agenda}
              loading={loadingAgenda}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Controller
            name="observacoes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                sx={textFieldSx}
                label="Observações (Opcional)"
              />
            )}
          />
        </Grid>

        <Grid
          size={{ xs: 12 }}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || isSubmitting}
            sx={{ minWidth: 150 }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Agendar Consulta"
            )}
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={toastOpen}
        autoHideDuration={5000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleToastClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Consulta agendada com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NovaConsulta;
