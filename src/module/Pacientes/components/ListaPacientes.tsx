import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Avatar,
  Chip,
  Tooltip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";
import EventIcon from "@mui/icons-material/Event";
import ArchiveIcon from "@mui/icons-material/Archive";
import type { TPaciente } from "../../../domain/types/paciente";

type ListaPacientesProps = {
  pacientes: TPaciente[];
  loading: boolean;
  onPacienteClick: (paciente: TPaciente) => void;
  onEditar: (paciente: TPaciente) => void;
  onProntuario: (paciente: TPaciente) => void;
  onAgendar: (paciente: TPaciente) => void;
  onArquivar: (paciente: TPaciente) => void;
};

const calcularIdade = (dataNascimento: string): number => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
};

const formatarTelefone = (telefone: string): string => {
  const limpo = telefone.replace(/\D/g, "");
  // Se já está no formato 11xxxxxxxxx (11 dígitos), formata como 119xxxx-xxxx
  if (limpo.length === 11 && limpo.startsWith("11")) {
    return `${limpo.slice(0, 3)}${limpo.slice(3, 7)}-${limpo.slice(7)}`;
  }
  // Se tem 10 dígitos (sem o 9 do celular), adiciona o 9 e formata
  if (limpo.length === 10 && limpo.startsWith("11")) {
    return `${limpo.slice(0, 2)}9${limpo.slice(2, 6)}-${limpo.slice(6)}`;
  }
  // Se tem 13 dígitos (+5511xxxxxxxxx), remove o +55 e formata
  if (limpo.length === 13 && limpo.startsWith("55")) {
    const semPais = limpo.slice(2);
    if (semPais.startsWith("11") && semPais.length === 11) {
      return `${semPais.slice(0, 3)}${semPais.slice(3, 7)}-${semPais.slice(7)}`;
    }
  }
  // Se tem 12 dígitos (+5511xxxxxxxx), remove o +55, adiciona 9 e formata
  if (limpo.length === 12 && limpo.startsWith("55")) {
    const semPais = limpo.slice(2);
    if (semPais.startsWith("11") && semPais.length === 10) {
      return `${semPais.slice(0, 2)}9${semPais.slice(2, 6)}-${semPais.slice(
        6
      )}`;
    }
  }
  // Se já está formatado, retorna como está
  if (telefone.includes("-")) {
    return telefone;
  }
  return telefone;
};

const ListaPacientes = ({
  pacientes,
  loading,
  onPacienteClick,
  onEditar,
  onProntuario,
  onAgendar,
  onArquivar,
}: ListaPacientesProps) => {
  if (loading) {
    return (
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
    );
  }

  if (pacientes.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: 2,
        }}
      >
        <PersonIcon sx={{ fontSize: 64, color: "text.secondary" }} />
        <Typography variant="h6" color="text.secondary">
          Nenhum paciente encontrado
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2,
      }}
    >
      {pacientes.map((paciente) => {
        const idade = calcularIdade(paciente.dataNascimento);
        const telefoneFormatado = formatarTelefone(
          paciente.telefone || paciente.celular
        );

        return (
          <Card
            key={paciente.id}
            sx={{
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-4px)",
              },
            }}
            onClick={() => onPacienteClick(paciente)}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditar(paciente);
                    }}
                    aria-label="Editar paciente"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Prontuário">
                  <IconButton
                    size="small"
                    color="info"
                    onClick={(e) => {
                      e.stopPropagation();
                      onProntuario(paciente);
                    }}
                    aria-label="Ver prontuário"
                  >
                    <DescriptionIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Agendar Consulta">
                  <IconButton
                    size="small"
                    color="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAgendar(paciente);
                    }}
                    aria-label="Agendar consulta"
                  >
                    <EventIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Arquivar">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onArquivar(paciente);
                    }}
                    aria-label="Arquivar paciente"
                  >
                    <ArchiveIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Avatar
                  src={paciente.fotoPerfil}
                  alt={`${paciente.nome} ${paciente.sobrenome}`}
                  sx={{ width: 56, height: 56 }}
                >
                  {paciente.nome.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h6" noWrap>
                    {paciente.nome} {paciente.sobrenome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {idade} anos
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Telefone: {telefoneFormatado}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {paciente.email}
                </Typography>
              </Box>

              {paciente.tem_plano_saude && (
                <Chip
                  label="Plano de Saúde"
                  size="small"
                  color="primary"
                  sx={{ mb: 2 }}
                />
              )}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default ListaPacientes;
