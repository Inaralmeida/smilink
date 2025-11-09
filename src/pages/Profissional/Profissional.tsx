import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Modal,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useState, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import BoxContainer from "../../shared/components/BoxContainer/BoxContainer";
import { useProfissionais } from "../../module/Profissional/hooks/useProfissionais";
import ListaProfissionais from "../../module/Profissional/components/ListaProfissionais";
import ModalVisualizarProfissional from "../../module/Profissional/components/ModalVisualizarProfissional";
import ModalHorariosProfissional from "../../module/Profissional/components/ModalHorariosProfissional";
import ModalHistoricoProfissional from "../../module/Profissional/components/ModalHistoricoProfissional";
import FormProfissional from "../../module/Profissional/components/FormProfissional";
import RoleProtectedRoute from "../../shared/Router/RoleProtectedRoute";
import type { TProfissional } from "../../domain/types/profissional";
import type { IProfissionalFormInputs } from "../../module/Profissional/hooks/useFormProfissional";

const Profissional = () => {
  const {
    profissionais,
    loading,
    handleArquivar,
    handleCriar,
    handleAtualizar,
    carregarProfissionais,
  } = useProfissionais();
  const [profissionalSelecionado, setProfissionalSelecionado] =
    useState<TProfissional | null>(null);
  const [modalVisualizarOpen, setModalVisualizarOpen] = useState(false);
  const [modalNovoOpen, setModalNovoOpen] = useState(false);
  const [modalArquivarOpen, setModalArquivarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [modalHorariosOpen, setModalHorariosOpen] = useState(false);
  const [modalHistoricoOpen, setModalHistoricoOpen] = useState(false);
  const [profissionalParaArquivar, setProfissionalParaArquivar] =
    useState<TProfissional | null>(null);
  const [termoBusca, setTermoBusca] = useState("");

  // Filtrar profissionais pelo nome ou sobrenome
  const profissionaisFiltrados = useMemo(() => {
    if (!termoBusca.trim()) {
      return profissionais;
    }
    const termoLower = termoBusca.toLowerCase().trim();
    return profissionais.filter(
      (profissional) =>
        profissional.nome.toLowerCase().includes(termoLower) ||
        profissional.sobrenome.toLowerCase().includes(termoLower) ||
        `${profissional.nome} ${profissional.sobrenome}`
          .toLowerCase()
          .includes(termoLower)
    );
  }, [profissionais, termoBusca]);

  const handleProfissionalClick = (profissional: TProfissional) => {
    setProfissionalSelecionado(profissional);
    setModalVisualizarOpen(true);
  };

  const handleEditar = (profissional: TProfissional) => {
    setProfissionalSelecionado(profissional);
    setModalVisualizarOpen(false);
    setModalEditarOpen(true);
  };

  const handleArquivarClick = (profissional: TProfissional) => {
    setProfissionalParaArquivar(profissional);
    setModalArquivarOpen(true);
  };

  const confirmarArquivar = async () => {
    if (profissionalParaArquivar) {
      await handleArquivar(profissionalParaArquivar.id);
      setModalArquivarOpen(false);
      setProfissionalParaArquivar(null);
      await carregarProfissionais();
    }
  };

  const handleSalvo = async (dados: IProfissionalFormInputs) => {
    try {
      if (profissionalSelecionado) {
        // Atualizar profissional existente - garantir email @smilink.com
        const emailBase = dados.email.split("@")[0];
        const emailProfissional = dados.email.includes("@smilink.com")
          ? dados.email
          : `${emailBase}@smilink.com`;

        const dadosAtualizacao: Partial<TProfissional> = {
          nome: dados.nome,
          sobrenome: dados.sobrenome,
          email: emailProfissional,
          data_nascimento: dados.data_nascimento,
          dataNascimento: new Date(dados.data_nascimento).toISOString(),
          CPF: dados.CPF,
          cpf: dados.CPF,
          telefone: dados.telefone,
          celular: dados.telefone,
          especialidades: dados.especialidades,
          bio: dados.bio,
          fotoPerfil: dados.fotoPerfil || "",
          registro: dados.registro,
          cep: dados.cep,
          street: dados.street,
          number: dados.number,
          complemento: dados.complemento,
          neigborhood: dados.neigborhood,
          city: dados.city,
          state: dados.state,
        };
        await handleAtualizar(profissionalSelecionado.id, dadosAtualizacao);
      } else {
        // Criar novo profissional - garantir email @smilink.com
        const emailBase = dados.email.split("@")[0];
        const emailProfissional = dados.email.includes("@smilink.com")
          ? dados.email
          : `${emailBase}@smilink.com`;

        const novoProfissional: Omit<TProfissional, "id"> = {
          nome: dados.nome,
          sobrenome: dados.sobrenome,
          apelido: `${dados.nome.toLowerCase()}.${dados.sobrenome.toLowerCase()}`,
          email: emailProfissional,
          data_nascimento: dados.data_nascimento,
          dataNascimento: new Date(dados.data_nascimento).toISOString(),
          CPF: dados.CPF,
          cpf: dados.CPF,
          telefone: dados.telefone,
          celular: dados.telefone,
          especialidades: dados.especialidades,
          bio: dados.bio,
          fotoPerfil: dados.fotoPerfil || "",
          registro: dados.registro,
          role: "profissional",
          arquivado: false,
          cep: dados.cep,
          street: dados.street,
          number: dados.number,
          complemento: dados.complemento,
          neigborhood: dados.neigborhood,
          city: dados.city,
          state: dados.state,
        };
        await handleCriar(novoProfissional);
        setModalNovoOpen(false);
      }
      await carregarProfissionais();
    } catch (error) {
      console.error("Erro ao salvar profissional:", error);
      throw error;
    }
  };

  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <BoxContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            mb: 2,
          }}
        >
          <Typography
            color="primary"
            fontWeight={500}
            fontFamily={"Montserrat"}
            fontSize={18}
          >
            PROFISSIONAIS
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setProfissionalSelecionado(null);
              setModalNovoOpen(true);
            }}
          >
            Novo Profissional
          </Button>
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Buscar por nome..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#E7F2F4",
                },
                "&:hover fieldset": {
                  borderColor: "#037F8C",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#037F8C",
                },
              },
            }}
          />
        </Box>

        <ListaProfissionais
          profissionais={profissionaisFiltrados}
          loading={loading}
          onProfissionalClick={handleProfissionalClick}
          onVerHorarios={(profissional) => {
            setProfissionalSelecionado(profissional);
            setModalHorariosOpen(true);
          }}
          onVerHistorico={(profissional) => {
            setProfissionalSelecionado(profissional);
            setModalHistoricoOpen(true);
          }}
        />

        <ModalVisualizarProfissional
          open={modalVisualizarOpen}
          onClose={() => {
            setModalVisualizarOpen(false);
            setProfissionalSelecionado(null);
          }}
          profissional={profissionalSelecionado}
          onSalvo={async (dados) => {
            if (profissionalSelecionado) {
              await handleSalvo(dados);
            }
          }}
          onEditar={(prof) => {
            setModalVisualizarOpen(false);
            handleEditar(prof);
          }}
          onArquivar={handleArquivarClick}
        />

        <Modal
          open={modalEditarOpen}
          onClose={() => {
            setModalEditarOpen(false);
            setProfissionalSelecionado(null);
          }}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              width: "680px",
              borderRadius: "8px",
              padding: "16px",
              maxHeight: "90vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <FormProfissional
              onClose={() => {
                setModalEditarOpen(false);
                setProfissionalSelecionado(null);
              }}
              profissional={profissionalSelecionado || undefined}
              modoEdicao={true}
              onSalvo={async (dados) => {
                if (profissionalSelecionado) {
                  await handleSalvo(dados);
                  setModalEditarOpen(false);
                  setProfissionalSelecionado(null);
                }
              }}
            />
          </Box>
        </Modal>

        <Modal
          open={modalNovoOpen}
          onClose={() => setModalNovoOpen(false)}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              width: "680px",
              borderRadius: "8px",
              padding: "16px",
              maxHeight: "90vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <FormProfissional
              onClose={() => setModalNovoOpen(false)}
              profissional={null}
              onSalvo={handleSalvo}
            />
          </Box>
        </Modal>

        <Dialog
          open={modalArquivarOpen}
          onClose={() => setModalArquivarOpen(false)}
        >
          <DialogTitle>Arquivar Profissional</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja arquivar o profissional{" "}
              {profissionalParaArquivar?.nome}{" "}
              {profissionalParaArquivar?.sobrenome}? Esta ação pode ser
              revertida posteriormente.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalArquivarOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmarArquivar}
              color="error"
              variant="contained"
            >
              Arquivar
            </Button>
          </DialogActions>
        </Dialog>

        <ModalHorariosProfissional
          open={modalHorariosOpen}
          onClose={() => {
            setModalHorariosOpen(false);
            setProfissionalSelecionado(null);
          }}
          profissional={profissionalSelecionado}
        />

        <ModalHistoricoProfissional
          open={modalHistoricoOpen}
          onClose={() => {
            setModalHistoricoOpen(false);
            setProfissionalSelecionado(null);
          }}
          profissional={profissionalSelecionado}
        />
      </BoxContainer>
    </RoleProtectedRoute>
  );
};

export default Profissional;
