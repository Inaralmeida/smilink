import type { TUserProps } from "../../domain/types/users";
import { MOCK_USER } from "../mock/user";
const USER_STORAGE_KEY = "smilink_user";

export const mockLogin = (role: "admin" | "paciente" = "admin") => {
  const userToLogin = MOCK_USER.find((user) => user.role === role);
  if (userToLogin) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToLogin));
    console.log(`Usuário '${userToLogin.nome}' logado como ${role}.`);
  }
};

export const getUser = (): TUserProps | null => {
  const userString = localStorage.getItem(USER_STORAGE_KEY);
  if (!userString) {
    mockLogin("admin");
    return getUser();
  }
  try {
    return JSON.parse(userString) as TUserProps;
  } catch (error) {
    console.error("Falha ao parsear usuário do localStorage", error);
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};
