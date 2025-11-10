import { Box, Modal } from "@mui/material";
import FormPaciente from "../components/FormPaciente";

const ModalNovoPaciente = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
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
        }}
      >
        <FormPaciente onClose={onClose} />
      </Box>
    </Modal>
  );
};

export default ModalNovoPaciente;
