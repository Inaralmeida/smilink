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

// Função para buscar profissionais (simula API)
export const fetchProfissionais = async (): Promise<TProfissional[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_PROFISSIONAIS.filter((p) => !p.arquivado).slice(0, 10);
};

// Função para buscar profissional por ID
export const fetchProfissionalById = async (
  id: string
): Promise<TProfissional | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_PROFISSIONAIS.find((p) => p.id === id) || null;
};

// Função para criar profissional
export const criarProfissional = async (
  profissional: Omit<TProfissional, "id">
): Promise<TProfissional> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const novoProfissional: TProfissional = {
    ...profissional,
    id: `profissional-${Date.now()}`,
    arquivado: false,
  };
  MOCK_PROFISSIONAIS.push(novoProfissional);
  return novoProfissional;
};

// Função para atualizar profissional
export const atualizarProfissional = async (
  id: string,
  dados: Partial<TProfissional>
): Promise<TProfissional | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = MOCK_PROFISSIONAIS.findIndex((p) => p.id === id);
  if (index === -1) return null;

  MOCK_PROFISSIONAIS[index] = {
    ...MOCK_PROFISSIONAIS[index],
    ...dados,
  };

  return MOCK_PROFISSIONAIS[index];
};

// Função para arquivar profissional
export const arquivarProfissional = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const profissional = MOCK_PROFISSIONAIS.find((p) => p.id === id);
  if (profissional) {
    profissional.arquivado = true;
  }
};
