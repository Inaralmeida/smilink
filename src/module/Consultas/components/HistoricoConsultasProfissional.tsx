import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { TConsulta } from "../../../domain/types/consulta";

// Dados mockados de histórico de consultas
const HISTORICO_MOCK: TConsulta[] = [
  {
    id: "1",
    agendamentoId: "ag-1",
    profissionalId: "prof-1",
    profissionalNome: "Dr.",
    profissionalSobrenome: "Silva",
    pacienteId: "pac-1",
    pacienteNome: "Maria",
    pacienteSobrenome: "Santos",
    data: "2025-01-15",
    horario: "09:00",
    horarioInicio: "09:00",
    horarioFim: "09:30",
    procedimentoPrincipal: "Limpeza e Profilaxia",
    procedimentosRealizados: ["Limpeza e Profilaxia"],
    materiaisUtilizados: ["Luvas Descartáveis", "Máscara Cirúrgica"],
    equipamentosUtilizados: ["Raio-X Panorâmico"],
    examesSolicitados: ["Radiografia Panorâmica"],
    observacoes: "Paciente em bom estado geral",
    status: "finalizada",
    tipoPagamento: "convenio",
    convenio: "Unimed",
    criadoEm: "2025-01-15T09:00:00Z",
    atualizadoEm: "2025-01-15T09:30:00Z",
    finalizadoEm: "2025-01-15T09:30:00Z",
  },
  {
    id: "2",
    agendamentoId: "ag-2",
    profissionalId: "prof-1",
    profissionalNome: "Dr.",
    profissionalSobrenome: "Silva",
    pacienteId: "pac-2",
    pacienteNome: "João",
    pacienteSobrenome: "Oliveira",
    data: "2025-01-15",
    horario: "10:00",
    horarioInicio: "10:00",
    horarioFim: "11:00",
    procedimentoPrincipal: "Restauração",
    procedimentosRealizados: ["Restauração"],
    materiaisUtilizados: ["Resina Composta", "Cimento Odontológico"],
    equipamentosUtilizados: ["Mesa Clínica"],
    examesSolicitados: [],
    observacoes: "Restauração realizada com sucesso",
    status: "finalizada",
    tipoPagamento: "particular",
    criadoEm: "2025-01-15T10:00:00Z",
    atualizadoEm: "2025-01-15T11:00:00Z",
    finalizadoEm: "2025-01-15T11:00:00Z",
  },
  {
    id: "3",
    agendamentoId: "ag-3",
    profissionalId: "prof-1",
    profissionalNome: "Dr.",
    profissionalSobrenome: "Silva",
    pacienteId: "pac-3",
    pacienteNome: "Ana",
    pacienteSobrenome: "Costa",
    data: "2025-01-14",
    horario: "14:00",
    horarioInicio: "14:00",
    horarioFim: "14:30",
    procedimentoPrincipal: "Consulta de Rotina",
    procedimentosRealizados: ["Consulta de Rotina"],
    materiaisUtilizados: [],
    equipamentosUtilizados: [],
    examesSolicitados: ["Radiografia Periapical"],
    observacoes: "Consulta de rotina, paciente saudável",
    status: "finalizada",
    tipoPagamento: "convenio",
    convenio: "SulAmérica",
    criadoEm: "2025-01-14T14:00:00Z",
    atualizadoEm: "2025-01-14T14:30:00Z",
    finalizadoEm: "2025-01-14T14:30:00Z",
  },
  {
    id: "4",
    agendamentoId: "ag-4",
    profissionalId: "prof-1",
    profissionalNome: "Dr.",
    profissionalSobrenome: "Silva",
    pacienteId: "pac-4",
    pacienteNome: "Pedro",
    pacienteSobrenome: "Ferreira",
    data: "2025-01-14",
    horario: "15:30",
    horarioInicio: "15:30",
    horarioFim: "16:30",
    procedimentoPrincipal: "Tratamento de Canal",
    procedimentosRealizados: ["Tratamento de Canal"],
    materiaisUtilizados: [
      "Limas Endodônticas",
      "Cones de Guta-percha",
      "Solução Irrigadora",
    ],
    equipamentosUtilizados: ["Aparelho de Endodontia"],
    examesSolicitados: ["Radiografia Periapical"],
    observacoes: "Tratamento de canal iniciado, retorno em 7 dias",
    status: "finalizada",
    tipoPagamento: "particular",
    criadoEm: "2025-01-14T15:30:00Z",
    atualizadoEm: "2025-01-14T16:30:00Z",
    finalizadoEm: "2025-01-14T16:30:00Z",
  },
  {
    id: "5",
    agendamentoId: "ag-5",
    profissionalId: "prof-1",
    profissionalNome: "Dr.",
    profissionalSobrenome: "Silva",
    pacienteId: "pac-5",
    pacienteNome: "Carla",
    pacienteSobrenome: "Rodrigues",
    data: "2025-01-13",
    horario: "09:00",
    horarioInicio: "09:00",
    horarioFim: "09:45",
    procedimentoPrincipal: "Limpeza e Profilaxia",
    procedimentosRealizados: ["Limpeza e Profilaxia"],
    materiaisUtilizados: ["Luvas Descartáveis", "Máscara Cirúrgica"],
    equipamentosUtilizados: [],
    examesSolicitados: [],
    observacoes: "Limpeza realizada com sucesso",
    status: "finalizada",
    tipoPagamento: "convenio",
    convenio: "Bradesco Saúde",
    criadoEm: "2025-01-13T09:00:00Z",
    atualizadoEm: "2025-01-13T09:45:00Z",
    finalizadoEm: "2025-01-13T09:45:00Z",
  },
  {
    id: "6",
    agendamentoId: "ag-6",
    profissionalId: "prof-1",
    profissionalNome: "Dr.",
    profissionalSobrenome: "Silva",
    pacienteId: "pac-6",
    pacienteNome: "Ricardo",
    pacienteSobrenome: "Almeida",
    data: "2025-01-13",
    horario: "10:30",
    horarioInicio: "10:30",
    horarioFim: "11:00",
    procedimentoPrincipal: "Extração",
    procedimentosRealizados: ["Extração"],
    materiaisUtilizados: [
      "Luvas Descartáveis",
      "Máscara Cirúrgica",
      "Anestésico Local",
    ],
    equipamentosUtilizados: ["Mesa Clínica"],
    examesSolicitados: ["Radiografia Panorâmica"],
    observacoes: "Extração realizada com sucesso, orientações passadas",
    status: "finalizada",
    tipoPagamento: "particular",
    criadoEm: "2025-01-13T10:30:00Z",
    atualizadoEm: "2025-01-13T11:00:00Z",
    finalizadoEm: "2025-01-13T11:00:00Z",
  },
  {
    id: "7",
    agendamentoId: "ag-7",
    profissionalId: "prof-1",
    profissionalNome: "Dr.",
    profissionalSobrenome: "Silva",
    pacienteId: "pac-7",
    pacienteNome: "Fernanda",
    pacienteSobrenome: "Lima",
    data: "2025-01-12",
    horario: "14:00",
    horarioInicio: "14:00",
    horarioFim: "14:30",
    procedimentoPrincipal: "Consulta de Rotina",
    procedimentosRealizados: ["Consulta de Rotina"],
    materiaisUtilizados: [],
    equipamentosUtilizados: [],
    examesSolicitados: [],
    observacoes: "Consulta de rotina",
    status: "finalizada",
    tipoPagamento: "convenio",
    convenio: "Amil",
    criadoEm: "2025-01-12T14:00:00Z",
    atualizadoEm: "2025-01-12T14:30:00Z",
    finalizadoEm: "2025-01-12T14:30:00Z",
  },
  {
    id: "8",
    agendamentoId: "ag-8",
    profissionalId: "prof-1",
    profissionalNome: "Dr.",
    profissionalSobrenome: "Silva",
    pacienteId: "pac-8",
    pacienteNome: "Lucas",
    pacienteSobrenome: "Souza",
    data: "2025-01-12",
    horario: "15:00",
    horarioInicio: "15:00",
    horarioFim: "16:00",
    procedimentoPrincipal: "Restauração",
    procedimentosRealizados: ["Restauração"],
    materiaisUtilizados: ["Resina Composta", "Adesivo Dentinário"],
    equipamentosUtilizados: ["Mesa Clínica"],
    examesSolicitados: [],
    observacoes: "Restauração realizada",
    status: "finalizada",
    tipoPagamento: "particular",
    criadoEm: "2025-01-12T15:00:00Z",
    atualizadoEm: "2025-01-12T16:00:00Z",
    finalizadoEm: "2025-01-12T16:00:00Z",
  },
];

