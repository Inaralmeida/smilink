import { useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import type { View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Box } from "@mui/material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type {
  TAgendamento,
  EventAgendamento,
} from "../../../domain/types/agendamento";
import { obterCorProfissional } from "../utils/colors";

// Configurar localizador para date-fns
const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: ptBR }),
  getDay,
  locales,
});

type CalendarioAgendaProps = {
  agendamentos: TAgendamento[];
  onSelectEvent?: (event: EventAgendamento) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  view?: View;
  onViewChange?: (view: View) => void;
  date?: Date;
  onNavigate?: (date: Date) => void;
};

const CalendarioAgenda = ({
  agendamentos,
  onSelectEvent,
  onSelectSlot,
  view = Views.WEEK,
  onViewChange,
  date,
  onNavigate,
}: CalendarioAgendaProps) => {
  // Converter agendamentos para eventos do calendário
  const eventos = useMemo<EventAgendamento[]>(() => {
    return agendamentos
      .filter((a) => a.status !== "cancelado") // Não mostrar cancelados
      .map((agendamento) => {
        const [hora, minuto] = agendamento.horario.split(":").map(Number);
        // Criar data local a partir da string YYYY-MM-DD
        const [ano, mes, dia] = agendamento.data.split("-").map(Number);
        const dataInicio = new Date(ano, mes - 1, dia, hora, minuto, 0);

        const dataFim = new Date(dataInicio);
        dataFim.setMinutes(dataFim.getMinutes() + agendamento.duracao);

        const cor = obterCorProfissional(agendamento.profissionalId);

        return {
          id: agendamento.id,
          title: `${agendamento.pacienteNome} ${agendamento.pacienteSobrenome} - ${agendamento.procedimento}`,
          start: dataInicio,
          end: dataFim,
          resource: agendamento,
          color: cor,
        };
      });
  }, [agendamentos]);

  // Estilizar eventos com as cores dos profissionais
  const eventStyleGetter = (event: EventAgendamento) => {
    return {
      style: {
        backgroundColor: event.color || "#1976d2",
        borderColor: event.color || "#1976d2",
        color: "#fff",
        borderRadius: "4px",
        border: "none",
        padding: "2px 4px",
      },
    };
  };

  // Configurar mensagens em português
  const messages = {
    next: "Próximo",
    previous: "Anterior",
    today: "Hoje",
    month: "Mês",
    week: "Semana",
    day: "Dia",
    agenda: "Agenda",
    date: "Data",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "Não há agendamentos neste período.",
  };

  return (
    <Box
      sx={{
        height: "600px",
        marginTop: "16px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "16px",
        "& .rbc-toolbar": {
          backgroundColor: "#fff",
          marginBottom: "16px",
          "& button": {
            backgroundColor: "#fff",
            color: "#333A3B",
            border: "1px solid #ddd",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
            "&:active, &.rbc-active": {
              backgroundColor: "#037F8C",
              color: "#fff",
              borderColor: "#037F8C",
            },
          },
        },
        "& .rbc-calendar": {
          backgroundColor: "#fff",
        },
        "& .rbc-month-view, & .rbc-time-view, & .rbc-agenda-view": {
          backgroundColor: "#fff",
        },
        "& .rbc-header": {
          backgroundColor: "#fff",
          borderBottom: "2px solid #E7F2F4",
          padding: "8px",
        },
        "& .rbc-time-slot": {
          borderTop: "1px solid #E7F2F4",
        },
        "& .rbc-day-slot .rbc-time-slot": {
          borderTop: "1px solid #E7F2F4",
        },
        "& .rbc-today": {
          backgroundColor: "#f0f9fa",
        },
        "& .rbc-off-range-bg": {
          backgroundColor: "#fafafa",
        },
        "& .rbc-time-content": {
          borderTop: "2px solid #E7F2F4",
        },
        "& .rbc-time-header-content": {
          borderLeft: "1px solid #E7F2F4",
        },
      }}
    >
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable
        view={view}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        onView={onViewChange}
        date={date}
        onNavigate={onNavigate}
        messages={messages}
        eventPropGetter={eventStyleGetter}
        culture="pt-BR"
        step={30}
        timeslots={1}
        min={new Date(1970, 0, 1, 7, 0)} // 7h
        max={new Date(1970, 0, 1, 19, 0)} // 19h
      />
    </Box>
  );
};

export default CalendarioAgenda;
