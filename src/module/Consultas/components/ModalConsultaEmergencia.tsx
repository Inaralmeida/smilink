import { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { TPaciente } from "../../../domain/types/paciente";
import SeletorTags from "./SeletorTags";
import {
  MATERIAIS_ODONTOLOGICOS,
  EXAMES_ODONTOLOGICOS,
} from "../../../service/mock/consultas";
import { PROCEDIMENTOS_ODONTOLOGICOS } from "../../../service/mock/agendamentos";
import { fetchPacientes } from "../../../service/mock/pacientes";
import { format } from "date-fns";

// Lista de equipamentos odontológicos
const EQUIPAMENTOS_ODONTOLOGICOS = [
  "Raio-X Panorâmico",
  "Raio-X Periapical",
  "Raio-X Interproximal",
  "Scanner Intraoral",
  "Aparelho de Ultrassom",
  "Aparelho de Endodontia",
  "Mesa Clínica",
  "Refletor Odontológico",
  "Sugador",
  "Compressor",
  "Autoclave",
  "Aparelho de Anestesia",
  "Microscópio",
  "Laser",
  "Câmera Intraoral",
];

type ModalConsultaEmergenciaProps = {
  open: boolean;
  onClose: () => void;
  profissionalId: string;
  profissionalNome: string;
  profissionalSobrenome: string;
  onSalvar: (dados: {
    pacienteId: string;
    pacienteNome: string;
    pacienteSobrenome: string;
    procedimentosRealizados: string[];
    materiaisUtilizados: string[];
    equipamentosUtilizados: string[];
    examesSolicitados: string[];
    observacoes?: string;
    horarioInicio: string;
    data: string;
  }) => Promise<void>;
};

const ModalConsultaEmergencia = ({
  open,
  onClose,
  profissionalId: _profissionalId, // Não usado diretamente, mas necessário na interface
  profissionalNome,
  profissionalSobrenome,
  onSalvar,
}: ModalConsultaEmergenciaProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pacientes, setPacientes] = useState<TPaciente[]>([]);
  const [carregandoPacientes, setCarregandoPacientes] = useState(false);

  // Dados da consulta
  const [pacienteId, setPacienteId] = useState("");
  const [procedimentosRealizados, setProcedimentosRealizados] = useState<
    string[]
  >([]);
  const [materiaisUtilizados, setMateriaisUtilizados] = useState<string[]>([]);
  const [equipamentosUtilizados, setEquipamentosUtilizados] = useState<
    string[]
  >([]);
  const [examesSolicitados, setExamesSolicitados] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState("");

  // Horário de início travado com a hora atual quando o modal abrir
  const [horarioInicio, setHorarioInicio] = useState("");
  const [data, setData] = useState(format(new Date(), "yyyy-MM-dd"));

  // Erros de validação
  const [erroPaciente, setErroPaciente] = useState(false);
  const [erroProcedimentos, setErroProcedimentos] = useState(false);

  // Carregar pacientes quando o modal abrir
  useEffect(() => {
    if (open) {
      setCarregandoPacientes(true);
      fetchPacientes()
        .then((pacs) => {
          setPacientes(pacs.filter((p) => !p.arquivado));
        })
        .catch((err) => {
          console.error("Erro ao carregar pacientes:", err);
          setError("Erro ao carregar lista de pacientes");
        })
        .finally(() => {
          setCarregandoPacientes(false);
        });
    }
  }, [open]);

  // Resetar formulário quando abrir e travar horário de início
  useEffect(() => {
    if (open) {
      // Travar horário de início com a hora atual (momento em que o modal foi aberto)
      const agora = new Date();
      const horas = agora.getHours().toString().padStart(2, "0");
      const minutos = agora.getMinutes().toString().padStart(2, "0");
      const horarioAtual = `${horas}:${minutos}`;

      setPacienteId("");
      setProcedimentosRealizados([]);
      setMateriaisUtilizados([]);
      setEquipamentosUtilizados([]);
      setExamesSolicitados([]);
      setObservacoes("");
      setHorarioInicio(horarioAtual); // Travar com hora atual
      setData(format(new Date(), "yyyy-MM-dd"));
      setError(null);
      setErroPaciente(false);
      setErroProcedimentos(false);
    }
  }, [open]);

  const validarFormulario = (): boolean => {
    let valido = true;

    if (!pacienteId) {
      setErroPaciente(true);
      valido = false;
    } else {
      setErroPaciente(false);
    }

    if (procedimentosRealizados.length === 0) {
      setErroProcedimentos(true);
      valido = false;
    } else {
      setErroProcedimentos(false);
    }

    if (!horarioInicio) {
      setError("Horário de início não pode estar vazio");
      valido = false;
    }

    return valido;
  };

  // Obter dados do paciente selecionado
  const pacienteSelecionado = pacientes.find((p) => p.id === pacienteId);

  const handleSalvar = async () => {
    setError(null);

    if (!validarFormulario()) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!pacienteSelecionado) {
      setError("Paciente não encontrado");
      return;
    }

    setLoading(true);
    try {
      await onSalvar({
        pacienteId: pacienteSelecionado.id,
        pacienteNome: pacienteSelecionado.nome,
        pacienteSobrenome: pacienteSelecionado.sobrenome,
        procedimentosRealizados,
        materiaisUtilizados,
        equipamentosUtilizados,
        examesSolicitados,
        observacoes: observacoes.trim() || undefined,
        horarioInicio,
        data,
      });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao salvar consulta de emergência"
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
          width: "90%",
          maxWidth: "800px",
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
          <Typography variant="h5">Consulta de Emergência</Typography>
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Profissional: {profissionalNome} {profissionalSobrenome}
          </Typography>

          <Divider />

          <FormControl fullWidth error={erroPaciente} required>
            <InputLabel>Paciente</InputLabel>
            <Select
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              label="Paciente"
              disabled={carregandoPacientes}
            >
              {carregandoPacientes ? (
                <MenuItem disabled>Carregando pacientes...</MenuItem>
              ) : (
                pacientes.map((paciente) => (
                  <MenuItem key={paciente.id} value={paciente.id}>
                    {paciente.nome} {paciente.sobrenome}
                  </MenuItem>
                ))
              )}
            </Select>
            {erroPaciente && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1.75 }}
              >
                Paciente é obrigatório
              </Typography>
            )}
          </FormControl>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              type="date"
              label="Data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="time"
              label="Horário de Início"
              value={horarioInicio}
              disabled // Travar horário de início
              InputLabelProps={{ shrink: true }}
              helperText="Horário registrado no momento da abertura do modal"
            />
          </Box>

          <SeletorTags
            label="Procedimentos Realizados *"
            opcoes={PROCEDIMENTOS_ODONTOLOGICOS}
            valores={procedimentosRealizados}
            onChange={setProcedimentosRealizados}
            placeholder="Selecione os procedimentos realizados..."
            error={erroProcedimentos}
            helperText={
              erroProcedimentos
                ? "Pelo menos um procedimento é obrigatório"
                : ""
            }
          />

          <SeletorTags
            label="Materiais Utilizados"
            opcoes={MATERIAIS_ODONTOLOGICOS}
            valores={materiaisUtilizados}
            onChange={setMateriaisUtilizados}
            placeholder="Selecione os materiais utilizados..."
          />

          <SeletorTags
            label="Equipamentos Utilizados"
            opcoes={EQUIPAMENTOS_ODONTOLOGICOS}
            valores={equipamentosUtilizados}
            onChange={setEquipamentosUtilizados}
            placeholder="Selecione os equipamentos utilizados..."
          />

          <SeletorTags
            label="Exames Solicitados"
            opcoes={EXAMES_ODONTOLOGICOS}
            valores={examesSolicitados}
            onChange={setExamesSolicitados}
            placeholder="Selecione os exames solicitados..."
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Observações"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Adicione observações sobre a consulta..."
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
              variant="contained"
              color="primary"
              onClick={handleSalvar}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Salvar Consulta
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalConsultaEmergencia;
