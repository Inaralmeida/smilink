/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../domain/constants/Routes";
import type { TResponseLogin } from "../../domain/types/ResponseLogin";
import { setRole, setToken } from "../../service/http/storage";
import { UserService } from "../../service/http/UserService";
import { useAuth } from "../context/AuthContext";

interface TLoginForm {
  email: string;
  password: string;
}

const useLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { generateToken, updateUser } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TLoginForm>();

  const handleLogin = (data: any) => {
    const { email, password } = data;

    setLoading(true);
    const user = new UserService();
    const response: TResponseLogin = user.login(email, password);

    if (response.type !== "success") {
      setError(response.type, { message: response.message });
      setLoading(false);
    } else {
      const token = generateToken();
      setToken(token);
      setRole(response.user?.role || "paciente");
      if (!token) {
        setLoading(false);
        return;
      }
      // Atualizar o usuário no contexto após salvar no localStorage
      // Isso também atualiza isAuth para true
      updateUser();
      // Usar setTimeout para garantir que o React processe a atualização do estado
      // antes da navegação
      setTimeout(() => {
        navigate(`${ROUTES.home}/${response.user?.role}`);
        clearErrors();
        setLoading(false);
      }, 0);
    }
  };

  const onSubmit = handleSubmit(handleLogin);
  return {
    onSubmit,
    loading,
    register,
    control,
    errors,
  };
};

export default useLogin;
