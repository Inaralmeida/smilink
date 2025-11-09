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

// Interface do Formulário
interface IFormInputs {
  pacienteId: string;
  profissionalId: string;
  procedimento: string;
  data: string;
  horario: string;
  observacoes: string;
}

export const useNovaConsultaForm = ({
  onCloseModal,
  pacientePreSelecionado,
}: {
  onCloseModal: () => void;
  pacientePreSelecionado?: TPaciente | null;
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
      profissionalId: "",
      procedimento: "AVALIACAO",
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
    await new Promise((res) => setTimeout(res, 1000));
    console.log("DADOS AGENDADOS:", data);
    setToastOpen(true);

    resetField("profissionalId");
    resetField("data");
    resetField("horario");
    resetField("observacoes");
    onCloseModal();
    if (role === "admin") resetField("pacienteId");
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
