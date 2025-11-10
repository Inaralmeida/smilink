import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import type { TPaciente } from "../../../domain/types/paciente";
import type { TProfissional } from "../../../domain/types/profissional";
import type { TUserProps } from "../../../domain/types/users";
import { usePerfil } from "../hooks/usePerfil";
import PersonIcon from "@mui/icons-material/Person";

const unmask = (val: string | undefined | null): string => {
  if (!val) return "";
  return val.replace(/[^\d]/g, "");
};

type FormPerfilProps = {
  perfil: TPaciente | TProfissional | null;
  user: TUserProps | null;
  onCancelar: () => void;
  onSalvo: () => void;
};

const FormPerfil = ({ perfil, user, onCancelar, onSalvo }: FormPerfilProps) => {
  const { atualizarPerfil } = usePerfil();
  const [salvando, setSalvando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string>(
    perfil?.fotoPerfil || user?.fotoPerfil || ""
  );

  // Estados do formulário
  const [nome, setNome] = useState(perfil?.nome || user?.nome || "");
  const [sobrenome, setSobrenome] = useState(
    perfil?.sobrenome || user?.sobrenome || ""
  );
  const [celular, setCelular] = useState(
    perfil?.celular || user?.celular || ""
  );
  const [cep, setCep] = useState(perfil && "cep" in perfil ? perfil.cep : "");
  const [street, setStreet] = useState(
    perfil && "street" in perfil ? perfil.street : ""
  );
  const [number, setNumber] = useState(
    perfil && "number" in perfil ? perfil.number : ""
  );
  const [complemento, setComplemento] = useState(
    perfil && "complemento" in perfil ? perfil.complemento || "" : ""
  );
  const [neigborhood, setNeigborhood] = useState(
    perfil && "neigborhood" in perfil ? perfil.neigborhood : ""
  );
  const [city, setCity] = useState(
    perfil && "city" in perfil ? perfil.city : ""
  );
  const [state, setState] = useState(
    perfil && "state" in perfil ? perfil.state : ""
  );

  // Estados para responsável (pacientes)
  const [nameResponsible, setNameResponsible] = useState(
    perfil && "name_responsible" in perfil ? perfil.name_responsible || "" : ""
  );
  const [cpfResponsible, setCpfResponsible] = useState(
    perfil && "cpf_responsible" in perfil ? perfil.cpf_responsible || "" : ""
  );
  const [grauParentesco, setGrauParentesco] = useState(
    perfil && "grau_parentesco" in perfil ? perfil.grau_parentesco || "" : ""
  );
  const [telResponsible, setTelResponsible] = useState(
    perfil && "tel_responsible" in perfil ? perfil.tel_responsible || "" : ""
  );

  const isPaciente = perfil && "name_responsible" in perfil;

  // Buscar endereço por CEP
  const buscarEnderecoPorCEP = async (rawCep: string) => {
    const cepLimpo = unmask(rawCep);
    if (cepLimpo.length !== 8) return null;

    setLoadingCep(true);
    try {
      const resp = await axios.get(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      if (resp.data?.erro) {
        setError("CEP não encontrado");
        return null;
      }
      return resp.data;
    } catch {
      setError("Erro ao buscar CEP");
      return null;
    } finally {
      setLoadingCep(false);
    }
  };

  useEffect(() => {
    if (!cep) return;
    const cleaned = unmask(cep);
    if (cleaned.length === 8) {
      buscarEnderecoPorCEP(cleaned).then((endereco) => {
        if (endereco) {
          setStreet(endereco.logradouro || "");
          setNeigborhood(endereco.bairro || "");
          setCity(endereco.localidade || "");
          setState(endereco.uf || "");
        }
      });
    }
  }, [cep]);

  useEffect(() => {
    if (perfil) {
      setNome(perfil.nome || "");
      setSobrenome(perfil.sobrenome || "");
      setCelular(perfil.celular || "");
      setFotoPreview(perfil.fotoPerfil || "");

      if ("cep" in perfil) {
        setCep(perfil.cep || "");
        setStreet(perfil.street || "");
        setNumber(perfil.number || "");
        setComplemento(perfil.complemento || "");
        setNeigborhood(perfil.neigborhood || "");
        setCity(perfil.city || "");
        setState(perfil.state || "");
      }

      if ("name_responsible" in perfil) {
        setNameResponsible(perfil.name_responsible || "");
        setCpfResponsible(perfil.cpf_responsible || "");
        setGrauParentesco(perfil.grau_parentesco || "");
        setTelResponsible(perfil.tel_responsible || "");
      }
    } else if (user) {
      setNome(user.nome || "");
      setSobrenome(user.sobrenome || "");
      setCelular(user.celular || "");
      setFotoPreview(user.fotoPerfil || "");
    }
  }, [perfil, user]);

  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvar = async () => {
    try {
      setSalvando(true);
      setError(null);

      const dadosAtualizacao: Partial<TPaciente> | Partial<TProfissional> = {
        nome,
        sobrenome,
        celular,
        fotoPerfil: fotoPreview,
        ...(perfil &&
          "cep" in perfil && {
            cep,
            street,
            number,
            complemento,
            neigborhood,
            city,
            state,
          }),
        ...(isPaciente && {
          name_responsible: nameResponsible || undefined,
          cpf_responsible: cpfResponsible || undefined,
          grau_parentesco: grauParentesco || undefined,
          tel_responsible: telResponsible || undefined,
        }),
      };

      await atualizarPerfil(dadosAtualizacao);
      onSalvo();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar perfil");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">Editar Perfil</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={onCancelar}
            disabled={salvando}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={salvando ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSalvar}
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Foto de Perfil */}
        <Grid size={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              src={fotoPreview}
              sx={{ width: 120, height: 120 }}
              alt={`${nome} ${sobrenome}`}
            >
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCameraIcon />}
              size="small"
            >
              Alterar Foto
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFotoChange}
              />
            </Button>
          </Box>
        </Grid>

        {/* Dados Pessoais */}
        <Grid size={12}>
          <Typography variant="h6" gutterBottom>
            Dados Pessoais
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Nome"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Sobrenome"
            fullWidth
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Celular"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            fullWidth
            required
            placeholder="(00) 00000-0000"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Email"
            fullWidth
            value={user?.email || ""}
            disabled
            helperText="Email não pode ser alterado"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="CPF"
            fullWidth
            value={perfil?.cpf || user?.cpf || ""}
            disabled
            helperText="CPF não pode ser alterado"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Data de Nascimento"
            fullWidth
            value={
              perfil?.dataNascimento || user?.dataNascimento
                ? new Date(
                    perfil?.dataNascimento || user?.dataNascimento || ""
                  ).toLocaleDateString("pt-BR")
                : ""
            }
            disabled
            helperText="Data de nascimento não pode ser alterada"
          />
        </Grid>

        {/* Endereço */}
        {perfil && "cep" in perfil && (
          <>
            <Grid size={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Endereço
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                fullWidth
                placeholder="00000-000"
                InputProps={{
                  endAdornment: loadingCep ? (
                    <CircularProgress size={20} />
                  ) : null,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                label="Rua"
                fullWidth
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Número"
                fullWidth
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Complemento"
                fullWidth
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Bairro"
                fullWidth
                value={neigborhood}
                onChange={(e) => setNeigborhood(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Cidade"
                fullWidth
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Estado"
                fullWidth
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </Grid>
          </>
        )}

        {/* Responsável (para pacientes menores de idade) */}
        {isPaciente && (
          <>
            <Grid size={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Responsável (menor de idade)
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Nome do Responsável"
                fullWidth
                value={nameResponsible}
                onChange={(e) => setNameResponsible(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="CPF do Responsável"
                value={cpfResponsible}
                onChange={(e) => setCpfResponsible(e.target.value)}
                fullWidth
                placeholder="000.000.000-00"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Grau de Parentesco"
                fullWidth
                value={grauParentesco}
                onChange={(e) => setGrauParentesco(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Telefone do Responsável"
                value={telResponsible}
                onChange={(e) => setTelResponsible(e.target.value)}
                fullWidth
                placeholder="(00) 00000-0000"
              />
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
};

export default FormPerfil;
