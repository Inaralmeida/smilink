import { useState, useEffect, useCallback } from "react";
import type { TAgendamento } from "../../../domain/types/agendamento";
import {
  fetchAgendamentos,
  criarAgendamento,
  atualizarAgendamento,
  cancelarAgendamento,
  iniciarAtendimento,
  finalizarAtendimento,
} from "../../../service/mock/agendamentos";

export const useAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState<TAgendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarAgendamentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await fetchAgendamentos();
      setAgendamentos(dados);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar agendamentos"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarAgendamentos();
  }, [carregarAgendamentos]);

  const criar = useCallback(
    async (dados: Omit<TAgendamento, "id" | "criadoEm" | "atualizadoEm">) => {
      setLoading(true);
      setError(null);
      try {
        const novo = await criarAgendamento(dados);
        setAgendamentos((prev) => [...prev, novo]);
        return novo;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao criar agendamento";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const atualizar = useCallback(
    async (id: string, dados: Partial<TAgendamento>) => {
      setLoading(true);
      setError(null);
      try {
        const atualizado = await atualizarAgendamento(id, dados);
        if (atualizado) {
          setAgendamentos((prev) =>
            prev.map((a) => (a.id === id ? atualizado : a))
          );
        }
        return atualizado;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao atualizar agendamento";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const cancelar = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await cancelarAgendamento(id);
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "cancelado" } : a))
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao cancelar agendamento";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const iniciar = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await iniciarAtendimento(id);
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "em_atendimento" } : a))
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao iniciar atendimento";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const finalizar = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await finalizarAtendimento(id);
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "finalizado" } : a))
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao finalizar atendimento";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    agendamentos,
    loading,
    error,
    carregarAgendamentos,
    criar,
    atualizar,
    cancelar,
    iniciar,
    finalizar,
  };
};
