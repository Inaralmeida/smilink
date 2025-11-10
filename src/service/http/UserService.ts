import type { TResponseLogin } from "../../domain/types/ResponseLogin";
import { MOCK_USER } from "../mock/user";
import { setUser } from "./storage";

export class UserService {
  constructor() {}
  login(email: string, password: string): TResponseLogin {
    const user = MOCK_USER.find((user) => user.email === email);
    if (!user) {
      return {
        type: "email",
        message: "email não encontrado",
      };
    } else if (user && user.senha !== password) {
      return {
        type: "password",
        message: "Senha inválida",
      };
    } else {
      setUser(user);
      return {
        type: "success",
        message: "Logado com sucesso",
        user,
      };
    }
  }
}
