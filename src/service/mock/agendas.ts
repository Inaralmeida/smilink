import type { TUserProps } from "../../domain/types/users";
import { MOCK_USER } from "./user";

// --- TIPOS ---
export interface AgendaProfissional {
  dia: string;
  horarios: string[];
}

// Gerar horários disponíveis de 8h às 18h em intervalos de 30 minutos
const gerarHorariosDisponiveis = (inicio: number, fim: number): string[] => {
  const horarios: string[] = [];
  for (let hora = inicio; hora < fim; hora++) {
    for (let minuto = 0; minuto < 60; minuto += 30) {
      const horaStr = hora.toString().padStart(2, "0");
      const minutoStr = minuto.toString().padStart(2, "0");
      horarios.push(`${horaStr}:${minutoStr}`);
    }
  }
  return horarios;
};

// Gerar datas dos próximos 30 dias
const gerarProximasDatas = (quantidade: number): string[] => {
  const datas: string[] = [];
  const hoje = new Date();
  for (let i = 0; i < quantidade; i++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + i);
    // Apenas dias úteis (segunda a sexta)
    const diaSemana = data.getDay();
    if (diaSemana >= 1 && diaSemana <= 5) {
      data.setHours(3, 0, 0, 0); // 00:00 UTC-3 = 03:00 UTC
      datas.push(data.toISOString());
    }
  }
  return datas;
};

// Gerar agenda completa para um profissional
const gerarAgendaProfissional = (): AgendaProfissional[] => {
  const datas = gerarProximasDatas(30);
  const horariosCompletos = gerarHorariosDisponiveis(8, 18);

  return datas.map((dia) => ({
    dia,
    horarios: horariosCompletos,
  }));
};

// Inicializar agendas vazias e tornar mutável para permitir atualizações
const MOCK_AGENDAS: Record<string, AgendaProfissional[]> = {};

// Função para garantir que um profissional tenha agenda
const garantirAgendaProfissional = (
  profissionalId: string
): AgendaProfissional[] => {
  if (!MOCK_AGENDAS[profissionalId]) {
    MOCK_AGENDAS[profissionalId] = gerarAgendaProfissional();
  }
  return MOCK_AGENDAS[profissionalId];
};

const apiDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const fetchPacientes = async (): Promise<TUserProps[]> => {
  await apiDelay(500);
  return MOCK_USER.filter((user) => user.role === "paciente");
};

export const fetchProfissionais = async (): Promise<TUserProps[]> => {
  await apiDelay(500);
  return MOCK_USER.filter((user) => user.role === "profissional");
};

export const fetchAgenda = async (
  profissionalId: string
): Promise<AgendaProfissional[]> => {
  await apiDelay(700);
  return garantirAgendaProfissional(profissionalId);
};

export const salvarAgenda = async (
  profissionalId: string,
  agenda: AgendaProfissional[]
): Promise<void> => {
  await apiDelay(500);
  MOCK_AGENDAS[profissionalId] = agenda;
};
