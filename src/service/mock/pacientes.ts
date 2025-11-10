import type { TPaciente } from "../../domain/types/paciente";
import { MOCK_USER } from "./user";

// Função para gerar CPF aleatório válido (apenas formato)
const gerarCPF = (): string => {
  const numeros = Array.from({ length: 11 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return numeros;
};

// Função para gerar CEP aleatório
const gerarCEP = (): string => {
  const numeros = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return numeros;
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

// Função para calcular idade
const calcularIdade = (dataNascimento: string): number => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
};

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

// Lista de planos de saúde
const planosSaude = [
  "Unimed",
  "Amil",
  "SulAmérica",
  "Bradesco Saúde",
  "NotreDame Intermédica",
  "Hapvida",
  "São Francisco",
  "Prevent Senior",
];

// Lista de graus de parentesco
const grausParentesco = [
  "Pai",
  "Mãe",
  "Avô",
  "Avó",
  "Tio",
  "Tia",
  "Irmão",
  "Irmã",
  "Tutor",
];

// Função para gerar data de nascimento aleatória
const gerarDataNascimento = (minIdade = 5, maxIdade = 80): string => {
  const hoje = new Date();
  const anoMin = hoje.getFullYear() - maxIdade;
  const anoMax = hoje.getFullYear() - minIdade;
  const ano = Math.floor(Math.random() * (anoMax - anoMin + 1)) + anoMin;
  const mes = Math.floor(Math.random() * 12);
  const dia = Math.floor(Math.random() * 28) + 1;
  return new Date(ano, mes, dia).toISOString();
};

// Gerar pacientes adicionais
const gerarPacientesAdicionais = (): TPaciente[] => {
  const nomes = [
    "Ana",
    "Bruno",
    "Carlos",
    "Diana",
    "Eduardo",
    "Fernanda",
    "Gabriel",
    "Helena",
    "Igor",
    "Julia",
    "Kleber",
    "Larissa",
    "Marcos",
    "Natália",
    "Otávio",
    "Patrícia",
    "Rafael",
    "Sandra",
    "Thiago",
    "Vanessa",
    "Wagner",
    "Yara",
    "Zeca",
    "Alice",
    "Bernardo",
    "Camila",
    "Daniel",
    "Elisa",
    "Fábio",
    "Gisele",
    "Henrique",
    "Isabela",
    "João",
    "Karina",
    "Leonardo",
    "Mariana",
    "Nicolas",
    "Olívia",
    "Pedro",
    "Renata",
  ];

  const sobrenomes = [
    "Silva",
    "Santos",
    "Oliveira",
    "Souza",
    "Rodrigues",
    "Ferreira",
    "Alves",
    "Pereira",
    "Lima",
    "Gomes",
    "Ribeiro",
    "Carvalho",
    "Almeida",
    "Lopes",
    "Soares",
    "Fernandes",
    "Vieira",
    "Barbosa",
    "Rocha",
    "Dias",
    "Monteiro",
    "Mendes",
    "Cardoso",
    "Reis",
    "Araújo",
    "Costa",
    "Ramos",
    "Martins",
    "Teixeira",
    "Freitas",
  ];

  const pacientes: TPaciente[] = [];

  for (let i = 0; i < 50; i++) {
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    const dataNascimento = gerarDataNascimento();
    const idade = calcularIdade(dataNascimento);
    const isMenor = idade < 18;
    const temPlano = Math.random() > 0.3; // 70% têm plano
    const cidadeEstado =
      cidadesEstados[Math.floor(Math.random() * cidadesEstados.length)];
    const cep = gerarCEP();

    // Email com @gmail.com
    const emailPaciente = `${nome.toLowerCase()}.${sobrenome.toLowerCase()}@gmail.com`;

    // Gerar telefone de SP
    const telefoneSP = gerarTelefoneSP();

    const paciente: TPaciente = {
      id: `paciente-${i + 100}`,
      nome,
      sobrenome,
      apelido: `${nome.toLowerCase()}.${sobrenome.toLowerCase()}`,
      email: emailPaciente,
      cpf: gerarCPF(),
      celular: telefoneSP,
      dataNascimento,
      fotoPerfil: `https://randomuser.me/api/portraits/${
        Math.random() > 0.5 ? "men" : "women"
      }/${Math.floor(Math.random() * 99)}.jpg`,
      role: "paciente",
      arquivado: false,
      // Dados pessoais
      name: `${nome} ${sobrenome}`,
      telefone: telefoneSP,
      data_nascimento: dataNascimento.split("T")[0],
      CPF: gerarCPF(),
      tem_plano_saude: temPlano,
      // Endereço
      cep,
      street: `Rua ${nome} ${sobrenome}`,
      number: Math.floor(Math.random() * 9999).toString(),
      complemento:
        Math.random() > 0.5 ? "Apto " + Math.floor(Math.random() * 200) : "",
      neigborhood: `Bairro ${sobrenome}`,
      city: cidadeEstado.city,
      state: cidadeEstado.state,
    };

    // Responsável (se menor de idade)
    if (isMenor) {
      const responsavelNome = nomes[Math.floor(Math.random() * nomes.length)];
      paciente.name_responsible = `${responsavelNome} ${sobrenome}`;
      paciente.cpf_responsible = gerarCPF();
      paciente.grau_parentesco =
        grausParentesco[Math.floor(Math.random() * grausParentesco.length)];
      paciente.tel_responsible = gerarTelefoneSP();
    }

    // Plano de saúde (se tem plano)
    if (temPlano) {
      paciente.name_plano_saude =
        planosSaude[Math.floor(Math.random() * planosSaude.length)];
      paciente.numero_careteirinha = Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * 10)
      ).join("");
    }

    pacientes.push(paciente);
  }

  return pacientes;
};

