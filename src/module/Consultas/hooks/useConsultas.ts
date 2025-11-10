import { useState, useEffect, useCallback } from "react";
import type { TConsulta } from "../../../domain/types/consulta";
import {
  fetchConsultas,
  fetchConsultasPorProfissional,
  fetchConsultasPorPaciente,
  fetchConsultasDoDia,
  iniciarConsulta,
  finalizarConsulta,
  adicionarObservacaoProfissional,
} from "../../../service/mock/consultas";

export const useConsultas = () => {
  const [consultas, setConsultas] = useState<TConsulta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarConsultas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await fetchConsultas();
      setConsultas(dados);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar consultas"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarConsultas();

    const handleConsultasRegeneradas = () => {
      carregarConsultas();
    };

    window.addEventListener(
      "consultas-regeneradas",
      handleConsultasRegeneradas
    );

    const timer = setTimeout(() => {
      carregarConsultas();
    }, 2000);

    return () => {
      window.removeEventListener(
        "consultas-regeneradas",
        handleConsultasRegeneradas
      );
      clearTimeout(timer);
    };
  }, [carregarConsultas]);

  return {
    consultas,
    loading,
    error,
    carregarConsultas,
  };
};

export const useConsultasPorProfissional = (profissionalId: string) => {
  const [consultas, setConsultas] = useState<TConsulta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarConsultas = useCallback(async () => {
    if (!profissionalId) return;
    setLoading(true);
    setError(null);
    try {
      const dados = await fetchConsultasPorProfissional(profissionalId);
      setConsultas(dados);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar consultas"
      );
    } finally {
      setLoading(false);
    }
  }, [profissionalId]);

  useEffect(() => {
    carregarConsultas();
  }, [carregarConsultas]);

  return {
    consultas,
    loading,
    error,
    carregarConsultas,
  };
};

export const useConsultasPorPaciente = (pacienteId: string) => {
  const [consultas, setConsultas] = useState<TConsulta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarConsultas = useCallback(async () => {
    if (!pacienteId) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const dados = await fetchConsultasPorPaciente(pacienteId);
      setConsultas(dados);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar consultas";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    carregarConsultas();

    // Ouvir eventos de atualização de consultas
    const handleConsultasAtualizadas = () => {
      carregarConsultas();
    };
    window.addEventListener(
      "consultas-regeneradas",
      handleConsultasAtualizadas
    );

    return () => {
      window.removeEventListener(
        "consultas-regeneradas",
        handleConsultasAtualizadas
      );
    };
  }, [carregarConsultas]);

  return {
    consultas,
    loading,
    error,
    carregarConsultas,
  };
};

export const useConsultasDoDia = (profissionalId: string, data: string) => {
  const [consultas, setConsultas] = useState<TConsulta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarConsultas = useCallback(async () => {
    if (!profissionalId || !data) return;
    setLoading(true);
    setError(null);
    try {
      // Buscar consultas existentes
      const consultasExistentes = await fetchConsultasDoDia(
        profissionalId,
        data
      );

      // Buscar agendamentos do dia que ainda não têm consulta
      const { fetchAgendamentos } = await import(
        "../../../service/mock/agendamentos"
      );
      const agendamentos = await fetchAgendamentos();
      const agendamentosDoDia = agendamentos.filter(
        (a) =>
          a.profissionalId === profissionalId &&
          a.data === data &&
          a.status !== "cancelado" &&
          !consultasExistentes.find((c) => c.agendamentoId === a.id)
      );

      // Criar consultas "agendadas" a partir de agendamentos sem consulta
      const { fetchPacientes } = await import(
        "../../../service/mock/pacientes"
      );
      const pacientes = await fetchPacientes();
      const { criarConsultaDeAgendamento } = await import(
        "../../../service/mock/consultas"
      );

      const consultasDeAgendamentos = agendamentosDoDia.map((agendamento) => {
        const paciente = pacientes.find((p) => p.id === agendamento.pacienteId);
        const tipoPagamento = paciente?.tem_plano_saude
          ? "convenio"
          : "particular";
        const convenio = paciente?.name_plano_saude;
        return criarConsultaDeAgendamento(agendamento, tipoPagamento, convenio);
      });

      // Combinar consultas existentes com as novas (apenas para exibição, não salvar ainda)
      setConsultas([...consultasExistentes, ...consultasDeAgendamentos]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar consultas"
      );
    } finally {
      setLoading(false);
    }
  }, [profissionalId, data]);

  useEffect(() => {
    carregarConsultas();
  }, [carregarConsultas]);

  const iniciar = useCallback(
    async (
      consultaId: string,
      horarioInicio: string,
      agendamentoId?: string
    ) => {
      setLoading(true);
      setError(null);
      try {
        // Se tem agendamentoId, significa que é um agendamento que ainda não tem consulta
        if (agendamentoId) {
          const { iniciarConsultaDeAgendamento } = await import(
            "../../../service/mock/consultas"
          );
          const { fetchPacientes } = await import(
            "../../../service/mock/pacientes"
          );
          const pacientes = await fetchPacientes();
          await iniciarConsultaDeAgendamento(
            agendamentoId,
            horarioInicio,
            pacientes
          );
        } else {
          await iniciarConsulta(consultaId, horarioInicio);
        }
        await carregarConsultas();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao iniciar consulta"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [carregarConsultas]
  );

  const finalizar = useCallback(
    async (
      consultaId: string,
      dados: {
        procedimentosRealizados?: string[];
        materiaisUtilizados?: string[];
        equipamentosUtilizados?: string[];
        examesSolicitados?: string[];
        observacoes?: string;
        horarioFim: string;
        alergias?: string[];
        condicoesMedicas?: string[];
        receita?: string;
        atestado?: {
          emitido: boolean;
          cid?: string;
          dias?: number;
        };
      }
    ) => {
      setLoading(true);
      setError(null);
      try {
        await finalizarConsulta(consultaId, dados);
        await carregarConsultas();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao finalizar consulta"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [carregarConsultas]
  );

  const adicionarObservacao = useCallback(
    async (consultaId: string, observacoes: string) => {
      setLoading(true);
      setError(null);
      try {
        await adicionarObservacaoProfissional(consultaId, observacoes);
        await carregarConsultas();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao adicionar observação"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [carregarConsultas]
  );

  return {
    consultas,
    loading,
    error,
    carregarConsultas,
    iniciar,
    finalizar,
    adicionarObservacao,
  };
};
