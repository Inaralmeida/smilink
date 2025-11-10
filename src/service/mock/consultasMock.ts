import { v4 as uuidv4 } from "uuid";
import type { TConsulta, TipoPagamento } from "../../domain/types/consulta";
import type { TProfissional } from "../../domain/types/profissional";
import {
  PROCEDIMENTOS_ODONTOLOGICOS,
  DURACAO_POR_PROCEDIMENTO,
} from "./agendamentos";
import { MATERIAIS_ODONTOLOGICOS } from "./materiais";
import { EXAMES_ODONTOLOGICOS } from "./exames";

// Nomes fictícios de pacientes para gerar consultas
const NOMES_PACIENTES = [
  "Ana",
  "Bruno",
  "Carla",
  "Daniel",
  "Elena",
  "Felipe",
  "Gabriela",
  "Henrique",
  "Isabela",
  "João",
  "Karina",
  "Lucas",
  "Mariana",
  "Nicolas",
  "Olivia",
  "Pedro",
  "Rafaela",
  "Samuel",
  "Tatiana",
  "Vinicius",
  "Yasmin",
  "Zeca",
  "Amanda",
  "Bernardo",
  "Camila",
  "Diego",
  "Elisa",
  "Fernando",
  "Gisele",
  "Hugo",
  "Ingrid",
  "Juliano",
  "Larissa",
  "Marcelo",
  "Natália",
  "Otávio",
  "Patricia",
  "Renato",
  "Sabrina",
  "Thiago",
  "Ursula",
  "Valeria",
  "William",
  "Ximena",
  "Yara",
  "Zélia",
  "Adriana",
  "Breno",
  "Cecilia",
  "Davi",
  "Estela",
  "Fabio",
  "Gloria",
  "Helio",
  "Irene",
  "Jorge",
  "Leticia",
  "Mauricio",
  "Nadia",
  "Orlando",
  "Paula",
  "Ricardo",
  "Sandra",
  "Tomas",
  "Vanessa",
  "Wagner",
  "Xenia",
  "Yago",
  "Zaira",
];

const SOBRENOMES_PACIENTES = [
  "Silva",
  "Santos",
  "Oliveira",
  "Souza",
  "Pereira",
  "Costa",
  "Rodrigues",
  "Almeida",
  "Nascimento",
  "Lima",
  "Araújo",
  "Fernandes",
  "Carvalho",
  "Gomes",
  "Martins",
  "Rocha",
  "Ribeiro",
  "Alves",
  "Monteiro",
  "Mendes",
  "Barros",
  "Freitas",
  "Barbosa",
  "Cardoso",
  "Castro",
  "Dias",
  "Moreira",
  "Campos",
  "Teixeira",
  "Moraes",
  "Ramos",
  "Cunha",
  "Ferreira",
  "Reis",
  "Moura",
  "Machado",
  "Brito",
  "Lopes",
  "Nunes",
  "Pinto",
  "Duarte",
  "Correia",
  "Siqueira",
  "Vieira",
  "Andrade",
  "Cavalcanti",
  "Medeiros",
  "Melo",
];

// Convenios disponíveis
const CONVENIOS = [
  "Unimed",
  "SulAmérica",
  "Bradesco Saúde",
  "Amil",
  "NotreDame Intermédica",
  "Golden Cross",
  "Trasmontano",
  "Omint",
  "Particular",
];

// Receita padrão para consultas passadas
const RECEITA_PADRAO = `Cetoprofeno 100mg - Tomar 1 comprimido de 8 em 8 horas por 7 dias
Dipirona 500mg - Tomar 1 comprimido a cada 6 horas em caso de dor
Dexametasona 4mg - Tomar 1 comprimido de 12 em 12 horas por 5 dias`;

// CID padrão para atestados
const CID_PADRAO = "K08.1 - Remoção de siso";
const DIAS_AFASTAMENTO_PADRAO = 3;

/**
 * Garante que todas as consultas passadas tenham receita e atestado padrão
 */
