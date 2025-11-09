import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { LIST_FIELDS_PACIENTE } from "../../../shared/assets/listFieldsFormPaciente";
import { Controller } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  useFormPaciente,
  type IPacienteFormInputs,
} from "../hooks/useFormPaciente";
import { CpfTextField } from "../../../shared/components/TextFields/CpfTextField";
import { PhoneTextField } from "../../../shared/components/TextFields/PhoneTextField";
import { CepTextField } from "../../../shared/components/TextFields/CepTextField";

type FormPacienteProps = {
  onClose: () => void;
  paciente?: IPacienteFormInputs | null;
  modoEdicao?: boolean;
  somenteLeitura?: boolean;
  onSalvo?: () => void;
};

const FormPaciente = ({
  onClose,
  paciente,
  modoEdicao = false,
  somenteLeitura = false,
  onSalvo,
}: FormPacienteProps) => {
  const {
    control,
    errors,
    isSubmitting,
    loadingCep,
    temPlano,
    isMenorDeIdade,
    toast,
    handleSubmit: handleFormSubmit,
    handleToastClose,
    editando,
    somenteLeitura: isReadOnly,
    handleEditar,
    handleCancelarEdicao,
  } = useFormPaciente({
    onClose,
    paciente,
    modoEdicao,
    somenteLeitura,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderField = (fieldInfo: any) => {
    const fieldName = fieldInfo.fieldName as keyof IPacienteFormInputs;
    const error = errors[fieldName];
    const disabled = isReadOnly && !editando;

    const commonProps = {
      control: control,
      name: fieldName,
      label: fieldInfo.label,
      required: fieldInfo.required && !disabled,
      sx: { bgcolor: "primary.contrastText" },
      disabled,
    };

    switch (fieldName) {
      case "CPF":
      case "cpf_responsible":
        return <CpfTextField {...commonProps} />;

      case "telefone":
      case "tel_responsible":
        return <PhoneTextField {...commonProps} />;

      case "cep":
        return <CepTextField {...commonProps} loading={loadingCep} />;

      case "tem_plano_saude":
        return (
          <Controller
            name="tem_plano_saude"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={field.value}
                    color="primary"
                    disabled={disabled}
                  />
                }
                label="Possui Plano de Saúde?"
              />
            )}
          />
        );

      default:
        return (
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                required={fieldInfo.required && !disabled}
                type={fieldInfo.type}
                rows={fieldInfo.type === "textarea" ? 3 : 1}
                variant="outlined"
                sx={{ bgcolor: "primary.contrastText" }}
                label={fieldInfo.label}
                error={!!error}
                helperText={error?.message}
                disabled={disabled}
                InputLabelProps={
                  fieldInfo.type === "date" ? { shrink: true } : undefined
                }
              />
            )}
          />
        );
    }
  };

  const handleSubmitForm = handleFormSubmit(async () => {
    if (onSalvo) {
      onSalvo();
    }
  });

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmitForm}
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
            {paciente ? "Detalhes do Paciente" : "Novo Paciente"}
          </Typography>
          <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {paciente && !editando && (
              <Button
                startIcon={<EditIcon />}
                onClick={handleEditar}
                variant="outlined"
                color="primary"
              >
                Editar
              </Button>
            )}
            {paciente && editando && (
              <Button
                startIcon={<CancelIcon />}
                onClick={handleCancelarEdicao}
                variant="outlined"
                color="secondary"
              >
                Cancelar
              </Button>
            )}
            <CloseIcon
              sx={{ cursor: "pointer" }}
              onClick={onClose}
              aria-label="Fechar"
            />
          </Box>
        </Box>

        {LIST_FIELDS_PACIENTE.map((section) => {
          if (section.name === "Plano de saúde" && !temPlano) {
            return null;
          }

          if (section.name === "Responsavel" && !isMenorDeIdade) {
            return null;
          }

          return (
            <Box
              key={section.name}
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
              <Typography>{section.name}</Typography>

              <Grid container spacing={2}>
                {section.fields.map((fieldSection) => {
                  return (
                    <Grid
                      size={{ xs: 12, md: fieldSection.size }}
                      key={fieldSection.fieldName}
                    >
                      {renderField(fieldSection)}
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          );
        })}

        {(!isReadOnly || editando) && (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Salvando..."
              : paciente
              ? "Salvar Alterações"
              : "Salvar Paciente"}
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

export default FormPaciente;
