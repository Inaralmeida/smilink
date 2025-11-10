import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../application/context/AuthContext";
import type { TPaciente } from "../../../domain/types/paciente";
import type { TProfissional } from "../../../domain/types/profissional";
import {
  fetchPacienteById,
  atualizarPaciente,
} from "../../../service/mock/pacientes";
import {
  fetchProfissionalById,
  atualizarProfissional,
} from "../../../service/mock/profissionais";
import { setUser, getUser } from "../../../service/http/storage";
import type { TUserProps } from "../../../domain/types/users";

export const usePerfil = () => {
  const { user: userAuth } = useAuth();
  const [perfil, setPerfil] = useState<TPaciente | TProfissional | null>(null);
  const [user, setUserState] = useState<TUserProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarPerfil = useCallback(async () => {
    if (!userAuth?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Buscar usuário atual do localStorage
      const userStorage = getUser();
      setUserState(userStorage);

      // Buscar dados completos baseado no role
      if (userAuth.role === "paciente") {
        const paciente = await fetchPacienteById(userAuth.id);
        if (paciente) {
          setPerfil(paciente);
        } else {
          setError("Paciente não encontrado");
        }
      } else if (userAuth.role === "profissional") {
        const profissional = await fetchProfissionalById(userAuth.id);
        if (profissional) {
          setPerfil(profissional);
        } else {
          setError("Profissional não encontrado");
        }
      } else if (userAuth.role === "admin") {
        // Admin não tem perfil completo, usar apenas dados do user
        setPerfil(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }, [userAuth]);

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

  const atualizarPerfil = useCallback(
    async (dados: Partial<TPaciente> | Partial<TProfissional>) => {
      if (!userAuth?.id || !perfil) {
        throw new Error("Usuário não encontrado");
      }

      try {
        setError(null);

        if (userAuth.role === "paciente") {
          const pacienteAtualizado = await atualizarPaciente(
            userAuth.id,
            dados as Partial<TPaciente>
          );
          setPerfil(pacienteAtualizado);

          // Atualizar também o user no localStorage se necessário
          if (user) {
            const userAtualizado: TUserProps = {
              ...user,
              nome: dados.nome || user.nome,
              sobrenome: dados.sobrenome || user.sobrenome,
              fotoPerfil: dados.fotoPerfil || user.fotoPerfil,
            };
            setUser(userAtualizado);
            setUserState(userAtualizado);
          }
        } else if (userAuth.role === "profissional") {
          const profissionalAtualizado = await atualizarProfissional(
            userAuth.id,
            dados as Partial<TProfissional>
          );
          setPerfil(profissionalAtualizado);

          // Atualizar também o user no localStorage se necessário
          if (user) {
            const userAtualizado: TUserProps = {
              ...user,
              nome: dados.nome || user.nome,
              sobrenome: dados.sobrenome || user.sobrenome,
              fotoPerfil: dados.fotoPerfil || user.fotoPerfil,
            };
            setUser(userAtualizado);
            setUserState(userAtualizado);
          }
        }

        // Recarregar perfil para garantir dados atualizados
        await carregarPerfil();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao atualizar perfil";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [userAuth, perfil, user, carregarPerfil]
  );

  const atualizarSenha = useCallback(
    async (novaSenha: string) => {
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      try {
        setError(null);

        // Atualizar senha no user
        const userAtualizado: TUserProps = {
          ...user,
          senha: novaSenha,
        };
        setUser(userAtualizado);
        setUserState(userAtualizado);

        // Se houver perfil (paciente ou profissional), também atualizar lá
        if (perfil && userAuth?.role === "paciente") {
          await atualizarPaciente(userAuth.id, {
            // Paciente não tem campo senha, então não precisamos atualizar
          } as Partial<TPaciente>);
        } else if (perfil && userAuth?.role === "profissional") {
          await atualizarProfissional(userAuth.id, {
            // Profissional não tem campo senha, então não precisamos atualizar
          } as Partial<TProfissional>);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao atualizar senha";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user, perfil, userAuth]
  );

  return {
    perfil,
    user,
    loading,
    error,
    carregarPerfil,
    atualizarPerfil,
    atualizarSenha,
  };
};
