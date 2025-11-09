import { useState, useEffect } from "react";
import type { TProfissional } from "../../../domain/types/profissional";
import {
  fetchProfissionais,
  fetchProfissionalById,
  arquivarProfissional,
  criarProfissional,
  atualizarProfissional,
} from "../../../service/mock/profissionais";

export const useProfissionais = () => {
  const [profissionais, setProfissionais] = useState<TProfissional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarProfissionais = async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await fetchProfissionais();
      setProfissionais(dados);
    } catch (err) {
      setError("Erro ao carregar profissionais");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProfissionais();
  }, []);

  const handleArquivar = async (id: string) => {
    try {
      await arquivarProfissional(id);
      await carregarProfissionais();
    } catch (err) {
      setError("Erro ao arquivar profissional");
      console.error(err);
    }
  };

  const handleCriar = async (
    dados: Omit<TProfissional, "id">
  ): Promise<TProfissional | null> => {
    try {
      const novoProfissional = await criarProfissional(dados);
      await carregarProfissionais();
      return novoProfissional;
    } catch (err) {
      setError("Erro ao criar profissional");
      console.error(err);
      return null;
    }
  };

  const handleAtualizar = async (
    id: string,
    dados: Partial<TProfissional>
  ): Promise<TProfissional | null> => {
    try {
      const profissionalAtualizado = await atualizarProfissional(id, dados);
      await carregarProfissionais();
      return profissionalAtualizado;
    } catch (err) {
      setError("Erro ao atualizar profissional");
      console.error(err);
      return null;
    }
  };

  const buscarProfissional = async (
    id: string
  ): Promise<TProfissional | null> => {
    try {
      return await fetchProfissionalById(id);
    } catch (err) {
      setError("Erro ao buscar profissional");
      console.error(err);
      return null;
    }
  };

  return {
    profissionais,
    loading,
    error,
    carregarProfissionais,
    handleArquivar,
    handleCriar,
    handleAtualizar,
    buscarProfissional,
  };
};
