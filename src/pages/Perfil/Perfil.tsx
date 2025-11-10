import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Grid,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import BoxContainer from "../../shared/components/BoxContainer/BoxContainer";
import { usePerfil } from "../../module/Perfil/hooks/usePerfil";
import FormPerfil from "../../module/Perfil/components/FormPerfil";
import AlterarSenha from "../../module/Perfil/components/AlterarSenha";
import GerenciarPlanosSaude from "../../module/Perfil/components/GerenciarPlanosSaude";
import { useAuth } from "../../application/context/AuthContext";
import RoleProtectedRoute from "../../shared/Router/RoleProtectedRoute";
import type { TPaciente } from "../../domain/types/paciente";

const Perfil = () => {
  const { user: userAuth } = useAuth();
  const { perfil, user, loading, error } = usePerfil();
  const [abaAtiva, setAbaAtiva] = useState(0);
  const [editando, setEditando] = useState(false);

  const handleAbaChange = (_event: React.SyntheticEvent, newValue: number) => {
    setAbaAtiva(newValue);
  };

  const isPaciente = userAuth?.role === "paciente";

  if (loading) {
    return (
      <RoleProtectedRoute allowedRoles={["admin", "paciente", "profissional"]}>
        <BoxContainer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <CircularProgress />
          </Box>
        </BoxContainer>
      </RoleProtectedRoute>
    );
  }

  if (error) {
    return (
      <RoleProtectedRoute allowedRoles={["admin", "paciente", "profissional"]}>
        <BoxContainer>
          <Alert severity="error">{error}</Alert>
        </BoxContainer>
      </RoleProtectedRoute>
    );
  }

  const fotoPerfil = user?.fotoPerfil || perfil?.fotoPerfil || "";
  const nomeCompleto = user
    ? `${user.nome} ${user.sobrenome}`
    : perfil
    ? `${perfil.nome} ${perfil.sobrenome}`
    : "Usuário";

  return (
    <RoleProtectedRoute allowedRoles={["admin", "paciente", "profissional"]}>
      <BoxContainer>
        <Box sx={{ mb: 3 }}>
          {/* Header do Perfil */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Avatar
              src={fotoPerfil}
              sx={{ width: 100, height: 100 }}
              alt={nomeCompleto}
            >
              <PersonIcon sx={{ fontSize: 50 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {nomeCompleto}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.email || "Email não disponível"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userAuth?.role === "paciente"
                  ? "Paciente"
                  : userAuth?.role === "profissional"
                  ? "Profissional"
                  : "Administrador"}
              </Typography>
            </Box>
            {!editando && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setEditando(true)}
              >
                Editar Perfil
              </Button>
            )}
          </Paper>

          {/* Tabs para diferentes seções */}
          {!editando ? (
            <Paper sx={{ p: 3 }}>
              <Tabs value={abaAtiva} onChange={handleAbaChange} sx={{ mb: 3 }}>
                <Tab label="Informações Pessoais" icon={<PersonIcon />} />
                {isPaciente && (
                  <Tab label="Planos de Saúde" icon={<HealthAndSafetyIcon />} />
                )}
                <Tab label="Alterar Senha" icon={<LockIcon />} />
              </Tabs>

              <Divider sx={{ mb: 3 }} />

              {/* Conteúdo das Tabs */}
              {abaAtiva === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Informações Pessoais
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Nome
                      </Typography>
                      <Typography variant="body1">
                        {perfil?.nome || user?.nome || "Não informado"}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Sobrenome
                      </Typography>
                      <Typography variant="body1">
                        {perfil?.sobrenome ||
                          user?.sobrenome ||
                          "Não informado"}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {user?.email || perfil?.email || "Não informado"}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        CPF
                      </Typography>
                      <Typography variant="body1">
                        {perfil?.cpf || user?.cpf || "Não informado"}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Data de Nascimento
                      </Typography>
                      <Typography variant="body1">
                        {perfil?.dataNascimento || user?.dataNascimento
                          ? new Date(
                              perfil?.dataNascimento ||
                                user?.dataNascimento ||
                                ""
                            ).toLocaleDateString("pt-BR")
                          : "Não informado"}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Celular
                      </Typography>
                      <Typography variant="body1">
                        {perfil?.celular || user?.celular || "Não informado"}
                      </Typography>
                    </Grid>
                    {perfil && "street" in perfil && (
                      <>
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Endereço
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            CEP
                          </Typography>
                          <Typography variant="body1">
                            {perfil.cep || "Não informado"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Rua
                          </Typography>
                          <Typography variant="body1">
                            {perfil.street || "Não informado"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Número
                          </Typography>
                          <Typography variant="body1">
                            {perfil.number || "Não informado"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Complemento
                          </Typography>
                          <Typography variant="body1">
                            {perfil.complemento || "Não informado"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Bairro
                          </Typography>
                          <Typography variant="body1">
                            {perfil.neigborhood || "Não informado"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Cidade
                          </Typography>
                          <Typography variant="body1">
                            {perfil.city || "Não informado"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Estado
                          </Typography>
                          <Typography variant="body1">
                            {perfil.state || "Não informado"}
                          </Typography>
                        </Grid>
                      </>
                    )}
                    {isPaciente && perfil && "name_responsible" in perfil && (
                      <>
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Responsável (menor de idade)
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Nome do Responsável
                          </Typography>
                          <Typography variant="body1">
                            {perfil.name_responsible || "Não informado"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            CPF do Responsável
                          </Typography>
                          <Typography variant="body1">
                            {perfil.cpf_responsible || "Não informado"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Grau de Parentesco
                          </Typography>
                          <Typography variant="body1">
                            {perfil.grau_parentesco || "Não informado"}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="body2" color="text.secondary">
                            Telefone do Responsável
                          </Typography>
                          <Typography variant="body1">
                            {perfil.tel_responsible || "Não informado"}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>
              )}

              {abaAtiva === 1 && isPaciente && perfil && (
                <GerenciarPlanosSaude paciente={perfil as TPaciente} />
              )}

              {abaAtiva === (isPaciente ? 2 : 1) && <AlterarSenha />}
            </Paper>
          ) : (
            <FormPerfil
              perfil={perfil}
              user={user}
              onCancelar={() => setEditando(false)}
              onSalvo={() => {
                setEditando(false);
                // Recarregar perfil será feito pelo hook usePerfil
              }}
            />
          )}
        </Box>
      </BoxContainer>
    </RoleProtectedRoute>
  );
};

export default Perfil;
