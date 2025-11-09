import { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { TAgendamento } from "../../../domain/types/agendamento";
import type { TProfissional } from "../../../domain/types/profissional";
import type { TPaciente } from "../../../domain/types/paciente";
import { storage, STORAGE_KEYS } from "../../../shared/utils/localStorage";

// Lista de procedimentos odontológicos
const PROCEDIMENTOS = [
  "Consulta de Rotina",
  "Limpeza e Profilaxia",
  "Restauração",
  "Extração",
  "Tratamento de Canal",
  "Clareamento Dental",
  "Avaliação Ortodôntica",
  "Manutenção de Aparelho",
  "Implante",
  "Prótese",
  "Periodontia",
  "Cirurgia",
  "Radiografia",
  "Avaliação Inicial",
];

// Durações padrão (em minutos)
const DURACAO_POR_PROCEDIMENTO: Record<string, number> = {
  "Consulta de Rotina": 30,
  "Limpeza e Profilaxia": 45,
  Restauração: 60,
  Extração: 30,
  "Tratamento de Canal": 90,
  "Clareamento Dental": 60,
  "Avaliação Ortodôntica": 45,
  "Manutenção de Aparelho": 30,
  Implante: 120,
  Prótese: 60,
  Periodontia: 60,
  Cirurgia: 120,
  Radiografia: 15,
  "Avaliação Inicial": 30,
};

const agendamentoSchema = z.object({
  profissionalId: z.string().min(1, "Profissional é obrigatório"),
  pacienteId: z.string().min(1, "Paciente é obrigatório"),
  data: z.string().min(1, "Data é obrigatória"),
  horario: z.string().min(1, "Horário é obrigatório"),
  procedimento: z.string().min(1, "Procedimento é obrigatório"),
  duracao: z.number().min(15, "Duração mínima é 15 minutos"),
  observacoes: z.string().optional(),
});

type AgendamentoFormInputs = z.infer<typeof agendamentoSchema>;

type ModalAgendamentoProps = {
  open: boolean;
  onClose: () => void;
  onSave: (
    dados: Omit<TAgendamento, "id" | "criadoEm" | "atualizadoEm">
  ) => Promise<void>;
  agendamento?: TAgendamento | null;
  dataInicial?: string;
  horarioInicial?: string;
};

const ModalAgendamento = ({
  open,
  onClose,
  onSave,
  agendamento,
  dataInicial,
  horarioInicial,
}: ModalAgendamentoProps) => {
  const [profissionais, setProfissionais] = useState<TProfissional[]>([]);
  const [pacientes, setPacientes] = useState<TPaciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<AgendamentoFormInputs>({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: {
      profissionalId: "",
      pacienteId: "",
      data: "",
      horario: "",
      procedimento: "",
      duracao: 30,
      observacoes: "",
    },
  });

  const procedimentoSelecionado = watch("procedimento");

  // Carregar profissionais e pacientes
  useEffect(() => {
    if (open) {
      const profs = storage.get<TProfissional[]>(
        STORAGE_KEYS.PROFISSIONAIS,
        []
      );
      const pacs = storage.get<TPaciente[]>(STORAGE_KEYS.PACIENTES, []);
      setProfissionais(profs.filter((p) => !p.arquivado));
      setPacientes(pacs.filter((p) => !p.arquivado));

      if (agendamento) {
        reset({
          profissionalId: agendamento.profissionalId,
          pacienteId: agendamento.pacienteId,
          data: agendamento.data,
          horario: agendamento.horario,
          procedimento: agendamento.procedimento,
          duracao: agendamento.duracao,
          observacoes: agendamento.observacoes || "",
        });
      } else {
        reset({
          profissionalId: "",
          pacienteId: "",
          data: dataInicial || new Date().toISOString().split("T")[0],
          horario: horarioInicial || "",
          procedimento: "",
          duracao: 30,
          observacoes: "",
        });
      }
    }
  }, [open, agendamento, reset, dataInicial, horarioInicial]);

  // Atualizar duração quando procedimento muda (apenas ao criar novo)
  useEffect(() => {
    if (
      procedimentoSelecionado &&
      DURACAO_POR_PROCEDIMENTO[procedimentoSelecionado] &&
      !agendamento
    ) {
      // Atualizar duração apenas se não estiver editando
      const novaDuracao = DURACAO_POR_PROCEDIMENTO[procedimentoSelecionado];
      setValue("duracao", novaDuracao);
    }
  }, [procedimentoSelecionado, agendamento, setValue]);

  const onSubmit = async (dados: AgendamentoFormInputs) => {
    setLoading(true);
    setError(null);

    try {
      const profissional = profissionais.find(
        (p) => p.id === dados.profissionalId
      );
      const paciente = pacientes.find((p) => p.id === dados.pacienteId);

      if (!profissional || !paciente) {
        throw new Error("Profissional ou paciente não encontrado");
      }

      // Atualizar duração se procedimento foi selecionado
      const duracaoFinal =
        DURACAO_POR_PROCEDIMENTO[dados.procedimento] || dados.duracao;

      await onSave({
        profissionalId: dados.profissionalId,
        profissionalNome: profissional.nome,
        profissionalSobrenome: profissional.sobrenome,
        pacienteId: dados.pacienteId,
        pacienteNome: paciente.nome,
        pacienteSobrenome: paciente.sobrenome,
        data: dados.data,
        horario: dados.horario,
        procedimento: dados.procedimento,
        duracao: duracaoFinal,
        status: agendamento?.status || "agendado",
        observacoes: dados.observacoes || undefined,
      });

      onClose();
      reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar agendamento"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          width: "600px",
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
            {agendamento ? "Editar Agendamento" : "Novo Agendamento"}
          </Typography>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={onClose}
            aria-label="Fechar"
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
              name="profissionalId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.profissionalId}>
                  <InputLabel>Profissional</InputLabel>
                  <Select {...field} label="Profissional">
                    {profissionais.map((prof) => (
                      <MenuItem key={prof.id} value={prof.id}>
                        {prof.nome} {prof.sobrenome}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.profissionalId && (
                    <Typography variant="caption" color="error">
                      {errors.profissionalId.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="pacienteId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.pacienteId}>
                  <InputLabel>Paciente</InputLabel>
                  <Select {...field} label="Paciente">
                    {pacientes.map((pac) => (
                      <MenuItem key={pac.id} value={pac.id}>
                        {pac.nome} {pac.sobrenome}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.pacienteId && (
                    <Typography variant="caption" color="error">
                      {errors.pacienteId.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="data"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="date"
                  label="Data"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.data}
                  helperText={errors.data?.message}
                />
              )}
            />

            <Controller
              name="horario"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="time"
                  label="Horário"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.horario}
                  helperText={errors.horario?.message}
                />
              )}
            />

            <Controller
              name="procedimento"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.procedimento}>
                  <InputLabel>Procedimento</InputLabel>
                  <Select {...field} label="Procedimento">
                    {PROCEDIMENTOS.map((proc) => (
                      <MenuItem key={proc} value={proc}>
                        {proc}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.procedimento && (
                    <Typography variant="caption" color="error">
                      {errors.procedimento.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="duracao"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="Duração (minutos)"
                  error={!!errors.duracao}
                  helperText={
                    errors.duracao?.message ||
                    (procedimentoSelecionado &&
                      DURACAO_POR_PROCEDIMENTO[procedimentoSelecionado] &&
                      `Duração padrão: ${DURACAO_POR_PROCEDIMENTO[procedimentoSelecionado]} minutos`)
                  }
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />

            <Controller
              name="observacoes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  label="Observações"
                  error={!!errors.observacoes}
                  helperText={errors.observacoes?.message}
                />
              )}
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 2,
              }}
            >
              <Button variant="outlined" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {agendamento ? "Atualizar" : "Criar"}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalAgendamento;
