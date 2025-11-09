import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useState, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import BoxContainer from "../../shared/components/BoxContainer/BoxContainer";
import { usePacientes } from "../../module/Pacientes/hooks/usePacientes";
import ListaPacientes from "../../module/Pacientes/components/ListaPacientes";
import ModalVisualizarPaciente from "../../module/Pacientes/components/ModalVisualizarPaciente";
import ModalProntuario from "../../module/Pacientes/components/ModalProntuario";
import ModalNovaConsulta from "../../module/Consultas/ModalNovaConsulta";
import RoleProtectedRoute from "../../shared/Router/RoleProtectedRoute";
import type { TPaciente } from "../../domain/types/paciente";

const Pacientes = () => {
  const { pacientes, loading, handleArquivar, carregarPacientes } =
    usePacientes();
  const [pacienteSelecionado, setPacienteSelecionado] =
    useState<TPaciente | null>(null);
  const [modalVisualizarOpen, setModalVisualizarOpen] = useState(false);
  const [modalProntuarioOpen, setModalProntuarioOpen] = useState(false);
  const [modalAgendarOpen, setModalAgendarOpen] = useState(false);
  const [modalArquivarOpen, setModalArquivarOpen] = useState(false);
  const [pacienteParaArquivar, setPacienteParaArquivar] =
    useState<TPaciente | null>(null);
  const [termoBusca, setTermoBusca] = useState("");

  // Filtrar pacientes pelo nome ou sobrenome
  const pacientesFiltrados = useMemo(() => {
    if (!termoBusca.trim()) {
      return pacientes;
    }
    const termoLower = termoBusca.toLowerCase().trim();
    return pacientes.filter(
      (paciente) =>
        paciente.nome.toLowerCase().includes(termoLower) ||
        paciente.sobrenome.toLowerCase().includes(termoLower) ||
        `${paciente.nome} ${paciente.sobrenome}`
          .toLowerCase()
          .includes(termoLower)
    );
  }, [pacientes, termoBusca]);

  const handlePacienteClick = (paciente: TPaciente) => {
    setPacienteSelecionado(paciente);
    setModalVisualizarOpen(true);
  };

  const handleEditar = (paciente: TPaciente) => {
    setPacienteSelecionado(paciente);
    setModalVisualizarOpen(true);
  };

  const handleProntuario = (paciente: TPaciente) => {
    setPacienteSelecionado(paciente);
    setModalProntuarioOpen(true);
  };

  const handleAgendar = (paciente: TPaciente) => {
    setPacienteSelecionado(paciente);
    setModalAgendarOpen(true);
  };

  const handleArquivarClick = (paciente: TPaciente) => {
    setPacienteParaArquivar(paciente);
    setModalArquivarOpen(true);
  };

  const confirmarArquivar = async () => {
    if (pacienteParaArquivar) {
      await handleArquivar(pacienteParaArquivar.id);
      setModalArquivarOpen(false);
      setPacienteParaArquivar(null);
      await carregarPacientes();
    }
  };

  const handleSalvo = () => {
    carregarPacientes();
  };

  return (
    <RoleProtectedRoute allowedRoles={["admin", "profissional"]}>
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
            PACIENTES
          </Typography>
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

        <ListaPacientes
          pacientes={pacientesFiltrados}
          loading={loading}
          onPacienteClick={handlePacienteClick}
          onEditar={handleEditar}
          onProntuario={handleProntuario}
          onAgendar={handleAgendar}
          onArquivar={handleArquivarClick}
        />

        <ModalVisualizarPaciente
          open={modalVisualizarOpen}
          onClose={() => {
            setModalVisualizarOpen(false);
            setPacienteSelecionado(null);
          }}
          paciente={pacienteSelecionado}
          onSalvo={handleSalvo}
        />

        <ModalProntuario
          open={modalProntuarioOpen}
          onClose={() => {
            setModalProntuarioOpen(false);
            setPacienteSelecionado(null);
          }}
          paciente={pacienteSelecionado}
        />

        <ModalNovaConsulta
          open={modalAgendarOpen}
          onClose={() => {
            setModalAgendarOpen(false);
            setPacienteSelecionado(null);
          }}
          pacientePreSelecionado={pacienteSelecionado}
        />

        <Dialog
          open={modalArquivarOpen}
          onClose={() => setModalArquivarOpen(false)}
        >
          <DialogTitle>Arquivar Paciente</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja arquivar o paciente{" "}
              {pacienteParaArquivar?.nome} {pacienteParaArquivar?.sobrenome}?
              Esta ação pode ser revertida posteriormente.
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
      </BoxContainer>
    </RoleProtectedRoute>
  );
};

export default Pacientes;
