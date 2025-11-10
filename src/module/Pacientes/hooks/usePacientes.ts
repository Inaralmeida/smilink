import { useState, useEffect } from "react";
import type { TPaciente } from "../../../domain/types/paciente";
import {
  fetchPacientes,
  fetchPacienteById,
  arquivarPaciente,
} from "../../../service/mock/pacientes";

export const usePacientes = () => {
  const [pacientes, setPacientes] = useState<TPaciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarPacientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await fetchPacientes();
      setPacientes(dados);
    } catch (err) {
      setError("Erro ao carregar pacientes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  const handleArquivar = async (id: string) => {
    try {
      await arquivarPaciente(id);
      await carregarPacientes();
    } catch (err) {
      setError("Erro ao arquivar paciente");
      console.error(err);
    }
  };

  const buscarPaciente = async (id: string): Promise<TPaciente | null> => {
    try {
      return await fetchPacienteById(id);
    } catch (err) {
      setError("Erro ao buscar paciente");
      console.error(err);
      return null;
    }
  };

  return {
    pacientes,
    loading,
    error,
    carregarPacientes,
    handleArquivar,
    buscarPaciente,
  };
};
