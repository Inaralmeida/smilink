import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import { usePerfil } from "../hooks/usePerfil";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const alterarSenhaSchema = z
  .object({
    senhaAtual: z.string().min(1, "Senha atual é obrigatória"),
    novaSenha: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número"
      ),
    confirmarSenha: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type AlterarSenhaFormInputs = z.infer<typeof alterarSenhaSchema>;

const AlterarSenha = () => {
  const { atualizarSenha, user } = usePerfil();
  const [salvando, setSalvando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AlterarSenhaFormInputs>({
    resolver: zodResolver(alterarSenhaSchema),
    defaultValues: {
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    },
  });

  const onSubmit = async (dados: AlterarSenhaFormInputs) => {
    try {
      setSalvando(true);
      setError(null);
      setSuccess(false);

      // Verificar se a senha atual está correta
      if (user?.senha !== dados.senhaAtual) {
        setError("Senha atual incorreta");
        return;
      }

      // Atualizar senha
      await atualizarSenha(dados.novaSenha);
      setSuccess(true);
      reset();

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao alterar senha");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <LockIcon />
        <Typography variant="h6">Alterar Senha</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Senha alterada com sucesso!
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Controller
            name="senhaAtual"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="password"
                label="Senha Atual"
                fullWidth
                required
                error={!!errors.senhaAtual}
                helperText={errors.senhaAtual?.message}
                disabled={salvando}
              />
            )}
          />

          <Controller
            name="novaSenha"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="password"
                label="Nova Senha"
                fullWidth
                required
                error={!!errors.novaSenha}
                helperText={
                  errors.novaSenha?.message ||
                  "Mínimo de 8 caracteres, incluindo letras maiúsculas, minúsculas e números"
                }
                disabled={salvando}
              />
            )}
          />

          <Controller
            name="confirmarSenha"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="password"
                label="Confirmar Nova Senha"
                fullWidth
                required
                error={!!errors.confirmarSenha}
                helperText={errors.confirmarSenha?.message}
                disabled={salvando}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            startIcon={salvando ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={salvando}
            sx={{ mt: 2 }}
          >
            {salvando ? "Alterando..." : "Alterar Senha"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AlterarSenha;
