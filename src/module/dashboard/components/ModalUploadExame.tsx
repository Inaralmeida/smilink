import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState, useRef } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type ModalUploadExameProps = {
  open: boolean;
  onClose: () => void;
  nomeExame: string;
  onUpload: (nomeExame: string, arquivo: File) => void;
};

const ModalUploadExame = ({
  open,
  onClose,
  nomeExame,
  onUpload,
}: ModalUploadExameProps) => {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo (imagem ou PDF)
    const tiposPermitidos = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];

    if (!tiposPermitidos.includes(file.type)) {
      setErro("Por favor, selecione uma imagem (JPG, PNG, GIF) ou um PDF.");
      setArquivo(null);
      setNomeArquivo("");
      return;
    }

    // Validar tamanho (máximo 10MB)
    const tamanhoMaximo = 10 * 1024 * 1024; // 10MB
    if (file.size > tamanhoMaximo) {
      setErro("O arquivo é muito grande. Tamanho máximo: 10MB.");
      setArquivo(null);
      setNomeArquivo("");
      return;
    }

    setErro(null);
    setArquivo(file);
    setNomeArquivo(file.name);
  };

  const handleUpload = async () => {
    if (!arquivo) {
      setErro("Por favor, selecione um arquivo.");
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      // Simular upload (em produção, isso faria uma chamada à API)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Chamar callback
      onUpload(nomeExame, arquivo);

      // Fechar modal e resetar
      handleClose();
    } catch (error) {
      setErro("Erro ao enviar arquivo. Tente novamente.");
      console.error("Erro ao fazer upload:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setArquivo(null);
    setNomeArquivo("");
    setErro(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Enviar Exame: {nomeExame}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Selecione o arquivo do exame (imagem ou PDF). Tamanho máximo: 10MB.
          </Typography>

          <Box>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="upload-exame-input"
            />
            <label htmlFor="upload-exame-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Selecionar Arquivo
              </Button>
            </label>
          </Box>

          {nomeArquivo && (
            <Box
              sx={{
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 1,
                bgcolor: "#f5f5f5",
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                Arquivo selecionado:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {nomeArquivo}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tamanho: {(arquivo?.size || 0) / 1024 / 1024} MB
              </Typography>
            </Box>
          )}

          {erro && (
            <Alert severity="error" onClose={() => setErro(null)}>
              {erro}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          disabled={!arquivo || loading}
          startIcon={
            loading ? <CircularProgress size={16} /> : <CloudUploadIcon />
          }
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalUploadExame;
