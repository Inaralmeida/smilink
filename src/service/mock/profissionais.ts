import type { TProfissional } from "../../domain/types/profissional";
import { MOCK_USER } from "./user";

// Lista de especialidades odontológicas
const especialidades = [
  "Clínica Geral",
  "Ortodontia",
  "Implantodontia",
  "Endodontia",
  "Periodontia",
  "Prótese Dentária",
  "Odontopediatria",
  "Cirurgia Oral",
  "Estética Dental",
  "Radiologia Odontológica",
  "Dentística",
  "Odontologia Hospitalar",
  "Harmonização Orofacial",
  "Ortopedia Funcional dos Maxilares",
];

// Lista de biografias odontológicas
const biografias = [
  "Cirurgião-dentista com mais de 10 anos de experiência em clínica geral. Especializado em tratamentos restauradores e prevenção odontológica. Atende pacientes de todas as idades com foco em saúde bucal integral.",
  "Formado em Odontologia pela USP, com especialização em Ortodontia. Experiente em tratamentos com aparelhos fixos e móveis, alinhadores transparentes e correção de má oclusão em crianças e adultos.",
  "Especialista em Implantodontia com mais de 8 anos de experiência. Realiza implantes dentários, enxertos ósseos e reabilitações orais completas. Certificado pela Associação Brasileira de Odontologia.",
  "Endodontista com formação pela UNIFESP. Especialista em tratamento de canal, retratamentos endodônticos e traumatismo dental. Atende casos complexos com técnica de ponta.",
  "Periodontista com experiência em tratamento de doenças gengivais, cirurgias periodontais e enxertos gengivais. Trabalha com técnicas minimamente invasivas para recuperação da saúde periodontal.",
  "Protético dentário especializado em próteses fixas e móveis, coroas cerâmicas e reabilitações estéticas. Mais de 12 anos de experiência em laboratório e clínica.",
  "Odontopediatra com formação voltada para atendimento infantil. Especialista em prevenção, tratamento de cáries em crianças e orientação de higiene bucal. Ambiente acolhedor para os pequenos pacientes.",
  "Cirurgião oral e bucomaxilofacial com experiência em extrações, cirurgias de terceiros molares, apicectomias e procedimentos cirúrgicos complexos. Certificado pelo Conselho Regional de Odontologia.",
];

// Lista de cidades e estados brasileiros
const cidadesEstados = [
  { city: "São Paulo", state: "SP" },
  { city: "Rio de Janeiro", state: "RJ" },
  { city: "Belo Horizonte", state: "MG" },
  { city: "Brasília", state: "DF" },
  { city: "Salvador", state: "BA" },
  { city: "Curitiba", state: "PR" },
  { city: "Recife", state: "PE" },
  { city: "Porto Alegre", state: "RS" },
  { city: "Fortaleza", state: "CE" },
  { city: "Campinas", state: "SP" },
];

// Função para gerar CEP aleatório
const gerarCEP = (): string => {
  const numeros = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return numeros;
};

// Função para gerar registro profissional aleatório
const gerarRegistro = (): string => {
  const numeros = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return `${numeros}`;
};

// Função para gerar CRM aleatório (formato: CRM-SP 123456)
const gerarCRM = (): string => {
  const uf = ["SP", "RJ", "MG", "PR", "RS", "SC", "BA", "DF"][
    Math.floor(Math.random() * 8)
  ];
  const numeros = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return `CRM-${uf} ${numeros}`;
};

// Função para gerar telefone de SP (celular) no formato 119xxxx-xxxx
const gerarTelefoneSP = (): string => {
  const ddd = "11"; // DDD de São Paulo
  const prefixo = "9"; // Celular sempre começa com 9
  const numero = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return `${ddd}${prefixo}${numero}`;
};

// Converter MOCK_USER profissionais para TProfissional
const converterUsuariosParaProfissionais = (): TProfissional[] => {
  const usuariosProfissionais = MOCK_USER.filter(
    (user) => user.role === "profissional"
  );

  return usuariosProfissionais.map((user) => {
    const cidadeEstado =
      cidadesEstados[Math.floor(Math.random() * cidadesEstados.length)];
    const cep = gerarCEP();
    const numEspecialidades = Math.floor(Math.random() * 3) + 1; // 1 a 3 especialidades
    const especialidadesSelecionadas = especialidades
      .sort(() => Math.random() - 0.5)
      .slice(0, numEspecialidades);
    const bio = biografias[Math.floor(Math.random() * biografias.length)];

    // CRO (Conselho Regional de Odontologia) - obrigatório para todos os dentistas
    const cro = gerarRegistro();

    // CRM (Conselho Regional de Medicina) - para dentistas também
    const crm = gerarCRM();

    // Ajustar email para @smilink
    const emailBase = user.email.split("@")[0];
    const emailProfissional = `${emailBase}@smilink.com`;

    // Gerar telefone de SP
    const telefoneSP = gerarTelefoneSP();

    const profissional: TProfissional = {
      id: user.id,
      nome: user.nome,
      sobrenome: user.sobrenome,
      apelido: user.apelido,
      email: emailProfissional,
      cpf: user.cpf,
      celular: telefoneSP,
      dataNascimento: user.dataNascimento,
      fotoPerfil: user.fotoPerfil,
      role: "profissional",
      arquivado: false,
      especialidades: especialidadesSelecionadas,
      bio,
      registro: cro, // CRO para odontologia
      crm: crm, // CRM para dentistas
      telefone: telefoneSP,
      data_nascimento: user.dataNascimento.split("T")[0],
      CPF: user.cpf,
      cep,
      street: `Rua ${user.nome} ${user.sobrenome}`,
      number: Math.floor(Math.random() * 9999).toString(),
      complemento:
        Math.random() > 0.5 ? "Apto " + Math.floor(Math.random() * 200) : "",
      neigborhood: `Bairro ${user.sobrenome}`,
      city: cidadeEstado.city,
      state: cidadeEstado.state,
    };

    return profissional;
  });
};

// Exportar todos os profissionais
export const MOCK_PROFISSIONAIS: TProfissional[] =
  converterUsuariosParaProfissionais();

// Log para debug: verificar se Inara está na lista
if (typeof window !== "undefined") {
  const inaraProf = MOCK_PROFISSIONAIS.find(
    (p) => p.id === "inara-profissional-001"
  );
  console.log(
    "🔍 [MOCK_PROFISSIONAIS] Profissional Inara encontrado:",
    inaraProf ? "SIM" : "NÃO"
  );
  console.log(
    "🔍 [MOCK_PROFISSIONAIS] Total de profissionais:",
    MOCK_PROFISSIONAIS.length
  );
  console.log(
    "🔍 [MOCK_PROFISSIONAIS] IDs dos profissionais:",
    MOCK_PROFISSIONAIS.map((p) => p.id)
  );
}

// Função para buscar profissionais (simula API)
export const fetchProfissionais = async (): Promise<TProfissional[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const profissionais = storage.get<TProfissional[]>(
    STORAGE_KEYS.PROFISSIONAIS,
    MOCK_PROFISSIONAIS
  );
  return profissionais.filter((p) => !p.arquivado).slice(0, 10);
};

// Função para buscar profissional por ID
export const fetchProfissionalById = async (
  id: string
): Promise<TProfissional | null> => {
  console.log("🔍 [fetchProfissionalById] Buscando profissional com ID:", id);
  await new Promise((resolve) => setTimeout(resolve, 300));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const profissionaisStorage = storage.get<TProfissional[]>(
    STORAGE_KEYS.PROFISSIONAIS,
    []
  );

  // Combinar profissionais do storage com MOCK_PROFISSIONAIS para garantir que todos estejam disponíveis
  const todosProfissionais = [...profissionaisStorage];
  MOCK_PROFISSIONAIS.forEach((prof) => {
    if (!todosProfissionais.find((p) => p.id === prof.id)) {
      todosProfissionais.push(prof);
    }
  });

  console.log(
    "🔍 [fetchProfissionalById] Total de profissionais no storage:",
    profissionaisStorage.length
  );
  console.log(
    "🔍 [fetchProfissionalById] Total de profissionais (com MOCK):",
    todosProfissionais.length
  );
  console.log(
    "🔍 [fetchProfissionalById] IDs disponíveis:",
    todosProfissionais.map((p) => p.id)
  );

  const profissionalEncontrado =
    todosProfissionais.find((p) => p.id === id) || null;
  console.log(
    "🔍 [fetchProfissionalById] Profissional encontrado:",
    profissionalEncontrado
      ? `${profissionalEncontrado.nome} ${profissionalEncontrado.sobrenome}`
      : "null"
  );

  // Se encontrou no MOCK mas não no storage, salvar no storage para próxima vez
  if (
    profissionalEncontrado &&
    !profissionaisStorage.find((p) => p.id === id)
  ) {
    console.log(
      "🔍 [fetchProfissionalById] Profissional encontrado no MOCK, salvando no storage..."
    );
    profissionaisStorage.push(profissionalEncontrado);
    storage.set(STORAGE_KEYS.PROFISSIONAIS, profissionaisStorage);
  }

  return profissionalEncontrado;
};

// Função para criar profissional
export const criarProfissional = async (
  profissional: Omit<TProfissional, "id">
): Promise<TProfissional> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const profissionais = storage.get<TProfissional[]>(
    STORAGE_KEYS.PROFISSIONAIS,
    MOCK_PROFISSIONAIS
  );

  const novoProfissional: TProfissional = {
    ...profissional,
    id: `profissional-${Date.now()}`,
    arquivado: false,
  };

  profissionais.push(novoProfissional);
  storage.set(STORAGE_KEYS.PROFISSIONAIS, profissionais);

  return novoProfissional;
};

// Função para atualizar profissional
export const atualizarProfissional = async (
  id: string,
  dados: Partial<TProfissional>
): Promise<TProfissional | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const profissionais = storage.get<TProfissional[]>(
    STORAGE_KEYS.PROFISSIONAIS,
    MOCK_PROFISSIONAIS
  );

  const index = profissionais.findIndex((p) => p.id === id);
  if (index === -1) return null;

  profissionais[index] = {
    ...profissionais[index],
    ...dados,
  };

  storage.set(STORAGE_KEYS.PROFISSIONAIS, profissionais);

  return profissionais[index];
};

// Função para arquivar profissional
export const arquivarProfissional = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const profissionais = storage.get<TProfissional[]>(
    STORAGE_KEYS.PROFISSIONAIS,
    MOCK_PROFISSIONAIS
  );

  const profissional = profissionais.find((p) => p.id === id);
  if (profissional) {
    profissional.arquivado = true;
    storage.set(STORAGE_KEYS.PROFISSIONAIS, profissionais);
  }
};
