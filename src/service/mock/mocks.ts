// --- TIPOS (poderiam estar em src/domain/types) ---
export interface Paciente {
  id: string;
  nome: string;
}

export interface AgendaProfissional {
  dia: string; // Formato ISO: "2025-10-30T00:00:00Z"
  horarios: string[]; // Ex: ["09:00", "10:00", "11:00"]
}

export interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  // A agenda é separada para simular uma chamada de API
}

// --- DADOS MOCKADOS ---
const MOCK_PACIENTES: Paciente[] = [
  { id: "p1", nome: "Ana Clara Souza" },
  { id: "p2", nome: "Bruno Marques" },
  { id: "p3", nome: "Carla Dias" },
];

const MOCK_PROFISSIONAIS: Profissional[] = [
  { id: "dr1", nome: "Dr. Carlos Silva", especialidade: "Ortodontia" },
  { id: "dr2", nome: "Dra. Maria Linhares", especialidade: "Clínico Geral" },
];

// Simulação de "banco de dados" de agendas
const MOCK_AGENDAS: Record<string, AgendaProfissional[]> = {
  dr1: [
    {
      dia: "2025-11-05T03:00:00Z",
      horarios: ["09:00", "10:00", "11:00"],
    },
    {
      dia: "2025-11-06T03:00:00Z",
      horarios: ["14:00", "15:00", "16:00"],
    },
  ],
  dr2: [
    {
      dia: "2025-11-05T03:00:00Z",
      horarios: ["08:30", "09:30"],
    },
    {
      dia: "2025-11-07T03:00:00Z",
      horarios: ["10:30", "11:30", "14:30"],
    },
  ],
};

// --- FUNÇÕES MOCK (simulando API) ---

const apiDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const fetchPacientes = async (): Promise<Paciente[]> => {
  await apiDelay(500);
  return MOCK_PACIENTES;
};

export const fetchProfissionais = async (): Promise<Profissional[]> => {
  await apiDelay(500);
  return MOCK_PROFISSIONAIS;
};

export const fetchAgenda = async (
  profissionalId: string
): Promise<AgendaProfissional[]> => {
  await apiDelay(700);
  return MOCK_AGENDAS[profissionalId] || [];
};
