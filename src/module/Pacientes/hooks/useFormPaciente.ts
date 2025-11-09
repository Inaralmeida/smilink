// src/hooks/useFormPaciente.ts
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

const unmask = (val: string | undefined | null): string => {
  if (!val) return "";
  return val.replace(/[^\d]/g, "");
};

const calcularIdade = (dataNascimento: string): number | null => {
  if (!dataNascimento) return null;
  const today = new Date();
  const [year, month, day] = dataNascimento.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);
  if (isNaN(birthDate.getTime())) return null;

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const pacienteSchema = z
  .object({
    name: z.string().min(3, "Nome completo é obrigatório"),
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    data_nascimento: z
      .string()
      .min(1, "Data de nascimento é obrigatória")
      .refine(
        (date) => new Date(date) <= new Date(),
        "A data não pode ser no futuro"
      ),
    CPF: z
      .string()
      .transform(unmask)
      .pipe(z.string().length(11, "CPF inválido")),
    telefone: z
      .string()
      .transform(unmask)
      .pipe(z.string().min(10, "Telefone inválido")),
    tem_plano_saude: z.boolean(),

    name_responsible: z.string().optional(),
    cpf_responsible: z
      .string()
      .transform((val) => (val ? unmask(val) : ""))
      .pipe(
        z.string().refine((val) => val.length === 0 || val.length === 11, {
          message: "CPF deve ter 11 dígitos",
        })
      )
      .optional(),
    grau_parentesco: z.string().optional(),
    tel_responsible: z
      .string()
      .transform((val) => (val ? unmask(val) : ""))
      .pipe(
        z
          .string()
          .refine(
            (val) => val.length === 0 || (val.length >= 10 && val.length <= 11),
            {
              message: "Telefone deve ter 10-11 dígitos",
            }
          )
      )
      .optional(),

    cep: z
      .string()
      .transform(unmask)
      .pipe(z.string().length(8, "CEP inválido")),
    street: z.string().min(1, "Logradouro é obrigatório"),
    number: z.string().min(1, "Número é obrigatório"),
    complemento: z.string().optional(),
    neigborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(1, "Estado é obrigatório"),

    name_plano_saude: z.string().optional(),
    numero_careteirinha: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const idade = calcularIdade(data.data_nascimento);
    const isMenor = idade !== null && idade < 18;

    if (isMenor) {
      if (!data.name_responsible || data.name_responsible.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nome do responsável é obrigatório",
          path: ["name_responsible"],
        });
      }
      if (!data.cpf_responsible || data.cpf_responsible.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CPF do responsável é obrigatório",
          path: ["cpf_responsible"],
        });
      }
      if (!data.grau_parentesco || data.grau_parentesco.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Grau de parentesco é obrigatório",
          path: ["grau_parentesco"],
        });
      }
      if (!data.tel_responsible || data.tel_responsible.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Telefone do responsável é obrigatório",
          path: ["tel_responsible"],
        });
      }
    }

    if (data.tem_plano_saude) {
      if (!data.name_plano_saude || data.name_plano_saude.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nome do plano é obrigatório",
          path: ["name_plano_saude"],
        });
      }
      if (!data.numero_careteirinha || data.numero_careteirinha.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Número da carteirinha é obrigatório",
          path: ["numero_careteirinha"],
        });
      }
    }
  });

export type IPacienteFormInputs = z.infer<typeof pacienteSchema>;

type UseFormPacienteProps = {
  onClose: () => void;
  paciente?: IPacienteFormInputs | null;
  modoEdicao?: boolean;
  somenteLeitura?: boolean;
};

export const useFormPaciente = ({
  onClose,
  paciente,
  modoEdicao = false,
  somenteLeitura = false,
}: UseFormPacienteProps) => {
  const [loadingCep, setLoadingCep] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });
  const [isMenorDeIdade, setIsMenorDeIdade] = useState(false);
  const [editando, setEditando] = useState(modoEdicao);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
    reset,
  } = useForm<IPacienteFormInputs>({
    resolver:
      somenteLeitura || !editando ? undefined : zodResolver(pacienteSchema),
    mode: "onBlur",
    defaultValues: paciente || {
      name: "",
      email: "",
      data_nascimento: "",
      CPF: "",
      telefone: "",
      tem_plano_saude: false,
      name_responsible: "",
      cpf_responsible: "",
      grau_parentesco: "",
      tel_responsible: "",
      cep: "",
      street: "",
      number: "",
      complemento: "",
      neigborhood: "",
      city: "",
      state: "",
      name_plano_saude: "",
      numero_careteirinha: "",
    },
  });

  const cep = watch("cep");
  const temPlano = watch("tem_plano_saude");
  const dataNascimento = watch("data_nascimento");

  // buscar CEP dentro do hook (pode usar axios ou fetch)
  const buscarEnderecoPorCEP = async (rawCep: string) => {
    const cepLimpo = unmask(rawCep);
    if (cepLimpo.length !== 8) return null;

    setLoadingCep(true);
    try {
      const resp = await axios.get(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      if (resp.data?.erro) {
        setError("cep", { message: "CEP não encontrado" });
        return null;
      }
      return resp.data;
    } catch {
      setError("cep", { message: "Erro ao buscar CEP" });
      return null;
    } finally {
      setLoadingCep(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!cep) return;
      const cleaned = unmask(cep);
      if (cleaned.length === 8) {
        const endereco = await buscarEnderecoPorCEP(cleaned);
        if (endereco) {
          setValue("street", endereco.logradouro || "");
          setValue("neigborhood", endereco.bairro || "");
          setValue("city", endereco.localidade || "");
          setValue("state", endereco.uf || "");
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep]);

  useEffect(() => {
    const idade = calcularIdade(dataNascimento);
    const isMenor = idade !== null && idade < 18;
    setIsMenorDeIdade(isMenor);
  }, [dataNascimento]);

  const onSubmit: SubmitHandler<IPacienteFormInputs> = async (data) => {
    try {
      await new Promise((res) => setTimeout(res, 800)); // simula request
      console.log("DADOS DO PACIENTE:", data);
      setToast({
        open: true,
        message: paciente
          ? "Paciente atualizado com sucesso!"
          : "Paciente salvo com sucesso!",
        severity: "success",
      });
      if (!paciente) {
        reset();
        onClose();
      } else if (editando) {
        setEditando(false);
      }
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Erro ao salvar paciente.",
        severity: "error",
      });
    }
  };

  const handleEditar = () => {
    setEditando(true);
  };

  const handleCancelarEdicao = () => {
    if (paciente) {
      reset(paciente);
    }
    setEditando(false);
  };

  const onInvalid: SubmitErrorHandler<IPacienteFormInputs> = (errs) => {
    console.warn("Erros de validação:", errs);
    setToast({
      open: true,
      message: "Por favor, corrija os campos inválidos.",
      severity: "error",
    });
  };

  const handleToastClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setToast((p) => ({ ...p, open: false }));
  };

  return {
    control,
    errors,
    isSubmitting,
    loadingCep,
    temPlano,
    isMenorDeIdade,
    toast,
    handleSubmit: (callback?: () => void) => {
      return handleSubmit(async (data) => {
        await onSubmit(data);
        if (callback) {
          callback();
        }
      }, onInvalid);
    },
    handleToastClose,
    editando,
    somenteLeitura: somenteLeitura || (!editando && !!paciente),
    handleEditar,
    handleCancelarEdicao,
  };
};
