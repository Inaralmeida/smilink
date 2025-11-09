import { Box, Modal, Button } from "@mui/material";
import FormProfissional from "./FormProfissional";
import type { TProfissional } from "../../../domain/types/profissional";
import type { IProfissionalFormInputs } from "../hooks/useFormProfissional";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";

type ModalVisualizarProfissionalProps = {
  open: boolean;
  onClose: () => void;
  profissional: TProfissional | null;
  onSalvo?: (dados: IProfissionalFormInputs) => void | Promise<void>;
  onEditar?: (profissional: TProfissional) => void;
  onArquivar?: (profissional: TProfissional) => void;
};

const ModalVisualizarProfissional = ({
  open,
  onClose,
  profissional,
  onSalvo,
  onEditar,
  onArquivar,
}: ModalVisualizarProfissionalProps) => {
  if (!profissional) return null;

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
        <Box sx={{ flex: 1, overflow: "auto", mb: 2 }}>
          <FormProfissional
            onClose={onClose}
            profissional={profissional}
            somenteLeitura={true}
            onSalvo={onSalvo}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          {onEditar && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => {
                onEditar(profissional);
                onClose();
              }}
              fullWidth
            >
              Editar
            </Button>
          )}
          {onArquivar && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<ArchiveIcon />}
              onClick={() => {
                onArquivar(profissional);
              }}
              fullWidth
            >
              Arquivar
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalVisualizarProfissional;
