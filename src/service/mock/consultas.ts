import { v4 as uuidv4 } from "uuid";
import type { TConsulta, TipoPagamento } from "../../domain/types/consulta";
import type { TAgendamento } from "../../domain/types/agendamento";
import type { TPaciente } from "../../domain/types/paciente";
import { storage, STORAGE_KEYS } from "../../shared/utils/localStorage";
import { MATERIAIS_ODONTOLOGICOS } from "./materiais";
import { EXAMES_ODONTOLOGICOS } from "./exames";
import {
  PROCEDIMENTOS_ODONTOLOGICOS,
  DURACAO_POR_PROCEDIMENTO,
} from "./agendamentos";
import { subMonths, eachMonthOfInterval } from "date-fns";

// Exportar para uso em outros módulos
export { MATERIAIS_ODONTOLOGICOS, EXAMES_ODONTOLOGICOS };
export { buscarMateriais } from "./materiais";
export { buscarExames } from "./exames";

/**
 * Converte um agendamento finalizado em uma consulta
 */
export const criarConsultaDeAgendamento = (
  agendamento: TAgendamento,
  tipoPagamento: TipoPagamento = "particular",
  convenio?: string
): TConsulta => {
  const agora = new Date().toISOString();

  return {
    id: uuidv4(),
    agendamentoId: agendamento.id,
    profissionalId: agendamento.profissionalId,
    profissionalNome: agendamento.profissionalNome,
    profissionalSobrenome: agendamento.profissionalSobrenome,
    pacienteId: agendamento.pacienteId,
    pacienteNome: agendamento.pacienteNome,
    pacienteSobrenome: agendamento.pacienteSobrenome,
    data: agendamento.data,
    horario: agendamento.horario,
    procedimentoPrincipal: agendamento.procedimento,
    procedimentosRealizados: [agendamento.procedimento],
    materiaisUtilizados: [],
    equipamentosUtilizados: [],
    examesSolicitados: [],
    observacoes: agendamento.observacoes,
    status: agendamento.status === "finalizado" ? "finalizada" : "agendada",
    tipoPagamento,
    convenio: tipoPagamento === "convenio" ? convenio : undefined,
    criadoEm: agora,
    atualizadoEm: agora,
  };
};

/**
 * Gera consultas iniciais usando o MOC específico para a tela de consultas
 * Gera dados para vários meses incluindo dezembro de 2005 e janeiro de 2001/2006
 * Nota: Os parâmetros agendamentos e pacientes não são usados, pois o MOC gera dados independentes
 */
export const gerarConsultasIniciais = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _agendamentos: TAgendamento[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _pacientes: TPaciente[]
): Promise<TConsulta[]> => {
  // Importar profissionais reais do MOC
  const { MOCK_PROFISSIONAIS } = await import("./profissionais");

  // Usar o MOC específico para gerar consultas completas
  const { gerarConsultasMockCompletas } = await import("./consultasMock");

  const { consultas } = gerarConsultasMockCompletas(MOCK_PROFISSIONAIS);

  return consultas;
};

/**
 * Busca todas as consultas
 */
export const fetchConsultas = async (): Promise<TConsulta[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Garantir consulta de demonstração antes de retornar
  await garantirConsultaDemonstracao();

  const consultas = storage.get<TConsulta[]>(STORAGE_KEYS.CONSULTAS, []);
  console.log(`📋 fetchConsultas: ${consultas.length} consultas encontradas`);
  if (consultas.length > 0) {
    // Log da distribuição por mês
    const distribuicaoPorMes = consultas.reduce((acc, c) => {
      const mes = c.data.substring(0, 7); // YYYY-MM
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log("📊 Distribuição por mês:", distribuicaoPorMes);
  }
  return consultas;
};

/**
 * Busca consulta por ID
 */
export const fetchConsultaById = async (
  id: string
): Promise<TConsulta | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const consultas = storage.get<TConsulta[]>(STORAGE_KEYS.CONSULTAS, []);
  return consultas.find((c) => c.id === id) || null;
};

/**
 * Busca consultas por profissional
 */
export const fetchConsultasPorProfissional = async (
  profissionalId: string
): Promise<TConsulta[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Garantir consulta de demonstração
  await garantirConsultaDemonstracao();

  const consultas = await fetchConsultas();
  const consultasDoProfissional = consultas.filter(
    (c) => c.profissionalId === profissionalId
  );

  // Se não houver consultas do profissional, incluir consulta de demonstração
  // (a consulta de demonstração será visível para todos os profissionais)
  if (consultasDoProfissional.length === 0) {
    const consultaDemo = consultas.find(
      (c) => c.id === "consulta-demonstracao"
    );
    if (consultaDemo) {
      return [consultaDemo];
    }
  }

  // Sempre incluir consulta de demonstração se existir
  const consultaDemo = consultas.find((c) => c.id === "consulta-demonstracao");
  if (
    consultaDemo &&
    !consultasDoProfissional.find((c) => c.id === "consulta-demonstracao")
  ) {
    return [...consultasDoProfissional, consultaDemo];
  }

  return consultasDoProfissional;
};

/**
 * Gera histórico de consultas para um paciente específico
 * Gera pelo menos 20 consultas distribuídas pelos últimos 12 meses
 */
const gerarHistoricoConsultasParaPaciente = async (
  pacienteId: string,
  pacienteNome: string,
  pacienteSobrenome: string,
  tipoPagamento: TipoPagamento = "particular",
  convenio?: string
): Promise<TConsulta[]> => {
  // Buscar profissionais disponíveis
  const { fetchProfissionais } = await import("./profissionais");
  const profissionais = await fetchProfissionais();
  const profissionaisAtivos = profissionais.filter((p) => !p.arquivado);

  if (profissionaisAtivos.length === 0) {
    return [];
  }

  const consultas: TConsulta[] = [];
  const hoje = new Date();

  // Gerar consultas para os últimos 12 meses
  // Garantir pelo menos 1 consulta por mês, totalizando pelo menos 20
  const mesesParaGerar = eachMonthOfInterval({
    start: subMonths(hoje, 11),
    end: hoje,
  }).reverse();

  // Garantir pelo menos 1 consulta por mês, totalizando pelo menos 20 consultas
  // Distribuir: últimos 6 meses têm mais consultas (2-3 cada), meses anteriores têm 1-2 cada
  // Isso garante pelo menos 12 + (6 * 2) = 24 consultas, muito mais que 20

  mesesParaGerar.forEach((mesData, index) => {
    const ano = mesData.getFullYear();
    const mes = mesData.getMonth() + 1;
    const diasNoMes = new Date(ano, mes, 0).getDate();

    // Garantir pelo menos 1 consulta por mês
    // Últimos 6 meses: 2-3 consultas cada (mais frequente)
    // Meses anteriores (7-12): 1-2 consultas cada
    const isMesRecente = index < 6; // Últimos 6 meses
    const consultasNoMes = isMesRecente
      ? Math.floor(Math.random() * 2) + 2 // 2-3 consultas nos meses recentes
      : Math.floor(Math.random() * 2) + 1; // 1-2 consultas nos meses anteriores

    // Garantir pelo menos 1 consulta mesmo nos meses anteriores
    const quantidadeConsultas = Math.max(1, consultasNoMes);

    for (let i = 0; i < quantidadeConsultas; i++) {
      // Selecionar profissional aleatório
      const profissional =
        profissionaisAtivos[
          Math.floor(Math.random() * profissionaisAtivos.length)
        ];

      // Gerar data aleatória no mês
      const dia = Math.floor(Math.random() * diasNoMes) + 1;
      const data = `${ano}-${mes.toString().padStart(2, "0")}-${dia
        .toString()
        .padStart(2, "0")}`;

      // Gerar horário comercial (8h às 17h)
      const hora = Math.floor(Math.random() * 10) + 8;
      const minutos = Math.random() > 0.5 ? "00" : "30";
      const horario = `${hora.toString().padStart(2, "0")}:${minutos}`;

      // Selecionar procedimento principal
      const procedimentoPrincipal =
        PROCEDIMENTOS_ODONTOLOGICOS[
          Math.floor(Math.random() * PROCEDIMENTOS_ODONTOLOGICOS.length)
        ];

      // Procedimentos adicionais (30% de chance)
      const procedimentosAdicionais =
        Math.random() > 0.7
          ? PROCEDIMENTOS_ODONTOLOGICOS.filter(
              (p) => p !== procedimentoPrincipal
            )
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
      const [horaNum, minutoNum] = horario.split(":").map(Number);
      const dataInicio = new Date(ano, mes - 1, dia, horaNum, minutoNum, 0);
      const duracao = DURACAO_POR_PROCEDIMENTO[procedimentoPrincipal] || 30;
      const dataFim = new Date(dataInicio);
      dataFim.setMinutes(dataFim.getMinutes() + duracao);

      const agora = new Date().toISOString();
      const finalizadoEm = dataFim.toISOString();

      // Status: 90% finalizada, 10% cancelada
      const status = Math.random() > 0.1 ? "finalizada" : "cancelada";

      const consulta: TConsulta = {
        id: uuidv4(),
        agendamentoId: uuidv4(), // ID fictício de agendamento
        profissionalId: profissional.id,
        profissionalNome: profissional.nome,
        profissionalSobrenome: profissional.sobrenome,
        pacienteId,
        pacienteNome,
        pacienteSobrenome,
        data,
        horario,
        horarioInicio: horario,
        horarioFim:
          status === "finalizada"
            ? `${dataFim.getHours().toString().padStart(2, "0")}:${dataFim
                .getMinutes()
                .toString()
                .padStart(2, "0")}`
            : undefined,
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
        status,
        tipoPagamento,
        convenio,
        criadoEm: agora,
        atualizadoEm: agora,
        finalizadoEm: status === "finalizada" ? finalizadoEm : undefined,
      };

      consultas.push(consulta);
    }
  });

  // Garantir que temos pelo menos 20 consultas
  // Se não temos, adicionar mais consultas nos meses mais recentes
  if (consultas.length < 20) {
    const mesesRecentes = mesesParaGerar.slice(0, 6); // Últimos 6 meses
    const consultasParaAdicionar = 20 - consultas.length;

    for (let i = 0; i < consultasParaAdicionar; i++) {
      const mesData = mesesRecentes[i % mesesRecentes.length];
      const ano = mesData.getFullYear();
      const mes = mesData.getMonth() + 1;
      const diasNoMes = new Date(ano, mes, 0).getDate();
      const dia = Math.floor(Math.random() * diasNoMes) + 1;
      const data = `${ano}-${mes.toString().padStart(2, "0")}-${dia
        .toString()
        .padStart(2, "0")}`;

      const hora = Math.floor(Math.random() * 10) + 8;
      const minutos = Math.random() > 0.5 ? "00" : "30";
      const horario = `${hora.toString().padStart(2, "0")}:${minutos}`;

      const profissional =
        profissionaisAtivos[
          Math.floor(Math.random() * profissionaisAtivos.length)
        ];

      const procedimentoPrincipal =
        PROCEDIMENTOS_ODONTOLOGICOS[
          Math.floor(Math.random() * PROCEDIMENTOS_ODONTOLOGICOS.length)
        ];

      const materiaisUtilizados = MATERIAIS_ODONTOLOGICOS.sort(
        () => Math.random() - 0.5
      ).slice(0, Math.floor(Math.random() * 4) + 1);

      const examesSolicitados =
        Math.random() > 0.6
          ? EXAMES_ODONTOLOGICOS.sort(() => Math.random() - 0.5).slice(
              0,
              Math.floor(Math.random() * 3) + 1
            )
          : [];

      const [horaNum, minutoNum] = horario.split(":").map(Number);
      const dataInicio = new Date(ano, mes - 1, dia, horaNum, minutoNum, 0);
      const duracao = DURACAO_POR_PROCEDIMENTO[procedimentoPrincipal] || 30;
      const dataFim = new Date(dataInicio);
      dataFim.setMinutes(dataFim.getMinutes() + duracao);

      const agora = new Date().toISOString();
      const finalizadoEm = dataFim.toISOString();
      const status = Math.random() > 0.1 ? "finalizada" : "cancelada";

      const consulta: TConsulta = {
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
        horarioFim:
          status === "finalizada"
            ? `${dataFim.getHours().toString().padStart(2, "0")}:${dataFim
                .getMinutes()
                .toString()
                .padStart(2, "0")}`
            : undefined,
        procedimentoPrincipal,
        procedimentosRealizados: [procedimentoPrincipal],
        materiaisUtilizados,
        equipamentosUtilizados: [],
        examesSolicitados,
        observacoes:
          Math.random() > 0.7
            ? `Observações sobre a consulta realizada em ${data}.`
            : undefined,
        status,
        tipoPagamento,
        convenio,
        criadoEm: agora,
        atualizadoEm: agora,
        finalizadoEm: status === "finalizada" ? finalizadoEm : undefined,
      };

      consultas.push(consulta);
    }
  }

  return consultas;
};

/**
 * Busca consultas por paciente
 * Se não houver consultas, gera um histórico automático usando dados do usuário logado
 */
export const fetchConsultasPorPaciente = async (
  pacienteId: string
): Promise<TConsulta[]> => {
  console.log(
    `📋 fetchConsultasPorPaciente: Buscando consultas para paciente ${pacienteId}`
  );

  if (!pacienteId) {
    console.warn("⚠️ fetchConsultasPorPaciente: pacienteId vazio");
    return [];
  }

  await new Promise((resolve) => setTimeout(resolve, 300));

  // Garantir consulta de demonstração antes de buscar
  await garantirConsultaDemonstracao();

  // Buscar consultas existentes
  const consultasExistentes = await fetchConsultas();
  console.log(
    `📊 Total de consultas no sistema: ${consultasExistentes.length}`
  );

  const consultasDoPaciente = consultasExistentes.filter(
    (c) => c.pacienteId === pacienteId
  );
  console.log(
    `📊 Consultas do paciente ${pacienteId}: ${consultasDoPaciente.length}`
  );

  // Se já tem consultas (pelo menos 20), adicionar consulta de demonstração se não estiver incluída
  if (consultasDoPaciente.length >= 20) {
    console.log(
      `✅ Retornando ${consultasDoPaciente.length} consultas existentes`
    );
    // Adicionar consulta de demonstração se for do paciente ou sempre mostrar
    const consultaDemo = consultasExistentes.find(
      (c) => c.id === "consulta-demonstracao"
    );
    if (consultaDemo) {
      // Se a consulta de demonstração é do paciente, já está incluída
      if (consultaDemo.pacienteId === pacienteId) {
        return consultasDoPaciente;
      }
      // Se não é do paciente, ainda assim mostrar no histórico (pode ser útil para demo)
      return [consultaDemo, ...consultasDoPaciente];
    }
    return consultasDoPaciente;
  }

  console.log(
    `🔄 Gerando histórico de consultas (atual: ${consultasDoPaciente.length}, necessário: 20+)`
  );

  // PRIMEIRO: Buscar dados do usuário logado do localStorage (mais confiável)
  let pacienteNome = "";
  let pacienteSobrenome = "";
  let tipoPagamento: TipoPagamento = "particular";
  let convenio: string | undefined;

  try {
    // Tentar ambas as chaves possíveis
    let userString = localStorage.getItem("user");
    if (!userString) {
      userString = localStorage.getItem("smilink_user");
    }

    console.log(`🔍 Buscando usuário logado para pacienteId: ${pacienteId}`);
    console.log(
      `📦 Chave "user":`,
      localStorage.getItem("user") ? "existe" : "não existe"
    );
    console.log(
      `📦 Chave "smilink_user":`,
      localStorage.getItem("smilink_user") ? "existe" : "não existe"
    );

    if (userString) {
      const user = JSON.parse(userString);
      console.log(`👤 Usuário encontrado:`, {
        id: user.id,
        nome: user.nome,
        role: user.role,
      });

      // Se o usuário logado é paciente e o ID corresponde, usar seus dados
      if (user.role === "paciente" && user.id === pacienteId) {
        pacienteNome = user.nome || "";
        pacienteSobrenome = user.sobrenome || "";
        tipoPagamento = "particular"; // Default
        convenio = undefined;
        console.log(
          `✅ Dados do paciente obtidos do usuário logado: ${pacienteNome} ${pacienteSobrenome}`
        );
      }
    }
  } catch (error) {
    console.error("❌ Erro ao buscar usuário do localStorage:", error);
  }

  // SEGUNDO: Se não encontrou no localStorage, buscar na lista de pacientes do sistema
  if (!pacienteNome || !pacienteSobrenome) {
    console.log(
      `🔍 Buscando paciente ${pacienteId} na lista de pacientes do sistema...`
    );
    const { fetchPacienteById } = await import("./pacientes");
    const paciente = await fetchPacienteById(pacienteId);

    if (paciente) {
      pacienteNome = paciente.nome;
      pacienteSobrenome = paciente.sobrenome;
      tipoPagamento = paciente.tem_plano_saude ? "convenio" : "particular";
      convenio = paciente.name_plano_saude;
      console.log(
        `✅ Dados do paciente obtidos da lista de pacientes: ${pacienteNome} ${pacienteSobrenome}`
      );
    }
  }

  // TERCEIRO: Se ainda não encontrou, buscar no MOCK_USER
  if (!pacienteNome || !pacienteSobrenome) {
    console.log(`🔍 Buscando paciente ${pacienteId} no MOCK_USER...`);
    try {
      const { MOCK_USER } = await import("./user");
      const usuarioPaciente = MOCK_USER.find(
        (u) => u.id === pacienteId && u.role === "paciente"
      );

      if (usuarioPaciente) {
        pacienteNome = usuarioPaciente.nome || "Paciente";
        pacienteSobrenome = usuarioPaciente.sobrenome || "Anônimo";
        tipoPagamento = "particular";
        convenio = undefined;
        console.log(
          `✅ Dados obtidos do MOCK_USER: ${pacienteNome} ${pacienteSobrenome}`
        );
      }
    } catch (error) {
      console.error("❌ Erro ao buscar no MOCK_USER:", error);
    }
  }

  // Se ainda não tem nome, não pode gerar consultas
  if (!pacienteNome || !pacienteSobrenome) {
    console.error(`❌ Paciente ${pacienteId} não encontrado em nenhum lugar`);
    return consultasDoPaciente; // Retornar as que já existem (se houver)
  }

  // Gerar histórico de consultas completo (sempre gerar pelo menos 20)
  const historicoConsultas = await gerarHistoricoConsultasParaPaciente(
    pacienteId,
    pacienteNome,
    pacienteSobrenome,
    tipoPagamento,
    convenio
  );

  // Se já tinha algumas consultas, substituir todas pelas novas para garantir histórico completo
  const consultasParaAdicionar = historicoConsultas;

  // Se já tinha consultas, remover as antigas e adicionar as novas
  // Caso contrário, apenas adicionar as novas
  const todasConsultas = await fetchConsultas();
  const consultasSemEstePaciente = todasConsultas.filter(
    (c) => c.pacienteId !== pacienteId && c.id !== "consulta-demonstracao" // Preservar consulta de demonstração
  );

  // Adicionar novas consultas
  consultasSemEstePaciente.push(...consultasParaAdicionar);

  // Garantir que consulta de demonstração seja preservada
  const consultaDemo = todasConsultas.find(
    (c) => c.id === "consulta-demonstracao"
  );
  if (consultaDemo) {
    consultasSemEstePaciente.push(consultaDemo);
  }

  storage.set(STORAGE_KEYS.CONSULTAS, consultasSemEstePaciente);

  console.log(
    `✅ Gerado histórico de ${consultasParaAdicionar.length} consultas para paciente ${pacienteNome} ${pacienteSobrenome} (ID: ${pacienteId})`
  );

  // Retornar consultas do paciente
  // A consulta de demonstração será incluída se for do paciente (via fetchConsultasPorPaciente)
  return consultasParaAdicionar;
};

/**
 * Busca consultas do dia para um profissional
 */
export const fetchConsultasDoDia = async (
  profissionalId: string,
  data: string
): Promise<TConsulta[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Garantir consulta de demonstração antes de buscar
  await garantirConsultaDemonstracao();

  const consultas = await fetchConsultasPorProfissional(profissionalId);
  const consultasDoDia = consultas.filter((c) => c.data === data);

  // Sempre incluir consulta de demonstração se for do dia atual
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = (agora.getMonth() + 1).toString().padStart(2, "0");
  const dia = agora.getDate().toString().padStart(2, "0");
  const hoje = `${ano}-${mes}-${dia}`;

  if (data === hoje) {
    const todasConsultas = await fetchConsultas();
    const consultaDemo = todasConsultas.find(
      (c) => c.id === "consulta-demonstracao" && c.data === data
    );
    if (
      consultaDemo &&
      !consultasDoDia.find((c) => c.id === "consulta-demonstracao")
    ) {
      return [...consultasDoDia, consultaDemo];
    }
  }

  return consultasDoDia;
};

/**
 * Inicia uma consulta a partir de um agendamento
 * Cria a consulta se não existir, ou atualiza se já existir
 */
export const iniciarConsultaDeAgendamento = async (
  agendamentoId: string,
  horarioInicio: string,
  pacientes: TPaciente[]
): Promise<TConsulta> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Verificar se já existe consulta para esse agendamento
  const consultas = storage.get<TConsulta[]>(STORAGE_KEYS.CONSULTAS, []);
  const consultaExistente = consultas.find(
    (c) => c.agendamentoId === agendamentoId
  );

  if (consultaExistente) {
    // Atualizar consulta existente
    return (await iniciarConsulta(
      consultaExistente.id,
      horarioInicio
    )) as TConsulta;
  }

  // Buscar agendamento
  const { fetchAgendamentoById } = await import("./agendamentos");
  const agendamento = await fetchAgendamentoById(agendamentoId);

  if (!agendamento) {
    throw new Error("Agendamento não encontrado");
  }

  // Buscar paciente para determinar tipo de pagamento
  const paciente = pacientes.find((p) => p.id === agendamento.pacienteId);
  const tipoPagamento: TipoPagamento = paciente?.tem_plano_saude
    ? "convenio"
    : "particular";
  const convenio = paciente?.name_plano_saude;

  // Criar consulta
  const consulta = criarConsultaDeAgendamento(
    agendamento,
    tipoPagamento,
    convenio
  );
  consulta.status = "em_andamento";
  consulta.horarioInicio = horarioInicio;

  // Salvar consulta
  consultas.push(consulta);
  storage.set(STORAGE_KEYS.CONSULTAS, consultas);

  // Atualizar status do agendamento
  const { atualizarAgendamento } = await import("./agendamentos");
  await atualizarAgendamento(agendamentoId, { status: "em_atendimento" });

  return consulta;
};

/**
 * Cria uma nova consulta
 */
export const criarConsulta = async (
  consulta: Omit<TConsulta, "id" | "criadoEm" | "atualizadoEm">
): Promise<TConsulta> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const consultas = storage.get<TConsulta[]>(STORAGE_KEYS.CONSULTAS, []);

  const agora = new Date().toISOString();
  const novaConsulta: TConsulta = {
    ...consulta,
    id: uuidv4(),
    criadoEm: agora,
    atualizadoEm: agora,
  };

  consultas.push(novaConsulta);
  storage.set(STORAGE_KEYS.CONSULTAS, consultas);

  return novaConsulta;
};

/**
 * Cria uma consulta de emergência
 */
export const criarConsultaEmergencia = async (dados: {
  profissionalId: string;
  profissionalNome: string;
  profissionalSobrenome: string;
  pacienteId: string;
  pacienteNome: string;
  pacienteSobrenome: string;
  procedimentosRealizados: string[];
  materiaisUtilizados: string[];
  equipamentosUtilizados: string[];
  examesSolicitados: string[];
  observacoes?: string;
  horarioInicio: string;
  data: string;
}): Promise<TConsulta> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Buscar paciente para determinar tipo de pagamento
  const { fetchPacienteById } = await import("./pacientes");
  const paciente = await fetchPacienteById(dados.pacienteId);
  const tipoPagamento: TipoPagamento = paciente?.tem_plano_saude
    ? "convenio"
    : "particular";
  const convenio = paciente?.name_plano_saude;

  // Criar consulta de emergência
  const consulta: Omit<TConsulta, "id" | "criadoEm" | "atualizadoEm"> = {
    agendamentoId: `emergencia-${uuidv4()}`, // ID fictício de agendamento
    profissionalId: dados.profissionalId,
    profissionalNome: dados.profissionalNome,
    profissionalSobrenome: dados.profissionalSobrenome,
    pacienteId: dados.pacienteId,
    pacienteNome: dados.pacienteNome,
    pacienteSobrenome: dados.pacienteSobrenome,
    data: dados.data,
    horario: dados.horarioInicio,
    horarioInicio: dados.horarioInicio,
    horarioFim: undefined, // Horário de fim será definido quando a consulta for finalizada
    procedimentoPrincipal:
      dados.procedimentosRealizados[0] || "Consulta de Emergência",
    procedimentosRealizados: dados.procedimentosRealizados,
    materiaisUtilizados: dados.materiaisUtilizados,
    equipamentosUtilizados: dados.equipamentosUtilizados,
    examesSolicitados: dados.examesSolicitados,
    observacoes: dados.observacoes,
    status: "em_andamento", // Consulta de emergência começa em andamento
    tipoPagamento,
    convenio,
  };

  return criarConsulta(consulta);
};

