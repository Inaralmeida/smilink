import { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  Divider,
  InputAdornment,
  Chip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type { TConsulta } from "../../../domain/types/consulta";
import SeletorTags from "./SeletorTags";
import {
  MATERIAIS_ODONTOLOGICOS,
  EXAMES_ODONTOLOGICOS,
} from "../../../service/mock/consultas";
import { PROCEDIMENTOS_ODONTOLOGICOS } from "../../../service/mock/agendamentos";
import { criarAgendamento } from "../../../service/mock/agendamentos";
import { fetchAgendamentos } from "../../../service/mock/agendamentos";
import { format } from "date-fns";
import { addDays } from "date-fns";

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

type ModalFinalizarConsultaProps = {
  open: boolean;
  onClose: () => void;
  consulta: TConsulta | null;
  onFinalizar: (dados: {
    procedimentosRealizados: string[];
    materiaisUtilizados: string[];
    equipamentosUtilizados: string[];
    examesSolicitados: string[];
    observacoes?: string;
    horarioFim: string;
    alergias?: string[];
    condicoesMedicas?: string[];
    receita?: string;
    atestado?: {
      emitido: boolean;
      cid?: string;
      dias?: number;
    };
  }) => Promise<void>;
};

const ModalFinalizarConsulta = ({
  open,
  onClose,
  consulta,
  onFinalizar,
}: ModalFinalizarConsultaProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dados da consulta
  const [procedimentosRealizados, setProcedimentosRealizados] = useState<
    string[]
  >([]);
  const [materiaisUtilizados, setMateriaisUtilizados] = useState<string[]>([]);
  const [equipamentosUtilizados, setEquipamentosUtilizados] = useState<
    string[]
  >([]);
  const [examesSolicitados, setExamesSolicitados] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const [horarioFim, setHorarioFim] = useState("");

  // Dados médicos do paciente
  const [alergias, setAlergias] = useState<string[]>([]);
  const [condicoesMedicas, setCondicoesMedicas] = useState<string[]>([]);
  const [novaAlergia, setNovaAlergia] = useState("");
  const [novaCondicao, setNovaCondicao] = useState("");

  // Receita médica
  const [receita, setReceita] = useState("");

  // Atestado médico
  const [emitirAtestado, setEmitirAtestado] = useState(false);
  const [cidAtestado, setCidAtestado] = useState("");
  const [diasAtestado, setDiasAtestado] = useState<number>(1);

  // Agendar próxima consulta
  const [agendarProxima, setAgendarProxima] = useState(false);
  const [dataProxima, setDataProxima] = useState("");
  const [horarioProxima, setHorarioProxima] = useState("");
  const [observacoesProxima, setObservacoesProxima] = useState("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

  // Carregar dados iniciais
  useEffect(() => {
    if (consulta && open) {
      setProcedimentosRealizados(
        consulta.procedimentosRealizados || [consulta.procedimentoPrincipal]
      );
      setMateriaisUtilizados(consulta.materiaisUtilizados || []);
      setEquipamentosUtilizados(consulta.equipamentosUtilizados || []);
      setExamesSolicitados(consulta.examesSolicitados || []);
      setObservacoes(consulta.observacoes || "");
      setAlergias(consulta.alergias || []);
      setCondicoesMedicas(consulta.condicoesMedicas || []);
      setReceita(consulta.receita || "");
      setEmitirAtestado(consulta.atestado?.emitido || false);
      setCidAtestado(consulta.atestado?.cid || "");
      setDiasAtestado(consulta.atestado?.dias || 1);

      // Atualizar horário de fim com a hora atual (preview)
      const atualizarHorarioFim = () => {
        const agora = new Date();
        const horas = agora.getHours().toString().padStart(2, "0");
        const minutos = agora.getMinutes().toString().padStart(2, "0");
        setHorarioFim(`${horas}:${minutos}`);
      };

      atualizarHorarioFim();
      // Atualizar a cada minuto para mostrar preview do horário
      const interval = setInterval(atualizarHorarioFim, 60000); // Atualizar a cada minuto

      return () => clearInterval(interval);
    }
  }, [consulta, open]);

  // Gerar horários disponíveis (8h-18h, intervalos de 30min)
  useEffect(() => {
    const horarios: string[] = [];
    for (let hora = 8; hora < 18; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        horarios.push(
          `${hora.toString().padStart(2, "0")}:${minuto
            .toString()
            .padStart(2, "0")}`
        );
      }
    }
    setHorariosDisponiveis(horarios);
  }, []);

  // Filtrar horários disponíveis baseado em agendamentos existentes
  useEffect(() => {
    if (dataProxima && consulta) {
      const filtrarHorariosDisponiveis = async () => {
        try {
          // Gerar todos os horários possíveis
          const todosHorarios: string[] = [];
          for (let hora = 8; hora < 18; hora++) {
            for (let minuto = 0; minuto < 60; minuto += 30) {
              todosHorarios.push(
                `${hora.toString().padStart(2, "0")}:${minuto
                  .toString()
                  .padStart(2, "0")}`
              );
            }
          }

          const agendamentos = await fetchAgendamentos();
          const agendamentosDoDia = agendamentos.filter(
            (a) =>
              a.data === dataProxima &&
              a.profissionalId === consulta.profissionalId
          );
          const horariosOcupados = new Set(
            agendamentosDoDia.map((a) => a.horario)
          );

          const horariosLivres = todosHorarios.filter(
            (h) => !horariosOcupados.has(h)
          );
          setHorariosDisponiveis(horariosLivres);
        } catch (err) {
          console.error("Erro ao filtrar horários:", err);
        }
      };
      filtrarHorariosDisponiveis();
    } else {
      // Se não há data selecionada, resetar para horários padrão
      const horarios: string[] = [];
      for (let hora = 8; hora < 18; hora++) {
        for (let minuto = 0; minuto < 60; minuto += 30) {
          horarios.push(
            `${hora.toString().padStart(2, "0")}:${minuto
              .toString()
              .padStart(2, "0")}`
          );
        }
      }
      setHorariosDisponiveis(horarios);
    }
  }, [dataProxima, consulta]);

  // Handlers para adicionar alergias e condições médicas
  const handleAdicionarAlergia = () => {
    if (novaAlergia.trim() && !alergias.includes(novaAlergia.trim())) {
      setAlergias([...alergias, novaAlergia.trim()]);
      setNovaAlergia("");
    }
  };

  const handleRemoverAlergia = (alergia: string) => {
    setAlergias(alergias.filter((a) => a !== alergia));
  };

  const handleAdicionarCondicao = () => {
    if (
      novaCondicao.trim() &&
      !condicoesMedicas.includes(novaCondicao.trim())
    ) {
      setCondicoesMedicas([...condicoesMedicas, novaCondicao.trim()]);
      setNovaCondicao("");
    }
  };

  const handleRemoverCondicao = (condicao: string) => {
    setCondicoesMedicas(condicoesMedicas.filter((c) => c !== condicao));
  };

  const handleSubmit = async () => {
    if (!consulta) return;

    setLoading(true);
    setError(null);

    try {
      // Validar atestado se emitido
      if (
        emitirAtestado &&
        (!cidAtestado || !diasAtestado || diasAtestado < 1)
      ) {
        setError(
          "Para emitir atestado, é necessário informar CID e quantidade de dias (mínimo 1)"
        );
        setLoading(false);
        return;
      }

      // Definir horário de fim automaticamente com a hora atual
      const agora = new Date();
      const horas = agora.getHours().toString().padStart(2, "0");
      const minutos = agora.getMinutes().toString().padStart(2, "0");
      const horarioFimAtual = `${horas}:${minutos}`;

      // Finalizar consulta
      await onFinalizar({
        procedimentosRealizados,
        materiaisUtilizados,
        equipamentosUtilizados,
        examesSolicitados,
        observacoes: observacoes || undefined,
        horarioFim: horarioFimAtual,
        alergias: alergias.length > 0 ? alergias : undefined,
        condicoesMedicas:
          condicoesMedicas.length > 0 ? condicoesMedicas : undefined,
        receita: receita.trim() || undefined,
        atestado: emitirAtestado
          ? {
              emitido: true,
              cid: cidAtestado,
              dias: diasAtestado,
            }
          : undefined,
      });

      // Se marcou para agendar próxima, criar agendamento
      if (agendarProxima && dataProxima && horarioProxima) {
        await criarAgendamento({
          profissionalId: consulta.profissionalId,
          profissionalNome: consulta.profissionalNome,
          profissionalSobrenome: consulta.profissionalSobrenome,
          pacienteId: consulta.pacienteId,
          pacienteNome: consulta.pacienteNome,
          pacienteSobrenome: consulta.pacienteSobrenome,
          data: dataProxima,
          horario: horarioProxima,
          procedimento:
            procedimentosRealizados[0] || consulta.procedimentoPrincipal,
          duracao: 30, // Duração padrão
          status: "agendado",
          observacoes: observacoesProxima || undefined,
        });
      }

      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao finalizar consulta"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!consulta) return null;

  // Data mínima para próxima consulta (amanhã)
  const dataMinima = format(addDays(new Date(), 1), "yyyy-MM-dd");

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
          width: "700px",
          maxWidth: "90vw",
          borderRadius: "8px",
          padding: "24px",
          maxHeight: "90vh",
          overflow: "auto",
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
          <Typography variant="h5">Finalizar Consulta</Typography>
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

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Paciente
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            {consulta.pacienteNome} {consulta.pacienteSobrenome}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <SeletorTags
            label="Procedimentos Realizados"
            opcoes={PROCEDIMENTOS_ODONTOLOGICOS}
            valores={procedimentosRealizados}
            onChange={setProcedimentosRealizados}
            placeholder="Adicione procedimentos realizados..."
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <SeletorTags
            label="Materiais Utilizados"
            opcoes={MATERIAIS_ODONTOLOGICOS}
            valores={materiaisUtilizados}
            onChange={setMateriaisUtilizados}
            placeholder="Adicione materiais utilizados..."
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <SeletorTags
            label="Equipamentos Utilizados"
            opcoes={EQUIPAMENTOS_ODONTOLOGICOS}
            valores={equipamentosUtilizados}
            onChange={setEquipamentosUtilizados}
            placeholder="Adicione equipamentos utilizados..."
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <SeletorTags
            label="Exames Solicitados"
            opcoes={EXAMES_ODONTOLOGICOS}
            valores={examesSolicitados}
            onChange={setExamesSolicitados}
            placeholder="Adicione exames solicitados..."
          />
        </Box>

        <TextField
          fullWidth
          label="Observações"
          multiline
          rows={3}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Divider sx={{ my: 3 }} />

        {/* Alergias e Condições Médicas */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <LocalHospitalIcon />
            Dados Médicos do Paciente
          </Typography>

          {/* Alergias */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Alergias
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
              {alergias.map((alergia) => (
                <Chip
                  key={alergia}
                  label={alergia}
                  onDelete={() => handleRemoverAlergia(alergia)}
                  deleteIcon={<DeleteIcon />}
                  color="error"
                  variant="outlined"
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Adicionar alergia"
                value={novaAlergia}
                onChange={(e) => setNovaAlergia(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdicionarAlergia();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleAdicionarAlergia}
                        edge="end"
                        size="small"
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Condições Médicas */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Condições Médicas
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
              {condicoesMedicas.map((condicao) => (
                <Chip
                  key={condicao}
                  label={condicao}
                  onDelete={() => handleRemoverCondicao(condicao)}
                  deleteIcon={<DeleteIcon />}
                  color="warning"
                  variant="outlined"
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Adicionar condição médica"
                value={novaCondicao}
                onChange={(e) => setNovaCondicao(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdicionarCondicao();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleAdicionarCondicao}
                        edge="end"
                        size="small"
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Receita Médica */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <AssignmentIcon />
            Receita Médica
          </Typography>
          <TextField
            fullWidth
            label="Receita"
            multiline
            rows={6}
            value={receita}
            onChange={(e) => setReceita(e.target.value)}
            placeholder="Digite a receita médica aqui..."
            helperText="Esta receita será salva no prontuário do paciente"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Atestado Médico */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <DescriptionIcon />
            Atestado Médico
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={emitirAtestado}
                onChange={(e) => setEmitirAtestado(e.target.checked)}
              />
            }
            label="Emitir atestado médico"
            sx={{ mb: 2 }}
          />

          {emitirAtestado && (
            <Box
              sx={{ pl: 4, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                fullWidth
                label="CID"
                value={cidAtestado}
                onChange={(e) => setCidAtestado(e.target.value)}
                placeholder="Ex: K08.1 - Remoção de siso"
                helperText="Classificação Internacional de Doenças"
                required
              />
              <TextField
                fullWidth
                type="number"
                label="Dias de Afastamento"
                value={diasAtestado}
                onChange={(e) => setDiasAtestado(parseInt(e.target.value) || 1)}
                inputProps={{ min: 1, max: 365 }}
                helperText="Quantidade de dias que o paciente ficará afastado"
                required
              />
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <TextField
          fullWidth
          label="Horário de Término (será definido ao finalizar)"
          type="time"
          value={horarioFim}
          disabled // Desabilitado - será definido automaticamente ao finalizar
          InputLabelProps={{ shrink: true }}
          helperText="O horário será registrado automaticamente quando você finalizar a consulta"
          sx={{ mb: 3 }}
        />

        <Divider sx={{ my: 3 }} />

        <FormControlLabel
          control={
            <Checkbox
              checked={agendarProxima}
              onChange={(e) => setAgendarProxima(e.target.checked)}
            />
          }
          label="Agendar próxima consulta"
          sx={{ mb: 2 }}
        />

        {agendarProxima && (
          <Box sx={{ mb: 3, pl: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Profissional
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {consulta.profissionalNome} {consulta.profissionalSobrenome}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Paciente
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {consulta.pacienteNome} {consulta.pacienteSobrenome}
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Data da Próxima Consulta"
              type="date"
              value={dataProxima}
              onChange={(e) => setDataProxima(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: dataMinima }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Horário"
              type="time"
              value={horarioProxima}
              onChange={(e) => setHorarioProxima(e.target.value)}
              InputLabelProps={{ shrink: true }}
              select
              SelectProps={{
                native: true,
              }}
              sx={{ mb: 2 }}
            >
              <option value="">Selecione um horário</option>
              {horariosDisponiveis.map((horario) => (
                <option key={horario} value={horario}>
                  {horario}
                </option>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Observações (opcional)"
              multiline
              rows={2}
              value={observacoesProxima}
              onChange={(e) => setObservacoesProxima(e.target.value)}
            />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            mt: 3,
          }}
        >
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              loading || (agendarProxima && (!dataProxima || !horarioProxima))
            }
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Finalizar Consulta
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalFinalizarConsulta;
