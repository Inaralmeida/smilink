import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type {
  TItemEstoque,
  TItemEstoqueInput,
  TipoItemEstoque,
} from "../../../domain/types/estoque";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const tiposItem: { value: TipoItemEstoque; label: string }[] = [
  { value: "material_basico", label: "Material Básico" },
  { value: "anestesico", label: "Anestésico" },
  { value: "restauracao", label: "Restauração" },
  { value: "endodontico", label: "Endodôntico" },
  { value: "periodontal", label: "Periodontal" },
  { value: "moldagem", label: "Moldagem" },
  { value: "protesico", label: "Protésico" },
  { value: "ortodontico", label: "Ortodôntico" },
  { value: "profilaxia", label: "Profilaxia" },
  { value: "cirurgico", label: "Cirúrgico" },
  { value: "diagnostico", label: "Diagnóstico" },
  { value: "outro", label: "Outro" },
];

const unidades = ["unidade", "caixa", "litro", "kg", "ml", "g"];

const itemEstoqueSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  quantidade: z.number().min(0, "Quantidade deve ser maior ou igual a zero"),
  tipo: z.enum([
    "material_basico",
    "anestesico",
    "restauracao",
    "endodontico",
    "periodontal",
    "moldagem",
    "protesico",
    "ortodontico",
    "profilaxia",
    "cirurgico",
    "diagnostico",
    "outro",
  ]),
  unidade: z.string().optional(),
  descricao: z.string().optional(),
});

type ItemEstoqueFormInputs = z.infer<typeof itemEstoqueSchema>;

type ModalItemEstoqueProps = {
  open: boolean;
  onClose: () => void;
  item?: TItemEstoque | null;
  onSalvar: (dados: TItemEstoqueInput) => Promise<void>;
  loading?: boolean;
};

const ModalItemEstoque = ({
  open,
  onClose,
  item,
  onSalvar,
  loading = false,
}: ModalItemEstoqueProps) => {
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemEstoqueFormInputs>({
    resolver: zodResolver(itemEstoqueSchema),
    defaultValues: {
      nome: "",
      quantidade: 0,
      tipo: "outro",
      unidade: "unidade",
      descricao: "",
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        nome: item.nome,
        quantidade: item.quantidade,
        tipo: item.tipo,
        unidade: item.unidade || "unidade",
        descricao: item.descricao || "",
      });
    } else {
      reset({
        nome: "",
        quantidade: 0,
        tipo: "outro",
        unidade: "unidade",
        descricao: "",
      });
    }
    setError(null);
  }, [item, reset, open]);

  const onSubmit = async (dados: ItemEstoqueFormInputs) => {
    try {
      setError(null);
      await onSalvar(dados);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar item de estoque"
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {item ? "Editar Item de Estoque" : "Adicionar Novo Item"}
          </Typography>
          <IconButton onClick={onClose} aria-label="Fechar">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome do Item"
                    fullWidth
                    required
                    error={!!errors.nome}
                    helperText={errors.nome?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid size={6}>
              <Controller
                name="quantidade"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Quantidade"
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                    error={!!errors.quantidade}
                    helperText={errors.quantidade?.message}
                    disabled={loading}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>

            <Grid size={6}>
              <Controller
                name="unidade"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Unidade</InputLabel>
                    <Select {...field} label="Unidade" disabled={loading}>
                      {unidades.map((unidade) => (
                        <MenuItem key={unidade} value={unidade}>
                          {unidade}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.tipo}>
                    <InputLabel>Tipo de Item</InputLabel>
                    <Select {...field} label="Tipo de Item" disabled={loading}>
                      {tiposItem.map((tipo) => (
                        <MenuItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="descricao"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descrição (opcional)"
                    fullWidth
                    multiline
                    rows={3}
                    disabled={loading}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalItemEstoque;
