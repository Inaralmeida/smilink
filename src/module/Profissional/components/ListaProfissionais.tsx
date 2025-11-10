import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
  Chip,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HistoryIcon from "@mui/icons-material/History";
import type { TProfissional } from "../../../domain/types/profissional";

type ListaProfissionaisProps = {
  profissionais: TProfissional[];
  loading: boolean;
  onProfissionalClick: (profissional: TProfissional) => void;
  onVerHorarios: (profissional: TProfissional) => void;
  onVerHistorico: (profissional: TProfissional) => void;
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

const ListaProfissionais = ({
  profissionais,
  loading,
  onProfissionalClick,
  onVerHorarios,
  onVerHistorico,
}: ListaProfissionaisProps) => {
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

  if (profissionais.length === 0) {
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
          Nenhum profissional encontrado
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
      {profissionais.map((profissional) => {
        const telefoneFormatado = formatarTelefone(
          profissional.telefone || profissional.celular
        );

        return (
          <Card
            key={profissional.id}
            sx={{
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-4px)",
              },
            }}
            onClick={() => onProfissionalClick(profissional)}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Avatar
                  src={profissional.fotoPerfil}
                  alt={`${profissional.nome} ${profissional.sobrenome}`}
                  sx={{ width: 56, height: 56 }}
                >
                  {profissional.nome.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h6" noWrap>
                    {profissional.nome} {profissional.sobrenome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profissional.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {telefoneFormatado}
                </Typography>
                {profissional.bio && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {profissional.bio}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  mb: 2,
                }}
              >
                {profissional.especialidades
                  .slice(0, 3)
                  .map((especialidade) => (
                    <Chip
                      key={especialidade}
                      label={especialidade}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                {profissional.especialidades.length > 3 && (
                  <Chip
                    label={`+${profissional.especialidades.length - 3}`}
                    size="small"
                    color="default"
                    variant="outlined"
                  />
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<ScheduleIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onVerHorarios(profissional);
                  }}
                  fullWidth
                >
                  Horários
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<HistoryIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onVerHistorico(profissional);
                  }}
                  fullWidth
                >
                  Histórico
                </Button>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default ListaProfissionais;
