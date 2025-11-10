/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  Alert,
  Divider,
  Chip,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ReceiptIcon from "@mui/icons-material/Receipt";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import DescriptionIcon from "@mui/icons-material/Description";
import MedicationIcon from "@mui/icons-material/Medication";
import type { TConsulta } from "../../../domain/types/consulta";
import { fetchProfissionalById } from "../../../service/mock/profissionais";
import {
  gerarPDFReceita,
  gerarPDFAtestado,
} from "../../../shared/utils/pdfGenerator";
import { atualizarConsulta } from "../../../service/mock/consultas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type ModalDetalhesConsultaPacienteProps = {
  open: boolean;
  onClose: () => void;
  consulta: TConsulta | null;
  onAtualizada?: () => void;
};

const ModalDetalhesConsultaPaciente = ({
  open,
  onClose,
  consulta,
  onAtualizada,
}: ModalDetalhesConsultaPacienteProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profissional, setProfissional] = useState<any | null>(null); // 'TProfissional' not found, so use 'any'
  const [adicionandoReceita, setAdicionandoReceita] = useState(false);
  const [adicionandoAtestado, setAdicionandoAtestado] = useState(false);
  const [receitaTexto, setReceitaTexto] = useState("");
  const [cidAtestado, setCidAtestado] = useState("");
  const [diasAtestado, setDiasAtestado] = useState<number>(3);
  const [emitirAtestado, setEmitirAtestado] = useState(false);

  useEffect(() => {
    if (consulta && open) {
      setReceitaTexto(consulta.receita || "");
      setCidAtestado(consulta.atestado?.cid || "");
      setDiasAtestado(consulta.atestado?.dias || 3);
      setEmitirAtestado(consulta.atestado?.emitido || false);

      const buscarProfissional = async () => {
        try {
          const prof = await fetchProfissionalById(consulta.profissionalId);
          setProfissional(prof);
        } catch (err) {
          // Ignorar erro
        }
      };
      buscarProfissional();
    }
  }, [consulta, open]);

  const formatarDataHora = (data: string, horario: string): string => {
    try {
      const dataObj = new Date(`${data}T${horario}`);
      return format(dataObj, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    } catch {
      return `${data} às ${horario}`;
    }
  };

  const handleSalvarReceita = async () => {
    if (!consulta) return;

    setLoading(true);
    setError(null);

    try {
      await atualizarConsulta(consulta.id, {
        receita: receitaTexto.trim() || undefined,
      });

      setAdicionandoReceita(false);
      if (onAtualizada) {
        onAtualizada();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar receita");
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarAtestado = async () => {
    if (!consulta) return;

    if (emitirAtestado && (!cidAtestado || !diasAtestado || diasAtestado < 1)) {
      setError(
        "Para emitir atestado, é necessário informar CID e quantidade de dias (mínimo 1)"
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await atualizarConsulta(consulta.id, {
        atestado: emitirAtestado
          ? {
              emitido: true,
              cid: cidAtestado,
              dias: diasAtestado,
            }
          : undefined,
      });

      setAdicionandoAtestado(false);
      if (onAtualizada) {
        onAtualizada();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar atestado");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceita = async () => {
    if (!consulta) {
      setError("Consulta não encontrada");
      return;
    }

    let profissionalParaUsar = profissional;
    if (!profissionalParaUsar) {
      try {
        profissionalParaUsar = await fetchProfissionalById(
          consulta.profissionalId
        );
        setProfissional(profissionalParaUsar);
      } catch (err) {
        setError("Erro ao buscar dados do profissional");
        return;
      }
    }

    if (!profissionalParaUsar) {
      setError("Profissional não encontrado");
      return;
    }

    try {
      await gerarPDFReceita(consulta, profissionalParaUsar);
    } catch (error) {
      setError("Erro ao gerar PDF da receita");
    }
  };

  const handleDownloadAtestado = async () => {
    if (!consulta) {
      setError("Consulta não encontrada");
      return;
    }

    let profissionalParaUsar = profissional;
    if (!profissionalParaUsar) {
      try {
        profissionalParaUsar = await fetchProfissionalById(
          consulta.profissionalId
        );
        setProfissional(profissionalParaUsar);
      } catch (err) {
        setError("Erro ao buscar dados do profissional");
        return;
      }
    }

    if (!profissionalParaUsar) {
      setError("Profissional não encontrado");
      return;
    }

    try {
      await gerarPDFAtestado(consulta, profissionalParaUsar);
    } catch (error) {
      setError("Erro ao gerar PDF do atestado");
    }
  };

  if (!consulta) return null;

  const consultaPassada =
    new Date(`${consulta.data}T${consulta.horario}`) < new Date();

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
          width: "900px",
          maxWidth: "95vw",
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
          <Typography variant="h5">Detalhes da Consulta</Typography>
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

        {/* Informações Básicas */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Data e Horário
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatarDataHora(consulta.data, consulta.horario)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Profissional
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {consulta.profissionalNome} {consulta.profissionalSobrenome}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Procedimento Principal
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {consulta.procedimentoPrincipal}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Tipo de Pagamento
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {consulta.tipoPagamento === "convenio"
                ? `Convênio: ${consulta.convenio || "N/A"}`
                : "Particular"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Procedimentos Realizados */}
        {consulta.procedimentosRealizados.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Procedimentos Realizados
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {consulta.procedimentosRealizados.map((proc, idx) => (
                <Chip key={idx} label={proc} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        )}

        {/* Materiais Utilizados */}
        {consulta.materiaisUtilizados.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <MedicationIcon sx={{ fontSize: 18 }} />
              Materiais Utilizados
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {consulta.materiaisUtilizados.map((material, idx) => (
                <Chip
                  key={idx}
                  label={material}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Exames Solicitados */}
        {consulta.examesSolicitados.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <DescriptionIcon sx={{ fontSize: 18 }} />
              Exames Solicitados
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {consulta.examesSolicitados.map((exame, idx) => (
                <Chip
                  key={idx}
                  label={exame}
                  size="small"
                  color="info"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Observações */}
        {(consulta.observacoes || consulta.observacoesProfissionais) && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Observações
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: "#fafafa" }}>
              {consulta.observacoes && (
                <Typography variant="body2" paragraph>
                  <strong>Observações Gerais:</strong> {consulta.observacoes}
                </Typography>
              )}
              {consulta.observacoesProfissionais && (
                <Typography variant="body2">
                  <strong>Observações do Profissional:</strong>{" "}
                  {consulta.observacoesProfissionais}
                </Typography>
              )}
            </Paper>
          </Box>
        )}

        {/* Receita Médica */}
        {consultaPassada && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <ReceiptIcon />
                  Receita Médica
                </Typography>
                {consulta.receita ? (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadReceita}
                  >
                    Baixar Receita
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setAdicionandoReceita(true)}
                  >
                    Adicionar Receita
                  </Button>
                )}
              </Box>

              {consulta.receita ? (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "#fafafa" }}>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                    {consulta.receita}
                  </Typography>
                </Paper>
              ) : adicionandoReceita ? (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Receita"
                    value={receitaTexto}
                    onChange={(e) => setReceitaTexto(e.target.value)}
                    placeholder="Digite a receita médica aqui..."
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleSalvarReceita}
                      disabled={loading}
                    >
                      Salvar Receita
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setAdicionandoReceita(false);
                        setReceitaTexto(consulta.receita || "");
                      }}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma receita registrada para esta consulta.
                </Typography>
              )}
            </Box>
          </>
        )}

        {/* Atestado Médico */}
        {consultaPassada && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <VerifiedUserIcon />
                  Atestado Médico
                </Typography>
                {consulta.atestado?.emitido ? (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadAtestado}
                  >
                    Baixar Atestado
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setAdicionandoAtestado(true)}
                  >
                    Adicionar Atestado
                  </Button>
                )}
              </Box>

              {consulta.atestado?.emitido ? (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "#fafafa" }}>
                  <Typography variant="body2" paragraph>
                    <strong>CID:</strong> {consulta.atestado.cid || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Dias de Afastamento:</strong>{" "}
                    {consulta.atestado.dias || "N/A"} dia(s)
                  </Typography>
                </Paper>
              ) : adicionandoAtestado ? (
                <Box>
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
                      sx={{
                        pl: 4,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
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
                        onChange={(e) =>
                          setDiasAtestado(parseInt(e.target.value) || 1)
                        }
                        inputProps={{ min: 1, max: 365 }}
                        helperText="Quantidade de dias que o paciente ficará afastado"
                        required
                      />
                    </Box>
                  )}

                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleSalvarAtestado}
                      disabled={
                        loading ||
                        (emitirAtestado && (!cidAtestado || !diasAtestado))
                      }
                    >
                      Salvar Atestado
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setAdicionandoAtestado(false);
                        setCidAtestado(consulta.atestado?.cid || "");
                        setDiasAtestado(consulta.atestado?.dias || 3);
                        setEmitirAtestado(consulta.atestado?.emitido || false);
                      }}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhum atestado registrado para esta consulta.
                </Typography>
              )}
            </Box>
          </>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 3,
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            Fechar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalDetalhesConsultaPaciente;
