import { useState, useEffect, useCallback } from "react";
import type {
  TItemEstoque,
  TItemEstoqueInput,
} from "../../../domain/types/estoque";
import {
  fetchItensEstoque,
  criarItemEstoque,
  atualizarItemEstoque,
  deletarItemEstoque,
} from "../../../service/mock/estoque";

export const useEstoque = () => {
  const [itens, setItens] = useState<TItemEstoque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarItens = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dados = await fetchItensEstoque();
      setItens(dados);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar itens de estoque"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarItens();
  }, [carregarItens]);

  const adicionarItem = useCallback(
    async (dados: TItemEstoqueInput) => {
      try {
        setError(null);
        const novoItem = await criarItemEstoque(dados);
        await carregarItens();
        return novoItem;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao adicionar item";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [carregarItens]
  );

  const editarItem = useCallback(
    async (id: string, dados: Partial<TItemEstoqueInput>) => {
      try {
        setError(null);
        const itemAtualizado = await atualizarItemEstoque(id, dados);
        await carregarItens();
        return itemAtualizado;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao editar item";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [carregarItens]
  );

  const removerItem = useCallback(
    async (id: string) => {
      try {
        setError(null);
        await deletarItemEstoque(id);
        await carregarItens();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao remover item";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [carregarItens]
  );

  return {
    itens,
    loading,
    error,
    carregarItens,
    adicionarItem,
    editarItem,
    removerItem,
  };
};
