import type { TRole } from "./typeRoles";

export type TUserProps = {
  id: string;
  nome: string;
  sobrenome: string;
  apelido: string;
  email: string;
  cpf: string;
  senha: string;
  celular: string;
  dataNascimento: string; // ISO string
  fotoPerfil: string;
  role: TRole;
  _raw?: {
    nat?: string;
    registered?: {
      date: string;
      age: number;
    };
  };
};
