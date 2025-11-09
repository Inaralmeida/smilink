import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Autocomplete,
  Chip,
  Avatar,
  IconButton,
} from "@mui/material";
import { Controller } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  useFormProfissional,
  type IProfissionalFormInputs,
} from "../hooks/useFormProfissional";
import { CpfTextField } from "../../../shared/components/TextFields/CpfTextField";
import { PhoneTextField } from "../../../shared/components/TextFields/PhoneTextField";
import { CepTextField } from "../../../shared/components/TextFields/CepTextField";
import type { TProfissional } from "../../../domain/types/profissional";

// Lista de especialidades odontológicas
const ESPECIALIDADES_DISPONIVEIS = [
  "Clínica Geral",
  "Ortodontia",
  "Implantodontia",
  "Endodontia",
  "Periodontia",
  "Prótese Dentária",
  "Odontopediatria",
  "Cirurgia Oral",
  "Estética Dental",
  "Radiologia Odontológica",
  "Dentística",
  "Odontologia Hospitalar",
  "Harmonização Orofacial",
  "Ortopedia Funcional dos Maxilares",
];

type FormProfissionalProps = {
  onClose: () => void;
  profissional?: Partial<TProfissional> | null;
  modoEdicao?: boolean;
  somenteLeitura?: boolean;
  onSalvo?: (dados: IProfissionalFormInputs) => void | Promise<void>;
};

