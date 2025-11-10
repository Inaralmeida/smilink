import type {
  TAgendamento,
  StatusAgendamento,
} from "../../domain/types/agendamento";
import type { TProfissional } from "../../domain/types/profissional";
import type { TPaciente } from "../../domain/types/paciente";

// Lista de procedimentos odontológicos
export const PROCEDIMENTOS_ODONTOLOGICOS = [
  "Consulta de Rotina",
  "Limpeza e Profilaxia",
  "Restauração",
  "Extração",
  "Tratamento de Canal",
  "Clareamento Dental",
  "Avaliação Ortodôntica",
  "Manutenção de Aparelho",
  "Implante",
  "Prótese",
  "Periodontia",
  "Cirurgia",
  "Radiografia",
  "Avaliação Inicial",
  "Raspagem",
  "Aplicação de Flúor",
  "Remoção de Tártaro",
  "Avaliação de Implante",
  "Consulta de Retorno",
];

const procedimentos = PROCEDIMENTOS_ODONTOLOGICOS;

// Durações padrão por procedimento (em minutos)
export const DURACAO_POR_PROCEDIMENTO: Record<string, number> = {
  "Consulta de Rotina": 30,
  "Limpeza e Profilaxia": 45,
  Restauração: 60,
  Extração: 30,
  "Tratamento de Canal": 90,
  "Clareamento Dental": 60,
  "Avaliação Ortodôntica": 45,
  "Manutenção de Aparelho": 30,
  Implante: 120,
  Prótese: 60,
  Periodontia: 60,
  Cirurgia: 120,
  Radiografia: 15,
  "Avaliação Inicial": 30,
  Raspagem: 60,
  "Aplicação de Flúor": 30,
  "Remoção de Tártaro": 45,
  "Avaliação de Implante": 60,
  "Consulta de Retorno": 20,
};

const duracaoPorProcedimento = DURACAO_POR_PROCEDIMENTO;

// Status possíveis (removido - não utilizado)
// const statusPossiveis: StatusAgendamento[] = [
//   "agendado",
//   "em_atendimento",
//   "finalizado",
//   "cancelado",
// ];

/**
 * Gera uma data aleatória distribuída entre passado e futuro
 * 60% no passado (últimos 90 dias), 30% no mês atual, 10% no futuro
 */
const gerarDataAleatoria = (): string => {
  const hoje = new Date();
  const random = Math.random();

  let diasOffset: number;
  if (random < 0.6) {
    // 60% no passado (últimos 90 dias)
    diasOffset = -Math.floor(Math.random() * 90);
  } else if (random < 0.9) {
    // 30% no mês atual (últimos 30 dias até hoje)
    diasOffset = -Math.floor(Math.random() * 30);
  } else {
    // 10% no futuro (próximos 30 dias)
    diasOffset = Math.floor(Math.random() * 30);
  }

  const data = new Date(hoje);
  data.setDate(data.getDate() + diasOffset);
  return data.toISOString().split("T")[0]; // YYYY-MM-DD
};

/**
 * Gera um horário aleatório no horário comercial (8h às 18h)
 */
const gerarHorarioAleatorio = (): string => {
  const hora = Math.floor(Math.random() * 10) + 8; // 8 a 17
  const minutos = Math.random() > 0.5 ? "00" : "30";
  return `${hora.toString().padStart(2, "0")}:${minutos}`;
};

/**
 * Gera agendamentos iniciais baseados em profissionais e pacientes
 */