export const garantirReceitaEAtestadoParaConsultasPassadas = (
  consultas: TConsulta[]
): TConsulta[] => {
  const hoje = new Date();

  return consultas.map((consulta) => {
    // Verificar se é consulta passada e finalizada
    const dataConsulta = new Date(`${consulta.data}T${consulta.horario}`);
    const isPassada = dataConsulta < hoje && consulta.status === "finalizada";

    if (!isPassada) {
      return consulta;
    }

    // Criar cópia da consulta para não modificar a original
    const consultaAtualizada = { ...consulta };

    // Adicionar receita padrão se não tiver
    if (!consultaAtualizada.receita) {
      consultaAtualizada.receita = RECEITA_PADRAO;
    }

    // Adicionar atestado padrão se não tiver
    if (!consultaAtualizada.atestado?.emitido) {
      consultaAtualizada.atestado = {
        emitido: true,
        cid: CID_PADRAO,
        dias: DIAS_AFASTAMENTO_PADRAO,
      };
    }

    return consultaAtualizada;
  });
};

/**
 * Gera um nome completo de paciente fictício
 */
const gerarNomePaciente = (): { nome: string; sobrenome: string } => {
  const nome =
    NOMES_PACIENTES[Math.floor(Math.random() * NOMES_PACIENTES.length)];
  const sobrenome =
    SOBRENOMES_PACIENTES[
      Math.floor(Math.random() * SOBRENOMES_PACIENTES.length)
    ];
  return { nome, sobrenome };
};

/**
 * Gera um ID fictício de paciente
 */
const gerarPacienteId = (): string => {
  return `paciente-mock-${uuidv4()}`;
};

/**
 * Gera uma data aleatória dentro de um mês específico
 */
