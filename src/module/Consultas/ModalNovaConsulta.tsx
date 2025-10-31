import { Box, Modal } from "@mui/material";
import NovaConsulta from "./NovaConsulta";

const ModalNovaConsulta = ({
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
        sx={{ backgroundColor: "#fff", width: "680px", borderRadius: "8px" }}
      >
        <NovaConsulta onCloseModal={onClose} />
      </Box>
    </Modal>
  );
};

export default ModalNovaConsulta;
