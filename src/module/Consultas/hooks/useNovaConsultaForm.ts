import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "../../../application/context/AuthContext";
import type { TUserProps } from "../../../domain/types/users";
import type { TPaciente } from "../../../domain/types/paciente";
import {
  fetchAgenda,
  fetchPacientes,
  fetchProfissionais,
  type AgendaProfissional,
} from "../../../service/mock/agendas";
import {
  criarAgendamento,
  cancelarAgendamento,
} from "../../../service/mock/agendamentos";
import { DURACAO_POR_PROCEDIMENTO } from "../../../service/mock/agendamentos";

// Interface do Formulário
interface IFormInputs {
  pacienteId: string;
  profissionalId: string;
  procedimento: string;
  data: string;
  horario: string;
  observacoes: string;
}

// Mapear códigos de procedimento para nomes completos
const mapearCodigoParaProcedimento = (codigo: string): string => {
  const mapeamento: Record<string, string> = {
    AVALIACAO: "Avaliação Inicial",
    LIMPEZA: "Limpeza e Profilaxia",
    MANUTENCAO: "Manutenção de Aparelho",
    RESTAURACAO: "Restauração",
  };
  return mapeamento[codigo] || "Consulta de Rotina";
};

export const useNovaConsultaForm = ({
  onCloseModal,
  pacientePreSelecionado,
  profissionalIdPreSelecionado,
  procedimentoPreSelecionado,
  agendamentoAntigoId,
}: {
  onCloseModal: () => void;
  pacientePreSelecionado?: TPaciente | null;
  profissionalIdPreSelecionado?: string;
  procedimentoPreSelecionado?: string;
  agendamentoAntigoId?: string;
}) => {
  const { role, user } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
    watch,
    resetField,
    setValue,
  } = useForm<IFormInputs>({
    mode: "onChange",
    defaultValues: {
      pacienteId:
        pacientePreSelecionado?.id ||
        (role === "paciente" ? user?.id || "" : ""),
      profissionalId: profissionalIdPreSelecionado || "",
      procedimento: procedimentoPreSelecionado || "AVALIACAO",
      data: "",
      horario: "",
      observacoes: "",
    },
  });

  useEffect(() => {
    if (pacientePreSelecionado?.id) {
      setValue("pacienteId", pacientePreSelecionado.id);
    }
  }, [pacientePreSelecionado, setValue]);

  useEffect(() => {
    if (profissionalIdPreSelecionado) {
      setValue("profissionalId", profissionalIdPreSelecionado);
      // Carregar agenda do profissional pré-selecionado
      setLoadingAgenda(true);
      setAgenda([]);
      resetField("data");
      resetField("horario");
      fetchAgenda(profissionalIdPreSelecionado).then((data) => {
        setAgenda(data);
        setLoadingAgenda(false);
      });
    }
  }, [profissionalIdPreSelecionado, setValue, resetField]);

  useEffect(() => {
    if (procedimentoPreSelecionado) {
      setValue("procedimento", procedimentoPreSelecionado);
    }
  }, [procedimentoPreSelecionado, setValue]);

  const [pacientes, setPacientes] = useState<TUserProps[]>([]);
  const [profissionais, setProfissionais] = useState<TUserProps[]>([]);
  const [agenda, setAgenda] = useState<AgendaProfissional[]>([]);

  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [loadingProfissionais, setLoadingProfissionais] = useState(false);
  const [loadingAgenda, setLoadingAgenda] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);

  const profissionalIdSelecionado = watch("profissionalId");

  useEffect(() => {
    setLoadingProfissionais(true);
    fetchProfissionais().then((data) => {
      setProfissionais(data);
      setLoadingProfissionais(false);
    });

    if (role === "admin") {
      setLoadingPacientes(true);
      fetchPacientes().then((data) => {
        setPacientes(data);
        setLoadingPacientes(false);
      });
    }
  }, [role]);

  useEffect(() => {
    if (profissionalIdSelecionado) {
      setLoadingAgenda(true);
      setAgenda([]);
      resetField("data");
      resetField("horario");

      fetchAgenda(profissionalIdSelecionado).then((data) => {
        setAgenda(data);
        setLoadingAgenda(false);
      });
    } else {
      setAgenda([]); // Limpa a agenda se nenhum profissional estiver selecionado
    }
  }, [profissionalIdSelecionado, resetField]);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      // Buscar dados do profissional e paciente
      const profissional = profissionais.find(
        (p) => p.id === data.profissionalId
      );
      const pacienteId =
        data.pacienteId || (role === "paciente" ? user?.id : "");
      const paciente =
        role === "admin"
          ? pacientes.find((p) => p.id === data.pacienteId)
          : user;

      if (!profissional || !paciente || !pacienteId) {
        throw new Error("Dados incompletos para criar agendamento");
      }

      // Mapear código do procedimento para nome completo
      const procedimentoNome = mapearCodigoParaProcedimento(data.procedimento);

      // Obter duração do procedimento
      const duracao = DURACAO_POR_PROCEDIMENTO[procedimentoNome] || 30;

      // Criar novo agendamento
      await criarAgendamento({
        profissionalId: profissional.id,
        profissionalNome: profissional.nome,
        profissionalSobrenome: profissional.sobrenome,
        pacienteId: pacienteId,
        pacienteNome: paciente.nome,
        pacienteSobrenome: paciente.sobrenome,
        data: data.data,
        horario: data.horario,
        procedimento: procedimentoNome,
        duracao: duracao,
        status: "agendado",
        observacoes: data.observacoes || undefined,
      });

      // Se for reagendamento, cancelar agendamento antigo
      if (agendamentoAntigoId) {
        await cancelarAgendamento(agendamentoAntigoId);
      }

      setToastOpen(true);

      // Limpar campos
      resetField("profissionalId");
      resetField("data");
      resetField("horario");
      resetField("observacoes");
      if (role === "admin") resetField("pacienteId");

      // Fechar modal após um pequeno delay para mostrar o toast
      setTimeout(() => {
        onCloseModal();
      }, 1500);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      // Mostrar erro ao usuário (pode ser melhorado com um toast de erro)
      alert(
        error instanceof Error ? error.message : "Erro ao criar agendamento"
      );
    }
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const textFieldSx = {
    bgcolor: "primary.contrastText",
  };

  return {
    control,
    handleSubmit,
    isValid,
    isSubmitting,
    role,
    user,
    pacientes,
    profissionais,
    agenda,
    loadingPacientes,
    loadingProfissionais,
    loadingAgenda,
    profissionalIdSelecionado,
    onSubmit,
    toastOpen,
    handleToastClose,
    textFieldSx,
  };
};
