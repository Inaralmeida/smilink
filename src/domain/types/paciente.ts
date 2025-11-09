export type TPaciente = {
  id: string;
  nome: string;
  sobrenome: string;
  apelido: string;
  email: string;
  cpf: string;
  celular: string;
  dataNascimento: string;
  fotoPerfil: string;
  role: "paciente";
  arquivado?: boolean;
  // Dados pessoais
  name: string;
  telefone: string;
  data_nascimento: string;
  CPF: string;
  tem_plano_saude: boolean;
  // Responsável (para menores de idade)
  name_responsible?: string;
  cpf_responsible?: string;
  grau_parentesco?: string;
  tel_responsible?: string;
  // Endereço
  cep: string;
  street: string;
  number: string;
  complemento: string;
  neigborhood: string;
  city: string;
  state: string;
  // Plano de saúde
  name_plano_saude?: string;
  numero_careteirinha?: string;
};
