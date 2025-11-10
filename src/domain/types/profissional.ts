export type TProfissional = {
  id: string;
  nome: string;
  sobrenome: string;
  apelido: string;
  email: string;
  cpf: string;
  celular: string;
  dataNascimento: string;
  fotoPerfil: string;
  role: "profissional";
  arquivado?: boolean;
  // Dados específicos de profissional
  especialidades: string[];
  bio: string;
  registro?: string; // CRO (Conselho Regional de Odontologia)
  crm?: string; // CRM (Conselho Regional de Medicina) - para médicos/dentistas
  // Dados pessoais
  telefone: string;
  data_nascimento: string;
  CPF: string;
  // Endereço
  cep: string;
  street: string;
  number: string;
  complemento?: string;
  neigborhood: string;
  city: string;
  state: string;
};
