import { Box, Modal } from "@mui/material";
import FormPaciente from "./FormPaciente";
import type { TPaciente } from "../../../domain/types/paciente";
import type { IPacienteFormInputs } from "../hooks/useFormPaciente";

type ModalVisualizarPacienteProps = {
  open: boolean;
  onClose: () => void;
  paciente: TPaciente | null;
  onSalvo?: () => void;
};

const converterPacienteParaFormInputs = (
  paciente: TPaciente
): IPacienteFormInputs => {
  return {
    name: paciente.name || `${paciente.nome} ${paciente.sobrenome}`,
    email: paciente.email,
    data_nascimento:
      paciente.data_nascimento || paciente.dataNascimento.split("T")[0],
    CPF: paciente.CPF || paciente.cpf,
    telefone: paciente.telefone || paciente.celular,
    tem_plano_saude: paciente.tem_plano_saude || false,
    name_responsible: paciente.name_responsible || "",
    cpf_responsible: paciente.cpf_responsible || "",
    grau_parentesco: paciente.grau_parentesco || "",
    tel_responsible: paciente.tel_responsible || "",
    cep: paciente.cep || "",
    street: paciente.street || "",
    number: paciente.number || "",
    complemento: paciente.complemento || "",
    neigborhood: paciente.neigborhood || "",
    city: paciente.city || "",
    state: paciente.state || "",
    name_plano_saude: paciente.name_plano_saude || "",
    numero_careteirinha: paciente.numero_careteirinha || "",
  };
};

const ModalVisualizarPaciente = ({
  open,
  onClose,
  paciente,
  onSalvo,
}: ModalVisualizarPacienteProps) => {
  if (!paciente) return null;

  const pacienteFormInputs = converterPacienteParaFormInputs(paciente);

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
        <FormPaciente
          onClose={onClose}
          paciente={pacienteFormInputs}
          somenteLeitura={true}
          onSalvo={onSalvo}
        />
      </Box>
    </Modal>
  );
};

export default ModalVisualizarPaciente;
