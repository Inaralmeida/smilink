import type { TUserProps } from "../../domain/types/users";
import { MOCK_USER } from "./user";

// --- TIPOS ---
export interface AgendaProfissional {
  dia: string;
  horarios: string[];
}

const MOCK_AGENDAS: Record<string, AgendaProfissional[]> = {
  // ID de "Adira profissional Pereira"
  "1b9ffe8c-1c75-448d-9699-9f725ed9f920": [
    {
      dia: "2025-11-10T03:00:00Z",
      horarios: ["09:00", "10:00", "11:00"],
    },
    {
      dia: "2025-11-11T03:00:00Z",
      horarios: ["14:00", "15:00", "16:00"],
    },
  ],
  // ID de "Flora Novaes"
  "2ff9a616-6e4b-4080-b664-bae7fc6253df": [
    {
      dia: "2025-11-10T03:00:00Z",
      horarios: ["08:30", "09:30"],
    },
    {
      dia: "2025-11-12T03:00:00Z",
      horarios: ["10:30", "11:30", "14:30"],
    },
  ],
  // ID de "Artur Aragão"
  "45c9c5b4-1920-4eeb-b7b6-315f961a34ad": [
    {
      dia: "2025-11-13T03:00:00Z",
      horarios: ["09:15", "10:15", "11:15"],
    },
  ],
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
  return MOCK_AGENDAS[profissionalId] || [];
};