/**
 * Garante que existe uma consulta de demonstração sempre ativa
 * Esta função é chamada na inicialização do sistema
 */
export const garantirConsultaDemonstracao = async (): Promise<void> => {
  const consultas = storage.get<TConsulta[]>(STORAGE_KEYS.CONSULTAS, []);

  // Verificar se já existe uma consulta de demonstração ativa (agendada ou em_andamento) para hoje
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = (agora.getMonth() + 1).toString().padStart(2, "0");
  const dia = agora.getDate().toString().padStart(2, "0");
  const hoje = `${ano}-${mes}-${dia}`;

  const consultaDemonstracao = consultas.find(
    (c) =>
      c.id === "consulta-demonstracao" &&
      (c.status === "agendada" || c.status === "em_andamento") &&
      c.data === hoje
  );

  if (consultaDemonstracao) {
    console.log("✅ Consulta de demonstração já existe");
    return;
  }

  // Remover consultas de demonstração antigas
  const consultasSemDemonstracao = consultas.filter(
    (c) => c.id !== "consulta-demonstracao"
  );

  // Buscar profissionais e pacientes
  const { fetchProfissionais } = await import("./profissionais");
  const { fetchPacientes } = await import("./pacientes");
  const profissionais = await fetchProfissionais();
  const pacientes = await fetchPacientes();

  if (profissionais.length === 0 || pacientes.length === 0) {
    console.warn(
      "⚠️ Não há profissionais ou pacientes para criar consulta de demonstração"
    );
    return;
  }

  // Selecionar profissional e paciente aleatórios
  const profissional =
    profissionais[Math.floor(Math.random() * profissionais.length)];
  const paciente = pacientes[Math.floor(Math.random() * pacientes.length)];

  // Criar consulta de demonstração para hoje, horário próximo ao atual
  const horas = agora.getHours();
  const minutos = agora.getMinutes();
  const horarioInicio = `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}`;

  const consultaDemonstracaoNova: TConsulta = {
    id: "consulta-demonstracao",
    agendamentoId: "agendamento-demonstracao",
    profissionalId: profissional.id,
    profissionalNome: profissional.nome,
    profissionalSobrenome: profissional.sobrenome,
    pacienteId: paciente.id,
    pacienteNome: paciente.nome,
    pacienteSobrenome: paciente.sobrenome,
    data: hoje,
    horario: horarioInicio,
    horarioInicio: undefined, // Ainda não iniciada
    horarioFim: undefined,
    procedimentoPrincipal: "Consulta de Rotina",
    procedimentosRealizados: ["Consulta de Rotina"],
    materiaisUtilizados: [],
    equipamentosUtilizados: [],
    examesSolicitados: [],
    observacoes: "Consulta de demonstração - Sistema Smilink",
    status: "agendada", // Status inicial: agendada (prestes a começar)
    tipoPagamento: paciente.tem_plano_saude ? "convenio" : "particular",
    convenio: paciente.name_plano_saude,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };

  consultasSemDemonstracao.push(consultaDemonstracaoNova);
  storage.set(STORAGE_KEYS.CONSULTAS, consultasSemDemonstracao);

  console.log("✅ Consulta de demonstração criada:", consultaDemonstracaoNova);
};