const gerarDataNoMes = (ano: number, mes: number): string => {
  const diasNoMes = new Date(ano, mes, 0).getDate();
  const dia = Math.floor(Math.random() * diasNoMes) + 1;
  return `${ano}-${mes.toString().padStart(2, "0")}-${dia
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Gera um horário aleatório no horário comercial
 */
const gerarHorario = (): string => {
  const hora = Math.floor(Math.random() * 10) + 8; // 8h às 17h
  const minutos = Math.random() > 0.5 ? "00" : "30";
  return `${hora.toString().padStart(2, "0")}:${minutos}`;
};

/**
 * Gera uma consulta completa
 */
const gerarConsulta = (
  profissional: TProfissional,
  pacienteId: string,
  pacienteNome: string,
  pacienteSobrenome: string,
  data: string,
  horario: string,
  tipoPagamento: TipoPagamento,
  convenio?: string
): TConsulta => {
  const procedimentoPrincipal =
    PROCEDIMENTOS_ODONTOLOGICOS[
      Math.floor(Math.random() * PROCEDIMENTOS_ODONTOLOGICOS.length)
    ];

  // Procedimentos adicionais (30% de chance)
  const procedimentosAdicionais =
    Math.random() > 0.7
      ? PROCEDIMENTOS_ODONTOLOGICOS.filter((p) => p !== procedimentoPrincipal)
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * 2) + 1)
      : [];

  // Materiais utilizados (sempre alguns)
  const materiaisUtilizados = MATERIAIS_ODONTOLOGICOS.sort(
    () => Math.random() - 0.5
  ).slice(0, Math.floor(Math.random() * 4) + 1);

  // Exames solicitados (40% de chance)
  const examesSolicitados =
    Math.random() > 0.6
      ? EXAMES_ODONTOLOGICOS.sort(() => Math.random() - 0.5).slice(
          0,
          Math.floor(Math.random() * 3) + 1
        )
      : [];

  // Calcular horário de término
  const [hora, minuto] = horario.split(":").map(Number);
  const [ano, mes, dia] = data.split("-").map(Number);
  const dataInicio = new Date(ano, mes - 1, dia, hora, minuto, 0);
  const duracao = DURACAO_POR_PROCEDIMENTO[procedimentoPrincipal] || 30;
  const dataFim = new Date(dataInicio);
  dataFim.setMinutes(dataFim.getMinutes() + duracao);

  const agora = new Date().toISOString();
  const finalizadoEm = dataFim.toISOString();

  return {
    id: uuidv4(),
    agendamentoId: uuidv4(),
    profissionalId: profissional.id,
    profissionalNome: profissional.nome,
    profissionalSobrenome: profissional.sobrenome,
    pacienteId,
    pacienteNome,
    pacienteSobrenome,
    data,
    horario,
    horarioInicio: horario,
    horarioFim: `${dataFim.getHours().toString().padStart(2, "0")}:${dataFim
      .getMinutes()
      .toString()
      .padStart(2, "0")}`,
    procedimentoPrincipal,
    procedimentosRealizados: [
      procedimentoPrincipal,
      ...procedimentosAdicionais,
    ],
    materiaisUtilizados,
    equipamentosUtilizados: [],
    examesSolicitados,
    observacoes:
      Math.random() > 0.7
        ? `Observações sobre a consulta realizada em ${data}.`
        : undefined,
    status: "finalizada", // Status padrão, pode ser alterado depois
    tipoPagamento,
    convenio,
    criadoEm: agora,
    atualizadoEm: agora,
    finalizadoEm,
  };
};

/**
 * Gera consultas para um mês específico
 * @param novosPacientesPercent - Percentual de novos pacientes (0-1). Se fornecido, garante que alguns pacientes sejam novos
 */
const gerarConsultasParaMes = (
  profissionais: TProfissional[],
  ano: number,
  mes: number,
  quantidade: number,
  pacientesMap: Map<
    string,
    {
      nome: string;
      sobrenome: string;
      id: string;
      tipoPagamento: TipoPagamento;
      convenio?: string;
      primeiraConsulta?: string; // Data da primeira consulta deste paciente
    }
  >,
  novasConsultas?: TConsulta[], // Consultas já geradas para calcular pacientes constantes
  novosPacientesPercent: number = 0.2 // 20% de novos pacientes por padrão
): TConsulta[] => {
  const consultas: TConsulta[] = [];

  // Calcular quantos pacientes novos precisamos neste mês
  const quantidadeNovosPacientes = Math.max(
    1,
    Math.floor(quantidade * novosPacientesPercent)
  );
  const quantidadePacientesConstantes = quantidade - quantidadeNovosPacientes;

  // Lista de pacientes que já têm consultas anteriores (para pacientes constantes)
  const pacientesExistentes = novasConsultas
    ? Array.from(new Set(novasConsultas.map((c) => c.pacienteId)))
    : [];

  // 1. Gerar consultas para novos pacientes
  for (let i = 0; i < quantidadeNovosPacientes; i++) {
    const profissional =
      profissionais[Math.floor(Math.random() * profissionais.length)];

    // Criar novo paciente
    const novoPaciente = gerarNomePaciente();
    const pacienteId = gerarPacienteId();
    const pacienteNome = novoPaciente.nome;
    const pacienteSobrenome = novoPaciente.sobrenome;

    // Distribuir tipo de pagamento (60% convênio, 40% particular)
    const tipoPagamento = Math.random() > 0.4 ? "convenio" : "particular";
    const convenio =
      tipoPagamento === "convenio"
        ? CONVENIOS[Math.floor(Math.random() * (CONVENIOS.length - 1))]
        : undefined;

    pacientesMap.set(pacienteId, {
      nome: pacienteNome,
      sobrenome: pacienteSobrenome,
      id: pacienteId,
      tipoPagamento,
      convenio,
      primeiraConsulta: `${ano}-${mes.toString().padStart(2, "0")}-01`,
    });

    const data = gerarDataNoMes(ano, mes);
    const horario = gerarHorario();

    const consulta = gerarConsulta(
      profissional,
      pacienteId,
      pacienteNome,
      pacienteSobrenome,
      data,
      horario,
      tipoPagamento,
      convenio
    );

    consultas.push(consulta);
  }

  // 2. Gerar consultas para pacientes constantes (que já têm consultas anteriores)
  for (let i = 0; i < quantidadePacientesConstantes; i++) {
    const profissional =
      profissionais[Math.floor(Math.random() * profissionais.length)];

    const pacienteIds = Array.from(pacientesMap.keys());
    let pacienteId: string;
    let pacienteNome: string;
    let pacienteSobrenome: string;
    let tipoPagamento: TipoPagamento;
    let convenio: string | undefined;

    // Tentar usar paciente existente (preferir pacientes que já têm consultas)
    if (pacientesExistentes.length > 0 && Math.random() > 0.3) {
      // 70% de chance de usar paciente que já tem consultas anteriores
      pacienteId =
        pacientesExistentes[
          Math.floor(Math.random() * pacientesExistentes.length)
        ];
      const paciente = pacientesMap.get(pacienteId);
      if (paciente) {
        pacienteNome = paciente.nome;
        pacienteSobrenome = paciente.sobrenome;
        tipoPagamento = paciente.tipoPagamento;
        convenio = paciente.convenio;
      } else {
        // Fallback: criar novo paciente
        const novoPaciente = gerarNomePaciente();
        pacienteId = gerarPacienteId();
        pacienteNome = novoPaciente.nome;
        pacienteSobrenome = novoPaciente.sobrenome;
        tipoPagamento = Math.random() > 0.4 ? "convenio" : "particular";
        convenio =
          tipoPagamento === "convenio"
            ? CONVENIOS[Math.floor(Math.random() * (CONVENIOS.length - 1))]
            : undefined;
        pacientesMap.set(pacienteId, {
          nome: pacienteNome,
          sobrenome: pacienteSobrenome,
          id: pacienteId,
          tipoPagamento,
          convenio,
        });
      }
    } else if (pacienteIds.length > 0) {
      // Usar qualquer paciente existente
      pacienteId = pacienteIds[Math.floor(Math.random() * pacienteIds.length)];
      const paciente = pacientesMap.get(pacienteId)!;
      pacienteNome = paciente.nome;
      pacienteSobrenome = paciente.sobrenome;
      tipoPagamento = paciente.tipoPagamento;
      convenio = paciente.convenio;
    } else {
      // Criar novo paciente se não houver nenhum
      const novoPaciente = gerarNomePaciente();
      pacienteId = gerarPacienteId();
      pacienteNome = novoPaciente.nome;
      pacienteSobrenome = novoPaciente.sobrenome;
      tipoPagamento = Math.random() > 0.4 ? "convenio" : "particular";
      convenio =
        tipoPagamento === "convenio"
          ? CONVENIOS[Math.floor(Math.random() * (CONVENIOS.length - 1))]
          : undefined;
      pacientesMap.set(pacienteId, {
        nome: pacienteNome,
        sobrenome: pacienteSobrenome,
        id: pacienteId,
        tipoPagamento,
        convenio,
      });
    }

    const data = gerarDataNoMes(ano, mes);
    const horario = gerarHorario();

    const consulta = gerarConsulta(
      profissional,
      pacienteId,
      pacienteNome,
      pacienteSobrenome,
      data,
      horario,
      tipoPagamento,
      convenio
    );

    consultas.push(consulta);
  }

  // 3. Marcar algumas consultas como canceladas (10-15% das consultas)
  // Garantir pelo menos 1 consulta cancelada se houver consultas
  const percentualCanceladas = 0.12; // 12% de canceladas
  const quantidadeCanceladas = Math.max(
    1,
    Math.floor(consultas.length * percentualCanceladas)
  );
  const indicesParaCancelar = Array.from(
    { length: consultas.length },
    (_, i) => i
  )
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(quantidadeCanceladas, consultas.length));

  indicesParaCancelar.forEach((index) => {
    consultas[index].status = "cancelada";
    consultas[index].finalizadoEm = undefined; // Consultas canceladas não têm data de finalização
    // Remover horário de fim também para consultas canceladas
    consultas[index].horarioFim = undefined;
  });

  return consultas;
};

/**
 * Gera um MOC completo de consultas para vários meses
 * Inclui dezembro de 2025, janeiro de 2025/2026, e meses recentes até o atual
 */
export const gerarConsultasMock = (
  profissionais: TProfissional[]
): TConsulta[] => {
  const consultas: TConsulta[] = [];
  const pacientesMap = new Map<
    string,
    {
      nome: string;
      sobrenome: string;
      id: string;
      tipoPagamento: TipoPagamento;
      convenio?: string;
      primeiraConsulta?: string;
    }
  >();

  // Filtrar apenas profissionais ativos
  const profissionaisAtivos = profissionais.filter((p) => !p.arquivado);

  if (profissionaisAtivos.length === 0) {
    return consultas;
  }

  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();

  // 1. Gerar consultas para TODOS os meses de 2025 (garantir dados completos para o dashboard)
  // Gerar de janeiro a dezembro de 2025, independente do mês atual
  // Acumular consultas para garantir pacientes constantes
  for (let mes = 1; mes <= 12; mes++) {
    const isMesAtual = anoAtual === 2025 && mes === mesAtual;

    // Mês atual: mais consultas (35-50)
    // Outros meses: consultas médias (25-40)
    // Gerar dados mesmo para meses futuros para o dashboard funcionar
    const quantidade = isMesAtual
      ? Math.floor(Math.random() * 16) + 35 // 35-50 consultas no mês atual
      : Math.floor(Math.random() * 16) + 25; // 25-40 consultas nos outros meses

    // Percentual de novos pacientes: mais novos no início do ano, menos no final
    // Janeiro: 30% novos, Dezembro: 10% novos
    const novosPacientesPercent = Math.max(0.1, 0.3 - (mes - 1) * 0.02); // Decresce ao longo do ano

    const consultasDoMes = gerarConsultasParaMes(
      profissionaisAtivos,
      2025,
      mes,
      quantidade,
      pacientesMap,
      consultas, // Passar consultas anteriores para calcular pacientes constantes
      novosPacientesPercent
    );

    consultas.push(...consultasDoMes);
  }

  // 2. Adicionar também consultas históricas de janeiro de 2026 (para ter dados de 2026)
  const consultas2026 = gerarConsultasParaMes(
    profissionaisAtivos,
    2026,
    1,
    Math.floor(Math.random() * 15) + 10, // 10-25 consultas
    pacientesMap,
    consultas, // Passar consultas anteriores
    0.2 // 20% de novos pacientes em 2026
  );
  consultas.push(...consultas2026);

  // 5. Garantir que apenas 2-3 pacientes sejam inativos
  // Pacientes inativos terão consultas apenas nos primeiros meses de 2025 (jan-fev)
  // e não terão consultas nos meses recentes
  const pacientesIds = Array.from(pacientesMap.keys());
  const pacientesInativos = Math.min(
    3,
    Math.max(2, Math.floor(pacientesIds.length * 0.05))
  ); // Entre 2-3 inativos

  // Separar pacientes que serão inativos
  const idsParaInativar = pacientesIds
    .sort(() => Math.random() - 0.5)
    .slice(0, pacientesInativos);

  // Para os pacientes inativos, remover consultas dos últimos 6 meses de 2025
  // Mas manter consultas dos primeiros meses (jan-fev) para ter histórico
  idsParaInativar.forEach((pacienteId) => {
    // Remover consultas de março em diante de 2025 para esses pacientes
    // Eles terão consultas apenas em janeiro e fevereiro de 2025
    const consultasParaRemover = consultas.filter((c) => {
      if (c.pacienteId !== pacienteId) return false;
      if (!c.data.startsWith("2025")) return false;
      const mes = parseInt(c.data.substring(5, 7)); // MM
      return mes >= 3; // Remover de março (3) em diante
    });

    consultasParaRemover.forEach((consulta) => {
      const index = consultas.indexOf(consulta);
      if (index > -1) {
        consultas.splice(index, 1);
      }
    });
  });

  return consultas;
};

/**
 * Gera um MOC de consultas e atualiza a última consulta dos pacientes
 * Retorna as consultas e um mapa de pacientes com suas últimas consultas
 */
export const gerarConsultasMockCompletas = (
  profissionais: TProfissional[]
): {
  consultas: TConsulta[];
  pacientesUltimaConsulta: Map<string, string>;
} => {
  const consultas = gerarConsultasMock(profissionais);

  // Garantir que todas as consultas passadas tenham receita e atestado padrão
  const consultasComReceitaEAtestado =
    garantirReceitaEAtestadoParaConsultasPassadas(consultas);

  const pacientesUltimaConsulta = new Map<string, string>();

  // Agrupar consultas por paciente e encontrar a última
  const consultasPorPaciente = new Map<string, TConsulta[]>();
  consultasComReceitaEAtestado.forEach((consulta) => {
    if (!consultasPorPaciente.has(consulta.pacienteId)) {
      consultasPorPaciente.set(consulta.pacienteId, []);
    }
    consultasPorPaciente.get(consulta.pacienteId)!.push(consulta);
  });

  // Encontrar a última consulta de cada paciente
  consultasPorPaciente.forEach((consultasPaciente, pacienteId) => {
    const consultasOrdenadas = consultasPaciente.sort((a, b) => {
      const dataA = new Date(a.finalizadoEm || a.data);
      const dataB = new Date(b.finalizadoEm || b.data);
      return dataB.getTime() - dataA.getTime();
    });

    const ultimaConsulta = consultasOrdenadas[0];
    pacientesUltimaConsulta.set(
      pacienteId,
      ultimaConsulta.finalizadoEm ||
        `${ultimaConsulta.data}T${ultimaConsulta.horario}`
    );
  });

  return {
    consultas: consultasComReceitaEAtestado,
    pacientesUltimaConsulta,
  };
};

/**
 * Adiciona consultas específicas para a usuária Inara Almeida
 * - Como profissional: consultas para TODOS os dias de novembro e dezembro de 2025
 * - Como paciente: consultas no histórico (últimos 12 meses, pelo menos 20 consultas)
 */
export const adicionarConsultasInara = (
  consultas: TConsulta[],
  profissionais: TProfissional[],
  pacientes: Array<{ id: string; nome: string; sobrenome: string }>
): TConsulta[] => {
  const consultasAdicionadas: TConsulta[] = [];

  // Encontrar o profissional Inara
  const profissionalInara = profissionais.find(
    (p) => p.id === "inara-profissional-001"
  );

  // Encontrar o paciente Inara
  const pacienteInara = pacientes.find((p) => p.id === "inara-paciente-001");

  if (!profissionalInara) {
    return consultas;
  }

  // 1. Adicionar consultas como PROFISSIONAL para novembro e dezembro de 2025
  // Gerar consultas para TODOS os dias de novembro e dezembro
  const meses = [11, 12]; // Novembro e Dezembro
  const ano = 2025;

  meses.forEach((mes) => {
    const diasNoMes = new Date(ano, mes, 0).getDate();

    // Gerar consultas para TODOS os dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = `${ano}-${mes.toString().padStart(2, "0")}-${dia
        .toString()
        .padStart(2, "0")}`;

      // Quantidade de consultas por dia (3-5 consultas por dia para ter bastante conteúdo)
      const consultasPorDia = Math.floor(Math.random() * 3) + 3; // 3-5 consultas

      // Horários disponíveis (8h às 17h, intervalos de 30min)
      const horariosDisponiveis: string[] = [];
      for (let hora = 8; hora < 18; hora++) {
        horariosDisponiveis.push(`${hora.toString().padStart(2, "0")}:00`);
        if (hora < 17) {
          horariosDisponiveis.push(`${hora.toString().padStart(2, "0")}:30`);
        }
      }

      // Selecionar horários aleatórios para o dia (garantir que não haja sobreposição)
      const horariosSelecionados = horariosDisponiveis
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(consultasPorDia, horariosDisponiveis.length))
        .sort();

      horariosSelecionados.forEach((horario) => {
        // Selecionar um paciente aleatório
        let pacienteId: string;
        let pacienteNome: string;
        let pacienteSobrenome: string;
        let tipoPagamento: TipoPagamento;
        let convenio: string | undefined;

        // 20% de chance de usar a própria Inara como paciente, 80% pacientes fictícios
        if (pacienteInara && Math.random() > 0.8) {
          pacienteId = pacienteInara.id;
          pacienteNome = pacienteInara.nome;
          pacienteSobrenome = pacienteInara.sobrenome;
          tipoPagamento = Math.random() > 0.5 ? "convenio" : "particular";
          convenio =
            tipoPagamento === "convenio"
              ? CONVENIOS[Math.floor(Math.random() * (CONVENIOS.length - 1))]
              : undefined;
        } else {
          // Usar paciente fictício
          const novoPaciente = gerarNomePaciente();
          pacienteId = gerarPacienteId();
          pacienteNome = novoPaciente.nome;
          pacienteSobrenome = novoPaciente.sobrenome;
          tipoPagamento = Math.random() > 0.4 ? "convenio" : "particular";
          convenio =
            tipoPagamento === "convenio"
              ? CONVENIOS[Math.floor(Math.random() * (CONVENIOS.length - 1))]
              : undefined;
        }

        const consulta = gerarConsulta(
          profissionalInara,
          pacienteId,
          pacienteNome,
          pacienteSobrenome,
          data,
          horario,
          tipoPagamento,
          convenio
        );

        // Para novembro e dezembro, marcar como finalizadas (já que são meses passados/futuros)
        // Se for data futura, manter como agendada
        const dataConsulta = new Date(`${data}T${horario}`);
        const hoje = new Date();
        if (dataConsulta < hoje) {
          consulta.status = "finalizada";
        } else {
          consulta.status = "agendada";
          consulta.horarioFim = undefined;
          consulta.finalizadoEm = undefined;
        }

        consultasAdicionadas.push(consulta);
      });
    }
  });

  // 2. Adicionar consultas no HISTÓRICO como PACIENTE (pelo menos 20 consultas)
  if (pacienteInara) {
    // Gerar consultas históricas para o paciente Inara
    // Uma consulta por mês nos últimos 12 meses, garantindo pelo menos 20 consultas
    const hoje = new Date();
    const profissionaisDisponiveis = profissionais.filter(
      (p) => p.id !== "inara-profissional-001" && !p.arquivado
    );

    if (profissionaisDisponiveis.length > 0) {
      // Gerar pelo menos 20 consultas distribuídas pelos últimos 12 meses
      const totalConsultas = Math.max(20, 24); // 24 consultas (2 por mês em média)

      for (let i = 0; i < totalConsultas; i++) {
        // Distribuir ao longo dos últimos 12 meses
        const mesesAtras = Math.floor(Math.random() * 12);
        const dataConsulta = new Date(
          hoje.getFullYear(),
          hoje.getMonth() - mesesAtras,
          1
        );
        const anoConsulta = dataConsulta.getFullYear();
        const mesConsulta = dataConsulta.getMonth() + 1;

        // Selecionar um profissional aleatório
        const profissional =
          profissionaisDisponiveis[
            Math.floor(Math.random() * profissionaisDisponiveis.length)
          ];

        // Gerar data aleatória no mês
        const data = gerarDataNoMes(anoConsulta, mesConsulta);
        const horario = gerarHorario();
        const tipoPagamento = Math.random() > 0.4 ? "convenio" : "particular";
        const convenio =
          tipoPagamento === "convenio"
            ? CONVENIOS[Math.floor(Math.random() * (CONVENIOS.length - 1))]
            : undefined;

        const consulta = gerarConsulta(
          profissional,
          pacienteInara.id,
          pacienteInara.nome,
          pacienteInara.sobrenome,
          data,
          horario,
          tipoPagamento,
          convenio
        );

        // Todas as consultas históricas são finalizadas
        consulta.status = "finalizada";

        consultasAdicionadas.push(consulta);
      }
    }
  } else {
    console.warn("⚠️ Paciente Inara (inara-paciente-001) não encontrado");
  }

  const consultasComoProfissional = consultasAdicionadas.filter(
    (c) => c.profissionalId === "inara-profissional-001"
  ).length;
  const consultasComoPaciente = consultasAdicionadas.filter(
    (c) => c.pacienteId === "inara-paciente-001"
  ).length;

  console.log(
    `✅ Adicionadas ${consultasAdicionadas.length} consultas específicas para Inara`
  );
  console.log(
    `   👨‍⚕️ Como profissional (nov/dez 2025): ${consultasComoProfissional} consultas`
  );
  console.log(
    `   👤 Como paciente (histórico): ${consultasComoPaciente} consultas`
  );

  // Garantir que todas as consultas passadas tenham receita e atestado padrão
  const todasConsultas = [...consultas, ...consultasAdicionadas];
  return garantirReceitaEAtestadoParaConsultasPassadas(todasConsultas);
};
