import type { TRole } from "../../domain/types/typeRoles";
import type { TUserProps } from "../../domain/types/users";

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setUser = (user: TUserProps) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem("user");
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? token : null;
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const clearToken = () => {
  localStorage.removeItem("token");
};

export const setRole = (role: TRole) => {
  localStorage.setItem("role", role);
};

export const getRole = (): TRole => {
  const role = localStorage.getItem("role")
    ? localStorage.getItem("role")
    : "paciente";
  return role as TRole;
};