export const gerarAgendamentosIniciais = (
  profissionais: TProfissional[],
  pacientes: TPaciente[]
): TAgendamento[] => {
  const agendamentos: TAgendamento[] = [];
  const profissionaisAtivos = profissionais.filter((p) => !p.arquivado);
  const pacientesAtivos = pacientes.filter((p) => !p.arquivado);

  if (profissionaisAtivos.length === 0 || pacientesAtivos.length === 0) {
    return agendamentos;
  }

  // Gerar entre 60 e 100 agendamentos para ter dados suficientes
  const quantidadeAgendamentos = Math.floor(Math.random() * 41) + 60;

  for (let i = 0; i < quantidadeAgendamentos; i++) {
    const profissional =
      profissionaisAtivos[
        Math.floor(Math.random() * profissionaisAtivos.length)
      ];
    const paciente =
      pacientesAtivos[Math.floor(Math.random() * pacientesAtivos.length)];
    const procedimento =
      procedimentos[Math.floor(Math.random() * procedimentos.length)];
    const data = gerarDataAleatoria();
    const horario = gerarHorarioAleatorio();
    const duracao = duracaoPorProcedimento[procedimento] || 30;

    // Determinar status baseado na data
    const dataAgendamento = new Date(data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dataAgendamento.setHours(0, 0, 0, 0);

    let status: StatusAgendamento = "agendado";
    const diasDiferenca = Math.floor(
      (hoje.getTime() - dataAgendamento.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diasDiferenca > 0) {
      // Se a data já passou, 85% finalizado, 10% cancelado, 5% agendado (atrasado)
      const rand = Math.random();
      if (rand < 0.85) {
        status = "finalizado";
      } else if (rand < 0.95) {
        status = "cancelado";
      } else {
        status = "agendado"; // Agendamento atrasado
      }
    } else if (diasDiferenca === 0) {
      // Se é hoje, 70% agendado, 20% em atendimento, 10% finalizado
      const rand = Math.random();
      if (rand < 0.7) {
        status = "agendado";
      } else if (rand < 0.9) {
        status = "em_atendimento";
      } else {
        status = "finalizado";
      }
    } else {
      // Futuro - todos agendados
      status = "agendado";
    }

    const agora = new Date();
    const criadoEm = new Date(
      agora.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(); // Criado entre 30 dias atrás e agora

    const agendamento: TAgendamento = {
      id: `agendamento-${Date.now()}-${i}`,
      profissionalId: profissional.id,
      profissionalNome: profissional.nome,
      profissionalSobrenome: profissional.sobrenome,
      pacienteId: paciente.id,
      pacienteNome: paciente.nome,
      pacienteSobrenome: paciente.sobrenome,
      data,
      horario,
      procedimento,
      duracao,
      status,
      observacoes:
        Math.random() > 0.7 ? `Observações do agendamento ${i + 1}` : undefined,
      criadoEm,
      atualizadoEm: criadoEm,
    };

    agendamentos.push(agendamento);
  }

  // Adicionar agendamentos específicos para o profissional Inara em novembro e dezembro de 2025
  const profissionalInara = profissionaisAtivos.find(
    (p) => p.id === "inara-profissional-001"
  );

  if (profissionalInara) {
    const meses = [11, 12]; // Novembro e Dezembro
    const ano = 2025;

    meses.forEach((mes) => {
      const diasNoMes = new Date(ano, mes, 0).getDate();

      // Gerar agendamentos para TODOS os dias de novembro e dezembro
      for (let dia = 1; dia <= diasNoMes; dia++) {
        const data = `${ano}-${mes.toString().padStart(2, "0")}-${dia
          .toString()
          .padStart(2, "0")}`;

        // Quantidade de agendamentos por dia (3-5)
        const agendamentosPorDia = Math.floor(Math.random() * 3) + 3;

        // Horários disponíveis (8h às 17h, intervalos de 30min)
        const horariosDisponiveis: string[] = [];
        for (let hora = 8; hora < 18; hora++) {
          horariosDisponiveis.push(`${hora.toString().padStart(2, "0")}:00`);
          if (hora < 17) {
            horariosDisponiveis.push(`${hora.toString().padStart(2, "0")}:30`);
          }
        }

        // Selecionar horários aleatórios para o dia
        const horariosSelecionados = horariosDisponiveis
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(agendamentosPorDia, horariosDisponiveis.length))
          .sort();

        horariosSelecionados.forEach((horario, index) => {
          // Selecionar um paciente aleatório
          const paciente =
            pacientesAtivos[Math.floor(Math.random() * pacientesAtivos.length)];
          const procedimento =
            procedimentos[Math.floor(Math.random() * procedimentos.length)];
          const duracao = duracaoPorProcedimento[procedimento] || 30;

          // Determinar status baseado na data
          const dataAgendamento = new Date(`${data}T${horario}`);
          const hoje = new Date();
          let status: StatusAgendamento = "agendado";

          if (dataAgendamento < hoje) {
            // Data passada - finalizado ou cancelado
            status = Math.random() > 0.1 ? "finalizado" : "cancelado";
          } else {
            // Data futura - agendado
            status = "agendado";
          }

          const agora = new Date();
          const criadoEm = new Date(
            agora.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ).toISOString();

          const agendamento: TAgendamento = {
            id: `agendamento-inara-${ano}-${mes}-${dia}-${index}-${Date.now()}`,
            profissionalId: profissionalInara.id,
            profissionalNome: profissionalInara.nome,
            profissionalSobrenome: profissionalInara.sobrenome,
            pacienteId: paciente.id,
            pacienteNome: paciente.nome,
            pacienteSobrenome: paciente.sobrenome,
            data,
            horario,
            procedimento,
            duracao,
            status,
            observacoes:
              Math.random() > 0.8
                ? `Observações do agendamento para ${data}`
                : undefined,
            criadoEm,
            atualizadoEm: criadoEm,
          };

          agendamentos.push(agendamento);
        });
      }
    });

    console.log(
      `✅ Adicionados agendamentos para profissional Inara em nov/dez 2025`
    );
  }

  return agendamentos;
};

/**
 * Busca agendamentos do localStorage
 */
export const fetchAgendamentos = async (): Promise<TAgendamento[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  return storage.get<TAgendamento[]>(STORAGE_KEYS.AGENDAMENTOS, []);
};

/**
 * Busca agendamento por ID
 */
export const fetchAgendamentoById = async (
  id: string
): Promise<TAgendamento | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const agendamentos = storage.get<TAgendamento[]>(
    STORAGE_KEYS.AGENDAMENTOS,
    []
  );
  return agendamentos.find((a) => a.id === id) || null;
};

/**
 * Cria um novo agendamento
 */
export const criarAgendamento = async (
  agendamento: Omit<TAgendamento, "id" | "criadoEm" | "atualizadoEm">
): Promise<TAgendamento> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const agendamentos = storage.get<TAgendamento[]>(
    STORAGE_KEYS.AGENDAMENTOS,
    []
  );

  const agora = new Date().toISOString();
  const novoAgendamento: TAgendamento = {
    ...agendamento,
    id: `agendamento-${Date.now()}`,
    criadoEm: agora,
    atualizadoEm: agora,
  };

  agendamentos.push(novoAgendamento);
  storage.set(STORAGE_KEYS.AGENDAMENTOS, agendamentos);

  return novoAgendamento;
};

/**
 * Atualiza um agendamento
 */
export const atualizarAgendamento = async (
  id: string,
  dados: Partial<TAgendamento>
): Promise<TAgendamento | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const agendamentos = storage.get<TAgendamento[]>(
    STORAGE_KEYS.AGENDAMENTOS,
    []
  );

  const index = agendamentos.findIndex((a) => a.id === id);
  if (index === -1) return null;

  agendamentos[index] = {
    ...agendamentos[index],
    ...dados,
    atualizadoEm: new Date().toISOString(),
  };

  storage.set(STORAGE_KEYS.AGENDAMENTOS, agendamentos);

  return agendamentos[index];
};

/**
 * Cancela um agendamento
 */
export const cancelarAgendamento = async (id: string): Promise<void> => {
  await atualizarAgendamento(id, { status: "cancelado" });
};

/**
 * Inicia atendimento
 */
export const iniciarAtendimento = async (id: string): Promise<void> => {
  await atualizarAgendamento(id, { status: "em_atendimento" });
};

/**
 * Finaliza atendimento
 */
export const finalizarAtendimento = async (id: string): Promise<void> => {
  await atualizarAgendamento(id, { status: "finalizado" });
};