const FormProfissional = ({
  onClose,
  profissional,
  modoEdicao = false,
  somenteLeitura = false,
  onSalvo,
}: FormProfissionalProps) => {
  const {
    control,
    errors,
    isSubmitting,
    loadingCep,
    toast,
    handleSubmit,
    handleToastClose,
    editando,
    somenteLeitura: isReadOnly,
  } = useFormProfissional({
    onClose,
    profissional,
    modoEdicao,
    somenteLeitura,
    onSalvo,
  });

  const disabled = isReadOnly && !editando;

  const fotoPerfil = profissional?.fotoPerfil || "";

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        width={"100%"}
        sx={{
          overflowY: "auto",
          paddingRight: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
        maxHeight={"600px"}
      >
        <Box
          width={"100%"}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">
            {profissional ? "Detalhes do Profissional" : "Novo Profissional"}
          </Typography>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={onClose}
            aria-label="Fechar"
          />
        </Box>

        {/* Seção: Foto e Dados Básicos */}
        <Box
          width={"100%"}
          display="flex"
          flexDirection="column"
          gap={"12px"}
          sx={{
            padding: "16px",
            borderRadius: "8px",
            bgcolor: "secondary.main",
          }}
        >
          <Typography>Foto e Dados Básicos</Typography>

          <Grid container spacing={2}>
            <Grid
              size={{ xs: 12 }}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Avatar
                  src={fotoPerfil}
                  sx={{ width: 100, height: 100 }}
                  alt="Foto do profissional"
                />
                {!disabled && (
                  <Controller
                    name="fotoPerfil"
                    control={control}
                    render={({ field }) => (
                      <Box>
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="foto-perfil-input"
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                field.onChange(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label htmlFor="foto-perfil-input">
                          <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                          >
                            <PhotoCameraIcon />
                          </IconButton>
                        </label>
                        <TextField
                          {...field}
                          fullWidth
                          label="URL da Foto"
                          variant="outlined"
                          size="small"
                          sx={{ mt: 1, bgcolor: "primary.contrastText" }}
                          disabled={disabled}
                          error={!!errors.fotoPerfil}
                          helperText={errors.fotoPerfil?.message}
                        />
                      </Box>
                    )}
                  />
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="Nome"
                    variant="outlined"
                    sx={{ bgcolor: "primary.contrastText" }}
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                    disabled={disabled}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="sobrenome"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="Sobrenome"
                    variant="outlined"
                    sx={{ bgcolor: "primary.contrastText" }}
                    error={!!errors.sobrenome}
                    helperText={errors.sobrenome?.message}
                    disabled={disabled}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="email"
                    label="E-mail"
                    variant="outlined"
                    sx={{ bgcolor: "primary.contrastText" }}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={disabled}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="data_nascimento"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="date"
                    label="Data de Nascimento"
                    variant="outlined"
                    sx={{ bgcolor: "primary.contrastText" }}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.data_nascimento}
                    helperText={errors.data_nascimento?.message}
                    disabled={disabled}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CpfTextField
                control={control}
                name="CPF"
                label="CPF"
                required
                sx={{ bgcolor: "primary.contrastText" }}
                disabled={disabled}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <PhoneTextField
                control={control}
                name="telefone"
                label="Telefone"
                required
                sx={{ bgcolor: "primary.contrastText" }}
                disabled={disabled}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Seção: Especialidades e Registros */}
        <Box
          width={"100%"}
          display="flex"
          flexDirection="column"
          gap={"12px"}
          sx={{
            padding: "16px",
            borderRadius: "8px",
            bgcolor: "secondary.main",
          }}
        >
          <Typography>Especialidades e Registros Profissionais</Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="especialidades"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={ESPECIALIDADES_DISPONIVEIS}
                    value={field.value}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    disabled={disabled}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Especialidades"
                        placeholder="Selecione as especialidades"
                        required
                        error={!!errors.especialidades}
                        helperText={errors.especialidades?.message}
                        sx={{ bgcolor: "primary.contrastText" }}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="registro"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="CRO (Conselho Regional de Odontologia)"
                    variant="outlined"
                    sx={{ bgcolor: "primary.contrastText" }}
                    error={!!errors.registro}
                    helperText={errors.registro?.message}
                    disabled={disabled}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    multiline
                    rows={4}
                    label="Biografia"
                    placeholder="Descreva sua trajetória profissional..."
                    variant="outlined"
                    sx={{ bgcolor: "primary.contrastText" }}
                    error={!!errors.bio}
                    helperText={errors.bio?.message}
                    disabled={disabled}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Seção: Endereço */}
        <Box
          width={"100%"}
          display="flex"
          flexDirection="column"
          gap={"12px"}
          sx={{
            padding: "16px",
            borderRadius: "8px",
            bgcolor: "secondary.main",
          }}
        >
          <Typography>Endereço</Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <CepTextField
                control={control}
                name="cep"
                label="CEP"
                required
                sx={{ bgcolor: "primary.contrastText" }}
                loading={loadingCep}
                disabled={disabled}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Controller
                name="street"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="Logradouro"
                    variant="outlined"
                    sx={{ bgcolor: "primary.contrastText" }}
                    error={!!errors.street}
                    helperText={errors.street?.message}
                    disabled={disabled}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="Número"
                    variant="outlined"
                    sx={{ bgcolor: "primary.contrastText" }}
                    error={!!errors.number}
                    helperText={errors.number?.message}
                    disabled={disabled}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="complemento"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Complemento"
                    variant="outlined"
                    sx={{ bgcolor: "primary.contrastText" }}
                    disabled={disabled}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="neigborhood"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="Bairro"
                    variant="outlined"
                    sx={{ bgcolor: "primary.contrastText" }}
                    error={!!errors.neigborhood}
                    helperText={errors.neigborhood?.message}
                    disabled={disabled}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="Cidade"
                    variant="outlined"
                    sx={{ bgcolor: "primary.contrastText" }}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    disabled={disabled}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="Estado"
                    variant="outlined"
                    sx={{ bgcolor: "primary.contrastText" }}
                    error={!!errors.state}
                    helperText={errors.state?.message}
                    disabled={disabled}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        {(!isReadOnly || editando) && (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Salvando..."
              : profissional
              ? "Salvar Alterações"
              : "Salvar Profissional"}
          </Button>
        )}
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toast.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FormProfissional;
