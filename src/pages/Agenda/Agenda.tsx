import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Views } from "react-big-calendar";
import type { View } from "react-big-calendar";
import BoxContainer from "../../shared/components/BoxContainer/BoxContainer";
import { useAgendamentos } from "../../module/Agenda/hooks/useAgendamentos";
import CalendarioAgenda from "../../module/Agenda/components/CalendarioAgenda";
import ModalAgendamento from "../../module/Agenda/components/ModalAgendamento";
import ModalDetalhesAgendamento from "../../module/Agenda/components/ModalDetalhesAgendamento";
import type {
  TAgendamento,
  EventAgendamento,
} from "../../domain/types/agendamento";

const Agenda = () => {
  const { agendamentos, criar, atualizar, cancelar, iniciar, finalizar } =
    useAgendamentos();

  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] =
    useState<TAgendamento | null>(null);
  const [agendamentoEditando, setAgendamentoEditando] =
    useState<TAgendamento | null>(null);
  const [viewAtual, setViewAtual] = useState<View>(Views.WEEK);
  const [dataAtual, setDataAtual] = useState<Date>(new Date());
  const [dataInicial, setDataInicial] = useState<string | undefined>();
  const [horarioInicial, setHorarioInicial] = useState<string | undefined>();

  const handleNovoAgendamento = () => {
    setAgendamentoEditando(null);
    setDataInicial(undefined);
    setHorarioInicial(undefined);
    setModalNovoAberto(true);
  };

  const handleSalvarAgendamento = async (
    dados: Omit<TAgendamento, "id" | "criadoEm" | "atualizadoEm">
  ) => {
    try {
      if (agendamentoEditando) {
        await atualizar(agendamentoEditando.id, dados);
      } else {
        await criar(dados);
      }
      setModalNovoAberto(false);
      setAgendamentoEditando(null);
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
    }
  };

  const handleSelecionarEvento = (event: EventAgendamento) => {
    setAgendamentoSelecionado(event.resource);
    setModalDetalhesAberto(true);
  };

  const handleSelecionarSlot = (slotInfo: { start: Date; end: Date }) => {
    // Quando clica em um slot vazio, criar novo agendamento com data/hora pré-preenchida
    const ano = slotInfo.start.getFullYear();
    const mes = (slotInfo.start.getMonth() + 1).toString().padStart(2, "0");
    const dia = slotInfo.start.getDate().toString().padStart(2, "0");
    const data = `${ano}-${mes}-${dia}`;
    const horario = `${slotInfo.start
      .getHours()
      .toString()
      .padStart(2, "0")}:${slotInfo.start
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    setAgendamentoEditando(null);
    setDataInicial(data);
    setHorarioInicial(horario);
    setModalNovoAberto(true);
  };

  const handleEditar = (agendamento: TAgendamento) => {
    setAgendamentoEditando(agendamento);
    setDataInicial(undefined);
    setHorarioInicial(undefined);
    setModalNovoAberto(true);
  };

  const handleCancelar = async (id: string) => {
    await cancelar(id);
    setModalDetalhesAberto(false);
    setAgendamentoSelecionado(null);
  };

  const handleIniciarAtendimento = async (id: string) => {
    await iniciar(id);
    setModalDetalhesAberto(false);
    setAgendamentoSelecionado(null);
  };

  const handleFinalizarAtendimento = async (id: string) => {
    await finalizar(id);
    setModalDetalhesAberto(false);
    setAgendamentoSelecionado(null);
  };

  return (
    <BoxContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          mb: 2,
        }}
      >
        <Typography
          color="primary"
          fontWeight={500}
          fontFamily={"Montserrat"}
          fontSize={18}
        >
          AGENDA
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleNovoAgendamento}
        >
          Novo Agendamento
        </Button>
      </Box>

      <CalendarioAgenda
        agendamentos={agendamentos}
        onSelectEvent={handleSelecionarEvento}
        onSelectSlot={handleSelecionarSlot}
        view={viewAtual}
        onViewChange={setViewAtual}
        date={dataAtual}
        onNavigate={setDataAtual}
      />

      <ModalAgendamento
        open={modalNovoAberto}
        onClose={() => {
          setModalNovoAberto(false);
          setAgendamentoEditando(null);
          setDataInicial(undefined);
          setHorarioInicial(undefined);
        }}
        onSave={handleSalvarAgendamento}
        agendamento={agendamentoEditando}
        dataInicial={dataInicial}
        horarioInicial={horarioInicial}
      />

      <ModalDetalhesAgendamento
        open={modalDetalhesAberto}
        onClose={() => {
          setModalDetalhesAberto(false);
          setAgendamentoSelecionado(null);
        }}
        agendamento={agendamentoSelecionado}
        onEditar={handleEditar}
        onCancelar={handleCancelar}
        onIniciarAtendimento={handleIniciarAtendimento}
        onFinalizarAtendimento={handleFinalizarAtendimento}
      />
    </BoxContainer>
  );
};

export default Agenda;