/**
 * Atualiza uma consulta
 */
export const atualizarConsulta = async (
  id: string,
  dados: Partial<TConsulta>
): Promise<TConsulta | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const consultas = storage.get<TConsulta[]>(STORAGE_KEYS.CONSULTAS, []);

  const index = consultas.findIndex((c) => c.id === id);
  if (index === -1) return null;

  consultas[index] = {
    ...consultas[index],
    ...dados,
    atualizadoEm: new Date().toISOString(),
  };

  storage.set(STORAGE_KEYS.CONSULTAS, consultas);

  return consultas[index];
};

/**
 * Inicia uma consulta (muda status e salva horário de início)
 */
export const iniciarConsulta = async (
  id: string,
  horarioInicio: string
): Promise<TConsulta | null> => {
  return atualizarConsulta(id, {
    status: "em_andamento",
    horarioInicio,
  });
};

/**
 * Finaliza uma consulta
 */
export const finalizarConsulta = async (
  id: string,
  dados: {
    procedimentosRealizados?: string[];
    materiaisUtilizados?: string[];
    equipamentosUtilizados?: string[];
    examesSolicitados?: string[];
    observacoes?: string;
    horarioFim: string;
  }
): Promise<TConsulta | null> => {
  const agora = new Date().toISOString();
  const consultaAtualizada = await atualizarConsulta(id, {
    status: "finalizada",
    finalizadoEm: agora,
    ...dados,
  });

  // Atualizar status do agendamento para finalizado
  if (consultaAtualizada) {
    const { atualizarAgendamento } = await import("./agendamentos");
    await atualizarAgendamento(consultaAtualizada.agendamentoId, {
      status: "finalizado",
    });

    // Atualizar última consulta do paciente
    const { fetchPacienteById, atualizarPaciente } = await import(
      "./pacientes"
    );
    const paciente = await fetchPacienteById(consultaAtualizada.pacienteId);
    if (paciente) {
      await atualizarPaciente(consultaAtualizada.pacienteId, {
        ultimaConsulta: agora,
      });
    }
  }

  return consultaAtualizada;
};

/**
 * Adiciona observação profissional a uma consulta finalizada
 */
export const adicionarObservacaoProfissional = async (
  id: string,
  observacoes: string
): Promise<TConsulta | null> => {
  return atualizarConsulta(id, {
    observacoesProfissionais: observacoes,
  });
};

// Mock inicial de consultas (será gerado a partir de agendamentos)
export const MOCK_CONSULTAS: TConsulta[] = [];
