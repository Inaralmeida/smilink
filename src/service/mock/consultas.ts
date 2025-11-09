export type TConsulta = {
  id: string;
  pacienteId: string;
  profissionalId: string;
  profissionalNome: string;
  data: string;
  horario: string;
  procedimento: string;
  observacoes?: string;
  status: "agendada" | "realizada" | "cancelada" | "remarcada";
};

// Gerar consultas mockadas
export const gerarConsultasMock = (pacienteId: string): TConsulta[] => {
  const procedimentos = ["AVALIACAO", "LIMPEZA", "MANUTENCAO", "RESTAURACAO"];
  const profissionais = [
    { id: "1b9ffe8c-1c75-448d-9699-9f725ed9f920", nome: "Adira Pereira" },
    { id: "2ff9a616-6e4b-4080-b664-bae7fc6253df", nome: "Flora Novaes" },
    { id: "45c9c5b4-1920-4eeb-b7b6-315f961a34ad", nome: "Artur Aragão" },
  ];
  const statuses: TConsulta["status"][] = [
    "agendada",
    "realizada",
    "cancelada",
    "remarcada",
  ];
  const horarios = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const consultas: TConsulta[] = [];
  const hoje = new Date();

  // Gerar 10-15 consultas por paciente
  const numConsultas = Math.floor(Math.random() * 6) + 10;

  for (let i = 0; i < numConsultas; i++) {
    const diasAtras = Math.floor(Math.random() * 180); // Últimos 6 meses
    const data = new Date(hoje);
    data.setDate(data.getDate() - diasAtras);

    const profissional =
      profissionais[Math.floor(Math.random() * profissionais.length)];

    const consulta: TConsulta = {
      id: `consulta-${pacienteId}-${i}`,
      pacienteId,
      profissionalId: profissional.id,
      profissionalNome: profissional.nome,
      data: data.toISOString().split("T")[0],
      horario: horarios[Math.floor(Math.random() * horarios.length)],
      procedimento:
        procedimentos[Math.floor(Math.random() * procedimentos.length)],
      observacoes:
        Math.random() > 0.5
          ? `Observação da consulta ${
              i + 1
            } - Paciente apresentou bom estado geral.`
          : undefined,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };

    consultas.push(consulta);
  }

  // Ordenar por data (mais recente primeiro)
  return consultas.sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );
};

// Buscar consultas de um paciente
export const fetchConsultasPorPaciente = async (
  pacienteId: string
): Promise<TConsulta[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return gerarConsultasMock(pacienteId);
};
