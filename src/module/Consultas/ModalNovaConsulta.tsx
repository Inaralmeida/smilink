import { Box, Modal } from "@mui/material";
import NovaConsulta from "./NovaConsulta";
import type { TPaciente } from "../../domain/types/paciente";

type ModalNovaConsultaProps = {
  open: boolean;
  onClose: () => void;
  pacientePreSelecionado?: TPaciente | null;
  profissionalIdPreSelecionado?: string;
  procedimentoPreSelecionado?: string;
  titulo?: string;
  agendamentoAntigoId?: string;
};

const ModalNovaConsulta = ({
  open,
  onClose,
  pacientePreSelecionado,
  profissionalIdPreSelecionado,
  procedimentoPreSelecionado,
  titulo,
  agendamentoAntigoId,
}: ModalNovaConsultaProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{ backgroundColor: "#fff", width: "680px", borderRadius: "8px" }}
      >
        <NovaConsulta
          onCloseModal={onClose}
          pacientePreSelecionado={pacientePreSelecionado}
          profissionalIdPreSelecionado={profissionalIdPreSelecionado}
          procedimentoPreSelecionado={procedimentoPreSelecionado}
          titulo={titulo}
          agendamentoAntigoId={agendamentoAntigoId}
        />
      </Box>
    </Modal>
  );
};

export default ModalNovaConsulta;