const HistoricoConsultasProfissional = () => {
  const [termoBusca, setTermoBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 10;

  // Filtrar consultas pelo termo de busca
  const consultasFiltradas = useMemo(() => {
    if (!termoBusca.trim()) {
      return HISTORICO_MOCK;
    }
    const termoLower = termoBusca.toLowerCase().trim();
    return HISTORICO_MOCK.filter(
      (consulta) =>
        consulta.pacienteNome.toLowerCase().includes(termoLower) ||
        consulta.pacienteSobrenome.toLowerCase().includes(termoLower) ||
        consulta.procedimentoPrincipal.toLowerCase().includes(termoLower) ||
        `${consulta.pacienteNome} ${consulta.pacienteSobrenome}`
          .toLowerCase()
          .includes(termoLower)
    );
  }, [termoBusca]);

  // Paginar consultas
  const consultasPaginadas = useMemo(() => {
    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return consultasFiltradas.slice(inicio, fim);
  }, [consultasFiltradas, pagina]);

  const totalPaginas = Math.ceil(consultasFiltradas.length / itensPorPagina);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finalizada":
        return "success";
      case "cancelada":
        return "error";
      case "em_andamento":
        return "warning";
      case "agendada":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "finalizada":
        return "Finalizada";
      case "cancelada":
        return "Cancelada";
      case "em_andamento":
        return "Em Andamento";
      case "agendada":
        return "Agendada";
      default:
        return status;
    }
  };

  const formatarData = (data: string) => {
    return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          color="primary"
          fontWeight={500}
          fontFamily="Montserrat"
          fontSize={24}
        >
          Histórico de Consultas
        </Typography>
      </Box>

      {/* Campo de Busca */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por paciente ou procedimento..."
          value={termoBusca}
          onChange={(e) => {
            setTermoBusca(e.target.value);
            setPagina(1); // Resetar para primeira página ao buscar
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#E7F2F4",
              },
              "&:hover fieldset": {
                borderColor: "#037F8C",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#037F8C",
              },
            },
          }}
        />
      </Box>

      {/* Tabela de Consultas */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Horário</TableCell>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Procedimento</TableCell>
                  <TableCell>Tipo de Pagamento</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {consultasPaginadas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary">
                        Nenhuma consulta encontrada
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  consultasPaginadas.map((consulta) => (
                    <TableRow key={consulta.id}>
                      <TableCell>{formatarData(consulta.data)}</TableCell>
                      <TableCell>
                        {consulta.horarioInicio} - {consulta.horarioFim}
                      </TableCell>
                      <TableCell>
                        {consulta.pacienteNome} {consulta.pacienteSobrenome}
                      </TableCell>
                      <TableCell>{consulta.procedimentoPrincipal}</TableCell>
                      <TableCell>
                        {consulta.tipoPagamento === "convenio"
                          ? `Convênio: ${consulta.convenio || "N/A"}`
                          : "Particular"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(consulta.status)}
                          color={getStatusColor(consulta.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPaginas}
                page={pagina}
                onChange={(_, value) => setPagina(value)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default HistoricoConsultasProfissional;