// Converter MOCK_USER pacientes para TPaciente
const converterUsuariosParaPacientes = (): TPaciente[] => {
  const usuariosPacientes = MOCK_USER.filter(
    (user) => user.role === "paciente"
  );

  return usuariosPacientes.map((user) => {
    const idade = calcularIdade(user.dataNascimento);
    const isMenor = idade < 18;
    const temPlano = Math.random() > 0.4; // Alguns têm plano
    const cidadeEstado =
      cidadesEstados[Math.floor(Math.random() * cidadesEstados.length)];
    const cep = gerarCEP();

    // Ajustar email para @gmail.com
    const emailBase = user.email.split("@")[0];
    const emailPaciente = `${emailBase}@gmail.com`;

    // Gerar telefone de SP
    const telefoneSP = gerarTelefoneSP();

    const paciente: TPaciente = {
      id: user.id,
      nome: user.nome,
      sobrenome: user.sobrenome,
      apelido: user.apelido,
      email: emailPaciente,
      cpf: user.cpf,
      celular: telefoneSP,
      dataNascimento: user.dataNascimento,
      fotoPerfil: user.fotoPerfil,
      role: "paciente",
      arquivado: false,
      // Dados pessoais
      name: `${user.nome} ${user.sobrenome}`,
      telefone: telefoneSP,
      data_nascimento: user.dataNascimento.split("T")[0],
      CPF: user.cpf,
      tem_plano_saude: temPlano,
      // Endereço
      cep,
      street: `Rua ${user.nome} ${user.sobrenome}`,
      number: Math.floor(Math.random() * 9999).toString(),
      complemento:
        Math.random() > 0.5 ? "Apto " + Math.floor(Math.random() * 200) : "",
      neigborhood: `Bairro ${user.sobrenome}`,
      city: cidadeEstado.city,
      state: cidadeEstado.state,
    };

    // Responsável (se menor de idade)
    if (isMenor) {
      paciente.name_responsible = `Responsável ${user.sobrenome}`;
      paciente.cpf_responsible = gerarCPF();
      paciente.grau_parentesco =
        grausParentesco[Math.floor(Math.random() * grausParentesco.length)];
      paciente.tel_responsible = gerarTelefoneSP();
    }

    // Plano de saúde (se tem plano)
    if (temPlano) {
      paciente.name_plano_saude =
        planosSaude[Math.floor(Math.random() * planosSaude.length)];
      paciente.numero_careteirinha = Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * 10)
      ).join("");
    }

    return paciente;
  });
};

// Exportar todos os pacientes
export const MOCK_PACIENTES: TPaciente[] = [
  ...converterUsuariosParaPacientes(),
  ...gerarPacientesAdicionais(),
];

// Função para buscar pacientes (simula API)
export const fetchPacientes = async (): Promise<TPaciente[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const pacientes = storage.get<TPaciente[]>(
    STORAGE_KEYS.PACIENTES,
    MOCK_PACIENTES
  );
  return pacientes.filter((p) => !p.arquivado);
};

// Função para buscar paciente por ID
export const fetchPacienteById = async (
  id: string
): Promise<TPaciente | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const pacientes = storage.get<TPaciente[]>(
    STORAGE_KEYS.PACIENTES,
    MOCK_PACIENTES
  );
  return pacientes.find((p) => p.id === id) || null;
};

// Função para atualizar paciente
export const atualizarPaciente = async (
  id: string,
  dados: Partial<TPaciente>
): Promise<TPaciente | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const pacientes = storage.get<TPaciente[]>(
    STORAGE_KEYS.PACIENTES,
    MOCK_PACIENTES
  );

  const index = pacientes.findIndex((p) => p.id === id);
  if (index === -1) return null;

  pacientes[index] = {
    ...pacientes[index],
    ...dados,
  };

  storage.set(STORAGE_KEYS.PACIENTES, pacientes);

  return pacientes[index];
};

// Função para arquivar paciente
export const arquivarPaciente = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const { storage, STORAGE_KEYS } = await import(
    "../../shared/utils/localStorage"
  );
  const pacientes = storage.get<TPaciente[]>(
    STORAGE_KEYS.PACIENTES,
    MOCK_PACIENTES
  );

  const paciente = pacientes.find((p) => p.id === id);
  if (paciente) {
    paciente.arquivado = true;
    storage.set(STORAGE_KEYS.PACIENTES, pacientes);
  }
};
