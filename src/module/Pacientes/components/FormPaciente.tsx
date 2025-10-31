import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { LIST_FIELDS_PACIENTE } from "../../../shared/assets/listFieldsFormPaciente";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";

const FormPaciente = ({ onClose }: { onClose: () => void }) => {
  const { control } = useForm();
  return (
    <Box
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
        <Typography variant="h5">Novo Paciente</Typography>
        <CloseIcon cursor={"pointer"} onClick={onClose} />
      </Box>
      {LIST_FIELDS_PACIENTE.map((section) => {
        return (
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
            <Typography>{section.name}</Typography>
            <Grid container spacing={2}>
              {section.fields.map((fieldSection) => {
                return (
                  <Grid size={{ xs: 12, md: fieldSection.size }}>
                    <Controller
                      name={fieldSection.fieldName}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          focused={fieldSection.type == "date"}
                          required={fieldSection.required}
                          type={fieldSection.type}
                          rows={3}
                          variant="outlined"
                          sx={{ bgcolor: "primary.contrastText" }}
                          label={fieldSection.label}
                        />
                      )}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}

      <Button variant="contained" color="primary">
        Salvar Paciente
      </Button>
    </Box>
  );
};

export default FormPaciente;
